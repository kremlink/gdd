import {app} from '../../bf/base.js';
//import {data} from './data.js';
import {BaseBlockView} from '../baseBlock/view.js';

import {data as dat} from './data.js';
let data=app.configure({chat:dat}).chat,
    epIndex;

let events={};
events[`click ${data.events.choose}`]='choose';
events[`mouseenter ${data.events.choose}`]='hover';

export let ChatView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 chosen:data.dataStart,
 ctr:0,
 canChoose:false,
 msgTemplate:_.template($(data.view.msgTemplate).html()),
 chTemplate:_.template($(data.view.chTemplate).html()),
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  epIndex=app.get('epIndex');

  this.$msgInto=this.$(data.view.msgInto);
  this.$chInto=this.$(data.view.chInto);
  this.next(false);
  //TODO:remove
  $('.chat-wrap').css('margin-right',app.get('scrollDim'));
  //TODO:end-remove
 },
 hover:function(){
  app.get('aggregator').trigger('sound','h-h');
 },
 next:function(snd=true){
  let msg,
      ch;

  if(data.data[epIndex][this.ctr])
  {
   msg=$(this.msgTemplate({text:data.data[epIndex][this.ctr][this.chosen].bot,isBot:true}));
   this.$msgInto.append(msg);
   this.canChoose=false;
   if(snd)
    app.get('aggregator').trigger('sound','chat-r');
   if(data.data[epIndex][this.ctr][this.chosen].user)
   {
    ch=$(this.chTemplate(data.data[epIndex][this.ctr][this.chosen]));
    this.$chInto.html(ch);
   }else
   {
    this.$chInto.html('');
   }
   setTimeout(()=>{
    msg.on('transitionend',()=>{
     this.canChoose=true;
    }).addClass(data.view.shownCls);
    if(ch)
     ch.addClass(data.view.shownCls);
   },0);
   this.ctr++;
  }

  //TODO:remove
  $('.chat-wrap').animate({scrollTop:$('.chat-wrap')[0].scrollHeight},600);
  //TODO:end-remove
 },
 choose:function(e){
  let index=$(e.currentTarget).index(),
   msg;

  if(this.canChoose&&this.chosen)
  {
   app.get('aggregator').trigger('sound','chat-s');
   msg=$(this.msgTemplate({text:data.data[epIndex][this.ctr-1][this.chosen].user[index].msg,isBot:false}));
   this.$msgInto.append(msg);
   this.chosen=data.data[epIndex][this.ctr-1][this.chosen].user[index].what;
   //TODO:remove
   $('.chat-wrap').animate({scrollTop:$('.chat-wrap')[0].scrollHeight},600);
   //TODO:end-remove
   setTimeout(()=>{
    msg.addClass(data.view.shownCls);
   },0);
   setTimeout(()=>{
    this.next();
   },data.soundWait);
  }
 }
});