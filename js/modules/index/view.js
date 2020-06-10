//import {PlayerView} from '../player/view.js';//--old
import {TrashView} from '../trash/view.js';
import {data} from './data.js';

//import {data as dat} from './data.js';
//let data=app.configure({index:dat}).index;
export function init(app,modules){
 if(!~modules.indexOf('index'))
  return;

 new (Backbone.View.extend({
  el:data.view.el,
  initialize:function(){
   let trashView=new TrashView;

   this.$el.addClass(data.view.loadedCls);
   if(!matchMedia(data.minViewport).matches)
    this.$el.addClass(data.view.tooSmallCls);

   /*this.playerView=new PlayerView;//--old
   this.listenTo(app.get('aggregator'),'player:ready',this.addTrash);*/
   $(window).on('resize',_.debounce(function(){
    //location.reload();TODO: uncomment
   },200));
  }/*,
  addTrash:function(){//--old
   let trashView=new TrashView;

   this.playerView.addTrash(trashView.el);
   trashView.ready();
   this.$el.addClass(data.view.readyCls);
   if(!matchMedia(data.minViewport).matches)
    this.$el.addClass(data.view.tooSmallCls);
  }*/
 }))
}