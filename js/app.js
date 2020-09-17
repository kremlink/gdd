import {app} from './bf/base.js';

import * as index from './modules/index/view.js';

//import {Toggle} from './bf/lib/toggle.js';
import {Bar} from './bf/lib/bar.js';
import {utils} from './bf/lib/utils.js';
//------------------------
const dataApp=app.get('helpers.html').data('app'),
 modules=dataApp.modules;
//------------------------
app.init({
 //plugins:[Toggle,Bar],
 plugins:[Bar,{object:utils,name:'utils'}],
 settings:{}//app specific like impPath
});
//------------------------
app.set({dest:'objects.aggregator',object:_.extend({},Backbone.Events)});
app.set({dest:'objects.isMobile',object:matchMedia(index.data.mobViewport).matches});
app.set({dest:'objects.epIndex',object:dataApp.index});

app.set({dest:'objects._dev',object:true});//TODO:remove

let _sync=Backbone.sync;
Backbone.sync=function(method,model,options){

 // Add trailing slash to backbone model views
 let url=_.isFunction(model.url)?model.url():model.url;
 url+=url.charAt(url.length-1)==='/'?'':'/';

 options=_.extend(options,{url:url});

 return _sync(method,model,options);
};

$(()=>{
 app.set({dest:'objects.scrollDim',object:-Math.abs(utils.scrollDim())});
 index.init(app,modules);
});
