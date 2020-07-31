import {MapMarkerModel} from './model.js';
import {utils} from '../../bf/lib/utils.js';
import {app} from '../../bf/base.js';
import {Scroll} from '../scroll/scroll.js';
import {data as scrollData} from '../scroll/data.js';
import {data} from './data.js';
import {BaseBlockView} from '../baseBlock/view.js';

app.configure({scroll:data.scroll});

let scroll=Scroll();

let events={};
events[`click ${data.events.marker}`]='pop';
events[`click ${data.events.close}`]='unpop';
events[`click ${data.events.react}`]='react';

export let MapView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 template:_.template($(data.view.template).html()),
 popTemplate:_.template($(data.view.popTemplate).html()),
 reactedTemplate:_.template($(data.view.reactedTemplate).html()),
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$el.html(this.template({data:data.data}));
  this.$pop=this.$(data.view.$pop);
  this.marks=new (Backbone.Collection.extend({model:MapMarkerModel}));
  this.marks.reset(data.data);
  this.$marks=this.$(data.events.marker);
  this.current=null;
  this.$popContent=null;
  this.$reacted=null;
 },
 renderReacted:function(){
  this.$reacted.html(this.reactedTemplate(this.current.toJSON()));
 },
 pop:function(e){
  let id=$(e.currentTarget).data(data.view.dataId);

  this.current=this.marks.where({id:id})[0];
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
  this.$reacted.addClass(type+' '+data.view.reactedCls);
  this.renderReacted();
 }
});