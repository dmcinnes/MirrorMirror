var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});
var exec = require('child_process').exec;

var sendToClients = function (message) {
  for (var i in wss.clients) {
    wss.clients[i].send(message);
  }
};

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
    sendToClients('refresh');
  },
  updateViewers: function (count) {
    sendToClients('viewers=' + count);
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

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
  console.log('got data', data);
  commands.updateViewers(data);
});

process.on('SIGINT', function() {
  console.log('exiting');
  // stop the stream so we can exit
  process.stdin.pause();
});
