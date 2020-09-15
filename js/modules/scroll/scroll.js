export let Scroll={
 events:function(wrapDim,blockDim){
  return {
   init:function(){
    let u=this.get('data').extra,
     hide;

    wrapDim=u.$wrap.height();
    blockDim=u.$block.height();
    hide=blockDim<=wrapDim;

    if(!hide)
     this.get('setBarDim',[wrapDim/blockDim*this.get('getData').holderDim]);
    this.get('getData').container[(hide?'add':'remove')+'Class'](u.cls);
    u.$wrap[(hide?'add':'remove')+'Class'](u.cls);

    u.$wrap.on('scroll',()=>{
     this.get('setPosition',{
      value:[u.$wrap.scrollTop()*this.get('getData').bounds[1]/(blockDim-wrapDim)],
      external:true
     });
    });
   },
   change:function(e,opts){
    let u=this.get('data').extra;

    if(!opts.external)
     u.$wrap.scrollTop(opts.value[0]*(blockDim-wrapDim)/opts.bounds[1]);
   }
  }
 }
};
