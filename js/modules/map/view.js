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
 reactedTemplate:_.template($(data.view.reactedTemplate).html()),
 initialize:function(){
  this.$el.html(this.template({data:data.data}));
  this.$pop=this.$(data.view.$pop);
  this.marks=new (Backbone.Collection.extend({model:MapMarkerModel}));
  this.marks.reset(data.data);
  this.addMarks();
  this.current=null;
  this.$popContent=null;
  this.$reacted=null;
 },
 addMarks:function(){
  this.marks.each((model,index)=>{
   model.set('index',index);
  });
 },
 show:function(){
  this.$el.addClass(data.view.shownCls);
 },
 hide:function(){
  this.$el.removeClass(data.view.shownCls);
 },
 renderReacted:function(){
  this.$reacted.html(this.reactedTemplate(this.current.toJSON()));
 },
 pop:function(e){
  let index=+$(e.currentTarget).index(this.$(data.events.marker));

  if(this.$popContent)
   this.$popContent.remove();
  this.current=this.marks.at(index);
  this.$popContent=$(this.popTemplate(this.current.toJSON({all:true})));
  this.$pop.append(this.$popContent);
  this.$el.addClass(data.view.popShownCls);
  this.$reacted=this.$(data.view.$reacted);
  this.renderReacted();
 },
 unpop:function(){
  this.$el.removeClass(data.view.popShownCls);
 },
 react:function(e){
  let type=$(e.currentTarget).data(data.view.dataClick),
  count=this.current.get(type);

  this.current.save({react:type,[type]:count+1});
  this.$(data.view.$reactContainer).addClass(type+' '+data.view.reactedCls);
  this.renderReacted();
 }
});