// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var width = 1600, height = 900, weight = 10;
var usernames = ['Blanche Neige', 'Gepeto', 'MacFly', 'Bamako', 'Jean-François Copé'];
var users = {};

io.on('connection', function (ioSocket) {
  var socket = ioSocket;

  // Sockets I/O
  (function io() {
    socket.on('client.user.connect', function() {
      socket.username = getAvailableUsername();
      users[socket.username] = {};
      socket.emit('server.game.load', { username : socket.username });
      socket.emit('server.user.notify', msg('Welcome ' + socket.username, 'info'));
      socket.broadcast.emit('server.user.notify', msg('User ' + socket.username + ' connected !', 'info'));
    });
    socket.on('disconnect', function () {
      delete users[socket.username];
      socket.broadcast.emit('server.user.notify', msg('User ' + socket.username + ' leaved !', 'info'));
    });
  })();

  // Sockets Game
  (function game() {
    socket.on('client.game.user.send.positions', function(positions) {
      if (socket.username) {
        users[socket.username].positions = positions;
      }
    });
    socket.on('client.game.user.receive.positions', function(data) {
      socket.emit('server.game.users.positions', users);
    });
  })();

  // Helpers
  function msg(content, type) {
    return { date: (new Date()).toString(), type: type, user: socket.username, message: content };
  }

  function getAvailableUsername() {
    var availableUsernames = usernames.diff(Object.keys(users)),
      randIndex = Math.floor(Math.random() * availableUsernames.length);

    return availableUsernames[randIndex];
  }
});

Array.prototype.diff = function(a) {
  return this.filter(function(i) { return a.indexOf(i) < 0; });
};


