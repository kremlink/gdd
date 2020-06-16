export const data={
 data:{
  '1':{
   color:'gray',
   items:[{id:1,text:'Text text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>text'},
    {id:2,text:'Text text <br/><br/> text text text<br/>text'},
    {id:3,text:'Text3'},
    {id:4,text:'Text4'},
    {id:5,text:'Text5'},
    {id:6,text:'Text6'}]
  },
  '2':{
   color:'orange',
   items:[
    {id:4,text:'Text4'},
    {id:5,text:'Text5'},
    {id:6,text:'Text6'}]
  },
  '3':{
   color:'green',
   items:[
    {id:4,text:'Text text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>textText text <br/><br/> text text text<br/>text'}]
  }
 },
 events:{
  'tab':'.bible-tab',
  'item':'.bible-item',
  'close':'.bible-pop-close'
 },
 view:{
  el:'.trash-block.bible',
  template:'#bible-template',
  tabTemplate:'#bible-tab-template',
  popTemplate:'#bible-pop-template',
  $itemsWrap:'.bible-items',
  $itemsContainer:'.bible-items-inner',
  $pop:'.bible-pop',
  shownCls:'shown',
  activeTabCls:'active',
  popShownCls:'popShown',
  dataClick:'type'
 }
};