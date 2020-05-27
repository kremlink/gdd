import {app} from '../../bf/base.js';
import {data} from './data.js';

export let PlayerView=Backbone.View.extend({
 initialize:function(){
  this.player=videojs($(data.view.el)[0],{},()=>{
   this.prepare();
  });
  this.listenTo(app.get('aggregator'),'player:play',this.play);
 },
 prepare:function(){
  this.setElement(data.view.el);
  app.get('aggregator').trigger('player:ready');
  this.player.on('pause',()=>{
   app.get('aggregator').trigger('trash:toggle',true);
  });
  this.player.on('play',()=>{
   app.get('aggregator').trigger('trash:toggle',false);
   //this.player.requestFullscreen();//TODO: uncomment
  });
  this.player.on('fullscreenchange',()=>{app.get('aggregator').trigger('trash:fs',this.player.isFullscreen());});
  this.player.on('touchstart',e=>{
   if(e.target.nodeName==='VIDEO'){
    if(this.player.paused())
     this.player.play();else
     this.player.pause();
   }
  });
 },
 addTrash:function(el){
  this.$el.append(el);

  return this;
 },
 play:function(){
  if(this.player.paused)
   this.player.play();
 }
});