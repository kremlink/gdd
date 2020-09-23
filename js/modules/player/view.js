import {app} from '../../bf/base.js';
import {data as dat} from './data.js';

let data=app.configure({player:dat}).player,
 epIndex;

export let PlayerView=Backbone.View.extend({
 el:data.view.el,
 end:false,
 initialize:function(){
  epIndex=app.get('epIndex');

  if(this.el)
  {
   this.player=videojs(this.el,{
    controlBar:{
     children:{
      playToggle:{},
      progressControl:{},
      volumePanel:{inline:false},
      fullscreenToggle:{}
     }
    },
    plugins:{

    }
   },()=>{
    this.prepare();
   });
   //this.listenTo(app.get('aggregator'),'player:play',this.play);//--old
   this.listenTo(app.get('aggregator'),'player:playPause',this.playPause);
  }else
  {
   app.get('aggregator').trigger('player:ready',null);
  }
 },
 prepare:function(){
  let touched={},
   epActivated;

  //this.setElement(data.view.el);//--old
  app.get('aggregator').trigger('player:ready');
  this.player.on('pause',()=>{
   if(!this.player.seeking())
   {
    app.get('aggregator').trigger('player:playPause',{play:false,self:true});
    if(app.get('isMobile'))
    {
     app.get('aggregator').trigger('trash:fs',false);
    }else
    {
     if(this.player.isFullscreen())
      this.player.exitFullscreen();
    }
    //app.get('aggregator').trigger('trash:toggle',true);//--old
   }
  });
  this.player.on('play',()=>{
   if(!this.player.seeking())
   {
    app.get('aggregator').trigger('player:playPause',{play:true,self:true});
    //app.get('aggregator').trigger('trash:toggle',false);//--old
    if(!this.end)
    {
     if(app.get('isMobile'))
     {
      if(!document.fullscreenElement)
       document.documentElement.requestFullscreen();
      app.get('aggregator').trigger('trash:fs',true);
     }else
     {
      if(!app.get('_dev'))
       this.player.requestFullscreen();
     }
    }
   }
  });
  this.player.on('timeupdate',()=>{
   if(this.player.currentTime()>this.player.duration()+data.epActivationTime&&!epActivated)
   {
    epActivated=true;
    app.get('aggregator').trigger('data:set',{ep:true});
   }
  });

  if(app.get('isMobile'))
  {
   document.addEventListener('fullscreenchange',()=>{
    //app.get('aggregator').trigger('trash:fs',document.fullscreenElement);
   },false);
  }else
  {
   this.player.on('fullscreenchange',(e)=>{
    if(e.isTrusted)
     app.get('aggregator').trigger('trash:fs',this.player.isFullscreen());
   });
  }

  this.player.on('touchstart',e=>{
   touched.x=e.touches[0].pageX;
   touched.y=e.touches[0].pageY;
  });
  this.player.on('touchend',e=>{
   if(Math.sqrt((touched.x-e.changedTouches[0].pageX)*(touched.x-e.changedTouches[0].pageX)+(touched.y-e.changedTouches[0].pageY)*(touched.y-e.changedTouches[0].pageY))<data.touchPlayRadius)
   {
    if(e.target.nodeName==='VIDEO')
     app.get('aggregator').trigger('player:playPause',{play:this.player.paused()});
   }
  });
 },
 setSrc:function(){
  let time=Date.now(),
   xhr,br,size;

  if(epIndex>0)
  {
   /*this.player.src({
    src:data.quality[epIndex][0].src,
    type: 'video/mp4'
   });*/
   xhr=new XMLHttpRequest();
   xhr.open('GET',data.testSpeedFile+'?'+time,true);
   xhr.responseType='blob';
   xhr.onload=()=>{
    let index;
    size=xhr.response.size/1024/1024*8;
    time=(Date.now()-time)/1000;
    br=size/time;
    index=data.quality[epIndex].findIndex((o)=>o.speed[0]<br&&o.speed[1]>=br);
    //console.log(br,index);

    data.quality[epIndex].unshift({selected:true,label:'auto',src:data.quality[epIndex][index].src+'?'+Date.now()});
    this.player.controlBar.addChild('QualitySelector');
    this.player.src(data.quality[epIndex]);

    //app.get('aggregator').trigger('player:ready');
   };
   xhr.send();
  }
 },
 /*addTrash:function(el){//--old
  this.$el.append(el);

  return this;
 },*/
 playPause:function(opts){
  if(!opts.self)
  {
   if(opts.end)
   {
    this.end=true;
    this.player.src({
     src:opts.end.src,
     type:'video/mp4'
    });
    this.player.off('ended');
    this.player.on('ended',()=>location.href=opts.end.href);
   }
   this.player[opts.play?'play':'pause']();
  }
 }
});