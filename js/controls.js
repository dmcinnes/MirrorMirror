$(function () {
  if (/ip(hone|od|ad)/i.test(navigator.userAgent) ||
      window.location.hash === '#controls') {
    var shutdown = $('<a/>', {href:'#'}).addClass('command').text('Shut Down');
    shutdown.click(function (e) {
      e.preventDefault();
      if (window.confirm('Are you sure?')) {
        Connection.send('shutdown');
      }
    });
    var refresh = $('<a/>', {href:'#'}).addClass('command').text('Refresh');
    refresh.click(function (e) {
      e.preventDefault();
      Connection.send('refresh');
    });
    $('.bottom').append(shutdown, refresh);
  }
});
