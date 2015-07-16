var Connection = (function () {
  var socket;

  var events = {
    onopen:    function (e) {},
    onclose:   function (e) {},
    onerror:   function (e) {},
    onmessage: function (msg) {
      var pair = msg.data.split('=');
      var command = pair[0];
      console.log(msg.data);
      if (commands[command]) {
        commands[command].call(commands, pair[1]);
      }
    }
  };

  var commands = {
    refresh: function () {
      window.location.reload();
    },
    viewers: function (count) {
      Mirror.updateViewers(parseInt(count, 10));
    },
    show: function () {
      Mirror.show();
    },
    hide: function () {
      Mirror.hide();
    }
  };

  var connect = function () {
    socket = new WebSocket('ws://'+window.location.hostname+':8080/');
    for (var eventName in events) {
      socket[eventName] = events[eventName];
    }
  };

  connect();

  setInterval(function () {
    if (socket.readyState === WebSocket.CLOSED) {
      connect();
    }
  }, 1000);

  return {
    send: function (command) {
      console.log('sending "' + command + '"');
      socket.send(command);
    }
  };
})();
