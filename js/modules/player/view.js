import {app} from '../../bf/base.js';
import {data} from './data.js';

export let PlayerView=Backbone.View.extend({
 el:data.view.el,
 initialize:function(){
  this.player=videojs($(data.view.video)[0],{},()=>{
   this.prepare();
  });
  this.listenTo(app.get('aggregator'),'player:play',this.play);//--old
 },
 prepare:function(){
  //this.setElement(data.view.el);//--old
  app.get('aggregator').trigger('player:ready');
  this.player.on('pause',()=>{
   if(this.player.isFullscreen())
    this.player.exitFullscreen();
   //app.get('aggregator').trigger('trash:toggle',true);//--old
  });
  this.player.on('play',()=>{
   //app.get('aggregator').trigger('trash:toggle',false);//--old
   this.player.requestFullscreen();
  });
  //this.player.on('fullscreenchange',()=>{app.get('aggregator').trigger('trash:fs',this.player.isFullscreen());});//--old
  this.player.on('touchstart',e=>{
   if(e.target.nodeName==='VIDEO'){
    if(this.player.paused())
     this.player.play();else
     this.player.pause();
   }
  });
 },
 show:function(){
  this.$el.addClass(data.view.shownCls);
 },
 hide:function(){
  this.$el.removeClass(data.view.shownCls);
 },
 /*addTrash:function(el){//--old
  this.$el.append(el);

  return this;
 },*/
 play:function(){
  if(this.player.paused)
   this.player.play();
 },
 pause:function(){
  this.player.pause();
 }
});