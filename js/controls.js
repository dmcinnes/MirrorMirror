$(function () {
  if (/ip(hone|od|ad)/i.test(navigator.userAgent) ||
      window.location.hash === '#controls') {
    var shutdown = $('<input/>', {type: 'button', value: 'Shut Down'});
    shutdown.click(function (e) {
      Connection.send('shutdown');
    });
    var refresh = $('<input/>', {type: 'button', value: 'Refresh'});
    refresh.click(function (e) {
      Connection.send('refresh');
    });
    $('.bottom').append(shutdown, refresh);
  }
});
