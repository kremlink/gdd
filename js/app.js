import {base} from './bf/base.js';

import * as index from './modules/index/index.js';

import {Toggle} from './bf/lib/toggle.js';
//------------------------
const modules=base.get('helpers.html').data('app').split(',');
//------------------------
base.init({
 mConfig:{
  index:index.data
 },
 plugins:[Toggle],
 settings:{}
});
//------------------------
index.init(base,modules);

$(()=>{
 var options = {};

 var player = videojs($('.video-js')[0], options, function onPlayerReady() {
  videojs.log('Your player is ready!');

  $(this.el()).append('<div class="test" />');
 });
});