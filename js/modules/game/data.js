export const data={
 view:{
  el:'.trash-block.game',
  bins:'.bins',
  shownCls:'shown'
 },
 data:{
  'easy':{
   trashData:[{type:2,subtype:1,left:'30%',trs:'3s linear 1s'},{type:2,subtype:2,left:'10%',trs:'5s linear 2s'},
    {type:1,subtype:1,left:'30%',trs:'4s linear 3.5s'},{type:3,subtype:1,left:'35%',trs:'2s linear 5s'},{type:2,subtype:3,left:'70%',trs:'8s linear 5s'},
    {type:3,subtype:2,left:'50%',trs:'6s linear 5s'},{type:1,subtype:2,left:'30%',trs:'3s linear 7s'}],
   binData:[{type:1,color:'green'},{type:2,color:'orange'},{type:3,color:'blue'}]
  },
  'normal':{
   trashData:[{type:2,subtype:1,left:'30%',trs:'3s linear 1s'},{type:2,subtype:2,left:'10%',trs:'5s linear 2s'},{type:3,subtype:4,left:'90%',trs:'2s linear 2.5s'},
    {type:1,subtype:1,left:'30%',trs:'4s linear 3.5s'},{type:4,subtype:1,left:'35%',trs:'2s linear 5s'},{type:2,subtype:3,left:'70%',trs:'8s linear 5s'},
    {type:3,subtype:2,left:'50%',trs:'6s linear 5s'},{type:1,subtype:3,left:'80%',trs:'2s linear 6s'},{type:4,subtype:2,left:'30%',trs:'3s linear 7s'},
    {type:4,subtype:3,left:'45%',trs:'2s linear 10s'}],
   binData:[{type:1,color:'green'},{type:2,color:'orange'},{type:3,color:'blue'},{type:4,color:'gray'},{type:5,color:'yellow'}]
  },
  'hard':{
   trashData:[{type:2,subtype:1,left:'30%',trs:'3s linear 1s'},{type:7,subtype:2,left:'10%',trs:'5s linear 2s'},{type:5,subtype:4,left:'90%',trs:'2s linear 2.5s'},
    {type:1,subtype:1,left:'30%',trs:'4s linear 3.5s'},{type:3,subtype:4,left:'60%',trs:'8s linear 4s'},{type:4,subtype:1,left:'35%',trs:'2s linear 5s'},
    {type:3,subtype:3,left:'70%',trs:'8s linear 5s'},{type:5,subtype:3,left:'20%',trs:'4s linear 5s'},{type:6,subtype:3,left:'20%',trs:'4s linear 5s'},
    {type:1,subtype:2,left:'50%',trs:'6s linear 5.5s'},{type:4,subtype:3,left:'80%',trs:'2s linear 6s'},{type:2,subtype:2,left:'60%',trs:'3s linear 7s'},
    {type:2,subtype:3,left:'45%',trs:'2s linear 9s'},{type:5,subtype:2,left:'30%',trs:'3s linear 9s'},{type:7,subtype:2,left:'10%',trs:'3s linear 9s'}],
   binData:[{type:1,color:'green'},{type:2,color:'orange'},{type:3,color:'blue'},{type:4,color:'gray'},{type:5,color:'yellow'},{type:6,color:'black'},{type:7,color:'red'}]
  }
 }
};