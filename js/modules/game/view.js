import {data} from './data.js';
import {utils} from '../../bf/lib/utils.js';
import {GameTrashView} from './trash/view.js';
import {GameBinView} from './bin/view.js';
import {GameBinModel} from './bin/model.js';
import {app} from '../../bf/base.js';
import {BaseBlockView} from '../baseBlock/view.js';

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
 ended:false,
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
  this.bins=new (Backbone.Collection.extend({model:GameBinModel}));
  this.listenTo(this.bins,'reset',this.addBins);
  this.listenTo(this.bins,'change:amount',this.trashPut);
  //this.bins.reset(data.data[this.diff].binData);
  this.listenTo(app.get('aggregator'),'game:trash-failed game:trash-caught',this.trashCount);

  this.$failLine=this.$(data.failLine.el);

  this.setDiff();
  this.gameCtrls();
 },
 setDiff:function(){
  let self=this;

  this.$diffCh.on('click',function(){
   let ind=$(this).index();

   if(ind===0&&self.diffIndex>0)
    self.diffIndex--;
   if(ind!==0&&self.diffIndex<self.diffs.length-1)
    self.diffIndex++;
   self.$diff.text(data.data[self.diffs[self.diffIndex]].text);
  });

  this.$diff.text(data.data[this.diffs[this.diffIndex]].text);
 },
 play:function(){
  if(this.ended)
  {
   this.$el.removeClass(data.view.gEnd1Cls+' '+data.view.gEnd2Cls);
   this.ended=false;
  }else
  {
   this.$el.addClass(data.view.gPlayCls);
   this.binViews=[];
   app.get('aggregator').trigger('game:progress',0);
   this.$pDone.css('width',0+'%');
   this.$pRem.text(100);
   _.invoke(this.bins.toArray(),'destroy');
   this.bins.reset(data.data[this.diffs[this.diffIndex]].binData);
   this.generateTrash();
  }
 },
 trashCount:function(){
  this.trashDone++;
  this.$pRem.text(100-Math.round(100*this.trashDone/data.data[this.diffs[this.diffIndex]].trashData.length));
  if(this.trashDone===data.data[this.diffs[this.diffIndex]].trashData.length)
  {
   setTimeout(()=>{
    app.get('aggregator').trigger('game:end');
    this.$el.removeClass(data.view.gPlayCls).addClass(data.view.gEnd1Cls);
    this.trashDone=0;
    this.ended=true;
   },data.waitWin);
  }
 },
 toggle:function(f){
  BaseBlockView.prototype.toggle.apply(this,[f]);
  this.$el.removeClass(data.view.gEnd1Cls+' '+data.view.gEnd2Cls);
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
   this.progress++;
   p=Math.round(100*this.progress/data.data[this.diffs[this.diffIndex]].trashData.length);
   this.$pDone.css('width',p+'%');
   app.get('aggregator').trigger('game:progress',p);//Math.ceil((n+1)/10)*10
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