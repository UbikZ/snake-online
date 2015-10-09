var Game = Game || {};

Game.Socket = (function () {
  'use strict';

  var socket = io();

  /**
   *
   */
  function init() {
    socket.on('server.user.notify', serverUserNotify)
  }

  /**
   *
   */
  function clientUserConnect() {
    socket.emit('client.user.connect', {});
  }

  /**
   *
   * @param data
   */
  function serverUserNotify(data) {
    switch (data.type) {
      default:
      case 'info':
        toastr.info(data.message);
        break;
      case 'warning':
        toastr.warning(data.message);
        break;
      case 'error':
        toastr.error(data.message);
        break;
    }
  }

  // Public
  return {
    init: init,
    connect: clientUserConnect,
  };
})();