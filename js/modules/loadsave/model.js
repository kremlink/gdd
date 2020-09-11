import {app} from '../../bf/base.js';
import {data} from './data.js';

export let LoadSaveModel=Backbone.Model.extend({
 //omit:data.omit,
 defaults:{
  type:'',
  value:''
 },
 localStorage:new Backbone.LocalStorage('bb-gdd'),
 initialize:function(){
  //this.localStorage=app.get('data')._dev?new Backbone.LocalStorage('bb-gdd'):null;
 },
 validate:function(attrs,opts){
  if(attrs.type==='load'&&!$.trim(attrs.value))
   return true;
 }
});