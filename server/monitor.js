var fs     = require('fs');
var watchr = require('watchr');
var spawn  = require('child_process').spawn;

var argv = process.argv.slice(2);
var debug = argv[0] === '--debug';

var server;

console.log('hello!');

var spawnServer = function () {
  server = spawn('node', ['server.js'], {stdio: [0, 1, 2]});
};

watchr.watch({
  path: '..',
  followLinks: false,
  ignorePaths: ['../server/cam.pipe'],
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

process.on('SIGINT', function() {
  console.log('exiting...');
  // clean up the server
  server.kill();
  // exit
  process.exit();
});

spawnServer();
