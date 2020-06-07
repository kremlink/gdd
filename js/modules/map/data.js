export const data={
 url:'game/map',
 data:[{id:1,left:10,top:10,alert:11,like:7,fire:2,text:'Text text text'},{id:2,left:20,top:20,alert:3,like:4,fire:5,text:'Text text <br/><br/> text text text<br/>text'}],
 omit:['left','top','index','text'],
 events:{
  'marker':'.map-mark',
  'close':'.map-pop-close',
  'react':'.map-pop-react.do .map-pop-react-item'
 },
 view:{
  el:'.trash-block.map',
  template:'#map-template',
  popTemplate:'#map-pop-template',
  reactedTemplate:'#map-pop-reacted-template',
  $pop:'.map-pop',
  $reactContainer:'.map-pop-react.do',
  $reacted:'.map-pop-react.done',
  reactedCls:'reacted',
  shownCls:'shown',
  popShownCls:'popShown',
  dataClick:'type'
 }
};