export const data={
 url:'rest/map',
 data:[{id:1,left:10,top:10,react:'like',alert:11,like:7,fire:2,h:'Заголовок1',text:'Text text <br/><br/> text text text<br/> text text<br/> text<br/> text text text<br/>textText text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>text'},
  {id:2,left:20,top:20,alert:3,like:4,fire:5,h:'Заголовок2',text:'Text text <br/><br/> text text text<br/>text'},
  {id:3,left:70,top:45,alert:0,like:0,fire:2,h:'Заголовок3',text:'Text3'},
  {id:4,left:60,top:30,alert:5,like:5,fire:5,h:'Заголовок4',text:'Text4'},
  {id:5,left:30,top:70,alert:1,like:1,fire:1,h:'Заголовок5',text:'Text5'},
  {id:6,left:50,top:50,alert:3,like:0,fire:12,h:'Заголовок6',text:'Text6'}],
 omit:['left','top','text','h'],
 events:{
  'marker':'.map-mark',
  'close':'.uni-pop-close',
  //'react':'.map-pop-react .map-pop-react-item',
  'full':'.map-full',
  'react':'.tab-tab'
 },
 view:{
  el:'.trash-block.map',
  template:'#map-template',
  popTemplate:'#map-pop-template',
  $pop:'.uni-pop',
  reactedCls:'reacted',
  shownCls:'shown',
  popShownCls:'popShown',
  fullCls:'pop-full',
  dataClick:'type',
  dataId:'id'
 }
};