import {MapMarkerModel} from './model.js';
import {utils} from '../../bf/lib/utils.js';
import {app} from '../../bf/base.js';
import {data} from './data.js';

app.configure({scroll:data.scroll});

let events={};
events[`click ${data.events.marker}`]='pop';
events[`click ${data.events.close}`]='unpop';
events[`click ${data.events.react}`]='react';

export let MapView=Backbone.View.extend({
 el:data.view.el,
 events:events,
 template:_.template($(data.view.template).html()),
 popTemplate:_.template($(data.view.popTemplate).html()),
 reactedTemplate:_.template($(data.view.reactedTemplate).html()),
 initialize:function(){
  this.$el.html(this.template({data:data.data}));
  this.$pop=this.$(data.view.$pop);
  this.marks=new (Backbone.Collection.extend({model:MapMarkerModel}));
  this.marks.reset(data.data);
  this.addMarks();
  this.$marks=this.$(data.events.marker);
  this.current=null;
  this.$popContent=null;
  this.$reacted=null;
 },
 addMarks:function(){
  this.marks.each((model,index)=>{
   model.set('index',index);
  });
 },
 show:function(){
  this.$el.addClass(data.view.shownCls);
 },
 hide:function(){
  this.$el.removeClass(data.view.shownCls);
 },
 renderReacted:function(){
  this.$reacted.html(this.reactedTemplate(this.current.toJSON()));
 },
 pop:function(e){
  let index=this.$marks.index(e.currentTarget);

  if(this.$popContent)
   this.$popContent.remove();
  this.current=this.marks.at(index);
  this.$popContent=$(this.popTemplate(_.extend({margin:app.get('scrollDim')},this.current.toJSON({all:true}))));
  this.$pop.append(this.$popContent);
  this.$el.addClass(data.view.popShownCls);
  this.$reacted=this.$(data.view.$reacted);
  this.renderReacted();

  this.popScroll=app.set({
   data:'scroll',
   object:'Bar',
   on:scroll.events,
   add:{options:{helpers:{drag:utils.drag}}},
   set:false
  });
 },
 unpop:function(){
  this.popScroll.destroy();
  this.$el.removeClass(data.view.popShownCls);
 },
 react:function(e){
  let type=$(e.currentTarget).data(data.view.dataClick),
  count=this.current.get(type);

  this.current.save({react:type,[type]:count+1});
  this.$(data.view.$reactContainer).addClass(type+' '+data.view.reactedCls);
  this.renderReacted();
 }
});
//--------
let scroll={
 wrapDim:null,
 blockDim:null,
 events:{
  init:function(){
   let u=this.get('data').extra,
    hide;

   scroll.wrapDim=u.$wrap.height();
   scroll.blockDim=u.$block.height();
   hide=scroll.blockDim<=scroll.wrapDim;

   if(!hide)
    this.get('setBarDim',[scroll.wrapDim/scroll.blockDim*this.get('getData').holderDim]);
   this.get('getData').container[(hide?'add':'remove')+'Class'](u.cls);

   u.$wrap.on('scroll',()=>{
    this.get('setPosition',{
     value:[u.$wrap.scrollTop()*this.get('getData').bounds[1]/(scroll.blockDim-scroll.wrapDim)],
     external:true
    });
   });
  },
  change:function(e,opts){
   let u=this.get('data').extra;

   if(!opts.external)
    u.$wrap.scrollTop(opts.value[0]*(scroll.blockDim-scroll.wrapDim)/opts.bounds[1]);
  }
 }
};