var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});
var exec = require('child_process').exec;

var commands = {
  shutdown: function (socket) {
    exec('sudo shutdown now', function (error, stdout, stderr) {
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.log(stderr);
      }
    });
  },
  refresh: function () {
    for (var i in wss.clients) {
      wss.clients[i].send('refresh');
    }
  }
};


var restarted = true;

wss.on('connection', function (socket) {
  console.log('connection');
  socket.on('message', function (message) {
    console.log('received: %s', message);
    if (commands[message]) {
      commands[message].call();
    }
  });
  if (restarted) {
    restarted = false;
    commands.refresh();
  }
});
