import {MenuModel} from './model.js';
import {app} from '../../bf/base.js';
import {BaseBlockView} from '../baseBlock/view.js';
import {Scroll} from '../scroll/scroll.js';
import {data as scrollData} from '../scroll/data.js';
import {data as dat} from './data.js';
import {utils} from '../../bf/lib/utils.js';

let data=app.configure({menu:dat}).menu;

let scroll=Scroll;

let events={};
events[`click ${data.events.tab}`]='tab';
events[`click ${data.events.subTab}`]='subTab';
events[`click ${data.events.callbTab}`]='callbTab';
events[`click ${data.events.callbSend}`]='callbSend';
events[`click ${data.events.callbOk}`]='callbOk';
events[`click ${data.events.sharCopy}`]='sharCopy';
events[`mouseenter ${data.events.tab},${data.events.subTab}`]='hover';


export let MenuView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 tabIndex:0,
 subTabIndex:0,
 callbTabIndex:0,
 subTabsOnce:[],
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$el.addClass((data.view.tabClsBase+this.tabIndex)+' '+(data.view.tabClsBase+'-'+this.subTabIndex));
  this.$menuSubBlock=this.$(data.view.menuSubBlock);
  this.$copyFrom=this.$(data.view.copyFrom);
  this.$callb={
   tab:this.$(data.events.callbTab),
   tabInput:this.$(data.view.callb.tabInput),
   init:this.$(data.view.callb.init),
   sent:this.$(data.view.callb.sent)
  };
  this.callbTab();
  this.tab();
  this.subTab();
  this.authors();
  this.model=new MenuModel({id:data.uid});
  this.model.urlRoot=data.formUrl;
  this.listenTo(this.model,'invalid',()=>{
   this.$el.addClass(data.view.errCls);
  });
  this.listenTo(this.model,'sync',(m,r)=>{
   if(r.error)
   {
    this.model.trigger('invalid');
   }else
   {

   }
  });
 },
 hover:function(){
  app.get('aggregator').trigger('sound','h-h');
 },
 sharCopy:function(){
  this.$copyFrom[0].select();
  document.execCommand('copy');
  this.$el.addClass(data.view.refCopyCls);
 },
 authors:function(){
  let $authors=this.$(data.view.authors),
   $wrap=$authors.find(scrollData.extra.$wrap).css('margin-right',app.get('scrollDim')+'px').scrollTop(0),
   $block=$authors.find(scrollData.extra.$block);

  app.set({
   object:'Bar',
   on:scroll.events($wrap,$block),
   add:$.extend(true,{},scrollData,{
    holder:$authors.find(scrollData.holder),
    bar:$authors.find(scrollData.bar),
    options:{helpers:{drag:utils.drag}},
    extra:{
     $wrap:$wrap,
     $block:$block
    }
   }),
   set:false
  });
 },
 callbSend:function(){
  this.$callb.init.addClass(data.view.callb.hiddenCls);
  this.$callb.sent.addClass(data.view.callb.shownCls);
 },
 callbOk:function(){
  this.$callb.init.removeClass(data.view.callb.hiddenCls);
  this.$callb.sent.removeClass(data.view.callb.shownCls);
 },
 callbTab:function(e=0){
  this.$callb.tab.removeClass(data.view.callb.activeCls);
  this.callbTabIndex=!e?e:$(e.currentTarget).index();
  this.$callb.tab.eq(this.callbTabIndex).addClass(data.view.callb.activeCls);
  this.$callb.tabInput.val(this.callbTabIndex);
 },
 tab:function(e=0){
  this.$el.removeClass(data.view.tabClsBase+this.tabIndex);
  this.tabIndex=!e?e:$(e.currentTarget).index();
  this.$el.addClass(data.view.tabClsBase+this.tabIndex);
  this.$el.removeClass(data.view.refCopyCls);
  if(e)
   app.get('aggregator').trigger('sound','h-c');
 },
 subTab:function(e=0){
  let $wrap,
   $block;

  if(e)
   app.get('aggregator').trigger('sound','h-c');
  this.$el.removeClass(data.view.tabClsBase+'-'+this.subTabIndex);
  this.subTabIndex=!e?e:$(e.currentTarget).index();
  this.$el.addClass(data.view.tabClsBase+'-'+this.subTabIndex);
  if(!this.subTabsOnce[this.subTabIndex])
  {
   $wrap=this.$menuSubBlock.eq(this.subTabIndex).find(scrollData.extra.$wrap).scrollTop(0).css('margin-right',app.get('scrollDim')+'px');
   $block=this.$menuSubBlock.eq(this.subTabIndex).find(scrollData.extra.$block);
   this.subTabsOnce[this.subTabIndex]=true;
   app.set({
    object:'Bar',
    on:scroll.events($wrap,$block),
    add:$.extend(true,{},scrollData,{
     holder:this.$menuSubBlock.eq(this.subTabIndex).find(scrollData.holder),
     bar:this.$menuSubBlock.eq(this.subTabIndex).find(scrollData.bar),
     options:{helpers:{drag:utils.drag}},
     extra:{
      $wrap:$wrap,
      $block:$block
     }
    }),
    set:false
   });
  }
 },
 toggle:function(f){
  BaseBlockView.prototype.toggle.apply(this,[f]);
  this.$el.removeClass((data.view.tabClsBase+this.tabIndex)+' '+(data.view.tabClsBase+'-'+this.subTabIndex)+' '+data.view.endSaveCls)
   .addClass((data.view.tabClsBase+'0')+' '+(data.view.tabClsBase+'-0'));
  this.tabIndex=0;
  this.subTabIndex=0;
 }
});