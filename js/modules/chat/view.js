import {app} from '../../bf/base.js';
import {data} from './data.js';

app.configure({scroll:data.scroll});

let events={};
events[`click ${data.events.choose}`]='choose';

export let ChatView=Backbone.View.extend({
 el:data.view.el,
 events:events,
 //template:_.template($(data.view.template).html()),
 initialize:function(){
  //this.$el.html(this.template({data:data.data}));
  //this.$pop=this.$(data.view.$pop);
 },
 show:function(){
  this.$el.addClass(data.view.shownCls);
 },
 hide:function(){
  this.$el.removeClass(data.view.shownCls);
 },
 choose:function(e){

 }
});