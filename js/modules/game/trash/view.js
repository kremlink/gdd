import {data} from './data.js';
import {app} from '../../../bf/base.js';

export let GameTrashView=Backbone.View.extend({
 className:data.view.className,
 template:_.template($(data.view.template).html()),
 initialize:function(opts){
  this.data=opts;
  $(data.view.failLine.el).css('bottom',data.view.failLine.bottom);
  this.$el.html(this.template(opts))
   .css({left:opts.left,transition:`bottom ${opts.trs}`})
   .on('transitionend',()=>{
    this.$el.off('transitionend');
    this.failed({untouched:true});
   });
  _.debounce(()=>{
   this.$el.css('bottom',data.view.failLine.bottom);
  },100)();

  this.dragging=false;
  this.coords={x:0,y:0};
  this.$drop=this.$(data.view.drop);
  this.listenTo(app.get('aggregator'),'game:drag',this.drag);
 },
 get:function(v){
  return this[v];
 },
 failed:function({untouched=false}={}){
  if(untouched)
   this.$el.css('transition','').addClass(data.view.failCls);else
   this.$el.css({transition:`top ${data.view.fall}`,top:'100%'});

  setTimeout(()=>{this.remove()},4000);
  app.get('aggregator').trigger('game:trash-failed');
 },
 caught:function(){
  this.$el.addClass(data.view.caughtCls);
  setTimeout(()=>{this.remove()},1000);
  app.get('aggregator').trigger('game:trash-caught');
 },
 drag:function(opts){
  if(opts.start||this.dragging)
  {
   if(opts.start)
   {
    this.dragging=true;
    this.coords={x:parseInt(this.$el.css('left')),y:parseInt(this.$el.css('top'))};
    this.$el.css({transition:'',bottom:'auto',left:this.coords.x,top:this.coords.y,zIndex:1});
    this.$el.off('transitionend');
   }
   if(opts.up)
   {
    this.dragging=false;
    this.$el.css({zIndex:'auto'});
   }
   if(opts.drag&&this.dragging)
   {
    this.$el.css({left:this.coords.x+opts.drag.dx,top:this.coords.y+opts.drag.dy});
   }
  }
 }
});