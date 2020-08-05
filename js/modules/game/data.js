export const data={
 waitWin:1000,
 events:{
  'winTab':'.win-tab'
 },
 view:{
  el:'.trash-block.game',
  game:'.the-game',
  diff:'.game-diff',
  diffCh:'.game-diff-ctrl',
  pDone:'.game-sorted-p div,.game-win-sorted-p div',
  pRem:'.game-remaining-p span',
  pQual:'.game-qual-sorted-p div',
  bins:'.bins',
  shownCls:'shown',
  playCls:'game-play',
  endCls:['game-end1','game-end2'],
  diffCls:{
   easy:'game-easy',
   normal:'game-normal',
   hard:'game-hard'
  }
 },
 failLine:{
  el:'.fail-line',
  bottom:'-20%'
 },
 data:{
  'easy':{
   text:'Легко',
   trashData:[{type:2,subtype:1,left:'30%',trs:'3s linear 1s'},{type:2,subtype:2,left:'10%',trs:'5s linear 2s'},
    {type:1,subtype:1,left:'30%',trs:'4s linear 3.5s'},{type:3,subtype:1,left:'35%',trs:'2s linear 5s'},{type:2,subtype:3,left:'70%',trs:'8s linear 5s'},
    {type:3,subtype:2,left:'50%',trs:'6s linear 5s'},{type:1,subtype:2,left:'30%',trs:'3s linear 7s'}],
   binData:[{type:1},{type:2},{type:3}]
  },
  'normal':{
   text:'Средне',
   trashData:[{type:2,subtype:1,left:'30%',trs:'3s linear 1s'},{type:2,subtype:2,left:'10%',trs:'5s linear 2s'},{type:3,subtype:4,left:'90%',trs:'2s linear 2.5s'},
    {type:1,subtype:1,left:'30%',trs:'4s linear 3.5s'},{type:4,subtype:1,left:'35%',trs:'2s linear 5s'},{type:2,subtype:3,left:'70%',trs:'8s linear 5s'},
    {type:3,subtype:2,left:'50%',trs:'6s linear 5s'},{type:1,subtype:3,left:'80%',trs:'2s linear 6s'},{type:4,subtype:2,left:'30%',trs:'3s linear 7s'},
    {type:4,subtype:3,left:'45%',trs:'2s linear 10s'}],
   binData:[{type:1},{type:2},{type:3},{type:4},{type:5}]
  },
  'hard':{
   text:'Сложно',
   trashData:[{type:2,subtype:1,left:'30%',trs:'3s linear 1s'},{type:7,subtype:2,left:'10%',trs:'5s linear 2s'},{type:5,subtype:4,left:'90%',trs:'2s linear 2.5s'},
    {type:1,subtype:1,left:'30%',trs:'4s linear 3.5s'},{type:3,subtype:4,left:'60%',trs:'8s linear 4s'},{type:4,subtype:1,left:'35%',trs:'2s linear 5s'},
    {type:3,subtype:3,left:'70%',trs:'8s linear 5s'},{type:5,subtype:3,left:'20%',trs:'4s linear 5s'},{type:6,subtype:3,left:'20%',trs:'4s linear 5s'},
    {type:1,subtype:2,left:'50%',trs:'6s linear 5.5s'},{type:4,subtype:3,left:'80%',trs:'2s linear 6s'},{type:2,subtype:2,left:'60%',trs:'3s linear 7s'},
    {type:2,subtype:3,left:'45%',trs:'2s linear 9s'},{type:5,subtype:2,left:'30%',trs:'3s linear 9s'},{type:7,subtype:2,left:'10%',trs:'3s linear 9s'}],
   binData:[{type:1},{type:2},{type:3},{type:4},{type:5},{type:6},{type:7}]
  }
 }
};