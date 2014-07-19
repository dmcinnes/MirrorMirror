$(function() {

  var $elements = $('.date,.time').hide();

  var updateTime = function () {
    var now = moment();
    var date = now.format('LLLL').split(' ', 4);
    date = date[0] + ' ' + date[1] + ' ' + date[2] + ' ' + date[3];

    $('.date').html(date);
    $('.time').html(now.format('h') + ':' + now.format('mm') + '<span class="ampm">'+now.format('A')+'</span>');
  };

  setTimeout(function() {
    updateTime();
  }, 1000);

  Mirror.listen({
    show: function () {
      $elements.fadeIn(1000);
    },
    hide: function () {
      $elements.fadeOut(1000);
    }
  });

});
