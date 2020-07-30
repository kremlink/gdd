export let BaseBlockView=Backbone.View.extend({
 data:null,
 initialize:function(opts){
  this.data=opts.data;
  if(opts.el)
   this.setElement(opts.el);
 },
 toggle:function(f){
  this.$el.toggleClass(this.data.view.shownCls,f);
 }
});