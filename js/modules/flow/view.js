import {data} from './data.js';
import {utils} from '../../bf/lib/utils.js';
import {BaseBlockView} from '../baseBlock/view.js';

export let FlowView=BaseBlockView.extend({
 el:data.view.el,
 template:_.template($(data.view.template).html()),
 initialize:function(){
  BaseBlockView.prototype.initialize.apply(this,[{
   data:data
  }]);


  this.$(data.view.$episodes).html(this.template($.extend({},data.epis,{active:~location.href.indexOf('index.html')?
    (+utils.getParam({what:'?',name:data.gParam})||1):
    location.href.match(/(\d)\.html/)[1]})));
 }
});