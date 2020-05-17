import {data} from './data.js';

export let View=Backbone.View.extend({
 className:data.view.className,
 template:_.template($(data.view.template).html()),
 initialize:function(){
  this.render();
 },
 render:function(){
  this.$el.html(this.template());

  return this;
 },
 toggle:function(f){
  this.$el.toggleClass(data.view.shownCls,f);
 }
});