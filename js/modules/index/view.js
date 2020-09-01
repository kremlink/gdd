//import {PlayerView} from '../player/view.js';//--old
import {app} from '../../bf/base.js';
import {MainView} from '../main/view.js';
import {PlayerView} from '../player/view.js';
import {data} from './data.js';


export {data} from './data.js';

//import {data as dat} from './data.js';
//let data=app.configure({index:dat}).index;

let events={};
events[`click ${data.events.start}`]='start';

export function init(app,modules){
 if(!~modules.indexOf('index'))
  return;

 new (Backbone.View.extend({
  events:events,
  el:data.view.el,
  initialize:function(){
   let mob=!matchMedia(data.minViewport).matches;

   new MainView;

   this.$el.toggleClass(data.view.tooSmallCls,mob);

   if(app.get('_dev'))
    this.start();//TODO: remove (dev)

   /*this.playerView=new PlayerView;//--old
   this.listenTo(app.get('aggregator'),'player:ready',this.addTrash);*/
   $(window).on('resize',_.debounce(()=>{
    mob=!matchMedia(data.minViewport).matches;
    this.$el.toggleClass(data.view.tooSmallCls,mob);
    //app.get('aggregator').trigger(mob?'player:pause':'player:play');//TODO: check if paused
   },200));
   this.listenTo(app.get('aggregator'),'player:playPause',this.playPause);
   this.listenTo(app.get('aggregator'),'player:ready',this.loaded);
   document.addEventListener('contextmenu',e=>e.preventDefault());
   document.fonts.ready.then(()=>this.prepare());
  },
  prepare:function(){//inconsistent loadeddata event with multiple videos
   /*let imgs=[],
    wait=[];

   for(let [x,y] of Object.entries(data.preload))
   {
    if(y.imgs){
     imgs=y.imgs.map(t=>x+t);
    }
    if(y.i)
    {
     imgs=[];
     for(let i=1;i<=y.i;i++)
     {
      for(let j=1;j<=y.j[i-1];j++)
      {
       imgs.push(x+y.tmpl1.replace('[i]',i).replace('[j]',j));
       imgs.push(x+y.tmpl2.replace('[i]',i).replace('[j]',j));
      }
     }
    }
    wait.push(app.get('lib.utils.imgsReady')({src:imgs}));
   }
   $.when(wait).then(()=>this.playerView=new PlayerView({timecodes:data.timecodes}));*/
   $.when(1).then(()=>new PlayerView);
  },
  start:function(){
   this.$el.addClass(data.view.startCls);
   if(app.get('isMobile'))
   {
    if(!document.fullscreenElement)
     document.documentElement.requestFullscreen();
   }
   if(!app.get('_dev')&&app.get('epIndex')>0)
    app.get('aggregator').trigger('player:playPause',true);
  },
  playPause:function(f){
   if(f)
    this.$el.addClass(data.view.vidStartedOnce);
   this.$el.toggleClass(data.view.pauseCls,!f);
  },
  loaded:function(el){
   this.$el.addClass(data.view.loadedCls);
   $(el).find('video').after($(data.view.$overlay));
   //$(el).find('video').after($(data.view.$overlay))[0].play().then(()=>$(el).find('video')[0].pause());//TODO: remove and uncomment prev string (dev)
  }
  /*,
  addTrash:function(){//--old
   let trashView=new TrashView;

   this.playerView.addTrash(trashView.el);
   trashView.ready();
   this.$el.addClass(data.view.readyCls);
   if(!matchMedia(data.minViewport).matches)
    this.$el.addClass(data.view.tooSmallCls);
  }*/
 }));
}