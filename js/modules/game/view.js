import {data} from './data.js';
import {utils} from '../../bf/lib/utils.js';
import {app} from '../../bf/base.js';

export let View=Backbone.View.extend({
 el:data.view.el,
 initialize:function(){
  this.bins=new Backbone.Collection({model:BinModel});
  this.listenTo(this.bins,'reset',this.addBins);
  this.bins.reset(data.bin.data);
  this.trash=[];
  this.coords={x:0,y:0};
  this.dragging=false;
 },
 ctrls:function(){
  new utils.drag({
   both:true,
   mouse:true,
   container:this.$el,
   downCallback:(opts)=>{
    this.coords.x=opts.e[0].pageX;
    this.coords.y=opts.e[0].pageY;
    this.$el.addClass(data.view.dragCls);
    this.dragging=true;
    app.get('aggregator').trigger('game:drag',{start:true,target:opts.e[0].target});
   },
   dragCallback:(opts)=>{
    let delta={dx:0,dy:0};

    delta.dx=opts.e[0].pageX-this.coords.x;
    delta.dy=opts.e[0].pageY-this.coords.y;
    app.get('aggregator').trigger('game:drag',{drag:delta,target:opts.e[0].target});
   },
   upCallback:()=>{//test drop zone here
    if(this.dragging)
    {
     app.get('aggregator').trigger('game:drag',{up:true});
     this.$el.removeClass(data.view.dragCls);
     this.dragging=false;

    }
   }
  });
 },
 play:function(){
  this.$el.addClass(data.view.shownCls);
  this.ctrls();
  this.generateTrash();
 },
 addBins:function(){
  this.bins.each(model=>{
   let bin=new BinView({model:model});

   this.$(data.view.bins).append(bin.el);
  });
 },
 generateTrash:function(){//with re-generation logic that is to be removed
  if(!this.trash.length)
  {
   data.trash.data.forEach(t=>{
    let trash=new TrashView(t);

    this.$el.append(trash.el);
    this.trash.push(trash);
   });
  }else
  {
   this.trash.forEach(t=>{t.remove();});
   this.trash=[];
   this.generateTrash();
  }
 }
});

let BinView=Backbone.View.extend({
 className:data.bin.view.className,
 template:_.template($(data.bin.view.template).html()),
 initialize:function(){
  this.$el.html(this.template(this.model.toJSON()));
 }
});

let BinModel=Backbone.Model.extend({
 defaults:{
  amount:0
 }
});

let TrashView=Backbone.View.extend({
 className:data.trash.view.className,
 template:_.template($(data.trash.view.template).html()),
 initialize:function(opts){
  $(data.trash.view.fail.el).css('bottom',data.trash.view.fail.bottom);
  this.$el.html(this.template(opts))
   .css({left:opts.left,transition:`bottom ${opts.trs}`})
   .on('transitionend',(e)=>{
    this.$el.off('transitionend');
    this.failed();
   });
  _.debounce(()=>{
   this.$el.css('bottom',data.trash.view.fail.bottom);
  },0)();

  this.dragging=false;
  this.coords={x:0,y:0};
  this.listenTo(app.get('aggregator'),'game:drag',this.drag);
 },
 failed:function(){
  console.log('failed');
  this.$el.css('transition','').addClass(data.trash.view.failCls);
 },
 caught:function(){

 },
 drag:function(opts){
  if($(opts.target).closest(this.$el).length||this.dragging)
  {
   if(opts.start)
   {
    this.dragging=true;
    this.coords={x:parseInt(this.$el.css('left')),y:parseInt(this.$el.css('top'))};
    this.$el.css({transition:'',bottom:'auto',left:this.coords.x,top:this.coords.y});
    this.$el.off('transitionend');
   }
   if(opts.up)
    this.dragging=false;
   if(opts.drag&&this.dragging)
   {
    this.$el.css({left:this.coords.x+opts.drag.dx,top:this.coords.y+opts.drag.dy});
   }
  }
 }
});