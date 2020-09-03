import {app} from '../../bf/base.js';
//import {data} from './data.js';
import {BaseBlockView} from '../baseBlock/view.js';

import {data as dat} from './data.js';
let data=app.configure({obnul:dat}).obnul,
    epIndex;

export let NullView=BaseBlockView.extend({
 el:data.view.el,
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);

  epIndex=app.get('epIndex');

  this.$top=this.$(data.view.top);
  this.$bottom=this.$(data.view.bottom);
 }
});