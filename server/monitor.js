var watchr = require('watchr');
var spawn = require('child_process').spawn;

var argv = process.argv.slice(2);
var debug = argv[0] === '--debug';

var server;

var spawnServer = function () {
  server = spawn('node', ['server.js']);
  if (debug) {
    server.stdout.on('data', function (data) {
      console.log(data.toString().trim());
    });
  }
};

watchr.watch({
  path: '..',
  followLinks: false,
  listener: function (changeType, filePath, fileCurrentStat, filePreviousStat) {
    if (debug) {
      console.log(changeType, filePath);
    }
    if (server) {
      server.kill();
    }
    spawnServer();
  }
});

spawnServer();
