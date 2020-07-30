import {data} from './data.js';
import {BaseBlockView} from '../baseBlock/view.js';

export let FlowView=BaseBlockView.extend({
 el:data.view.el,
 template:_.template($(data.view.template).html()),
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$el.html(this.template({episodes:data.amount}));
  this.$('.f-vid').on('click',(e)=>{location.reload();e.preventDefault();});//TODO: remove after
 }
});