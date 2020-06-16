import {data} from './data.js';

export let MapMarkerModel=Backbone.Model.extend({
 url:data.url,
 omit:data.omit,
 defaults:{
  alert:0,
  like:0,
  fire:0,
  react:''
 },
 toJSON:function(options){
  return options&&options.all?_.clone(this.attributes):_.omit(_.clone(this.attributes),this.omit);
 }
});