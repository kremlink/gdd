import {app} from '../../bf/base.js';
//import {data} from './data.js';
import {BaseBlockView} from '../baseBlock/view.js';

import {data as dat} from './data.js';
let data=app.configure({obnul:dat}).obnul;

export let NullView=BaseBlockView.extend({
 el:data.view.el,
 topAnim:null,
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$top=this.$(data.view.$top);
  this.$bottom=this.$(data.view.$bottom);
  this.$bulbs=$(data.view.$bulbs);
 },
 lottie:function(){
  app.get('aggregator').trigger('sound','obnul');

  this.topAnim=lottie.loadAnimation({
   container:this.$top[0],
   renderer:'svg',
   loop:false,
   animationData:data.topAnimData
  });
  lottie.loadAnimation({
   container:this.$bottom[0],
   renderer:'svg',
   loop:false,
   animationData:data.botAnimData
  });
  lottie.loadAnimation({
   container:this.$bulbs[0],
   renderer:'svg',
   loop:true,
   animationData:data.bulbsAnimData
  });

  this.topAnim.addEventListener('complete',()=>app.get('aggregator').trigger('trash:obnulEnded'));
  //setTimeout(()=>app.get('aggregator').trigger('trash:obnulEnded'),1000)
 }
});