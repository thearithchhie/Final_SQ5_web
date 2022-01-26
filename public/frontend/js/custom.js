'use strict';

(function(tomExample, $, undefined) {
    tomExample.tabs = {};

    tomExample.tabs.init = function() {
        if ($('.tabs__link').length) {
            $('.tabs__link').click(function(e) {
                e.preventDefault();
                var tabId = $(this).attr('data-tab-id'),
                    parent = $(this).closest('.tabs');

                // remove 'is-active' state from tab and content
                parent.find('.show').removeClass('show');
                // add new 'show' state
                $(this).addClass('show');

                $('#' + tabId).addClass('show');
            })
            $('.nav-link').click(function(e) {
                e.preventDefault();
                var tabId = $(this).attr('data-tab-id'),
                    parent = $(this).closest('.tabs');

                // remove 'is-active' state from tab and content
                parent.find('.active').removeClass('active');

                // add new 'active' state
                $(this).addClass('active');

                $('#' + tabId).addClass('active');
            })
        }

        if ($('.tab-control').length) {
            $('.tab-control').click(function(e) {
                e.preventDefault();
                var tabId = $(this).attr('data-tab-id'),
                    parent = $(this).closest('.tabs');

                // remove 'is-active' state from tab and content
                parent.find('.on').removeClass('on');

                // add new 'on' state
                $(this).addClass('on');

                console.log("Enter");

                $('#' + tabId).addClass('on');
            })
        }
    };
}(window.tomExample = window.tomExample || {}, jQuery));

tomExample.tabs.init();
