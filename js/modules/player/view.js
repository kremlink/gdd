import {data} from './data.js';
export {data} from './data.js';

export let view=Backbone.View.extend({
 initialize:function(){
  this.player=videojs($(data.view.el)[0],{},()=>{
   this.prepare();
   //this.$el.append('<div class="test" style="width:100px;height:100px;position: absolute;left: 0;top: 0;background: #f00;" />');
  });
  //this.listenTo(this.model,'change',this.render);
 },
 prepare:function(){
  this.setElement(data.view.el);
  this.player.on('pause',function(){
   console.log('show overlay');
  });
  this.player.on('play',function(){
   console.log('hide overlay');
  });
 }
});