var watchr = require('watchr');
var spawn = require('child_process').spawn;

var server;

var spawnServer = function () {
  server = spawn('node', ['server.js']);
};

watchr.watch({
  path: '..',
  listener: function () {
    if (server) {
      server.kill();
    }
    spawnServer();
  }
});

spawnServer();
