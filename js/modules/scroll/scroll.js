export let Scroll=function(){
 return {
  wrapDim:null,
  blockDim:null,
  events:{
   init:function(){
    let u=this.get('data').extra,
     hide;

    scroll.wrapDim=u.$wrap.height();
    scroll.blockDim=u.$block.height();
    hide=scroll.blockDim<=scroll.wrapDim;

    if(!hide)
     this.get('setBarDim',[scroll.wrapDim/scroll.blockDim*this.get('getData').holderDim]);
    this.get('getData').container[(hide?'add':'remove')+'Class'](u.cls);

    u.$wrap.on('scroll',()=>{
     this.get('setPosition',{
      value:[u.$wrap.scrollTop()*this.get('getData').bounds[1]/(scroll.blockDim-scroll.wrapDim)],
      external:true
     });
    });
   },
   change:function(e,opts){
    let u=this.get('data').extra;

    if(!opts.external)
     u.$wrap.scrollTop(opts.value[0]*(scroll.blockDim-scroll.wrapDim)/opts.bounds[1]);
   }
  }
 }
};