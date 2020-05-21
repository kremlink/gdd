import {data} from './data.js';
import {utils} from '../../bf/lib/utils.js';
import {app} from '../../bf/base.js';

export let View=Backbone.View.extend({
 el:data.view.el,
 initialize:function(){
  this.binViews=[];
  this.bins=new (Backbone.Collection.extend({model:BinModel}));
  this.listenTo(this.bins,'reset',this.addBins);
  this.bins.reset(data.bin.data);
  this.trash=[];
  this.coords={x:0,y:0};
  this.dragging=false;
  this.draggingTrash=null;
 },
 ctrls:function(){
  new utils.drag({
   both:true,
   mouse:true,
   container:this.$el,
   threshold:0,
   downCallback:(opts)=>{
    this.coords.x=opts.e[0].pageX;
    this.coords.y=opts.e[0].pageY;
    this.$el.addClass(data.view.dragCls);
    this.dragging=true;
    this.draggingTrash=_.filter(this.trash,t=>{return $(opts.e[0].target).closest(t.$el).length;})[0];
    this.draggingTrash.drag({start:true});
   },
   dragCallback:(opts)=>{
    let delta={dx:0,dy:0};

    delta.dx=opts.e[0].pageX-this.coords.x;
    delta.dy=opts.e[0].pageY-this.coords.y;
    this.draggingTrash.drag({drag:delta});
   }
  });
  $(document).on('mouseup',()=>{// touchend
   if(this.dragging)
   {
    let dOffs=this.draggingTrash.$drop.offset(),
     dW=this.draggingTrash.$drop.width(),
     dH=this.draggingTrash.$drop.height(),
     bin=_.filter(this.binViews,t=>{
      let offs=t.$drop.offset(),
       w=t.$drop.width(),
       h=t.$drop.height();

      return offs.left<dOffs.left&&offs.left+w>dOffs.left+dW&&offs.top<dOffs.top&&offs.top+h>dOffs.top+dH;
     });

    this.draggingTrash.drag({up:true});
    this.$el.removeClass(data.view.dragCls);
    this.dragging=false;
    if(bin.length)
    {
     this.bins.where({type:this.draggingTrash.data.type})[0].addTrash();
     this.draggingTrash.caught();
    }else
    {
     this.draggingTrash.failed();
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
   this.binViews.push(bin);
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
  this.$drop=this.$(data.bin.view.drop);
 }
});

let BinModel=Backbone.Model.extend({
 defaults:{
  amount:0
 },
 addTrash:function(){
  this.set('amount',this.get('amount')+1);
 }
});

let TrashView=Backbone.View.extend({
 className:data.trash.view.className,
 template:_.template($(data.trash.view.template).html()),
 initialize:function(opts){
  this.data=opts;
  $(data.trash.view.fail.el).css('bottom',data.trash.view.fail.bottom);
  this.$el.html(this.template(opts))
   .css({left:opts.left,transition:`bottom ${opts.trs}`})
   .on('transitionend',()=>{
    this.$el.off('transitionend');
    this.failed();
   });
  _.debounce(()=>{
   this.$el.css('bottom',data.trash.view.fail.bottom);
  },0)();

  this.dragging=false;
  this.coords={x:0,y:0};
  this.$drop=this.$(data.trash.view.drop);
  this.listenTo(app.get('aggregator'),'game:drag',this.drag);
 },
 failed:function(){
  console.log('failed');
  this.$el.css('transition','').addClass(data.trash.view.failCls);
  setTimeout(()=>{this.remove()},2000);
 },
 caught:function(){
  this.$el.addClass(data.trash.view.caughtCls);
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