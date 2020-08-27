export let Scroll=function(){
 console.log(Scroll.once);
 Scroll.once=true;
 return {//TODO:make it as it has to be!!!!!!!! object instead of function
  events:{
   init:function(){
    let u=this.get('data').extra,
     hide;

    this.wrapDim=u.$wrap.height();
    this.blockDim=u.$block.height();
    hide=this.blockDim<=this.wrapDim;

    if(!hide)
     this.get('setBarDim',[this.wrapDim/this.blockDim*this.get('getData').holderDim]);
    this.get('getData').container[(hide?'add':'remove')+'Class'](u.cls);
    u.$wrap[(hide?'add':'remove')+'Class'](u.cls);

    u.$wrap.on('scroll',()=>{
     this.get('setPosition',{
      value:[u.$wrap.scrollTop()*this.get('getData').bounds[1]/(this.blockDim-this.wrapDim)],
      external:true
     });
    });
   },
   change:function(e,opts){
    let u=this.get('data').extra;

    if(!opts.external)
     u.$wrap.scrollTop(opts.value[0]*(this.blockDim-this.wrapDim)/opts.bounds[1]);
   }
  }
 }
};