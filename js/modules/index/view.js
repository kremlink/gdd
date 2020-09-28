//import {PlayerView} from '../player/view.js';//--old
import {app} from '../../bf/base.js';
import {MainView} from '../main/view.js';
import {PlayerView} from '../player/view.js';

import {data as dat} from './data.js';
export {data} from './data.js';
let data=app.configure({index:dat}).index;

let events={},
    epIndex;

events[`click ${data.events.start}`]='start';

export function init(app,modules){
 if(!~modules.indexOf('index'))
  return;

 new (Backbone.View.extend({
  events:events,
  el:data.view.el,
  mainView:null,
  initialize:function(){
   let mob=!matchMedia(data.minViewport).matches;

   epIndex=app.get('epIndex');

   this.$el.toggleClass(data.view.tooSmallCls,mob);

   if(app.get('_dev'))
    this.start();

   /*this.playerView=new PlayerView;//--old
   this.listenTo(app.get('aggregator'),'player:ready',this.addTrash);*/
   $(window).on('resize',_.debounce(()=>{
    mob=!matchMedia(data.minViewport).matches;
    this.$el.toggleClass(data.view.tooSmallCls,mob);
    //app.get('aggregator').trigger(mob?'player:pause':'player:play');//TODO: check if paused
   },200));
   this.listenTo(app.get('aggregator'),'player:playPause',this.playPause);
   this.listenTo(app.get('aggregator'),'player:ready',this.loaded);
   this.listenTo(app.get('aggregator'),'player:check-block',this.block);
   this.listenTo(app.get('aggregator'),'trash:help',this.help);
   document.addEventListener('contextmenu',e=>e.preventDefault());
   //document.fonts.ready.then(()=>this.prepare(),()=>this.prepare());
   this.prepare();
  },
  prepare:function(){//inconsistent loadeddata event with multiple videos
   let imgs=[],
    wait=[];

   for(let [x,y] of Object.entries(data.preload))
   {
    if(y.imgs){
     imgs=y.imgs.map(t=>x+t);
    }
    if(y.j)
    {
     imgs=[];
     for(let i=1;i<=y.j.length;i++)
      for(let j=1;j<=y.j[i-1];j++)
       for(let k=0;k<y.tmpl.length;k++)
        imgs.push(x+y.tmpl[k].replace('[i]',i).replace('[j]',j));
    }
    wait.push(app.get('lib.utils.imgsReady')({src:imgs}));
   }
   $.when(wait).then(()=>this.player=new PlayerView);
   //$.when(1).then(()=>this.player=new PlayerView);
  },
  help:function(f){
   this.$el.toggleClass(data.view.helperCls,f);
  },
  start:function(){
   if(epIndex===0)
    this.mainView.activateHelp();
   this.$el.addClass(data.view.startCls);
   if(app.get('isMobile'))
   {
    if(!document.fullscreenElement)
     document.documentElement.requestFullscreen();
   }
   if(!app.get('_dev')&&epIndex>0&&!this.mainView.epBlocked)
    app.get('aggregator').trigger('player:playPause',{play:true});
  },
  playPause:function(opts){
   if(opts.play)
    this.$el.addClass(data.view.vidStartedOnce);
   this.$el.toggleClass(data.view.pauseCls,!opts.play);
  },
  block:function(f){
   if(f)
   {
    this.$el.addClass(data.view.blockCls);
   }else
   {
    this.$el.addClass(data.view.loadedCls);
    this.player.setSrc();
   }
  },
  loaded:function(){
   this.mainView=new MainView;

   $(this.player.player.el()).find('video').after($(data.view.$overlay));
   this.block(app.get('ls').get('ep')<epIndex);
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