import {data} from './data.js';

export let View=Backbone.View.extend({
 el:data.view.el,
 initialize:function(){
  this.bins=new Backbone.Collection({model:BinModel});
  this.listenTo(this.bins,'reset',this.addBins);
  this.bins.reset(data.bin.data);
 },
 toggle:function(f){
  this.$el.toggleClass(data.view.shownCls,f);
 },
 addBins:function(){
  this.bins.each(model=>{
   let bin=new BinView({model:model});

   this.$(data.view.bins).append(bin.el);
  });
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