export const data={
 data:{
  '1':{
   name:'Отходины',
   items:[
    {id:1,h:'Тру',text:'Пластиковая заноза в заднице наших героев. Каким-то невероятным образомПластиковая заноза в заднице наших героев. Каким-то невероятным образомПластиковая заноза в заднице наших героев. Каким-то невероятным образом она оказалась на дне экологии – российской, незаконной свалке. Ей нужно срочно вернуться в Швецию, чтобы попасть обратно в эффективный круговорот мусора. Переработка – смысл ее жизни. Вернее – жизней!'},
    {id:2,h:'Квас',text:'В свое время был куплен тренером детской футбольной команды, после чего сделал впечатляющую карьеру. Им играли целый месяц в регианальной ДЮСШОР, пока мэрия не узнала.. о приезде проверки и не выделила деньги на футбольный мяч. С тех пор он ушел сначала в запас, а потом отправился на свалку.'},
    {id:3,h:'Кожура',text:'Попал с друзьями на вечеринку. Плод съели быстро, а кожуру оставили на столе. Благодаря этому она всю ночь слушала, как ребята играют на гитаре. Так кожура и научилась брынчать на струнках.'},
    {id:4,h:'Пакет',text:'Целофановый романтик, потерявший свою любовь под ботинком депутата Тюменева.  Что остается ему в этой жизни, в которой ему нет жизни и смерти? Только исполнить их общую с Деткой мечту – попасть на пластиковый остров.  Может, там он обретет покой.'},
    {id:5,no:true},
    {id:6,no:true},
    {id:7,no:true},
    {id:8,no:true}]
  },
  '2':{
   name:'Людишки',
   items:[
    {id:1,no:true},
    {id:2,no:true}]
  },
  '3':{
   name:'Мусордроиды',
   items:[
    {id:1,no:true},
    {id:2,no:true},
    {id:3,no:true}]
  },
  '4':{
   name:'Экстра',
   items:[
    {id:1,no:true}]
  }
 },
 events:{
  'tab':'.bible-tab',
  'item':'.bible-item',
  'close':'.uni-pop-close'
 },
 view:{
  el:'.trash-block.bible',
  template:'#bible-template',
  tabTemplate:'#bible-tab-template',
  popTemplate:'#bible-pop-template',
  $itemsWrap:'.bible-items',
  $itemsContainer:'.bible-items-inner',
  $pop:'.uni-pop',
  $name:'.bible-tab-name',
  shownCls:'shown',
  activeTabCls:'active',
  dataClick:'type',
  dataId:'id'
 }
};