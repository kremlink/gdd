import {app} from '../../bf/base.js';
import {data} from './data.js';
import {GameView} from '../game/view.js';
import {FlowView} from '../flow/view.js';
import {MapView} from '../map/view.js';
import {BibleView} from '../bible/view.js';
import {ChatView} from '../chat/view.js';
import {LoadSaveView} from '../loadsave/view.js';
import {MenuView} from '../menu/view.js';

let events={};
//events[`click ${data.events.return}`]='toVideo';
events[`click ${data.events.play}`]='topBtn';
events[`click ${data.events.game}`]='gameStart';
events[`click ${data.events.flow}`]='episodes';
events[`click ${data.events.map}`]='map';
events[`click ${data.events.bible}`]='bible';
events[`click ${data.events.chat}`]='chat';
events[`click ${data.events.loadsave}`]='loadsave';
events[`click ${data.events.menu}`]='menu';

export let MainView=Backbone.View.extend({
 events:events,
 el:data.view.el,
 initialize:function(){
  //this.listenTo(app.get('aggregator'),'trash:toggle',this.toggle);//--old
  this.listenTo(app.get('aggregator'),'trash:fs',this.fs);
  this.listenTo(app.get('aggregator'),'game:end',this.gameEnd);
  this.listenTo(app.get('aggregator'),'game:progress',this.gameProgress);
  this.listenTo(app.get('aggregator'),'episodes:progress',this.epProgress);

  this.$gameProgress=this.$(data.gameProgress.el);
  this.ready();
 },
 ready:function(){
  this.gameView=new GameView;
  this.flowView=new FlowView;
  this.mapView=new MapView;
  this.bibleView=new BibleView;
  this.chatView=new ChatView;
  this.loadSaveView=new LoadSaveView;
  this.menuView=new MenuView;

  if(app.get('epIndex')>0)
   this.episodes();else
   this.chat();
  //this.map();

  //app.get('aggregator').trigger('trash:toggle',true);//--old TODO:remove
 },
 epProgress:function(p){
  this.$epProgress=this.$(data.epProgress.el);
  this.$epProgress.css('width',`${p}%`);
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

  app.get('aggregator').trigger('player:playPause',false);
 },
 topBtn:function(){
  //this.switchTab(this.playerView);
  //this.playerView.toggle(true);
  if(this.activeTab===this.flowView)
   app.get('aggregator').trigger('player:playPause',true);
  if(this.activeTab===this.gameView)
   this.gameView.play();
 },
 gameStart:function(){
  this.switchTab(this.gameView);
  //this.$el.addClass(data.view.gameActiveCls);
  this.gameView.toggle(true);
  this.$gameProgress.css('width','0px');
 },
 gameEnd:function(){
  this.$el.removeClass(data.view.gamePlayingCls);
 },
 gameProgress:function(p){
  this.$el.addClass(data.view.gamePlayingCls);
  this.$gameProgress.css('width',`${p}%`);
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
 },
 loadsave:function(){
  this.switchTab(this.loadSaveView);
  this.loadSaveView.toggle(true);
 },
 menu:function(){
  this.switchTab(this.menuView);
  this.menuView.toggle(true);
 }
});