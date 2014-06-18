jQuery.fn.updateWithText = function(text, speed) {
  var dummy = $('<div/>').html(text);

  if ($(this).html() != dummy.html())
    {
      $(this).fadeOut(speed/2, function() {
        $(this).html(text);
        $(this).fadeIn(speed/2, function() {
          //done
        });
      });
    }
};

jQuery.fn.outerHTML = function(s) {
  return s ? this.before(s).remove()
    : jQuery("<p>").append(this.eq(0).clone()).html();
};
