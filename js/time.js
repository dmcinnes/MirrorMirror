$(function() {

  moment.lang(lang);

  (function updateTime() {
     var now = moment();
     var date = now.format('LLLL').split(' ',4);
     date = date[0] + ' ' + date[1] + ' ' + date[2] + ' ' + date[3];

     $('.date').html(date);
     $('.time').html(now.format('hh') + ':' + now.format('mm') + '<span class="ampm">'+now.format('A')+'</span>');

     setTimeout(function() {
       updateTime();
     }, 1000);
   })();


});
