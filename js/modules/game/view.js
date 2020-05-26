import {data} from './data.js';
import {utils} from '../../bf/lib/utils.js';
import {GameTrashView} from './trash/view.js';
import {app} from '../../bf/base.js';

export let GameView=Backbone.View.extend({
 el:data.view.el,
 initialize:function(){
  this.binViews=[];
  this.bins=new (Backbone.Collection.extend({model:BinModel}));
  this.listenTo(this.bins,'reset',this.addBins);
  this.listenTo(this.bins,'change:amount',this.trashPut);
  this.bins.reset(data.bin.data);
  this.trash=[];
  this.coords={x:0,y:0};
  this.dragging=false;
  this.draggingTrash=null;
  this.trashDone=0;
  this.listenTo(app.get('aggregator'),'game:trash-failed game:trash-caught',this.trashCount);
  this.progress=0;
 },
 trashCount:function(){
  this.trashDone++;
  if(this.trashDone===data.trashData.length)
  {
   app.get('aggregator').trigger('game:end');
   this.trashDone=0;
  }
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
    this.dragging=true;
    this.draggingTrash=_.filter(this.trash,t=>{return $(opts.e[0].target).closest(t.$el).length;})[0];
    if(this.draggingTrash)
     this.draggingTrash.drag({start:true});
   },
   dragCallback:(opts)=>{
    let delta={dx:0,dy:0};

    delta.dx=opts.e[0].pageX-this.coords.x;
    delta.dy=opts.e[0].pageY-this.coords.y;
    if(this.draggingTrash)
    this.draggingTrash.drag({drag:delta});
   }
  });
  $(document).on('mouseup touchend',()=>{// touchend
   if(this.dragging&&this.draggingTrash)
   {
    let $drop=this.draggingTrash.get('$drop'),
     dOffs=$drop.offset(),
     dW=$drop.width(),
     dH=$drop.height(),
     bin=_.filter(this.binViews,t=>{
      let offs=t.$drop.offset(),
       w=t.$drop.width(),
       h=t.$drop.height();

      return offs.left<dOffs.left&&offs.left+w>dOffs.left+dW&&offs.top<dOffs.top&&offs.top+h>dOffs.top+dH;
     });

    this.draggingTrash.drag({up:true});
    this.dragging=false;
    if(bin.length)
    {
     bin[0].model.addTrash(this.draggingTrash.get('data').type);
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
 trashPut:function(m,v){
  if(v>m.previousAttributes().amount)
  {
   this.progress++;
   app.get('aggregator').trigger('game:progress',Math.round(100*this.progress/data.trashData.length));
  }
  //console.log(++this.progress);
 },
 addBins:function(){
  this.bins.each(model=>{
   let bin=new BinView({model:model});

   this.$(data.view.bins).append(bin.el);
   this.binViews.push(bin);
  });
 },
 generateTrash:function(){//TODO: re-generation logic is to be removed
  if(!this.trash.length)
  {
   data.trashData.forEach(t=>{
    let trash=new GameTrashView(t);

    this.$el.append(trash.el);
    this.trash.push(trash);
   });
  }else
  {
   this.trash.forEach(t=>{t.remove();});
   this.trash=[];
   this.progress=0;
   this.generateTrash();
  }
 }
});
//--------------------
//--------------------
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
 addTrash:function(type){
  this.set({amount:this.get('amount')+(this.get('type')===type?1:-1)});
 }
});