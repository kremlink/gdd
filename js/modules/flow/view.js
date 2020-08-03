import {data} from './data.js';
import {BaseBlockView} from '../baseBlock/view.js';

export let FlowView=BaseBlockView.extend({
 el:data.view.el,
 template:_.template($(data.view.template).html()),
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$episodes=this.$(data.view.$episodes).html(this.template(data.epis));
  this.$vName=this.$(data.view.$vName);
  if(data.fromEpisode)
   this.$el.addClass(data.view.fromEpCls);
  this.$vName.text('Test');
 }
});