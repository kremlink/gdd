import {MapMarkerModel} from './model.js';
import {data} from './data.js';

let events={};
events[`click ${data.events.marker}`]='pop';
events[`click ${data.events.close}`]='unpop';
events[`click ${data.events.react}`]='react';

export let MapView=Backbone.View.extend({
 el:data.view.el,
 events:events,
 template:_.template($(data.view.template).html()),
 popTemplate:_.template($(data.view.popTemplate).html()),
 initialize:function(){
  let d=this.template({data:data.data});
  this.$el.html(this.template({data:data.data}));
  this.$pop=this.$(data.view.pop);
  this.marks=new (Backbone.Collection.extend({model:MapMarkerModel}));
  this.marks.reset(data.data);
  this.listenTo(this.marks,'change:react',this.reactDone);
 },
 show:function(){
  this.$el.addClass(data.view.shownCls);
 },
 hide:function(){
  this.$el.removeClass(data.view.shownCls);
 },
 pop:function(e){
  let index=+$(e.currentTarget).data(data.view.markerData);

  this.$pop.append(this.popTemplate(_.extend(this.marks.at(index).toJSON(),{index:index})));
  this.$el.addClass(data.view.popShownCls);
 },
 unpop:function(){
  this.$el.removeClass(data.view.popShownCls);
 },
 react:function(){

 },
 reactDone:function(){

 }
});