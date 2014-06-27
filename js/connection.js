var Connection = (function () {
  var socket;

  var events = {
    onopen:    function (e) {},
    onclose:   function (e) {},
    onerror:   function (e) {},
    onmessage: function (msg) {
      var command = msg.data;
      console.log(command);
      if (commands[command]) {
        commands[command].call();
      }
    }
  };

  var commands = {
    refresh: function () {
      window.location.reload();
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
