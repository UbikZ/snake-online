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

var usernames = ['Blanche Neige', 'Gepeto', 'MacFly', 'Bamako', 'Jean-François Copé'];
var users = {};

io.on('connection', function (ioSocket) {
  var socket = ioSocket;
  // Sockets binding
  (function io() {
    socket.on('client.user.connect', function() {
      socket.username = getAvailableUsername();
      users[socket.username] = {};
      console.info('New user ' + socket.username + ' !');
      socket.emit('server.user.notify', msg('Welcome ' + socket.username, 'info'));
      socket.broadcast.emit('server.user.notify', msg('User ' + socket.username + ' connected !', 'info'));
    });
    socket.on('disconnect', function () {
      delete users[socket.username];
      socket.broadcast.emit('server.user.notify', msg('User ' + socket.username + ' leaved !', 'info'));
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


