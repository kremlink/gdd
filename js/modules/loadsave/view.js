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
events[`click ${data.events.clr}`]='clr';
events[`focus ${data.events.focus}`]='focus';
events[`mouseenter .${data.view.tabCls},${data.events.copy},${data.events.load},${data.events.clr}`]='hover';

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

  //this.listenTo(app.get('aggregator'),'episodes:progress',({p})=>this.setVal('ep',p/10));
  //this.listenTo(app.get('aggregator'),'game:progress',({p})=>this.setVal('game',p));
  //this.listenTo(app.get('aggregator'),'react:progress',({ctr})=>this.setVal('react',ctr));

  this.lsTab();

  this.model.fetch({
   success:()=>{
    app.get('aggregator').trigger('data:ready',this.model);
    this.$copyFrom.val(this.datTmpl(this.model.toJSON()));
   },
   error:()=>{//is empty
    this.model.save({epis:[0,0],sum:0},{//create localstorage record
     success:()=>{
      app.get('aggregator').trigger('data:ready',this.model);
      this.$copyFrom.val(this.datTmpl(this.model.toJSON()));
     }
    });
   }
  });
 },
 /*setVal:function(t,v){
  this.model.save({[t]:v});
  this.$copyFrom.val(this.datTmpl(this.model.toJSON()));
 },*/
 setData:function(d){
  let ep,
   maxEp;

  if(d.ep)//triggered from video "end" event
  {
   ep=+this.model.get('ep');
   if(ep===epIndex)
   {
    this.model.save({ep:epIndex+1},{
     success:()=>{
      this.$copyFrom.val(this.datTmpl(this.model.toJSON()));
     }
    });
    app.get('aggregator').trigger('flow:inc',{ep:epIndex,end:true});
   }
  }else
  {
   if(d.game)
   {
    d.epis=this.model.get('epis');
    maxEp=this.model.get('maxEp');

    d.epis[epIndex]=epIndex===0?0:Math.floor(d.game/=maxEp);
    delete d.game;
   }

   this.model.save(d,{
    success:()=>{
     let s=this.model.sum();

     this.$copyFrom.val(this.datTmpl(this.model.toJSON()));
     app.get('aggregator').trigger('game:progress',{p:s,end:true});//Math.ceil((n+1)/10)*10
    }
   });
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
  app.get('aggregator').trigger('sound','h-c');
 },
 invalid:function(){
  this.$el.addClass(data.view.errCls);
 },
 load:function(){
  this.model.save({type:'load',value:this.$loadFrom.val()});
  app.get('aggregator').trigger('sound','h-c');
 },
 focus:function(){
  this.$el.removeClass(data.view.errCls);
 },
 clr:function(){
  this.model.save({type:'clr'});
  app.get('aggregator').trigger('sound','h-c');
 }
});