$(function() {

    var scroll_up = $('#scroll_up');

    $(document).scroll(function() {
        if ($(document).scrollTop() > 300) {
            scroll_up.addClass('show');
        } else {
            scroll_up.removeClass('show');
        }
    });

    scroll_up.on('click', function(e) {
        console.log(e);
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, '300');
    });

});