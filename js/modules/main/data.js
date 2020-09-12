export const data={
 fail:0,
 events:{
  'play':'.return-btn',
  'game':'.game-btn',
  'flow':'.videos-btn',
  'map':'.map-btn',
  'bible':'.book-btn',
  'chat':'.chat-btn',
  'loadsave':'.load-save-btn',
  'menu':'.menu-btn',
  'null':'.null-btn'
 },
 view:{
  el:'.trash-pop',
  template:'#trash-template',
  activeBtnCls:'active',
  //shownCls:'shown',
  fsCls:'fs',
  mfsCls:'mfs',
  gamePlayingCls:'game-playing',
  obnul:{
   cls:'null',
   endCls:'null-end',
   afterCls:'null-after',
   dur:'3.3s',
   start:{ep:'9.37s',game:'10.33s',react:'10.66s'},
   waitVid:0,
   srcGood:'',
   srcBad:'',
   href:''
  }
 },
 epProgress:{
  el:'.prog1 .prog-ac'
 },
 gameProgress:{
  el:'.prog2 .prog-ac'
 },
 reactProgress:{
  el:'.prog3 .prog-ac'
 }
};