import {MenuModel} from './model.js';
import {app} from '../../bf/base.js';
import {BaseBlockView} from '../baseBlock/view.js';
import {data as dat} from './data.js';

let data=app.configure({menu:dat}).menu;

let events={};
events[`click .${data.view.tabCls}`]='lsTab';

export let MenuView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 tabIndex:0,
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$el.addClass(data.view.tabCls[this.tabIndex]);
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
 lsTab:function(e){
  this.$el.removeClass(data.view.tabCls+this.tabIndex);
  this.tabIndex=$(e.currentTarget).index();
  this.$el.addClass(data.view.tabCls+this.tabIndex);
 },
 toggle:function(f){
  BaseBlockView.prototype.toggle.apply(this,[f]);
  this.$el.removeClass((data.view.tabCls+this.tabIndex)+' '+data.view.endSaveCls).addClass(data.view.tabCls+'0');
  this.tabIndex=0;
 }
});