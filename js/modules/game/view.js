import {data} from './data.js';

export let View=Backbone.View.extend({
 el:data.view.el,
 initialize:function(){
  this.bins=new Backbone.Collection({model:BinModel});
  this.listenTo(this.bins,'reset',this.addBins);
  this.bins.reset(data.bin.data);
  this.trash=[];
 },
 play:function(){
  this.$el.addClass(data.view.shownCls);
  this.generateTrash();
 },
 addBins:function(){
  this.bins.each(model=>{
   let bin=new BinView({model:model});

   this.$(data.view.bins).append(bin.el);
  });
 },
 generateTrash:function(){
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
   .on('transitionend',()=>{
    this.failed();
   });
  _.debounce(()=>{
   this.$el.css('bottom',data.trash.view.fail.bottom);
  },0)();
 },
 failed:function(){
  console.log('failed');
  this.$el.css('transition','').addClass(data.trash.view.failCls);
 },
 caught:function(){

 }
});