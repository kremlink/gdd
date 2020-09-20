import {app} from '../../bf/base.js';
import {data as dat} from './data.js';
import {GameView} from '../game/view.js';
import {FlowView} from '../flow/view.js';
import {MapView} from '../map/view.js';
import {BibleView} from '../bible/view.js';
import {ChatView} from '../chat/view.js';
import {LoadSaveView} from '../loadsave/view.js';
import {MenuView} from '../menu/view.js';
import {NullView} from '../null/view.js';
import {SoundMgr} from '../soundMgr/view.js';

let data=app.configure({main:dat}).main,
 events={},
 epIndex;

//events[`click ${data.events.return}`]='toVideo';
events[`click ${data.events.play}`]='topBtn';
events[`click ${data.events.game}`]='gameStart';
events[`click ${data.events.flow}`]='episodes';
events[`click ${data.events.map}`]='map';
events[`click ${data.events.bible}`]='bible';
events[`click ${data.events.chat}`]='chat';
events[`click ${data.events.loadsave}`]='loadsave';
events[`click ${data.events.menu}`]='menu';
events[`click ${data.events.null}`]='obnul';

export let MainView=Backbone.View.extend({
 events:events,
 el:data.view.el,
 epBlocked:false,
 initialize:function(){
  epIndex=app.get('epIndex');
  //this.listenTo(app.get('aggregator'),'trash:toggle',this.toggle);//--old
  this.listenTo(app.get('aggregator'),'data:ready',this.isReady);
  this.listenTo(app.get('aggregator'),'trash:fs',this.fs);
  this.listenTo(app.get('aggregator'),'game:progress',this.gameProgress);
  this.listenTo(app.get('aggregator'),'episodes:progress',this.epProgress);
  this.listenTo(app.get('aggregator'),'react:progress',this.reactProgress);
  this.listenTo(app.get('aggregator'),'trash:obnulEnded',this.obnulEnded);

  this.$gameProgress=this.$(data.gameProgress.el);
  this.$epProgress=this.$(data.epProgress.el);
  this.$reactProgress=this.$(data.reactProgress.el);

  this.$playBtn=this.$(data.events.play);

  this.loadSaveView=new LoadSaveView;
  //app.get('aggregator').trigger('trash:toggle',true);//--old TODO:remove
 },
 isReady:function(m){
  let ep=m.get('ep');

  new SoundMgr;

  this.gameView=new GameView;
  this.flowView=new FlowView;
  this.mapView=new MapView;
  this.bibleView=new BibleView;
  this.chatView=new ChatView;
  this.menuView=new MenuView;
  this.nullView=new NullView;

  if(epIndex>0)
  /*{this.menu({currentTarget:this.$(data.events.menu)});this.menuView.tab({currentTarget:this.$('.bottom-panel .tab-tab').eq(1)})}*/
   this.episodes();else
   this.chat({muted:true,currentTarget:this.$(data.events.chat)});

  if(ep===0&&epIndex===1)
  {
   m.save({ep:1});
   ep++;
   app.get('aggregator').trigger('flow:inc',ep);
  }

  if(ep<epIndex)
   this.block();
 },
 obnulEnded:function(){
  let d=this.loadSaveView.model.toJSON();

  this.$el.addClass(data.view.obnul.endCls);
  setTimeout(()=>{
   this.$el.addClass(data.view.obnul.afterCls);
   this.episodes();
   //values->100: ep 0 to 100%, game result 0 to 100%, reacts max 40; and divide by 3
   app.get('aggregator').trigger('player:playPause',//hardcoded value 2.5=100/d.epis.length/4 (4 - reactions amount in every episode)
    {play:true,end:{src:data.view.obnul[(d.ep+d.sum+d.react*2.5)/3<data.fail?'badSrc':'goodSrc'],href:data.view.obnul.href}});
  },data.view.obnul.waitVid);
 },
 epProgress:function(opts){
  this.$epProgress.css('width',`${opts.p}%`);
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

  app.get('aggregator').trigger('player:playPause',{play:false});
 },
 clickBtn:function(e,what){
  this.$playBtn.removeClass(data.view.playBtnCls);
  if($(e.currentTarget).hasClass(data.view.activeBtnCls))
  {
   this.switchTab(what);
   what.toggle(true);
   if(!e.muted)
    app.get('aggregator').trigger('sound','btn');
  }else
  {
   if(!e.muted)
    app.get('aggregator').trigger('sound','btn-inac');
  }
 },
 gameProgress:function(opts){
  if(opts.ini)
   this.$el.addClass(data.view.gamePlayingCls);
  if(opts.end)
   this.$el.removeClass(data.view.gamePlayingCls);
  if(!opts.ini)
   this.$gameProgress.css('width',`${opts.p}%`);
 },
 reactProgress:function(opts){
  this.$reactProgress.css('width',`${opts.p>100?100:opts.p}%`);
  app.get('aggregator').trigger('data:set',{react:opts.ctr});
 },
 block:function(){
  this.epBlocked=true;
 },
 //====btns====
 obnul:function(){
  if(epIndex===10)
  {
   app.get('aggregator').trigger('sound','obnul-c');
   this.switchTab(this.nullView);
   this.nullView.toggle(true);
   this.nullView.lottie();
   this.$el.addClass(data.view.obnul.cls);
   this.$epProgress.css({transitionDuration:data.view.obnul.dur,transitionDelay:data.view.obnul.start.ep,width:0});
   this.$gameProgress.css({transitionDuration:data.view.obnul.dur,transitionDelay:data.view.obnul.start.game,width:0});
   this.$reactProgress.css({transitionDuration:data.view.obnul.dur,transitionDelay:data.view.obnul.start.react,width:0});
  }else
  {
   app.get('aggregator').trigger('sound','btn-inac');
  }
 },
 topBtn:function(){
  //this.switchTab(this.playerView);
  //this.playerView.toggle(true);
  if(this.activeTab===this.flowView)
   app.get('aggregator').trigger('player:playPause',{play:true});
  if(this.activeTab===this.gameView)
   this.gameView.play();
  app.get('aggregator').trigger('sound','play');
 },
 gameStart:function(){
  this.switchTab(this.gameView);
  this.$playBtn.addClass(data.view.playBtnCls);
  this.gameView.toggle(true);
  app.get('aggregator').trigger('sound','btn');
 },
 episodes:function(e){
  this.$playBtn.addClass(data.view.playBtnCls);
  this.switchTab(this.flowView);
  this.flowView.toggle(true);
  if(e)
   app.get('aggregator').trigger('sound','btn');
 },
 map:function(e){
  this.clickBtn(e,this.mapView);
 },
 bible:function(e){
  this.clickBtn(e,this.bibleView);
 },
 chat:function(e){
  this.clickBtn(e,this.chatView);
 },
 loadsave:function(e){
  this.clickBtn(e,this.loadSaveView);
 },
 menu:function(e){
  this.clickBtn(e,this.menuView);
 }
});