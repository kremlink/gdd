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
  this.render();

  this.$main=this.$(data.view.main);
  this.gameView=new GameView;
  this.$main.append(this.gameView.el);
 },
 render:function(){
  this.$el.html(this.template());

  return this;
 },
 toggle:function(f){
  this.$el.toggleClass(data.view.shownCls,f);
 },
 toVideo:function(){
  app.get('aggregator').trigger('player:play');
 },
 game:function(){
  this.$el.toggleClass(data.view.gameActiveCls);
  this.gameView.toggle(this.$el.hasClass(data.view.gameActiveCls));
 }
});