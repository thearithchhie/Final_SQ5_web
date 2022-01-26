$(function() {
    $(document).on("click", ".js-menu-close", function() {
        $(".language-mobile").toggle();
    });

    $(document).on("click", ".lang-container", function() {
        $(".language-mobile").css({ 'display': 'block' });
    });
});