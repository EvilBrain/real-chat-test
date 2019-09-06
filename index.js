var ent = require('ent'),
    http = require('http'),
    express = require('express');

app = express();
server = http.createServer(app);

app.get('/', function(req, res){
  res.render("index.ejs");
});


// loading of socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket, username){

    // As soon as user has given a nickname, we store it as a session variable and send it to all
    socket.on('new_user', function(username){
        // username = ent.encode(username);
        username = ent.encode(username);
        socket.username = username;
        socket.broadcast.emit('new_user', username);
    });

    // As soon as we receive a message, we recover the pseudo from its author and we send it to other people
    socket.on('message', function(message){
        message = ent.encode(message);
        // when a client connects, we note it to all clients
        socket.broadcast.emit('message', {username : socket.username, message: message});
    });

});

server.listen(1337);
