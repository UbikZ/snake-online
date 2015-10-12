var Socket = function(_socket, _snakeInstance) {
  'use strict';

  var snakeInstance = _snakeInstance;
  var socket = _socket;

  socket.on('server.user.notify', serverUserNotify);
  socket.on('server.game.load', serverGameLoad);
  socket.on('server.game.users.positions', serverGameUsersPositions);

  /**
   *
   */
  function clientUserConnect() {
    socket.emit('client.user.connect', {});
  }

  /**
   *
   * @param positions
   */
  function send(positions) {
    socket.emit('client.game.user.send.positions', positions);
  }

  /**
   *
   */
  function listen()
  {
    socket.emit('client.game.user.receive.positions', {});
  }

  /**
   *
   * @param users
   */
  function serverGameUsersPositions(users) {
    var temp = [];
    for (var username in users) {
      if (users.hasOwnProperty(username) && username != snakeInstance.username) {
        temp.push(users[username].positions);
      }
    }

    Game.positions = temp;
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

  /**
   *
   * @param data
   */
  function serverGameLoad(data) {
    snakeInstance.name = data.username;
  }

  // Public
  return {
    connect: clientUserConnect,
    send: send,
    listen: listen,
  };
};