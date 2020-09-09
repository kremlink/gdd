import {data} from './data.js';

export let MapMarkerModel=Backbone.Model.extend({
 omit:data.omit,
 defaults:{
  reacts:[],
  react:''
 },
 toJSON:function(options){
  return options&&options.all?_.clone(this.attributes):_.omit(_.clone(this.attributes),this.omit);
 }
});