import {app} from '../../bf/base.js';
import {data as dat} from './data.js';
//import {data} from './data.js';
import {View as GameView} from '../game/view.js';

let data=app.configure({trash:dat}).trash;

let events={};
events[`click ${data.events.return}`]='toVideo';
events[`click ${data.events.game}`]='game';

export let View=Backbone.View.extend({
 events:events,
 className:data.view.className,
 template:_.template($(data.view.template).html()),
 initialize:function(){
  this.listenTo(app.get('aggregator'),'trash:toggle',this.toggle);
  this.listenTo(app.get('aggregator'),'trash:fs',this.fs);
  this.render();
 },
 render:function(){
  this.$el.html(this.template());

  return this;
 },
 ready:function(){
  this.gameView=new GameView;
 },
 toggle:function(f){
  this.$el.toggleClass(data.view.shownCls,f);
 },
 fs:function(f){
  this.$el.toggleClass(data.view.fsCls,f);
 },
 toVideo:function(){
  app.get('aggregator').trigger('player:play');
 },
 game:function(){
  this.$el.addClass(data.view.gameActiveCls);
  this.gameView.play();
 }
});