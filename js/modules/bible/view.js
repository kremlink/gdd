import {utils} from '../../bf/lib/utils.js';
import {app} from '../../bf/base.js';
//import {data} from './data.js';
import {data as dat} from './data.js';
import {Scroll} from '../scroll/scroll.js';
import {data as scrollData} from '../scroll/data.js';
import {BaseBlockView} from '../baseBlock/view.js';

let data=app.configure({bible:dat}).bible;

let scroll=Scroll,
    epIndex;

let events={};
events[`click ${data.events.tab}`]='tab';
events[`click ${data.events.item}`]='pop';
events[`click ${data.events.close}`]='unpop';
events[`mouseenter ${data.events.close},${data.events.tab}`]='hover';

export let BibleView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 template:_.template($(data.view.template).html()),
 tabTemplate:_.template($(data.view.tabTemplate).html()),
 popTemplate:_.template($(data.view.popTemplate).html()),
 initialize:function(){
  epIndex=app.get('epIndex');

  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.scrollDim=app.get('scrollDim');
  this.$el.html(this.template({margin:this.scrollDim,data:data.data[epIndex]}));
  this.$itemsContainer=this.$(data.view.$itemsContainer);
  this.$itemsWrap=this.$(data.view.$itemsWrap);
  this.$pop=this.$(data.view.$pop);
  this.$tabs=this.$(data.events.tab);
  this.$name=this.$(data.view.$name);
  this.$currentTab=null;
  this.$popContent=null;
  this.popScroll=null;
  this.tabScroll=null;
  this.tab(null);
 },
 hover:function(){
  app.get('aggregator').trigger('sound','h-h');
 },
 setScroll:function(what,container){
  let $wrap=container.find(scrollData.extra.$wrap).scrollTop(0),
      $block=container.find(scrollData.extra.$block);

  this[what]=app.set({
   object:'Bar',
   on:scroll.events($wrap,$block),
   add:$.extend(true,{},scrollData,{
    holder:container.find(scrollData.holder),
    bar:container.find(scrollData.bar),
    options:{helpers:{drag:utils.drag}},
    extra:{$wrap:$wrap,$block:$block}
   }),
   set:false
  });
 },
 tab:function(e){
  let id,
  tab=e?$(e.currentTarget):this.$tabs.eq(0);

  if(!tab.hasClass(data.view.activeTabCls))
  {
   this.$currentTab=tab;

   this.$tabs.removeClass(data.view.activeTabCls);
   id=this.$currentTab.addClass(data.view.activeTabCls).data(data.view.dataClick);

   if(this.tabScroll)
    this.tabScroll.destroy();
   this.$itemsContainer.html(this.tabTemplate({
    id:id,
    data:data.data[epIndex][id].items
   }));
   this.$name.text(data.data[epIndex][id].name);
   this.setScroll('tabScroll',this.$itemsWrap);
  }
 },
 pop:function(e){
  let id=$(e.currentTarget).data(data.view.dataId),
  tid=this.$currentTab.data(data.view.dataClick);

  this.$popContent=$(this.popTemplate(_.extend({margin:this.scrollDim,tid:tid},data.data[epIndex][this.$currentTab.data(data.view.dataClick)].items.filter(o=>o.id.toString()===id.toString())[0])));
  this.$pop.append(this.$popContent).addClass(data.view.shownCls);

  this.setScroll('popScroll',this.$pop);
  app.get('aggregator').trigger('sound','pop');
 },
 unpop:function(){
  app.get('aggregator').trigger('sound','close');
  this.popScroll.destroy();
  this.$popContent.remove();
  this.$pop.removeClass(data.view.shownCls);
 }
});