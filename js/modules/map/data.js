export const data={
 url:'',
 data:[],
 omit:['left','top','text','h','reacts'],
 events:{
  'marker':'.map-mark',
  'close':'.uni-pop-close',
  //'react':'.map-pop-react .map-pop-react-item',
  'full':'.map-full',
  'react':'.tab-tab',
  'zoomIn':'.zoom-in',
  'zoomOut':'.zoom-out'
 },
 view:{
  el:'.trash-block.map',
  template:'#map-template',
  popTemplate:'#map-pop-template',
  $pop:'.uni-pop',
  $map:'.map-block',
  $drag:'.map-inner',
  $progress:'.the-progress',
  dragW:87.2,
  dragP:9/16.15,
  $reactP:'.map-b-p-perc span',
  reactedCls:'reacted',
  shownCls:'shown',
  zoomCls:'map-zoom',
  poppedCls:'map-popped',
  dataClick:'type',
  dataId:'id'
 }
};