export let GameBinModel=Backbone.Model.extend({
 defaults:{
  amount:0
 },
 addTrash:function(type){
  this.set({amount:this.get('amount')+(this.get('type')===type?1:-1)});
 }
});