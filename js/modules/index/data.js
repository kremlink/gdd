export const data={
 preload:{},
 events:{
  'start':'.loader-pop .btn',
 },
 view:{
  el:'#wrap',
  loadedCls:'loaded',
  tooSmallCls:'too-small',
  $overlay:'.vid-overlay',
  startCls:'start',
  pauseCls:'paused',
  blockCls:'blocked',
  vidStartedOnce:'vidStartedOnce'
 },
 minViewport:'(min-width:500px)',
 mobViewport:'(max-width:1023px)'
};