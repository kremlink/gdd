import {app} from '../../bf/base.js';
//import {data as dat} from './data.js';
import {data} from './data.js';
import {GameView} from '../game/view.js';
import {FlowView} from '../flow/view.js';

//let data=app.configure({trash:dat}).trash;

let events={};
events[`click ${data.events.return}`]='toVideo';
events[`click ${data.events.game}`]='gameStart';
events[`click ${data.events.flow}`]='episodes';

export let TrashView=Backbone.View.extend({
 events:events,
 className:data.view.className,
 template:_.template($(data.view.template).html()),
 initialize:function(){
  this.listenTo(app.get('aggregator'),'trash:toggle',this.toggle);
  this.listenTo(app.get('aggregator'),'trash:fs',this.fs);
  this.listenTo(app.get('aggregator'),'game:end',this.gameEnd);
  this.listenTo(app.get('aggregator'),'game:progress',this.gameProgress);
  this.render();

  this.$gameProgress=this.$(data.gameProgress.el);
 },
 render:function(){
  this.$el.html(this.template());

  return this;
 },
 ready:function(){
  this.gameView=new GameView;
  this.flowView=new FlowView;
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
 gameStart:function(){
  if(this.activeTab)
   this.activeTab.hide();
  this.$el.addClass(data.view.gameActiveCls);
  this.gameView.play();
  this.activeTab=this.gameView;
  this.$gameProgress.css('clip-path',`polygon(0 0,0 0,0 100%,0 100%)`);
 },
 gameEnd:function(){
  this.$el.removeClass(data.view.gameActiveCls);
 },
 gameProgress:function(p){
  this.$gameProgress.css('clip-path',`polygon(0 0,${p}% 0,${p}% 100%,0 100%)`);
 },
 episodes:function(){
  if(this.activeTab)
   this.activeTab.hide();
  this.flowView.show();
  this.activeTab=this.flowView;
 }
});