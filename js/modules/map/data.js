export const data={
 url:'game/map',
 data:[{id:1,left:10,top:10,alert:11,like:7,fire:2},{id:2,left:20,top:20,alert:3,like:4,fire:5}],
 events:{
  'marker':'.map-mark',
  'close':'.map-pop-close',
  'react':'.map-pop-react-item'
 },
 view:{
  el:'.trash-block.map',
  template:'#map-template',
  popTemplate:'#map-pop-template',
  pop:'.map-pop',
  shownCls:'shown',
  popShownCls:'popShown'
 }
};