import {LoadSaveModel} from './model.js';
import {utils} from '../../bf/lib/utils.js';
import {app} from '../../bf/base.js';
import {BaseBlockView} from '../baseBlock/view.js';
import {data as dat} from './data.js';

let data=app.configure({loadsave:dat}).loadsave;

let events={};
events[`click ${data.events.lsTab}`]='lsTab';
events[`click ${data.events.copy}`]='copy';

export let LoadSaveView=BaseBlockView.extend({
 el:data.view.el,
 events:events,
 tabIndex:0,
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  this.$el.addClass(data.view.tabCls[this.tabIndex]);
  this.$copyFrom=this.$(data.view.copyFrom);
 },
 lsTab:function(e){
  this.$el.removeClass(data.view.tabCls[this.tabIndex]);
  this.tabIndex=$(e.currentTarget).index();
  this.$el.addClass(data.view.tabCls[this.tabIndex]);
 },
 copy:function(){
  this.$copyFrom[0].select();
  document.execCommand('copy');
 }
});