export let utils;

function Drag(opts){
 var self=this;

 self.options=$.extend(true,{
  mouse:false,
  mult:4,
  fingers:1,
  horizontal:false,
  both:false,
  ignore:null,
  threshold:5,
  coord:opts.horizontal?'pageX':'pageY',
  downCallback:opts.downCallback||function(){},
  dragCallback:opts.dragCallback||function(){},
  upCallback:opts.upCallback||function(){}
 },opts);

 self.props={
  container:opts.container,
  dragStart:false,
  dragging:false,
  touch:{
   coords:{pageX:0,pageY:0},
   start:{pageX:0,pageY:0},
   mousedownFn:[],
   dragFn:[]
  }
 };

 init();

 function init(){
  self.enable();
 }
}

$.extend(Drag.prototype,{
 enable:function(){
  var self=this,
   touch=self.props.touch;

  self.props.container.each(function(i){
   self.props.touch.mousedownFn.push(function(e){
    if(self.options.mouse&&!e.touches||e.touches&&e.touches.length===self.options.fingers)
    {
     self.props.dragStart=true;
     self.options.downCallback({e:(e.touches?e.touches:[e]),index:i,orig:e});
    }

    touch.coords['pageX']=e.touches?e.touches[0]['pageX']:e['pageX'];
    touch.coords['pageY']=e.touches?e.touches[0]['pageY']:e['pageY'];
    touch.start['pageX']=touch.coords['pageX'];
    touch.start['pageY']=touch.coords['pageY'];
    self.props.dragging=false;
   });

   self.props.touch.dragFn.push(function(e){
    var c=self.options.coord,
     c1=self.options.horizontal?'pageY':'pageX',//opposite
     d=e.touches?e.touches[0]:e,
     dx=d['pageX']-touch.start['pageX'],
     dy=d['pageY']-touch.start['pageY'];

    if(Math.sqrt(dx*dx+dy*dy)>self.options.threshold&&self.props.dragStart)
     self.props.dragging=true;

    if(self.props.dragging&&
     (self.options.mouse&&!e.touches||self.options.both||
      Math.abs(touch.coords[c]-d[c])>self.options.mult*Math.abs(touch.coords[c1]-d[c1])))
    {
     touch.coords['pageX']=d['pageX'];
     touch.coords['pageY']=d['pageY'];
     self.options.dragCallback({e:(e.touches?e.touches:[e]),index:i,orig:e});

     dx=d['pageX']-touch.start['pageX'];
     dy=d['pageY']-touch.start['pageY'];

     if(!$(e.target).closest(self.options.ignore).length&&
      Math.sqrt(dx*dx+dy*dy)>3)//disables mobile scroll
      eventjs.prevent(e);
    }
   });

   eventjs.add(this,'mousedown',touch.mousedownFn[i]);
   eventjs.add(this,'drag',touch.dragFn[i]);
  });

  eventjs.add(document,'mouseup',function(e){
   if(self.props.dragging)
   {
    self.props.dragging=false;
    self.props.dragStart=false;
    self.options.upCallback(e);
   }
  });
 },
 disable:function(){
  var self=this;

  self.props.container.each(function(i){
   eventjs.remove(this,'mousedown',self.props.touch.mousedownFn[i]);
   eventjs.remove(this,'drag',self.props.touch.dragFn[i]);
  });
 }
});

utils={
 drag:Drag,
 form:{
  validate:function(opts){
   var flag=true,
    check=opts.check?opts.check:opts.form.find(opts.inputs),
    ignore=opts.ignore?opts.ignore:function(){return false;},
    block=opts.block?opts.block:function(){return false;},
    error=opts.error?opts.error:function(){};

   check.each(function(){
    var obj=$(this),
     reg=obj.data(opts.data);

    if(obj.is('select'))
    {
     if(obj.find(':selected').is(':disabled')&&reg)
     {
      error(obj);
      flag=false;
     }
    }else
    {
     if(block(obj)||!ignore(obj)&&(reg&&!(new RegExp(reg)).test($.trim(this.value))))
     {
      flag=false;
      error(obj);
     }
    }
   });

   if(flag&&opts.blockFlag&&opts.blockFlag['file'])
   {
    alert('Файл все еще в процессе загрузки');
    return false;
   }

   return flag;
  }
 },
 fValid:function(opts){
  var obj={};

  if(opts.file)
  {
   if(opts.file.size>opts.max)
    obj.max=true;
   if(!opts.type.test(opts.file.type)&&!opts.type.test(opts.file.name))
    obj.type=true;
  }

  return obj;
 },
 scrollDim:function(){
  var div=$('<div style="position:absolute;overflow-y:scroll;"></div>').prependTo('body'),
   dim=div.width()-div.css('overflow-y','auto').width();

  div.remove();

  return dim;
 },
 value:function(opts){
  var s=opts.obj.is('input,textarea,select')?'val':'text';

  if(opts.value===undefined)
   return opts.obj[s]();else
   opts.obj[s](opts.value);
 },
 imgsReady:function(opts){
  var callback=opts.callback||function(){},
   src=$.type(opts.src)==='array'?opts.src:[opts.src],
   img,
   imgs=$({});

  for(var i=0;i<src.length;i++)
  {
   img=$('<img />').attr('src',src[i]);
   imgs=imgs?imgs.add(img):img;
  }

  imgs.imagesLoaded(function(){
   if(opts.elements)
   {
    opts.elements.each(function(i){
     $(this).css('backgroundImage','url('+src[i]+')');
    });
   }
   callback(imgs);
   imgs.remove();
  });
 },
 getParam:function(opts){
  var d=opts.delimiter||'&',
   w=opts.what||'#',
   n=opts.name,
   matches=n!==undefined?location[w==='#'?'hash':'search'].match(new RegExp('(?:[?#'+d+'])'+n+'=*([^'+d+']*)')):null;

  return matches?matches[1]:null;
 },
 setParam:function(opts){
  var d=opts.delimiter||'&',
   w=opts.what||'#',
   n=opts.name,
   v=opts.value,
   p=opts.push,
   path=location.protocol+'//'+location.host+location.pathname,
   matches;

  if(!~location.href.indexOf(w))
  {
   if(w==='?')
    history[p?'pushState':'replaceState'](opts.data,n,path+w+n+'='+v+location.hash);else
    location.replace(path+location.search+w+n+'='+v);
  }else
  {
   matches=location[w==='#'?'hash':'search'].match(new RegExp('(?:[?#'+d+'])('+n+'=*([^'+d+']*))'));
   if(matches)
   {
    if(w==='?')
     history[p?'pushState':'replaceState'](opts.data,n,path+location.search.replace(matches[1],n+'='+v)+location.hash);else
     location.replace(path+location.search+location.hash.replace(matches[1],n+'='+v));
   }else
   {
    if(w==='?')
     history.replaceState(opts.data,n,path+location.search+d+n+'='+v+location.hash);else
     location.replace(path+location.search+location.hash+d+n+'='+v);
   }
  }
 }
};