import {MapMarkerModel} from './model.js';
import {utils} from '../../bf/lib/utils.js';
import {app} from '../../bf/base.js';
import {data} from './data.js';

app.configure({scroll:data.scroll});

let events={};
events[`click ${data.events.marker}`]='pop';
events[`click ${data.events.close}`]='unpop';
events[`click ${data.events.react}`]='react';

export let MapView=Backbone.View.extend({
 el:data.view.el,
 events:events,
 template:_.template($(data.view.template).html()),
 popTemplate:_.template($(data.view.popTemplate).html()),
 reactedTemplate:_.template($(data.view.reactedTemplate).html()),
 initialize:function(){
  this.$el.html(this.template({data:data.data}));
  this.$pop=this.$(data.view.$pop);
  this.marks=new (Backbone.Collection.extend({model:MapMarkerModel}));
  this.marks.reset(data.data);
  this.addMarks();
  this.$marks=this.$(data.events.marker);
  this.current=null;
  this.$popContent=null;
  this.$reacted=null;
  this.scrollDim=utils.scrollDim();

  this.scroll={
     bar:{
      init:function(){
       var u=this.get('data').extra,
        self=this,
        d,
        db=_.debounce(function(){
         if(!self.get('getData').stopResize)
         {
          d=u.block.get('getData');
          self.get('resize');
          if(!d.hide)
           self.get('setBarDim',[d.wrapDim/d.blockDim*self.get('getData').holderDim]);
          self.get('getData').container[(d.hide?'add':'remove')+'Class'](u.cls);
         }
        },u.time);

       app.helpers.win.on('resize',function(){
        db();
       });
      },
      change:function(e,opts){
       var u=this.get('data').extra;

       if(u.block&&!opts.external&&!opts.resize)
       {
        u.block.get('move',{
         value:-opts.value*u.block.get('getData').dim/opts.bounds[1],
         external:true
        });
       }
      }
     }
    };
 },
 addMarks:function(){
  this.marks.each((model,index)=>{
   model.set('index',index);
  });
 },
 show:function(){
  this.$el.addClass(data.view.shownCls);
 },
 hide:function(){
  this.$el.removeClass(data.view.shownCls);
 },
 renderReacted:function(){
  this.$reacted.html(this.reactedTemplate(this.current.toJSON()));
 },
 pop:function(e){
  let index=this.$marks.index(e.currentTarget);

  if(this.$popContent)
   this.$popContent.remove();
  this.current=this.marks.at(index);
  this.$popContent=$(this.popTemplate(_.extend({margin:this.scrollDim},this.current.toJSON({all:true}))));
  this.$pop.append(this.$popContent);
  this.$el.addClass(data.view.popShownCls);
  this.$reacted=this.$(data.view.$reacted);
  this.renderReacted();

  let bar=app.set({
   data:'scroll',
   object:'Bar',
   on:this.scroll.bar,
   add:{options:{helpers:{drag:utils.drag}}},
   set:false
  });
 },
 unpop:function(){
  this.$el.removeClass(data.view.popShownCls);
 },
 react:function(e){
  let type=$(e.currentTarget).data(data.view.dataClick),
  count=this.current.get(type);

  this.current.save({react:type,[type]:count+1});
  this.$(data.view.$reactContainer).addClass(type+' '+data.view.reactedCls);
  this.renderReacted();
 }
});