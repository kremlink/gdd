import {MapMarkerModel} from './model.js';
import {utils} from '../../bf/lib/utils.js';
import {app} from '../../bf/base.js';
import {Scroll} from '../scroll/scroll.js';
import {data as scrollData} from '../scroll/data.js';
import {data} from './data.js';

app.configure({scroll:data.scroll});

let scroll=Scroll();

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
  this.$marks=this.$(data.events.marker);
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
  let index=this.$marks.index(e.currentTarget);

  this.current=this.marks.at(index);
  this.$popContent=$(this.popTemplate(_.extend({margin:app.get('scrollDim')},this.current.toJSON({all:true}))));
  this.$pop.append(this.$popContent);
  this.$el.addClass(data.view.popShownCls);
  this.$reacted=this.$(data.view.$reacted);
  this.renderReacted();

  this.popScroll=app.set({
   object:'Bar',
   on:scroll.events,
   add:$.extend(true,{},scrollData,{
    holder:this.$pop.find(scrollData.holder),
    bar:this.$pop.find(scrollData.bar),
    options:{helpers:{drag:utils.drag}},
    extra:{$wrap:this.$pop.find(scrollData.extra.$wrap),$block:this.$pop.find(scrollData.extra.$block)}
   }),
   set:false
  });
 },
 unpop:function(){
  this.popScroll.destroy();
  this.$popContent.remove();
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