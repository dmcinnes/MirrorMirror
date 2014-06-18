var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});

var restarted = true;

wss.on('connection', function(socket) {
  socket.on('message', function(message) {
    console.log('received: %s', message);
  });
  if (restarted) {
    restarted = false;
    socket.send('refresh');
  }
});
