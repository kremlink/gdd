export const data={
 omit:['type','value'],
 url:'',
 uid:'uid',
 datTmpl:'!@^P<%= ep %>D<%= sum %>T<%= react %>_',
 saveReloadTime:2000,
 clrHref:'',
 events:{
  'copy':'.ls-copy-btn',
  'load':'.ls-load-btn',
  'focus':'.ls-load-from',
  'clr':'.ls-clr-btn'
 },
 view:{
  tabCls:'tab-tab',
  el:'.trash-block.loadsave',
  reload:'.reload',
  copyFrom:'.ls-copy-from',
  shownCls:'shown',
  endSaveCls:'ls-load-end',
  errCls:'ls-load-err'
 }
};