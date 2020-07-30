import {app} from '../../bf/base.js';
import {data} from './data.js';
import {BaseBlockView} from '../baseBlock/view.js';

//app.configure({scroll:data.scroll});

let events={};
events[`click ${data.events.choose}`]='choose';

export let ChatView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 chosen:data.dataStart,
 msgTemplate:_.template($(data.view.msgTemplate).html()),
 chTemplate:_.template($(data.view.chTemplate).html()),
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$msgInto=this.$(data.view.msgInto);
  this.$chInto=this.$(data.view.chInto);
  this.$msgInto.append(this.msgTemplate(data.data[0][this.chosen]));
  this.$chInto.append(this.chTemplate(data.data[0][this.chosen]));
 },
 choose:function(e){

 }
});