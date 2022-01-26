$(function() {
    $('.inner_sub ul li')
        .bind('mouseover', function() {
            $(this).addClass('current')
            $('.gnb_sub').css({
                overflow: 'unset'
            })
        })
        .bind('mouseleave', function() {
            $(this).removeClass('current')
            $('.gnb_sub').css({
                overflow: 'hidden'
            })
        })

    $('ul.sub_menu li').bind('mouseover', function() {
        $(this).removeClass('current')
        $('#gnb .gnb_sub .gnb_menu li:hover').css({
            width: '122px!important'
        })
    })

    $('.menu1').bind('mouseover', function() {
        $('.gnb_sub').css('display', 'block')
        $('.overlay').show()
    })

    $('.menu1').click(function() {
        $('.gnb_sub').toggle()
        $('.overlay').css({
            display: 'block'
        })
    })

    $('.overlay').click(function() {
        $('.gnb_sub').hide()
        $('.overlay').hide()
    })

    $('.gnb_sub').bind('mouseleave', function() {
        $('.gnb_sub').toggle()
    })

    $('.inner_sub ul li').click(function() {
        if ($(this).hasClass('current')) {
            $('#gnb .gnb_sub .recommend').css({
                padding: '0'
            })
            $('ul.sub_menu li').css({
                width: '25em!important'
            })

            $(this).removeClass('current')
            $('.gnb_sub').css({
                overflow: 'hidden'
            })
        } else {
            $(this).addClass('current')
            $('.gnb_sub').css({
                overflow: 'unset'
            })
        }
    })

    $(window).scroll(function(e) {
        var $el = $('.fixed-position');
        var isPositionFixed = $el.css('position') == 'fixed';
        if ($(this).scrollTop() > 200 && !isPositionFixed) {
            $el.css({ position: 'fixed', top: '0px' });
        }
        if ($(this).scrollTop() < 200 && isPositionFixed) {
            $el.css({ position: 'static', top: '0px' });
        }
    });
});