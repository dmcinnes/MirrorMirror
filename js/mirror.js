var Mirror = (function () {
  var HIDE_TIMEOUT = 5000;
  var listeners = [];
  var viewerCount = 0;
  var timer;
  var showing = false;

  var notify = function (what) {
    console.log(what);
    for (var i = 0; i < listeners.length; i++) {
      listeners[i][what].call(listeners[i]);
    }
  };

  var show = function () {
    clearTimeout(timer);

    if (!showing) {
      showing = true;
      notify('show');
    }
  };

  var hide = function () {
    clearTimeout(timer);

    if (showing) {
      timer = setTimeout(function () {
        showing = false;
        notify('hide');
      }, HIDE_TIMEOUT);
    }
  };

  return {
    updateViewers: function (count) {
      if (count === viewerCount) {
        return;
      }

      if (count > 0) {
        show();
      } else {
        hide();
      }
      viewerCount = count;
    },

    listen: function (callbacks) {
      listeners.push(callbacks);
    }
  };
})();
