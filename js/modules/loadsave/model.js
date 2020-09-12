import {app} from '../../bf/base.js';
import {data} from './data.js';

export let LoadSaveModel=Backbone.Model.extend({
 omit:data.omit,
 defaults:{
  id:data.uid,
  type:'',
  value:'',
  ep:0,//max reached
  game:0,
  react:0
 },
 localStorage:new Backbone.LocalStorage('pdt123456qwerty'),
 initialize:function(){
  //this.localStorage=app.get('data')._dev?new Backbone.LocalStorage('bb-gdd'):null;
 },
 validate:function(attrs,opts){
  if(attrs.type==='load'&&!$.trim(attrs.value))
   return true;
 },
 toJSON:function(options){
  return options&&options.all?_.clone(this.attributes):_.omit(_.clone(this.attributes),this.omit);
 }
});