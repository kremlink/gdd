import {utils} from '../../bf/lib/utils.js';
import {app} from '../../bf/base.js';
import {data} from './data.js';
import {Scroll} from '../scroll/scroll.js';
import {data as scrollData} from '../scroll/data.js';
import {BaseBlockView} from '../baseBlock/view.js';

app.configure({scroll:data.scroll});

let scroll=Scroll();

let events={};
events[`click ${data.events.tab}`]='tab';
events[`click ${data.events.item}`]='pop';
events[`click ${data.events.close}`]='unpop';

export let BibleView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 template:_.template($(data.view.template).html()),
 tabTemplate:_.template($(data.view.tabTemplate).html()),
 popTemplate:_.template($(data.view.popTemplate).html()),
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.scrollDim=app.get('scrollDim');
  this.$el.html(this.template({margin:this.scrollDim,data:data.data}));
  this.$itemsContainer=this.$(data.view.$itemsContainer);
  this.$itemsWrap=this.$(data.view.$itemsWrap);
  this.$pop=this.$(data.view.$pop);
  this.$tabs=this.$(data.events.tab);
  this.$currentTab=null;
  this.$popContent=null;
  this.popScroll=null;
  this.tabScroll=null;
  this.tab(null);
 },
 setScroll:function(what,container){
  this[what]=app.set({
   object:'Bar',
   on:scroll.events,
   add:$.extend(true,{},scrollData,{
    holder:container.find(scrollData.holder),
    bar:container.find(scrollData.bar),
    options:{helpers:{drag:utils.drag}},
    extra:{$wrap:container.find(scrollData.extra.$wrap),$block:container.find(scrollData.extra.$block)}
   }),
   set:false
  });
 },
 tab:function(e){
  let id;

  this.$currentTab=e?$(e.currentTarget):this.$tabs.eq(0);

  this.$tabs.removeClass(data.view.activeTabCls);
  id=this.$currentTab.addClass(data.view.activeTabCls).data(data.view.dataClick);

  if(this.tabScroll)
   this.tabScroll.destroy();
  this.$itemsContainer.html(this.tabTemplate({
   id:id,
   data:data.data[id].items
  }));
  this.setScroll('tabScroll',this.$itemsWrap);
 },
 pop:function(e){
  let id=$(e.currentTarget).data(data.view.dataId),
  tid=this.$currentTab.data(data.view.dataClick);

  this.$popContent=$(this.popTemplate(_.extend({margin:this.scrollDim,tid:tid},data.data[this.$currentTab.data(data.view.dataClick)].items.filter(o=>o.id.toString()===id.toString())[0])));
  this.$pop.append(this.$popContent);
  this.$el.addClass(data.view.popShownCls);

  this.setScroll('popScroll',this.$pop);
 },
 unpop:function(){
  this.popScroll.destroy();
  this.$popContent.remove();
  this.$el.removeClass(data.view.popShownCls);
 }
});