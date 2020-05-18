import * as player from '../player/view.js';
import * as trash from '../trash/view.js';

//import {data as dat} from './data.js';
//let data=app.configure({index:dat}).index;
export function init(app,modules){
 if(!~modules.indexOf('index'))
  return;

 app.set({data:'index.main',object:new (Backbone.View.extend({
   el:'#wrap',
   initialize:function(){
    this.playerView=new player.View;
    this.listenTo(app.get('aggregator'),'player:ready',this.addTrash);
   },
   addTrash:function(){
    let trashView=new trash.View;

    this.playerView.addTrash(trashView.el);
    trashView.ready();
   }
  })),lib:false});
}