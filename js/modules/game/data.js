export const data={
 view:{
  el:'.trash-game',
  bins:'.bins',
  shownCls:'shown'
 },
 trashData:[{type:2,subtype:1,left:'30%',trs:'3s linear 1s'},{type:2,subtype:2,left:'10%',trs:'5s linear 2s'},{type:3,subtype:4,left:'90%',trs:'2s linear 2.5s'},
  {type:1,subtype:1,left:'30%',trs:'4s linear 3.5s'},{type:4,subtype:1,left:'35%',trs:'2s linear 5s'},{type:2,subtype:3,left:'70%',trs:'8s linear 5s'},
  {type:3,subtype:2,left:'50%',trs:'6s linear 5s'},{type:1,subtype:3,left:'80%',trs:'2s linear 6s'},{type:4,subtype:2,left:'30%',trs:'3s linear 7s'},
  {type:4,subtype:3,left:'45%',trs:'2s linear 10s'}],
 bin:{
  data:[{type:1},{type:2},{type:3},{type:4},{type:5}],
  view:{
   className:'bin',
   template:'#game-bin-template',
   drop:'.b-drop',
  }
 }
};