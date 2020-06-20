import {app} from './bf/base.js';

import * as index from './modules/index/view.js';

import {Toggle} from './bf/lib/toggle.js';
import {Bar} from './bf/lib/bar.js';
import {utils} from './bf/lib/utils.js';
//------------------------
const modules=app.get('helpers.html').data('app').split(',');
//------------------------
app.init({
 plugins:[Toggle,Bar],
 settings:{}//app specific like impPath
});
//------------------------
app.set({dest:'objects.aggregator',object:_.extend({},Backbone.Events)});

$(()=>{
 index.init(app,modules);
 app.set({dest:'objects.scrollDim',object:-Math.abs(utils.scrollDim())});
});

/*
$(()=>{
 let wobble=$('.w-wrap'),
  x=0,
  y=0,
  rand=()=>Math.floor(Math.random()*60)-30,
  wTrs=()=>{
   let oX=x,oY=y;

   x=rand();
   y=rand();

   if(x===oX&&y===oY)
    wTrs();
   wobble.css('transform',`translate(${x}px,${y}px)`);
  };

 $('.w-p div').css({transitionDuration:'5s',width:'100%'});
 wobble.on('transitionend',function(){
  wTrs();
 });
 wTrs();
});*/
