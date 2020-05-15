import {base} from './bf/base.js';

import * as index from './modules/index/view.js';

import {Toggle} from './bf/lib/toggle.js';
//------------------------
const modules=base.get('helpers.html').data('app').split(',');
//------------------------
base.init({
 mConfig:{
  index:index.data//settings are inserted into app.data and patched with config.js
 },
 plugins:[Toggle],
 settings:{}//app specific like impPath
});
//------------------------
$(()=>{
 index.init(base,modules);
});
