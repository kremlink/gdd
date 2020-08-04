import {app} from '../../bf/base.js';
import {data} from './data.js';

export let PlayerView=Backbone.View.extend({
 el:data.view.el,
 initialize:function(){
  this.player=videojs(this.el,{},()=>{
   this.prepare();
  });
  //this.listenTo(app.get('aggregator'),'player:play',this.play);//--old
  this.listenTo(app.get('aggregator'),'player:playPause',this.playPause);
 },
 prepare:function(){
  let touched={};
  //this.setElement(data.view.el);//--old
  app.get('aggregator').trigger('player:ready',this.player.el());
  this.player.on('pause',()=>{
   app.get('aggregator').trigger('player:playPause',false);
   if(app.get('isMobile'))
   {
    app.get('aggregator').trigger('trash:fs',false);
   }else
   {
    if(this.player.isFullscreen())
     this.player.exitFullscreen();
   }
   //app.get('aggregator').trigger('trash:toggle',true);//--old
  });
  this.player.on('play',()=>{
   app.get('aggregator').trigger('player:playPause',true);
   //app.get('aggregator').trigger('trash:toggle',false);//--old
   if(app.get('isMobile'))
   {
    if(!document.fullscreenElement)
     document.documentElement.requestFullscreen();
    app.get('aggregator').trigger('trash:fs',true);
   }else
   {
    this.player.requestFullscreen();
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
    {
     if(this.player.paused())
      this.player.play();else
      this.player.pause();
    }
   }
  });
 },
 /*addTrash:function(el){//--old
  this.$el.append(el);

  return this;
 },*/
 playPause:function(f){
  this.player[f?'play':'pause']();
 }
});