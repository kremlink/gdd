export const data={
 formUrl:'',
 events:{
  'tab':'.bottom-panel .tab-tab',
  'subTab':'.menu-subtabs .tab-tab',
  'callbTab':'.callb-where div',
  'callbSend':'.menu-b-btn.callb-send',
  'callbOk':'.menu-b-btn:not(.callb-send)',
  'sharCopy':'.shar-block .menu-b-btn'
 },
 view:{
  tabClsBase:'tab-tab',
  el:'.trash-block.menu',
  copyFrom:'.shar-block input',
  menuSubBlock:'.subtab-block',
  authors:'.auth-block',
  shownCls:'shown',
  errCls:'ls-load-err',
  refCopyCls:'menu-ref-copied',
  callb:{
   tabInput:'.callb-where input',
   init:'.callb-init',
   sent:'.callb-sent',
   activeCls:'active',
   shownCls:'shown',
   hiddenCls:'hidden'
  }
 }
};