$(function() {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent);

    let fetch = function(url, type, data) {
        url = url || "/api/products";
        type = type || 'get';
        $.ajax({
            type: type,
            url: url,
            data: data,
            success: function(e) {
                console.log(e.data);
                display(e.data);
            }
        })
    }

    if (this.location.search != '') {
        let name = this.location.search.split('=')[1];
        $('#main #filter_goods').val(name);

        let data = { name: name }
            // console.log(data);
        fetch(null, null, data);
    }

    $('#search').on('click', () => {
        let name = '';
        name = $('#main #filter_goods').val().trim();
        let data = { name: name }
            // console.log(data);
        fetch(null, null, data);
    });

    $('#search_product').on('click', (e) => {
        e.preventDefault();
        let name = $('#gnb #filter_search').val().trim();
        let searchUrl = location.origin + '/search';
        location.href = searchUrl + '?name=' + name;
        // fetch(null, null, data);
    });

    $('#m_search').on('click', (e) => {
        let name = '';
        name = $('#search-container #m_filter_goods').val().trim();
        let data = { name: name }
        fetch(null, null, data);
    });

    let display = function(data) {
        let html = `<ul class="list">`;
        if (data && data.length) {
            for (let i = 0; i < data.length; i++) {

                if (isMobile) {
                    html += `
										<li>
											<div class="item">
												<div class="thumb">
													<a class="img" style="background-image: url(&quot;https://img-cf.kurly.com/shop/data/goods/1617331435965l0.jpg&quot;);">
														<img src="${data[i].media[0]['url']}" alt="5 Fruits to Enjoy" onerror="this.src='https://res.kurly.com/mobile/img/1808/img_none_x2.png'">															
													</a>
															<div class="group_btn">
																	<button type="button" class="btn btn_cart">
																		<span class="screen_out">
																			<font style="vertical-align: inherit;">
																				<font style="vertical-align: inherit;">69394</font>
																			</font>
																		</span>
																	</button>
																</div>
															</div> 
															<a class="info">
																<span class="name">
																	<font style="vertical-align: inherit;">
																		<font style="vertical-align: inherit;">${ data[i].name }</font>
																	</font>
																</span> 
																<span class="cost">
																	<span class="price">
																		<font style="vertical-align: inherit;">
																			<font style="vertical-align: inherit;">${ data[i].price } won</font>
																		</font>
																	</span>
																</span> 
																<span class="tag"></span>
															</a>
														</div>
													</li>
												`;
                } else {
                    html += `
													<li>
														<div class="item">
															<div class="thumb">
																<a class="img" style="">
																	<img src="${data[i].media[0]['url']}" alt="5 Fruits to Enjoy" onerror="this.src='https://res.kurly.com/mobile/img/1808/img_none_x2.png'">															
																</a>
																<div class="group_btn">
																	<button type="button" class="btn btn_cart">
																		<span class="screen_out">
																			<font style="vertical-align: inherit;">
																				<font style="vertical-align: inherit;">69394</font>
																			</font>
																		</span>
																	</button>
																</div>
															</div> 
															<a class="info">
																<span class="name">
																	<font style="vertical-align: inherit;">
																		<font style="vertical-align: inherit;">${ data[i].name }</font>
																	</font>
																</span> 
																<span class="cost">
																	<span class="price">
																		<font style="vertical-align: inherit;">
																			<font style="vertical-align: inherit;">${ data[i].price } won</font>
																		</font>
																	</span>
																</span> 
																<span class="desc">
																	<font style="vertical-align: inherit;">
																		<font style="vertical-align: inherit;">${ data[i].description }</font>
																	</font>
																</span> 
																<span class="tag"></span>
															</a>
														</div>
													</li>
												`;
                }
            }

            html += '</ul>';
        } else {
            html = 'not data';
        }

        $('.inner_listgoods').html(html);
    }
});