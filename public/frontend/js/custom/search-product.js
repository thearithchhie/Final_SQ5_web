var tokenValue = $("meta[name='csrf-token']").attr('content');
$('#search_product').on('click', function(event) {
    event.preventDefault();
    var serachQuery = $('#filter_search').val();
    $.ajax({
        type: 'POST',
        url: '/products/search/',
        dataType: 'json',
        data: {
            '_token': tokenValue,
            serachQuery: serachQuery,
        },
        success: function(res) {
            isSearching = true;
            let tableRow = res.map(function(row, index) {
                let srcImage = '/storage/app/public/' + row.media[0].id + "/" + row.media[0].file_name;
                return `
            <li>
              <div class="item">
                <div class="thumb">
                  <a class="img" href="" title="" style = "">
                    <img src="${srcImage}" id="product_image_search">
                  </a>
                  <div class="group_btn">
                    <button type="button" class="btn btn_cart" data-toggle="modal" data-target="#cart_modal"
                      id="">
                      <span class="screen_out">
                        <font style="vertical-align: inherit;">
                          <font style="vertical-align: inherit;">78355</font>
                        </font>
                      </span>
                    </button>
                  </div>
                </div>
                <a class="info">
                  <span class="name">
                    <font style="vertical-align: inherit;">
                      <font style="vertical-align: inherit;">${row.name}</font>
                    </font>
                  </span>
                
                  <span class="original">
                      <font style="vertical-align: inherit;">
                        <font style="vertical-align: inherit;" class="font-weight-bold">${row.price}</font>
                      </font>
                    </span>
                    
                    <span class="original">
                      <font style="vertical-align: inherit;">
                        <font style="vertical-align: inherit;" class="text-danger">${row.discount_price}</font>
                      </font>
                    </span>
                    <span class="cost">
                      <span class="original">
                        <font style="vertical-align: inherit;">
                        <font style="vertical-align: inherit;">${row.price}</font>
                        </font>
                      </span>
                    </span> 
                  
                
                  <span class="desc">
                    <font style="vertical-align: inherit;">
                      <font style="vertical-align: inherit;">${row.description}</font>
                    </font>
                  </span>
                </a>
              </div>
            </li>`;
            });
            $('#list').html(tableRow);
        }
    })
});

$('#filter_search').on('keyup', function() {

    let value = $(this).val();
    if (value == '') {
        isSearching = false;
    }

    // console.log(value, isSearching)
})