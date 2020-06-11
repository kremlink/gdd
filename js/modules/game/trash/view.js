import {data} from './data.js';
import {app} from '../../../bf/base.js';

export let GameTrashView=Backbone.View.extend({
 className:data.view.className,
 template:_.template($(data.view.template).html()),
 initialize:function(opts){
  this.data=opts;
  this.data.failLine.$el.css('bottom',this.data.failLine.bottom);
  this.$el.html(this.template(opts))
   .css({left:opts.left,transition:`bottom ${opts.trs}`})
   .on('transitionend',()=>{
    this.$el.off('transitionend');
    this.dropped({untouched:true});
   });
  _.debounce(()=>{
   this.$el.css('bottom',opts.failLine.bottom);
  },100)();

  this.dragging=false;
  this.coords={x:0,y:0};
  this.$drop=this.$(data.view.drop);
  this.listenTo(app.get('aggregator'),'game:drag',this.drag);
 },
 get:function(v){
  return this[v];
 },
 dropped:function({untouched=false,put=false}={}){
  if(untouched)
  {
   this.$el.css('transition','').on('transitionend',()=>{
    this.remove();
   }).addClass(data.view.failCls);
   app.get('aggregator').trigger('game:trash-failed');
  }else
  {
   this.$el.on('transitionend',()=>{
    this.$el.off('transitionend');
    if(put)
     this.put({drop:true});else
     app.get('aggregator').trigger('game:trash-failed');
   }).css({transition:`top ${data.view.fall}`,top:put?`calc(${100-parseInt(this.data.failLine.bottom)}% - ${this.$el.height()}px`:'100%'});
  }
 },
 put:function({drop=false}={}){
  if(drop)
   this.$el.css('transition','');
  this.$el.on('transitionend',()=>{
   this.remove();
  }).addClass(data.view.putCls);
  app.get('aggregator').trigger('game:trash-caught');
 },
 drag:function({start=false,up=false,drag=false}){
  if(start||this.dragging)
  {
   if(start)
   {
    this.dragging=true;
    this.coords={x:parseInt(this.$el.css('left')),y:parseInt(this.$el.css('top'))};
    this.$el.css({transition:'',bottom:'auto',left:this.coords.x,top:this.coords.y,zIndex:1});
    this.$el.off('transitionend');
   }
   if(up)
   {
    this.dragging=false;
    this.$el.css({zIndex:'auto'}).addClass(data.view.upCls);
   }
   if(drag&&this.dragging)
   {
    this.$el.css({left:this.coords.x+drag.dx,top:this.coords.y+drag.dy});
   }
  }
 }
});