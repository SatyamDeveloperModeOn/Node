$(function() {
    $(window).scroll(function () {
       if ($(this).scrollTop() > 50) {
          $('nav').addClass('changeColor')
       }
       if ($(this).scrollTop() < 50) {
          $('nav').removeClass('changeColor')
       }
    });
 });