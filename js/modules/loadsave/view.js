import {LoadSaveModel} from './model.js';
import {app} from '../../bf/base.js';
import {BaseBlockView} from '../baseBlock/view.js';
import {data as dat} from './data.js';

let data=app.configure({loadsave:dat}).loadsave;

let events={},
 epIndex;

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
 datTmpl:_.template(data.datTmpl),
 initialize:function(){
  epIndex=app.get('epIndex');

  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$tabs=this.$('.'+data.view.tabCls);
  this.$el.addClass(data.view.tabCls+this.tabIndex);
  this.$copyFrom=this.$(data.view.copyFrom);
  this.$loadFrom=this.$(data.events.focus);
  this.model=new LoadSaveModel({id:data.uid});
  app.set({dest:'objects.ls',object:this.model});
  this.model.urlRoot=data.url;
  this.listenTo(app.get('aggregator'),'data:set',this.setData);
  this.listenTo(this.model,'invalid',this.invalid);
  this.listenTo(this.model,'change:type',this.changeType);

  this.listenTo(app.get('aggregator'),'episodes:progress',({p})=>this.setVal('ep',p/10));
  this.listenTo(app.get('aggregator'),'game:progress',({p})=>this.setVal('game',p));
  this.listenTo(app.get('aggregator'),'react:progress',({ctr})=>this.setVal('react',ctr));

  this.lsTab();

  this.model.fetch({
   success:()=>{
    app.get('aggregator').trigger('data:ready',this.model);
    this.$copyFrom.val(this.datTmpl(this.model.toJSON()));
   },
   error:()=>{
    this.model.save();
    app.get('aggregator').trigger('data:ready',this.model);
    this.$copyFrom.val(this.datTmpl(this.model.toJSON()));
   }
  });
 },
 setVal:function(t,v){
  this.model.save({[t]:v});
  this.$copyFrom.val(this.datTmpl(this.model.toJSON()));
 },
 setData:function(d){
  let ep;

  if(d.name==='ep')
  {
   ep=this.model.get(d.name);
   if(ep===epIndex)
   {
    this.model.save({[d.name]:epIndex+1});
    app.get('aggregator').trigger('flow:inc',epIndex+1);
   }
  }else
  {
   this.model.save(d);
  }
 },
 changeType:function(m,v){
  if(v==='load')
  {
   this.$el.addClass(data.view.endSaveCls);
   setTimeout(()=>{
    this.model.setLoaded();
    location.reload();
   },data.saveReloadTime);
  }
  if(v==='clr'){
   setTimeout(()=>{
    this.model.clr();
    location.href=data.clrHref;
   },100);
  }
 },
 hover:function(){
  app.get('aggregator').trigger('sound','h-h');
 },
 lsTab:function(e=0){
  app.get('aggregator').trigger('sound','h-c');
  this.$el.removeClass(data.view.tabCls+this.tabIndex);
  this.$tabs.eq(this.tabIndex).removeClass(data.view.shownCls);
  this.tabIndex=!e?e:$(e.currentTarget).index();
  this.$tabs.eq(this.tabIndex).addClass(data.view.shownCls);
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
 invalid:function(){
  this.$el.addClass(data.view.errCls);
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