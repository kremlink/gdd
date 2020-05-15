import * as player from '../player/view.js';

export {data} from './data.js';
export function init(app,modules){
 if(!~modules.indexOf('index'))
  return;

 app.set({data:'index.main',object:new (Backbone.View.extend({
   el:'#wrap',
   initialize:function(){
    //console.log(app.data);
    //console.log(app.get('main.player.View'));
    this.playerView=new player.view;
    //this.listenTo(this.model,'change',this.render);
   }
  })),lib:false});
 //app.set({data:'index.toggle',object:'Toggle'});
 //console.log(app.get('index.toggle'));
}