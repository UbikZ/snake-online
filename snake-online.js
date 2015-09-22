// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var db = require('mongoskin').db('mongodb://localhost:27017/snake_online');
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;
var maxUsers = 2;

// Game global
var gameStarted = false;
var usersReady = false;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    var object = { date: (new Date()).toString(), username: socket.username, message: data, admin: false };
    if (!parseCommands(data)) {
      db.collection('messages').insert(object);
      // we tell the client to execute 'new message'
      socket.broadcast.emit('new message', object);
    }
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (loginObject) {
    if (numUsers < maxUsers || gameStarted == true) {
      var login = JSON.parse(loginObject),
        requestObject = { username: login.username, password: login.password };
      if (usernames[login.username] == undefined) {

        // Session
        socket.username = login.username;
        socket.playerReady = false;

        var resultUser = db.collection('users').find({ username: login.username }).toArray(function(err, result) {
          if (err) throw err;
          if (Array.isArray(result) && result.length == 1) {
            console.info('OK User');
            var resultLogin = db.collection('users').find(requestObject).toArray(function(err, result) {
              if (err) throw err;
              if (Array.isArray(result) && result.length == 1) {
                console.info('OK User / OK Password');
                userJoined(login);
              } else {
                console.info('User auth failed');
                socket.emit('conn failed', { message: 'Authentication failed.' });
              }
            });
          } else {
            console.info('NOT OK user');
            db.collection('users').insert(requestObject);
            userJoined(login);
          }
        });
      } else {
        console.info('User ' + login.username + ' already connected.');
        socket.emit('conn failed', { message: 'You have already an instance launched.' });
      }
    } else {
      console.info('Max users reached.');
      socket.emit('conn failed', { message: 'Max users reached.' });
    }
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;
      if (socket.playerReady) --usersReady;
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

  // Functions

  function parseCommands(message) {
    if (message.indexOf('/') == 0) {
      var object = { date: (new Date()).toString(), username: 'ADMIN', admin: true };
      switch (message) {
        case '/start':
          if (socket.playerReady) {
            object.message = 'You are already ready !';
            socket.emit('new message', object);
          } else {
            socket.playerReady = true;
            usersReady++;
            object.message = 'Players: ' + usersReady + '/' + numUsers + ' are ready !';
            io.sockets.emit('new message', object);
          }
          break;
        case '/stop':
          if (socket.playerReady) {
            socket.playerReady = false;
            usersReady--;
            object.message = 'Players: ' + usersReady + '/' + numUsers + ' are ready !';
            io.sockets.emit('new message', object);
          } else {
            object.message = 'You are already not ready !';
            socket.emit('new message', object);
          }
          break;
        case '/help':
          object.message = 'Type "/start" to be ready, or "/stop" to interupt the queue.';
          socket.emit('new message', object);
          break;
        default:
          console.info(socket.playerReady);
          object.message = 'Bad command, type "/help" for more information.';
          socket.emit('new message', object);
          break;
      }

      return true;
    }
    return false;
  }

  function userJoined(loginObject) {
    usernames[loginObject.username] = loginObject.username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', { username: socket.username, numUsers: numUsers });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', { username: socket.username, numUsers: numUsers });
  }
});