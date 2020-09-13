import {utils} from '../../bf/lib/utils.js';
import {BaseBlockView} from '../baseBlock/view.js';
import {app} from '../../bf/base.js';
import {data as dat} from './data.js';

let data=app.configure({flow:dat}).flow;

let events={},
 epIndex;

events[`mouseenter ${data.view.ignor}`]='hover';

export let FlowView=BaseBlockView.extend({
 events:events,
 el:data.view.el,
 template:_.template($(data.view.template).html()),
 shift:0,
 maxShift:0,
 mult:0,
 dragging:false,
 initialize:function(){
  let ep=app.get('ls').get('ep');

  epIndex=app.get('epIndex');

  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.listenTo(app.get('aggregator'),'flow:inc',this.inc);
  
  this.$episodes=this.$(data.view.$episodes).html(this.template($.extend({},{amount:data.episAmt,avail:ep,active:epIndex})));
  this.$epItems=this.$(data.view.ignore);
  this.inc(ep);
  this.$drag=this.$(data.view.$drag);
  this.mult=parseInt(this.$drag.css('fontSize'));
  this.maxShift=(data.episAmt-4)*11.025-0.5;
  this.shift=-(epIndex>2?(epIndex>data.episAmt-2?this.maxShift:(epIndex-2)*11.025-11.025/2-0.5/2):0);
  this.$drag.css('left',this.shift+'em');
  this.drag();
 },
 inc:function(ep){
  app.get('aggregator').trigger('episodes:progress',{p:ep/data.episAmt*100});
  for(let i=0;i<ep;i++)
   this.$epItems.eq(i).removeClass(data.view.inavCls);
 },
 hover:function(){
  app.get('aggregator').trigger('sound','h-h');
 },
 checkBoundaries:function(delta,s=false){
  let v=this.shift+delta;

  if(v>0)
   v=0;
  if(v<-this.maxShift)
   v=-this.maxShift;

  if(s)
   this.shift=v;

  return v+'em';
 },
 drag:function(){
  let start,
      delta,
      nope=false;

  new utils.drag({
   both:true,
   mouse:true,
   container:this.$episodes,
   threshold:0,
   downCallback:(opts)=>{
    if($(opts.e[0].target).closest(data.view.ignore).length)
     nope=true;
    if(!nope)
    {
     start=opts.e[0].pageX;
     this.dragging=true;
     delta=0;
    }
   },
   dragCallback:(opts)=>{
    if(!nope)
    {
     delta=(opts.e[0].pageX-start)/this.mult;
     this.$drag.css('left',this.checkBoundaries(delta));
    }
   }
  });
  $(document).on('mouseup touchend',()=>{// touchend
   nope=false;
   if(this.dragging)
   {
    this.dragging=false;
    this.$drag.css('left',this.checkBoundaries(delta,true));
   }
  });
 }
});