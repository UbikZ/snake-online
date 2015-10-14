var Socket = function(_ws) {
  'use strict';

  var enabledSocketIO = typeof _ws != 'string';
  var socket = enabledSocketIO ? _ws : new WebSocket(_ws);

  if (enabledSocketIO) {
    socket.on('server.user.notify', serverUserNotify);
    socket.on('server.game.load', serverGameLoad);
    socket.on('server.game.users.positions', serverGameUsersPositions);
  } else {
    socket.addEventListener('open', function(e) {
      console.log('open', e);
    });
    socket.addEventListener('message', function(message) {
      var data = JSON.parse(message.data), type = data.type;
      if (type) {
        switch (type) {
          case 'server.user.notify':
            serverUserNotify(data.content);
            break;
          case 'server.game.load':
            serverGameLoad(data.content);
            break;
          case 'server.game.users.positions':
            serverGameUsersPositions(data.content);
            break;
          case 'server.game.users.directions':
            serverGameUsersDirections(data.content);
            break;
          default:
            toastr.error('Wrong data type received from WebServer !');
            break;
        }
      } else {
        toastr.error('No data type received from WebServer !');
      }
    });
  }


  /*
   *  Server methods
   */

  /**
   *
   * @param users
   */
  function serverGameUsersPositions(users) {
    var temp = [];
    for (var username in users) {
      if (username != Game.username) {
        temp[username] = users[username].positions;
      }
    }

    Game.missingSnakes = temp;
  }

  /**
   * @param users
   */
  function serverGameUsersDirections(users) {
    var temp = [];
    Game.directions = temp;
    for (var username in users) {
      if (username != Game.username) {
        temp[username] = users[username];
      }
    }

    Game.directions = temp;
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
    Game.username = data.username;
    Game.originSnakes = data.snakes;
  }

  /*
   *  Client methods
   */

  function clientUserConnect(positions) {
    socketEmit('client.user.connect', { positions: positions });
  }

  function sendPositions(positions) {
    socketEmit('client.game.user.send.positions', positions);
  }

  function sendDirection(direction) {
    socketEmit('client.game.user.send.direction', {direction : direction});
  }

  function listen()
  {
    socketEmit('client.game.user.receive.positions', {});
  }

  /*
   * Helpers
   */

  function socketEmit(type, content) {
    if (enabledSocketIO) {
      socket.emit(type, content);
    } else {
      waitConnection(socket, function() {
        socket.send(JSON.stringify({type: type, content: content}));
      });
    }
  }

  function waitConnection(socket, callback) {
    setTimeout(function() {
      if (socket.readyState == 1) {
        if (callback != null) {
          callback();
        }
      } else {
        waitConnection(socket, callback);
      }
    }, 5);
  }


  // Public
  return {
    connect: clientUserConnect,
    sendPositions: sendPositions,
    sendDirection: sendDirection,
    listen: listen,
  };
};