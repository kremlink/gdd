import {app} from '../../bf/base.js';
import {data} from './data.js';

export let MenuModel=Backbone.Model.extend({
 defaults:{

 },
 initialize:function(){
  //this.localStorage=new Backbone.LocalStorage('bb-gdd');
 },
 validate:function(attrs){
  let d=[];

  for(let [x,y] of Object.entries(attrs))
  {
   if(x!=='id'&&(y.reg&&!(new RegExp(y.reg)).test($.trim(y.value))))
    d.push(x);
  }

  return d.length?d:false;
 },
 toJSON:function(options){
  let attrs=_.clone(this.attributes);

  for(let [x,y] of Object.entries(attrs))
   if(x==='id')
    delete attrs[x];else
    attrs[x]=y.value;

  return attrs;
 }
});