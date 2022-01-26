var isSearching = false;
// now using with product
function loadDataPagination(page) {
  $.ajax({
      url: '?page=' + page,
      type: 'GET',
      beforeSend: function () {
        $('.load-ajax').show();
      }
    })
    .done(function (data) {
      if (data.html == "") {
        $('.load-ajax').html('No more record found ):');
        return;
      }
      $('.load-ajax').hide();
      $('#list').append(data.html);
    })
    .fail(function (jqXHR, ajaxOptions, thrownError) {
      console.log('Server error occured');
    });
}
var page = 1;
$(window).scroll(function () {
  if ($(window).scrollTop() + $(window).height() >= $(document).height() && !isSearching) {
    page++;
    loadDataPagination(page);
  }
});