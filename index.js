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
      // todo: have to be uniq
      socket.username = 'Guest' + Math.floor(Math.random() * 100);
      console.info('New user ' + socket.username + ' !');
      socket.emit('server.user.notify', msg('Welcome ' + socket.username));
    });
    socket.on('disconnect', function () {
      // todo
    });
  })();

  // Helpers
  function msg(content) {
    return { date: (new Date()).toString(), user: socket.username, message: content };
  }
});


