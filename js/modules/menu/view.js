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
events[`click ${data.events.callbFocus}`]='focus';
events[`click ${data.events.sharCopy}`]='sharCopy';
events[`mouseenter ${data.events.tab},${data.events.subTab},${data.events.callbTab},${data.events.callbSend},${data.events.callbOk},${data.events.sharCopy}`]='hover';


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
  this.$tabs=this.$(data.events.tab);
  this.$subTabs=this.$(data.events.subTab);
  this.$menuSubBlock=this.$(data.view.menuSubBlock);
  this.$copyFrom=this.$(data.view.copyFrom);
  this.$callb={
   tab:this.$(data.events.callbTab),
   tabInput:this.$(data.view.callb.tabInput),
   init:this.$(data.view.callb.init),
   sent:this.$(data.view.callb.sent),
   data:null
  };
  this.$callb.data=this.$callb.init.find(':input');
  this.callbTab();
  this.tab();
  this.subTab();
  this.authors();
  this.model=new MenuModel({id:data.uid});
  this.model.urlRoot=data.formUrl;
  this.listenTo(this.model,'invalid',this.callbInvalid);
 },
 hover:function(){
  app.get('aggregator').trigger('sound','h-h');
 },
 focus:function(e){
  $(e.currentTarget).removeClass(data.view.callb.errCls);
 },
 sharCopy:function(){
  this.$copyFrom[0].select();
  document.execCommand('copy');
  this.$el.addClass(data.view.refCopyCls);
  app.get('aggregator').trigger('sound','h-c');
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
 callbInvalid:function(m,err){
  err.forEach(o=>{
   this.$callb.data.filter(`[name=${o}]`).addClass(data.view.callb.errCls);
  });
 },
 callbSend:function(){
  let d={};

  app.get('aggregator').trigger('sound','h-c');
  this.$callb.data.each((i)=>{
   let obj=this.$callb.data.eq(i);

   d[obj.attr('name')]={value:obj.is('input:checkbox')?(obj.is(':checked')?1:''):obj.val(),reg:obj.data(data.view.callb.vData)};
  });

  this.model.save(d,{
   dataType:'text',
   success:()=>{
    this.$callb.init.addClass(data.view.callb.hiddenCls);
    this.$callb.sent.addClass(data.view.callb.shownCls);
   },
   error:()=>{
    alert('Что-то пошло не так. Попробуйте еще раз');
   }
  });
 },
 callbOk:function(){
  this.$callb.init.removeClass(data.view.callb.hiddenCls);
  this.$callb.sent.removeClass(data.view.callb.shownCls);
  app.get('aggregator').trigger('sound','h-c');
 },
 callbTab:function(e=0){
  this.$callb.tab.removeClass(data.view.callb.activeCls);
  this.callbTabIndex=!e?e:$(e.currentTarget).index();
  this.$callb.tab.eq(this.callbTabIndex).addClass(data.view.callb.activeCls);
  this.$callb.tabInput.val(this.callbTabIndex);
  if(e)
   app.get('aggregator').trigger('sound','h-c');
 },
 tab:function(e=0){
  this.$el.removeClass(data.view.tabClsBase+this.tabIndex);
  this.$tabs.eq(this.tabIndex).removeClass(data.view.shownCls);
  this.tabIndex=!e?e:$(e.currentTarget).index();
  this.$tabs.eq(this.tabIndex).addClass(data.view.shownCls);
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
  this.$subTabs.eq(this.subTabIndex).removeClass(data.view.shownCls);
  this.subTabIndex=!e?e:$(e.currentTarget).index();
  this.$el.addClass(data.view.tabClsBase+'-'+this.subTabIndex);
  this.$subTabs.eq(this.subTabIndex).addClass(data.view.shownCls);
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