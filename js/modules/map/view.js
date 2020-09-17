import {MapMarkerModel} from './model.js';
import {utils} from '../../bf/lib/utils.js';
import {app} from '../../bf/base.js';
//import {Scroll} from '../scroll/scroll.js';
//import {data as scrollData} from '../scroll/data.js';
import {data as dat} from './data.js';
import {BaseBlockView} from '../baseBlock/view.js';

//let scroll;
let data=app.configure({map:dat}).map,
 epIndex;

//scroll=Scroll();

let events={};
events[`click ${data.events.marker}`]='pop';
events[`click ${data.events.close}`]='unpop';
events[`click ${data.events.react}`]='react';
events[`click ${data.events.full}`]='full';
events[`click ${data.events.zoomIn}`]='zoomIn';
events[`click ${data.events.zoomOut}`]='zoomOut';
events[`mouseenter ${data.events.zoomIn},${data.events.zoomOut},${data.events.close},${data.events.react}`]='hover';

export let MapView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 marksCount:0,
 currTab:null,
 dragging:false,
 mult:0,
 shift:{x:0,y:0},
 zoomed:false,
 dragBounds:{h:0,v:0},
 reactedTab:{},
 reactedCtr:0,
 current:null,
 marker:null,
 marks:null,
 template:_.template($(data.view.template).html()),
 popTemplate:_.template($(data.view.popTemplate).html()),
 popTextTemplate:_.template($(data.view.popTextTemplate).html()),
 initialize:function(){
  epIndex=app.get('epIndex');

  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$el.prepend(this.template({data:data.data[epIndex]}));
  this.$pop=this.$(data.view.$pop);
  this.$map=this.$(data.view.$map);
  this.$tabs=this.$(data.events.react);
  this.$percents=this.$(data.view.$reactP);
  this.$progress=this.$(data.view.$progress);
  this.marks=new (Backbone.Collection.extend({model:MapMarkerModel,url:data.url}));
  this.marks.reset(data.data[epIndex]);
  this.progress();
  this.$popContent=null;
  this.$drag=this.$(data.view.$drag).css({'--w':data.view.dragW+'em','--p':data.view.dragP});
  this.dragBounds.h=data.view.dragW/4;
  this.dragBounds.v=data.view.dragW*data.view.dragP/4;
  this.mult=parseInt(this.$drag.css('fontSize'));
  this.drag();

  this.marksCount=(()=>{
   let i=0;

   for(let x of Object.values(data.data))
   {
    i+=x.length;
    /*x.forEach(o=>{
     if(o.react)
      this.reactedCtr++;
    });*/
   }

   return i;
  })();
  this.reactedCtr=app.get('ls').get('react');
  app.get('aggregator').trigger('react:progress',{p:this.reactedCtr/this.marksCount*100,ctr:this.reactedCtr});
 },
 hover:function(){
  app.get('aggregator').trigger('sound','h-h');
 },
 progress:function(){
  this.$progress.css('width',Math.floor(this.marks.filter(o=>o.get('react')).length/data.data[epIndex].length*100)+'%');
 },
 zoomIn:function(){
  this.zoomed=true;
  this.$el.addClass(data.view.zoomCls);
  app.get('aggregator').trigger('sound','h-c');
 },
 zoomOut:function(){
  this.$el.removeClass(data.view.zoomCls);
  this.zoomed=false;
  this.setMapPos({ini:true});
  this.shift={x:0,y:0};
  app.get('aggregator').trigger('sound','h-c');
 },
 getPerc:function(i){
  let r=this.current.get('reacts');

  return Math.floor(r[i]*100/r.reduce((a,b)=>a+b));
 },
 renderReacted:function(){
  let id=this.current.get('id'),
   tab=this.$tabs.filter(i=>this.current.get('react')===this.$tabs.eq(i).data(data.view.dataClick));

  if(tab.length)
   this.reactedTab[id]=tab;

  if(this.reactedTab[id])
  {
   this.renderPopText(true);
   this.$pop.addClass(data.view.reactedCls);
   this.reactedTab[id].addClass(data.view.shownCls);
   this.$percents.each(i=>{
    this.$percents.eq(i).text(this.getPerc(i));
   });
  }
 },
 renderPopText:function(reacted=false){
  let index=this.marks.indexOf(this.current);

  this.$(data.view.$popText).html(this.popTextTemplate(reacted?data.data[epIndex][index].reacted:data.data[epIndex][index]));
 },
 pop:function(e){
  this.marker=$(e.currentTarget);
  this.current=this.marks.where({id:this.marker.data(data.view.dataId)})[0];
  this.$popContent=$(this.popTemplate(_.extend({margin:app.get('scrollDim')},this.current.toJSON({all:true}))));
  this.$pop.append(this.$popContent);
  this.renderPopText();
  this.$el.addClass(data.view.poppedCls);
  this.renderReacted();
  app.get('aggregator').trigger('sound','pop');

  /*this.popScroll=app.set({
   object:'Bar',
   on:scroll.events,
   add:$.extend(true,{},scrollData,{
    holder:this.$pop.find(scrollData.holder),
    bar:this.$pop.find(scrollData.bar),
    options:{helpers:{drag:utils.drag}},
    extra:{$wrap:this.$pop.find(scrollData.extra.$wrap),$block:this.$pop.find(scrollData.extra.$block)}
   }),
   set:false
  });*/
 },
 unpop:function(){
  let id=this.current.get('id');

  //this.popScroll.destroy();
  app.get('aggregator').trigger('sound','close');
  this.$popContent.remove();
  this.$pop.removeClass(data.view.reactedCls);
  this.$el.removeClass(data.view.poppedCls);
  if(this.reactedTab[id])
   this.reactedTab[id].removeClass(data.view.shownCls);
 },
 react:function(e){
  let type,
  ind=this.$tabs.index($(e.currentTarget));

  app.get('aggregator').trigger('sound','h-c');

  this.marker.addClass(data.view.shownCls);
  this.currTab=this.$tabs.eq(ind);
  type=this.currTab.data(data.view.dataClick);
  this.reactedTab[this.current.get('id')]=this.currTab;

  this.current.get('reacts')[ind]=this.current.get('reacts')[ind]+1;
  this.current.save({react:type,episode:epIndex});
  this.progress();
  this.renderReacted();
  this.renderPopText(true);
  this.reactedCtr++;
  app.get('aggregator').trigger('react:progress',{p:this.reactedCtr/this.marksCount*100,ctr:this.reactedCtr});
 },
 checkBoundaries:function(delta={},s=false){
  let v={x:this.shift.x+delta.x,y:this.shift.y+delta.y};

  if(v.x>this.dragBounds.h)
   v.x=this.dragBounds.h;
  if(v.x<-this.dragBounds.h)
   v.x=-this.dragBounds.h;
  if(v.y>this.dragBounds.v)
   v.y=this.dragBounds.v;
  if(v.y<-this.dragBounds.v)
   v.y=-this.dragBounds.v;
  if(s)
  {
   this.shift.x=v.x;
   this.shift.y=v.y;
  }

  return {x:v.x+'em',y:v.y+'em'};
 },
 setMapPos:function({delta,end=false,ini=false}){
  let pos=this.checkBoundaries(delta,end);

  this.$drag.css('transform',`translate(${ini?'0em,0em':pos.x+','+pos.y})`);
 },
 drag:function(){
  let start={x:0,y:0},
   delta,
   nope=false;

  new utils.drag({
   both:true,
   mouse:true,
   container:this.$map,
   threshold:0,
   downCallback:(opts)=>{
    if(!this.zoomed||$(opts.e[0].target).closest(data.events.marker).length)
     nope=true;
    if(!nope)
    {
     start.x=opts.e[0].pageX;
     start.y=opts.e[0].pageY;
     this.dragging=true;
     delta={x:0,y:0};
    }
   },
   dragCallback:(opts)=>{
    if(!nope)
    {
     delta.x=(opts.e[0].pageX-start.x)/this.mult;
     delta.y=(opts.e[0].pageY-start.y)/this.mult;
     this.setMapPos({delta:delta});
    }
   }
  });
  $(document).on('mouseup touchend',()=>{// touchend
   nope=false;
   if(this.dragging)
   {
    this.dragging=false;
    this.setMapPos({delta:delta,end:true});
   }
  });
 }
});