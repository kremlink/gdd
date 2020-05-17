import {base as app} from './bf/base.js';

import * as index from './modules/index/view.js';

import {Toggle} from './bf/lib/toggle.js';
//------------------------
const modules=app.get('helpers.html').data('app').split(',');
//------------------------
app.init({
 plugins:[Toggle],
 settings:{}//app specific like impPath
});
//------------------------
app.set({dest:'objects.aggregator',object:_.extend({},Backbone.Events)});

$(()=>{
 index.init(app,modules);
});
