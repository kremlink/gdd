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
 loadReg:new RegExp(data.datTmpl.replace(/<%= [a-z]+ %>/g,'(\\d+)').replace('^','\\^')),
 localStorage:new Backbone.LocalStorage('pdt123456qwerty'),
 initialize:function(){
  //this.localStorage=app.get('data')._dev?new Backbone.LocalStorage('bb-gdd'):null;
 },
 validate:function(attrs,opts){
  if(attrs.type==='load'&&!attrs.value.match(this.loadReg))
   return true;
 },
 toJSON:function(options){
  return options&&options.all?_.clone(this.attributes):_.omit(_.clone(this.attributes),this.omit);
 },
 clr:function(){
  this.save({ep:0,game:0,react:0});
 },
 setLoaded:function(){
  let match=this.get('value').match(this.loadReg);

  this.save({ep:match[1],game:match[2],react:match[3]});
 }
});