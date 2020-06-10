import {app} from '../../bf/base.js';
//import {data as dat} from './data.js';
import {data} from './data.js';
import {PlayerView} from '../player/view.js';
import {GameView} from '../game/view.js';
import {FlowView} from '../flow/view.js';
import {MapView} from '../map/view.js';

//let data=app.configure({trash:dat}).trash;

let events={};
events[`click ${data.events.return}`]='toVideo';
events[`click ${data.events.game}`]='gameStart';
events[`click ${data.events.flow}`]='episodes';
events[`click ${data.events.map}`]='map';

export let TrashView=Backbone.View.extend({
 events:events,
 className:data.view.className,
 template:_.template($(data.view.template).html()),
 initialize:function(){
  this.$appendTo=$(data.appendTo);
  /*this.listenTo(app.get('aggregator'),'trash:toggle',this.toggle);
  this.listenTo(app.get('aggregator'),'trash:fs',this.fs);*///--old
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

  this.videoStart();

  //app.get('aggregator').trigger('trash:toggle',true);//TODO:remove
  //this.map();//TODO:remove
 },
 /*toggle:function(f){//--old
  this.$el.toggleClass(data.view.shownCls,f);
 },
 fs:function(f){
  this.$el.toggleClass(data.view.fsCls,f);
 },*/
 toVideo:function(){
  this.playerView.play();
  //app.get('aggregator').trigger('player:play');//--old
 },
 switchTab:function(tab){
  if(this.activeTab)
   this.activeTab.hide();
  this.activeTab=tab;

  this.playerView.pause();
 },
 videoStart:function(){
  this.switchTab(this.playerView);
  this.playerView.show();
 },
 gameStart:function(){
  this.switchTab(this.gameView);
  this.$el.addClass(data.view.gameActiveCls);
  this.gameView.play();
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
  this.flowView.show();
 },
 map:function(){
  this.switchTab(this.mapView);
  this.mapView.show();
 }
});