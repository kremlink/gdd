import {data} from './data.js';
import {utils} from '../../bf/lib/utils.js';
import {GameTrashView} from './trash/view.js';
import {GameBinView} from './bin/view.js';
import {GameBinModel} from './bin/model.js';
import {app} from '../../bf/base.js';

export let GameView=Backbone.View.extend({
 el:data.view.el,
 initialize:function(){
  //this.binViews=[];
  this.bins=new (Backbone.Collection.extend({model:GameBinModel}));
  this.listenTo(this.bins,'reset',this.addBins);
  this.listenTo(this.bins,'change:amount',this.trashPut);
  //this.bins.reset(data.data[this.diff].binData);
  this.trash=[];
  this.coords={x:0,y:0};
  this.dragging=false;
  this.draggingTrash=null;
  this.trashDone=0;
  this.listenTo(app.get('aggregator'),'game:trash-failed game:trash-caught',this.trashCount);
  this.progress=0;

  this.diff='';
  this.$diffChoose=$('.tmp-choose div');
  this.$diffChoose.each(i=>{
   this.$diffChoose.eq(i).on('click',()=>{
    switch (i)
    {
     case 0:this.diff='easy';
     break;
     case 1:this.diff='normal';
      break;
     case 2:this.diff='hard';
    }
    this.binViews=[];
    app.get('aggregator').trigger('game:progress',0);
    _.invoke(this.bins.toArray(),'destroy');
    this.$diffChoose.removeClass('active').eq(i).addClass('active');
    this.bins.reset(data.data[this.diff].binData);
    this.generateTrash();
   });
  });
 },
 trashCount:function(){
  this.trashDone++;
  if(this.trashDone===data.data[this.diff].trashData.length)
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
     //TODO: test if drops in bounds of some bins
    }
   }
  });
 },
 play:function(){
  this.$el.addClass(data.view.shownCls);
  this.ctrls();
  //this.generateTrash();
 },
 hide:function(){
  this.$el.removeClass(data.view.shownCls);
 },
 trashPut:function(m,v){
  if(v>m.previousAttributes().amount)
  {
   this.progress++;
   app.get('aggregator').trigger('game:progress',Math.round(100*this.progress/data.data[this.diff].trashData.length));//Math.ceil((n+1)/10)*10
  }
 },
 addBins:function(){
  this.bins.each(model=>{
   let bin=new GameBinView({model:model});

   this.$(data.view.bins).append(bin.el);
   this.binViews.push(bin);
  });
 },
 generateTrash:function(){//TODO: re-generation logic is to be removed
  if(!this.trash.length)
  {
   data.data[this.diff].trashData.forEach(t=>{
    let trash=new GameTrashView(t);

    this.$el.append(trash.el);
    this.trash.push(trash);
   });
  }else
  {
   _.invoke(this.trash,'remove');
   this.trash=[];
   this.progress=0;
   this.generateTrash();
  }
 }
});