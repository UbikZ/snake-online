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

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    var date = new Date(),
      object = { date: date.toString(), username: socket.username, message: data };
    db.collection('messages').insert(object);
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', object);
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (loginObject) {
    if (numUsers < maxUsers) {
      var login = JSON.parse(loginObject),
        requestObject = { username: login.username, password: login.password };
      // we store the username in the socket session for this client
      socket.username = login.username;

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

      function userJoined(loginObject) {
        // add the client's username to the global list
        usernames[loginObject.username] = loginObject.username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', { username: socket.username, numUsers: numUsers });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', { username: socket.username, numUsers: numUsers });
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

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});