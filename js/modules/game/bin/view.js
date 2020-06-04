import {data} from './data.js';

export let GameBinView=Backbone.View.extend({
 className:data.view.className,
 template:_.template($(data.view.template).html()),
 initialize:function(){
  this.$el.html(this.template(this.model.toJSON()));
  this.$drop=this.$(data.view.drop);
  this.listenTo(this.model,'destroy',this.remove);
 }
});