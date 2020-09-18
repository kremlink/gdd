import {app} from '../../bf/base.js';
import {data} from './data.js';

export let LoadSaveModel=Backbone.Model.extend({
 omit:data.omit,
 defaults:{
  id:data.uid,
  type:'',
  value:'',
  maxEp:0,
  sum:0,
  epis:[],
  ep:0,//max reached
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
 sum:function(save=false){
  let epis=this.get('epis'),
  s=0;

  epis.forEach((o)=>s+=o);

  this[save?'save':'set']('sum',s);

  return s;
 },
 clr:function(){
  this.save({ep:0,epis:[],react:0});
 },
 setLoaded:function(){
  let match=this.get('value').match(this.loadReg),
   game=+match[2],
   maxEp=this.get('maxEp'),
   gameFull=Math.floor(game/(100/maxEp)),
   ep=this.get('ep'),
   epis=[0];

  for(let i=0;i<ep;i++)
   epis.push(gameFull>i?100/maxEp:game-gameFull*100/maxEp);

  this.save({ep:match[1],epis:epis,react:match[3]});
  this.sum(true);
 }
});