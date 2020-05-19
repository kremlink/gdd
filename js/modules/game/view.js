import {data} from './data.js';

export let View=Backbone.View.extend({
 el:data.view.el,
 initialize:function(){
  this.bins=new Backbone.Collection({model:BinModel});
  this.listenTo(this.bins,'reset',this.addBins);
  this.bins.reset(data.bin.data);
  this.generateTrash();
 },
 toggle:function(f){
  this.$el.toggleClass(data.view.shownCls,f);
 },
 addBins:function(){
  this.bins.each(model=>{
   let bin=new BinView({model:model});

   this.$(data.view.bins).append(bin.el);
  });
 },
 generateTrash:function(){
  let trash=new TrashView(data.trash.data[1]);

  this.$el.append(trash.el);
 }
});

let BinView=Backbone.View.extend({
 className:data.bin.view.className,
 template:_.template($(data.bin.view.template).html()),
 initialize:function(){
  this.$el.html(this.template(this.model.toJSON()));
 }
});//for(let [x,y] of Object.entries(data))

let BinModel=Backbone.Model.extend({
 defaults:{
  amount:0
 }
});

let TrashView=Backbone.View.extend({
 className:data.trash.view.className,
 template:_.template($(data.trash.view.template).html()),
 initialize:function(opts){
  this.$el.html(this.template(opts)).css('left','10%');
 }
});