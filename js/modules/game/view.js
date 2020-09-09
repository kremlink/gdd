import {data} from './data.js';
import {utils} from '../../bf/lib/utils.js';
import {GameTrashView} from './trash/view.js';
import {GameBinView} from './bin/view.js';
import {GameBinModel} from './bin/model.js';
import {app} from '../../bf/base.js';
import {BaseBlockView} from '../baseBlock/view.js';

let events={};
events[`click ${data.events.winTab}`]='winTab';
events[`mouseenter ${data.events.winTab}`]='hover';

export let GameView=BaseBlockView.extend({
 el:data.view.el,
 activeDiff:-1,
 diffs:(()=>Object.keys(data.data))(),
 diffIndex:0,
 progress:0,
 trash:[],
 coords:{x:0,y:0},
 dragging:false,
 draggingTrash:null,
 trashDone:0,
 trashToBin:0,
 ended:false,
 events:events,
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);
  //this.binViews=[];
  this.$bins=this.$(data.view.bins);
  this.$game=this.$(data.view.game);
  this.$diff=this.$(data.view.diff);
  this.$diffCh=this.$(data.view.diffCh);
  this.$pDone=this.$(data.view.pDone);
  this.$pRem=this.$(data.view.pRem);
  this.$pQual=this.$(data.view.pQual);
  this.bins=new (Backbone.Collection.extend({model:GameBinModel}));
  this.listenTo(this.bins,'reset',this.addBins);
  this.listenTo(this.bins,'change:amount',this.trashPut);
  //this.bins.reset(data.data[this.diff].binData);
  this.listenTo(app.get('aggregator'),'game:trash-failed',()=>this.trashCount(true));
  this.listenTo(app.get('aggregator'),'game:trash-caught',this.trashCought);

  this.$failLine=this.$(data.failLine.el);

  this.setDiff();
  this.gameCtrls();
 },
 hover:function(){
  app.get('aggregator').trigger('sound','h-h');
 },
 setDiff:function(){
  let self=this;

  this.$diffCh.on('click',function(){
   let ind=$(this).index();

   app.get('aggregator').trigger('sound','g-diff');
   self.$el.removeClass(data.view.diffCls[self.diffs[self.diffIndex]]);
   if(ind===0&&self.diffIndex>0)
    self.diffIndex--;
   if(ind!==0&&self.diffIndex<self.diffs.length-1)
    self.diffIndex++;
   self.$diff.text(data.data[self.diffs[self.diffIndex]].text);
   self.$el.addClass(data.view.diffCls[self.diffs[self.diffIndex]]);
  });

  this.$diff.text(data.data[this.diffs[this.diffIndex]].text);
  this.$el.addClass(data.view.diffCls[this.diffs[this.diffIndex]]);
 },
 play:function(){
  if(this.ended)
  {
   this.$el.removeClass(data.view.endCls[0]+' '+data.view.endCls[1]);
   this.ended=false;
  }else
  {
   this.$el.addClass(data.view.playCls);
   this.binViews=[];
   app.get('aggregator').trigger('game:progress',0);
   this.$pDone.css('width',0+'%');
   this.$pRem.text(100);
   _.invoke(this.bins.toArray(),'destroy');
   this.bins.reset(data.data[this.diffs[this.diffIndex]].binData);
   this.generateTrash();
  }
 },
 trashCount:function(failed){
  this.trashDone++;
  this.$pRem.text(100-Math.round(100*this.trashDone/data.data[this.diffs[this.diffIndex]].trashData.length));
  if(this.trashDone===data.data[this.diffs[this.diffIndex]].trashData.length-data.last)
   app.get('aggregator').trigger('sound','g-rem-l');
  if(failed)
   app.get('aggregator').trigger('sound','g-fail');
  if(this.trashDone===data.data[this.diffs[this.diffIndex]].trashData.length)
  {
   app.get('aggregator').trigger('sound','g-end');
   setTimeout(()=>{
    app.get('aggregator').trigger('game:end');
    this.$el.removeClass(data.view.playCls).addClass(data.view.endCls[0]);
    this.trashDone=0;
    this.ended=true;
   },data.waitWin);
  }
 },
 trashCought:function(){//TODO: make this correct
  this.trashToBin++;
  this.$pQual.css('width',20+'%');
  this.trashCount(false);
 },
 winTab:function(e){
  app.get('aggregator').trigger('sound','h-c');
  this.$el.removeClass(data.view.endCls[0]+' '+data.view.endCls[1]).addClass(data.view.endCls[$(e.currentTarget).index()]);
 },
 toggle:function(f){
  BaseBlockView.prototype.toggle.apply(this,[f]);
  this.$el.removeClass(data.view.endCls[0]+' '+data.view.endCls[1]);
  this.ended=false;
 },
 gameCtrls:function(){
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
     this.draggingTrash.put();
    }else
    {
     bin=_.filter(this.binViews,t=>{
      let offs=t.$drop.offset(),
       w=t.$drop.width();

      return offs.left<dOffs.left&&offs.left+w>dOffs.left+dW;
     });
     this.draggingTrash.dropped({put:bin.length});
     if(bin.length)
      bin[0].model.addTrash(this.draggingTrash.get('data').type);
    }
   }
  });
 },
 trashPut:function(m,v){
  let p;

  if(v>m.previousAttributes().amount)
  {
   app.get('aggregator').trigger('sound','g-put');
   app.get('aggregator').trigger('sound','g-put-p');
   this.progress++;
   p=Math.round(100*this.progress/data.data[this.diffs[this.diffIndex]].trashData.length);
   this.$pDone.css('width',p+'%');
   app.get('aggregator').trigger('game:progress',p);//Math.ceil((n+1)/10)*10
  }else
  {
   app.get('aggregator').trigger('sound','g-fail');
  }
 },
 addBins:function(){
  this.bins.each(model=>{
   let bin=new GameBinView({model:model});

   this.$bins.append(bin.el);
   this.binViews.push(bin);
  });
 },
 generateTrash:function(){//TODO: re-generation logic is to be removed
  if(!this.trash.length)
  {
   data.data[this.diffs[this.diffIndex]].trashData.forEach(t=>{
    let trash=new GameTrashView(_.extend(t,{failLine:{$el:this.$failLine,bottom:data.failLine.bottom}}));

    this.$game.append(trash.el);
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