$(function(){
  var socket = undefined;
  try {
    socket = io();
  } catch(e){
    socket = 'ws://localhost:3000/';
  }
  finally{
    Game.Main.init($("#canvas"), socket);
  }
  Game.Main.start();
});