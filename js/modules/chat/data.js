export const data={
 dataStart:'choose0',
 data:[
  {
   'choose0':{bot:'Вечность.. Вечность.. И я. Только вечность. И я. В ней. Надолго ли? Эх.',user:[{what:'choose1',text:'Эй! Я на связи!',msg:'Эй! Я на связи!'}]}
  },
  {
   'choose1':{bot:'хм... какие-то странные искажения. интересно! давненько я их не видел. вернее - никогда! неужели кто-то добрался. неужели кто-то активировал... черт, но текст неразборчив. эй! если ты меня видишь! тебе нужно активировать "поток треша". блок 1. после этого криптография наших гаджетов синхронизируется и мы сможем общаться.',user:[{what:'choose1-1',text:'Ясно, приступаю!',msg:'Ясно, приступаю!'},{what:'choose1-2',text:'Чего? Чего ты несешь?!',msg:'Чего? Чего ты несешь?!'}]},
  },
  {
   'choose1-1':{bot:'Второе сообщение! Значит там кто-то есть. Если ты это читаешь - скорее активируй поток треша и возвращайся. Тебе выпал чудесный шанс - спасти эту планету. Если ты конечно с планеты Земля.',user:[{what:'choose2-1',text:'понял',msg:'понял'}]},
   'choose1-2':{bot:'Ничерта не понимаю. Текст прилетает битым. Скорее активируй "поток треша". Выбирай блок 1 . Жду тебя обратно. Торопись!',user:[{what:'choose3-1',text:'ыаолпзупдлуора38выдрп43',msg:'ыаолпзупдлуора38выдрп43'}]}
  },
  {
   'choose2-1':{bot:'мдэээ. нам будет с тобой не просто пройти через это приключения. ну ничего. нарастим твой левел когнитивности. а дальше уже полегче будет. вернись к тому что я сказал и за работу!',user:[{what:'choose4-1',text:'все! теперь понял!',msg:'все! теперь понял!'}]},
   'choose3-1':{bot:'о, вот сейчас уже гораздо понятнее. и все же - сделай все что я сказал. и готовься к приключению всей жизни.',user:[{what:'choose4-1',text:'все! теперь понял!',msg:'все! теперь понял!'}]}
  },
  {
   'choose4-1':{bot:'не, нам точно не будет просто. но я верю в тебя!'}
  }],
 /*data:[
  {
   'choose0':{bot:'1',user:[{what:'choose1',text:'a',msg:'a-msg'},{what:'choose2',text:'b',msg:'b-msg'},{what:'choose3',text:'c',msg:'c-msg'}]}
  },
  {
   'choose1':{bot:'1-1',user:[{what:'choose1-1',text:'a-1',msg:'a-1-msg'}]},
   'choose2':{bot:'1-2',user:[{what:'choose2-1',text:'b-1',msg:'b-1-msg'},{what:'choose2-2',text:'b-2',msg:'b-2-msg'}]},
   'choose3':{bot:'1-3',user:[{what:'choose3-1',text:'c-1',msg:'c-1-msg'}]}
  },
  {
   'choose1-1':{bot:'1-1-1',user:[{what:'choose1-1-1',text:'a-1-1',msg:'a-1-1-msg'},{what:'choose1-1-2',text:'a-1-2',msg:'a-1-2-msg'}]},
   'choose2-1':{bot:'1-2-1',user:[{what:'choose2-1-1',text:'b-1-1',msg:'b-1-1-msg'},{what:'choose2-1-2',text:'b-1-2',msg:'b-1-2-msg'},{what:'choose2-1-3',text:'b-1-3',msg:'b-1-3-msg'}]},
   'choose2-2':{bot:'1-2-2',user:[{what:'choose2-2-2',text:'b-2-1',msg:'b-2-1-msg'}]},
   'choose3-1':{bot:'1-3-1',user:[{what:'choose3-1-1',text:'c-1-1',msg:'c-1-1-msg'}]}
  },
  {
   'choose1-1-1':{bot:'1-1-1-1',user:[{what:'',text:'a-1-1-1-stop',msg:'a-1-1-1-stop-msg'}]},
   'choose1-1-2':{bot:'1-1-1-2',user:[{what:'',text:'a-1-2-1-stop',msg:'a-1-2-1-stop-msg'}]},
   'choose2-1-1':{bot:'1-2-1-1',user:[{what:'',text:'b-1-1-1-stop',msg:'b-1-1-1-stop'}]},
   'choose2-1-2':{bot:'1-2-1-2',user:[{what:'',text:'b-1-2-1-stop',msg:'b-1-2-1-stop-msg'}]},
   'choose2-1-3':{bot:'1-2-1-3',user:[{what:'',text:'b-1-3-1-stop',msg:'b-1-3-1-stop-msg'}]},
   'choose2-2-2':{bot:'1-2-2-2',user:[{what:'',text:'b-2-1-1-stop',msg:'b-2-1-1-stop-msg'}]},
   'choose3-1-1':{bot:'1-3-1-1',user:[{what:'',text:'c-1-1-1-stop',msg:'c-1-1-1-stop-msg'}]}
  }],*/
 events:{
  'choose':'.chat-choose'
 },
 view:{
  el:'.trash-block.chat',
  msgInto:'.chat-inner',
  chInto:'.chat-ctrls',
  msgTemplate:'#chat-msg-template',
  chTemplate:'#chat-choose-template',
  //$pop:'.bible-pop',
  shownCls:'shown'
 }
};