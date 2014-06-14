$(function () {
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

  var connect = function () {
    socket = new WebSocket('ws://localhost:8080/');
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

  var commands = {
    refresh: function () {
      window.location.reload();
    }
  };
});
