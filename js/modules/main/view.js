import {app} from '../../bf/base.js';
//import {data as dat} from './data.js';
import {data} from './data.js';
import {PlayerView} from '../player/view.js';
import {GameView} from '../game/view.js';
import {FlowView} from '../flow/view.js';
import {MapView} from '../map/view.js';
import {BibleView} from '../bible/view.js';
import {ChatView} from '../chat/view.js';

//let data=app.configure({trash:dat}).trash;

let events={};
//events[`click ${data.events.return}`]='toVideo';
events[`click ${data.events.return}`]='videoStart';
events[`click ${data.events.game}`]='gameStart';
events[`click ${data.events.flow}`]='episodes';
events[`click ${data.events.map}`]='map';
events[`click ${data.events.bible}`]='bible';
events[`click ${data.events.chat}`]='chat';

export let MainView=Backbone.View.extend({
 events:events,
 className:data.view.className,
 template:_.template($(data.view.template).html()),
 initialize:function(){
  this.$appendTo=$(data.appendTo);
  //this.listenTo(app.get('aggregator'),'trash:toggle',this.toggle);//--old
  this.listenTo(app.get('aggregator'),'trash:fs',this.fs);
  this.listenTo(app.get('aggregator'),'game:end',this.gameEnd);
  this.listenTo(app.get('aggregator'),'game:progress',this.gameProgress);
  this.render();

  this.$gameProgress=this.$(data.gameProgress.el);
 },
 render:function(){
  this.$el.html(this.template());
  this.$appendTo.append(this.$el);
  this.ready();

  //this.$el.html(this.template());--old

  return this;
 },
 ready:function(){
  this.playerView=new PlayerView;
  this.gameView=new GameView;
  this.flowView=new FlowView;
  this.mapView=new MapView;
  this.bibleView=new BibleView;
  this.chatView=new ChatView;

  //this.videoStart(null);
  this.chat();//TODO:remove

  //app.get('aggregator').trigger('trash:toggle',true);//--old TODO:remove
 },
 /*toggle:function(f){//--old
  this.$el.toggleClass(data.view.shownCls,f);
 },
 toVideo:function(){
  //app.get('aggregator').trigger('player:play');
 },*/
 fs:function(f){
  this.$el.toggleClass(app.get('isMobile')?data.view.mfsCls:data.view.fsCls,f);
 },
 switchTab:function(tab){
  if(this.activeTab)
   this.activeTab.toggle(false);
  this.activeTab=tab;

  this.playerView.pause();
 },
 videoStart:function(e){
  this.switchTab(this.playerView);
  this.playerView.toggle(true);
  if(e)
   app.get('aggregator').trigger('player:play');
 },
 gameStart:function(){
  this.switchTab(this.gameView);
  this.$el.addClass(data.view.gameActiveCls);
  this.gameView.toggle(true);
  this.$gameProgress.css('clip-path',`polygon(0 0,0 0,0 100%,0 100%)`);
 },
 gameEnd:function(){
  this.$el.removeClass(data.view.gameActiveCls);
 },
 gameProgress:function(p){
  this.$gameProgress.css('clip-path',`polygon(0 0,${p}% 0,${p}% 100%,0 100%)`);
 },
 episodes:function(){
  this.switchTab(this.flowView);
  this.flowView.toggle(true);
 },
 map:function(){
  this.switchTab(this.mapView);
  this.mapView.toggle(true);
 },
 bible:function(){
  this.switchTab(this.bibleView);
  this.bibleView.toggle(true);
 },
 chat:function(){
  this.switchTab(this.chatView);
  this.chatView.toggle(true);
 }
});