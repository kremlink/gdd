import {app} from '../../bf/base.js';
import {data} from './data.js';
import {utils} from '../../bf/lib/utils.js';
import {BaseBlockView} from '../baseBlock/view.js';

export let FlowView=BaseBlockView.extend({
 el:data.view.el,
 template:_.template($(data.view.template).html()),
 shift:0,
 maxShift:0,
 initialize:function(){
  let active=~location.href.indexOf('index.html')?(+utils.getParam({what:'?',name:data.gParam})||1):location.href.match(/(\d)\.html/)[1],
      fz;

  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$episodes=this.$(data.view.$episodes).html(this.template($.extend({},data.epis,{active:active})));
  this.$drag=this.$(data.view.$drag);
  fz=parseInt(this.$drag.css('fontSize'));
  //fz=1;
  this.maxShift=((data.epis.amount-4)*11.025+0.5)*fz;
  this.shift=-(active>2?(active>data.epis.amount-2?(data.epis.amount-4)*11.025-0.5:(active-2)*11.025-11.025/2-0.5/2):0)*fz;
  this.$drag.css('left',this.shift+'px');
  this.drag();
 },
 checkBoundaries:function(delta,s=false){
  let v=this.shift+delta;

  if(v>0)
   v=0;
  if(v<-this.maxShift)
   v=-this.maxShift;

  if(s)
   this.shift=v;

  return v;
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
     delta=opts.e[0].pageX-start;
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