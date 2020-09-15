import {app} from '../../bf/base.js';
import {data as dat} from './data.js';
let data=app.configure({sound:dat}).sound;

export let SoundMgr=Backbone.View.extend({
 template:_.template(data.template),
 sounds:{},
 initialize:function(){
  let body=$('body');

  this.listenTo(app.get('aggregator'),'sound',this.play);

  for(let [x,y] of Object.entries(data.src))
   body.append(this.sounds[x]=$(this.template({src:y}))[0]);
 },
 play:function(name){
  this.sounds[name].currentTime=0;
  if(!app.get('_dev'))
   this.sounds[name]['play']();
 }
});