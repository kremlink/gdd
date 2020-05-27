import {data} from './data.js';

export let FlowView=Backbone.View.extend({
 el:data.view.el,
 template:_.template($(data.view.template).html()),
 initialize:function(){
  this.$el.html(this.template({episodes:data.amount}));
  console.log(data);
 },
 show:function(){
  this.$el.addClass(data.view.shownCls);
 },
 hide:function(){
  this.$el.removeClass(data.view.shownCls);
 }
});