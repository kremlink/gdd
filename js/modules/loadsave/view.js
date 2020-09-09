import {LoadSaveModel} from './model.js';
import {app} from '../../bf/base.js';
import {BaseBlockView} from '../baseBlock/view.js';
import {data as dat} from './data.js';

let data=app.configure({loadsave:dat}).loadsave;

let events={};
events[`click .${data.view.tabCls}`]='lsTab';
events[`click ${data.events.copy}`]='copy';
events[`click ${data.events.load}`]='load';
events[`focus ${data.events.focus}`]='focus';
events[`click ${data.events.clr}`]='clr';
events[`mouseenter .${data.view.tabCls}`]='hover';

export let LoadSaveView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 tabIndex:0,
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$el.addClass(data.view.tabCls+this.tabIndex);
  this.$copyFrom=this.$(data.view.copyFrom);
  this.$loadFrom=this.$(data.events.focus);
  this.model=new LoadSaveModel({id:data.uid});
  this.model.urlRoot=data.url;
  this.$copyFrom.val(data.copy);
  this.listenTo(this.model,'invalid',()=>{
   this.$el.addClass(data.view.errCls);
  });
  this.listenTo(this.model,'sync',(m,r)=>{
   if(r.error)
   {
    this.model.trigger('invalid');
   }else
   {
    if(r.type==='load')
     this.$el.addClass(data.view.endSaveCls);
    setTimeout(()=>{
     location.reload();
    },r.type==='load'?data.saveReloadTime:0);
   }
  });
 },
 hover:function(){
  app.get('aggregator').trigger('sound','h-h');
 },
 lsTab:function(e){
  app.get('aggregator').trigger('sound','h-c');
  this.$el.removeClass(data.view.tabCls+this.tabIndex);
  this.tabIndex=$(e.currentTarget).index();
  this.$el.addClass(data.view.tabCls+this.tabIndex);
 },
 toggle:function(f){
  BaseBlockView.prototype.toggle.apply(this,[f]);
  this.$el.removeClass((data.view.tabCls+this.tabIndex)+' '+data.view.endSaveCls).addClass(data.view.tabCls+'0');
  this.tabIndex=0;
 },
 copy:function(){
  this.$copyFrom[0].select();
  document.execCommand('copy');
 },
 isValid:function(v){
  return $.trim(v)==='1';
 },
 load:function(){
  this.model.save({type:'load',value:this.$loadFrom.val()});
 },
 focus:function(){
  this.$el.removeClass(data.view.errCls);
 },
 clr:function(){
  this.model.save({type:'clr'});
 }
});