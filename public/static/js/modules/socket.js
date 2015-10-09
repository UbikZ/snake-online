var Game = Game || {};

Game.Socket = (function () {
  'use strict';

  var socket = io();

  /**
   *
   */
  function init()
  {
    socket.on('server.user.notify', serverUserNotify)
  }

  /**
   *
   */
  function clientUserConnect()
  {
    socket.emit('client.user.connect', {});
  }

  /**
   *
   * @param data
   */
  function serverUserNotify(data)
  {
    console.info(data);
  }

  // Public
  return {
    init: init,
    connect: clientUserConnect,
  };
})();