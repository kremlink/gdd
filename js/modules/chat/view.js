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
 ctr:0,
 canChoose:false,
 msgTemplate:_.template($(data.view.msgTemplate).html()),
 chTemplate:_.template($(data.view.chTemplate).html()),
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$msgInto=this.$(data.view.msgInto);
  this.$chInto=this.$(data.view.chInto);
  this.next();

  $('.chat-wrap').css('margin-right',app.get('scrollDim'));//TODO:remove
 },
 next:function(){
  let msg,
      ch;

  if(data.data[this.ctr])
  {
   msg=$(this.msgTemplate({text:data.data[this.ctr][this.chosen].bot,isBot:true}));
   this.$msgInto.append(msg);
   this.canChoose=false;
   if(data.data[this.ctr][this.chosen].user)
   {
    ch=$(this.chTemplate(data.data[this.ctr][this.chosen]));
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

  $('.chat-wrap').animate({scrollTop:$('.chat-wrap')[0].scrollHeight},600);//TODO:remove
 },
 choose:function(e){
  let index=$(e.currentTarget).index(),
   msg;

  if(this.canChoose&&this.chosen)
  {
   msg=$(this.msgTemplate({text:data.data[this.ctr-1][this.chosen].user[index].msg,isBot:false}));
   this.$msgInto.append(msg);
   this.chosen=data.data[this.ctr-1][this.chosen].user[index].what;
   setTimeout(()=>{
    msg.addClass(data.view.shownCls);
   },0);
   this.next();
  }
 }
});