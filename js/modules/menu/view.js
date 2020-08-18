import {MenuModel} from './model.js';
import {app} from '../../bf/base.js';
import {BaseBlockView} from '../baseBlock/view.js';
import {Scroll} from '../scroll/scroll.js';
import {data as scrollData} from '../scroll/data.js';
import {data as dat} from './data.js';
import {utils} from '../../bf/lib/utils.js';

let data=app.configure({menu:dat}).menu;

let scroll=Scroll();

let events={};
events[`click ${data.events.tab}`]='tab';
events[`click ${data.events.subTab}`]='subTab';

export let MenuView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 tabIndex:0,
 subTabIndex:0,
 subTabsOnce:[],
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$el.addClass((data.view.tabClsBase+this.tabIndex)+' '+(data.view.tabClsBase+'-'+this.subTabIndex));
  this.$menuSubBlock=this.$(data.view.menuSubBlock);
  this.tab();
  this.subTab();
  this.model=new MenuModel({id:data.uid});
  this.model.urlRoot=data.url;
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
 tab:function(e=0){
  this.$el.removeClass(data.view.tabClsBase+this.tabIndex);
  this.tabIndex=!e?e:$(e.currentTarget).index();
  this.$el.addClass(data.view.tabClsBase+this.tabIndex);
 },
 subTab:function(e=0){
  this.$el.removeClass(data.view.tabClsBase+'-'+this.subTabIndex);
  this.subTabIndex=!e?e:$(e.currentTarget).index();
  this.$el.addClass(data.view.tabClsBase+'-'+this.subTabIndex);
  if(!this.subTabsOnce[this.subTabIndex])
  {
   this.subTabsOnce[this.subTabIndex]=true;
   app.set({
    object:'Bar',
    on:scroll.events,
    add:$.extend(true,{},scrollData,{
     holder:this.$menuSubBlock.eq(this.subTabIndex).find(scrollData.holder),
     bar:this.$menuSubBlock.eq(this.subTabIndex).find(scrollData.bar),
     options:{helpers:{drag:utils.drag}},
     extra:{
      $wrap:this.$menuSubBlock.eq(this.subTabIndex).find(scrollData.extra.$wrap).css('margin-right',app.get('scrollDim')+'px'),
      $block:this.$menuSubBlock.eq(this.subTabIndex).find(scrollData.extra.$block)
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