Array.prototype.chunk = function (num) {
    var result = [];
    for (var i = 0, len = this.length; i < len; i += num) {
        var part = this.slice(i, i + num);
        if ( ! part.length) {
            break;
        }
        result.push(part);
    }
    return result;
};
function address_chk_popup(){
    frmMakeLayer('/shop/proc/popup_address2.php?isMobile=true&gubun=mobile','searchZipcode','',false);
}

function showCartResult (message) {
    var d = new Date();
    var timeNum = d.getHours().toString()+d.getMinutes().toString()+d.getSeconds().toString();
    return Layer.create('<div class="cart-add-content" style="background-image:url(https://res.kurly.com/mobile/etc/designgj/images/common/ico_cart_v3.gif?ver='+timeNum+')">'+message+'</div>');
}

function showCartResultSuccess (num) {
    var key = 'cartMessage' + +new Date;
    window[key] = showCartResult([
        '<p class="cart-add-success-message">������ ��ǰ�� ��ٱ��Ͽ� ��ҽ��ϴ�.</p>',
        //'<p>���� �� 11�� ���� �ֹ� �� ���� ���� 7�ñ��� ���!</p>',
        '<div class="layer_btn2">\
            <button type="button" class="btn" onclick="window[\''+key+'\'].close();"><span class="txt_type">��� �����ϱ�</span></button>\
            <a href="/m2/goods/cart.php" class="btn lst"><span class="txt_type">��ٱ��� Ȯ��</span></a>\
        </div>'
    ].join("\n"));
    return window[key];
}

function frmMakeLayer (url) {

    if(/popup_address/g.test(url)) {
        var $iframe = $('<iframe src="'+url+'" frameborder=0></iframe>').css({
            'width': '97%',
            'height' : '100%'
        });

        var $wrapper = $('<div>').addClass('layout-layer-popup-scroller').addClass('address_scroll').append($iframe);
    } else {
        var $iframe = $('<iframe src="'+url+'" frameborder=0></iframe>').css({
            'width': '97%'
        });

        var $wrapper = $('<div>').addClass('layout-layer-popup-scroller').append($iframe);
    }

    var layer = Layer.create($wrapper);

    window.addressPopup = layer;
    var mapCheck = '/shop/proc/popup_address.php';
    var mapCheck2 = '/shop/proc/popup_address2.php';

    layer.$container.css('width', '95%');
    layer.$container.css('height', '100%');
    if(url.indexOf(mapCheck) === -1 && url.indexOf(mapCheck2) === -1){
        layer.$container.css('padding', '10px');
    }else{
        layer.$wrapper.css('padding','0');
        layer.$container.css('padding','0');
        layer.$container.find('iframe').width('100%');
        if(url.indexOf(mapCheck2) !== -1){
            // $('.btn_close1').hide();
        }
    }
    layer.$wrapper.css('height', '95%');

    $(".layout-layer-popup-close-button").hide();

    $iframe.on('load', function () {
        var h = $iframe.contents().find('body > :visible').outerHeight(true);
        $iframe.add($wrapper).css('height', layer.$container.height() + 'px');
        //    var iscroll = new IScroll(layer.$container[0], {
        //      mouseWheel: true,
        //      click: true,
        //      scroll: true
        //    });
    });
}

var touchMoving = false;
document.ontouchmove = function(e)
{
    touchMoving = true;
}

document.ontouchend = function(e)
{
    touchMoving = false;
}

function isLocalStorageNameSupported()
{
    var testKey = 'test';
    try
    {
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
        return typeof window.localStorage === 'object';
    }
    catch (error)
    {
        return false;
    }
}


// ��� ���������� �����ϴ� ��ũ��Ʈ ����
jQuery(function ($) {

    var cart_switch = 'on'; //�ߺ� ��ٱ��� ����

    // ���� ���� ��ũ��Ʈ
    $(document).on('click', '.layout-ordering-content .layout-content-header', function (event) {
        event.preventDefault();
        $(this).parent().toggleClass('__active');
    })
    .on('click', function (event) {
        if (touchMoving) {
            event.preventDefault();
        }
    })

    .on('click', '[data-goods-action]', function (event) {
        var $this = $(this);
        switch ($this.data('goods-action')) {
            case 'cart':
            case 'wishlist':
                event.preventDefault();

                //�ߺ� ��ٱ��� ����(S)
                if( cart_switch == 'off' ){
                    alert('���� ó�����Դϴ�. ��ø� ��ٷ��ּ���.');
                    return false;
                }
                cart_switch = 'off';
                setTimeout(function(){
                    cart_switch = 'on';
                }, 1500);
                //�ߺ� ��ٱ��� ����(E)

                var
                    $optionModifyItemList = $('<div />'),
                    GOODSNO = $this.data('goodsno'),
                    ITEM_HTML = '<div class="origin-option-modify-layer-item"><span class="title"></span><span class="content"></span></div>';
                if ($this.data('goods-action') === 'wishlist' && $this.hasClass('__active')) {
                    $.ajax({
                        "url" : "/m2/goods/ajaxAction.php",
                        "type" : "post",
                        "dataType" : "json",
                        "data" : {
                            "mode" : "delWishlist",
                            "goodsno" : GOODSNO
                        },
                        //"dataType" : "json",
                        "success" : function(data) {
                            var key = 'successMessage' + (+ new Date);
                            window[key] = showCartResult('<p>' +  data.msg + '</p>\
                            <div class="layer_btn1">\
                                <button type="button" class="btn" onclick="window[\''+key+'\'].close();"><span class="txt_type">Ȯ��</span></button>\
                            </div>');
                            $this.removeClass('__active');
                        }
                    });
                } else if($this.data('goods-action') === 'wishlist' && !GD_ISMEMBER){ //��ȸ�� �α��� ������ ó��
                    if(confirm('�α����� �̿밡���մϴ�. \n�α��� �Ͻðڽ��ϱ�?')){
                        location.href = '/m2/mem/login.php?return_url=' + encodeURIComponent(location.href)
                    }
                } else {
                    $.ajax({
                        "url" : "/m2/proc/mAjaxAction.php",
                        "type" : "post",
                        "dataType" : "json",
                        "data" : {
                            "mode" : "get_option",
                            "type" : $this.data('goods-action'),
                            "goodsno" : GOODSNO,
                            'is_html' : true
                        },
                        //"dataType" : "json",
                        "success" : function(data) {
                            switch (data.mode) {
                                case 'option':
                                    Layer.create(data.html);
                                    $('.layout-layer-popup').addClass('layer_wishlist');
                                    break;
                                case 'success':
                                    var key = 'successMessage' + (+ new Date);
                                    window[key] = showCartResult('<p>' +  data.msg + '</p>\
                                    <div class="layer_btn1">\
                                        <button type="button" class="btn" onclick="window[\''+key+'\'].close();"><span class="txt_type">Ȯ��</span></button>\
                                    </div>');
                                    break;
                                case 'wishlist_success':
                                    var key = 'successMessage' + (+ new Date);
                                    window[key] = showCartResult('<p>' +  data.msg + '</p>\
                                    <div class="layer_btn1">\
                                        <button type="button" class="btn" onclick="window[\''+key+'\'].close();"><span class="txt_type">Ȯ��</span></button>\
                                    </div>');
                                    if (data.success) {
                                    }
                                    break;
                            }

                        }
                    });
                }
                break;
            case 'stocknoti':
                if (!GD_ISMEMBER) {
                    if(confirm("ȸ������ ���� �Դϴ�. �α���/ȸ������ �������� �̵��Ͻðڽ��ϱ�?")) {
                        document.location.href = "/m2/mem/login.php?return_url="+encodeURIComponent(location.href);
                    }
                    return;
                }

                if (+$this.data('runout') === 0) {
                    alert('ǰ���� ��ǰ�� ���԰� �˸���û�� �����մϴ�!!');
                    return;
                }
                if (+$this.data('usestocknoti') === 0) {
                    alert('���԰� �˸��� �Ұ����� ��ǰ�Դϴ�!\n�����Ϳ� ���ǹٶ��ϴ�!');
                    return;
                }
                $.get('/m2/goods/request_stocked_noti.php', {'goodsno': $this.data('goodsno')}, function (response) {
                    if (~response.indexOf("alert")) {
                        alert(response.replace(/^(.*?alert\(')(.*?)('\).*?)$/, '$2'));
                    } else {
                        window.reqNotice = Layer.create(response);
                    }
                });
                break;
        }
    });



    // ��� ��ǰ ���ϱ�/���԰� �˸� ��û���
    function createGoodsSlideMenu () {
        $('.goods-sidemenu-wrapper').each(function () {
            var $this = $(this);
            // var $menuItem = $this.data('goods-menu');
            if (!$this.data('goods-menu')) {

                var $menuItem = new IScroll(this.parentNode, {
                    mouseWheel: false,
                    click: false,
                    scrollX: false,
                    scrollY: false,
                    preventDefault: false
                });

                var wrapperWidth = $this.width();
                var wrapperHeight = $this.height();

                $menuItem.on('scrollEnd', function (e) {
                    //alert('???');
                    this.options.preventDefault = false;
                    if (Math.abs(this.distY / wrapperHeight) > .1) {
                        return;
                    }



                    if ((this.distX / wrapperWidth) > .15) {
                        this.options.preventDefault = true;
                        $this.find('.goods-tpl-item-menu').addClass('__active');
                    }
                    if (-(this.distX / wrapperWidth) > .15) {
                        $this.find('.goods-tpl-item-menu').removeClass('__active');
                    }
                });
                $this.data('goods-menu', $menuItem);

            }
        });
    }

    createGoodsSlideMenu();

    window.createGoodsSlideMenu = createGoodsSlideMenu;

    // ��۾ȳ� ������, ȸ������������ �� �ּҰ˻�â �ݱ� ��ư ��ġ ����
    var isLayerCloseBtnCheck = false;
    var LAYER_CLOSE_BTN_CHECK = [
      '/m2/event/kurlyEvent.php?htmid=event/delivery_search/delivery_search',
      '/m2/mem/join.php',
      'm2/myp/menu_list.php'
    ];
    for(var i = 0; i < LAYER_CLOSE_BTN_CHECK.length; i++){
      if( location.href.indexOf(LAYER_CLOSE_BTN_CHECK[i]) !== -1){
        isLayerCloseBtnCheck = true;
      }
    }

    // ���̾��˾� �Լ�
    function Layer ( content ) {
      var closeBtnName = isLayerCloseBtnCheck ? 'btn_delivery_close' : 'btn_close1';
        this.$layer = jQuery('<div class="layout-layer-popup">').hide();
        this.$wrapper = jQuery('<div class="layout-layer-popup-wrapper">').appendTo(this.$layer);
        this.$container = jQuery('<div class="layout-layer-popup-container">').appendTo(this.$wrapper);
        this.$closeButton = jQuery('<button class=' + closeBtnName + '>').html('�ݱ�').on('click', this.close.bind(this)).appendTo(this.$container);
        this.$layer.on('click remove', this.close.bind(this));
        this.$container.on('click', function (event) {
            event.stopPropagation();
        });
        this.$container.append( content );
        fixedControl.on();
        this.$layer.appendTo( 'body' ).fadeIn(500);
    }

    Layer.prototype.close = function () {
        fixedControl.off();
        this.$layer.hide().remove();
    }

    Layer.create = function ( content ) {
        return new Layer( content );
    };

    window.Layer = Layer;

    // ���� ó��
    var fixedControl = {
        $wrapper: $('#wrap'),
        $window: $(window),
        currentScroll: 0,
        on: function () {
            this.currentScroll = this.$window.scrollTop();
            this.$wrapper.css('overflow-y', 'hidden');
            this.$wrapper.scrollTop(this.currentScroll);
        },
        off: function () {
            this.$wrapper.css('overflow-y', '');
            this.$window.scrollTop(this.currentScroll);
        }
    };

    // ���������� ī�װ� ����
    var $subCategoryHeader = $('#sub-category-open-header');
    if ($subCategoryHeader.length) {
        var $subCategoryLayer = $('#sub-category-layer');
        var SUBCATEGORY_FADETIME = 250;

        $subCategoryHeader.on('click', '.overlay_cate', function (event) {
            event.preventDefault();
            $subCategoryLayer.fadeIn(SUBCATEGORY_FADETIME);
            fixedControl.on();
        });
        $subCategoryLayer.on('click', function () {
            fixedControl.off();
            $subCategoryLayer.fadeOut(SUBCATEGORY_FADETIME);
        });
    }


    // �˻� ����
    var $searchmenu = $('#search-menu');
    if ($searchmenu.length) {
        var $searchBody = $searchmenu.find('.layer_search');
        var $searchInput = $('#sword');
        var $searchResult = $('#search-result-area');
        var $searchKeyword = $('#search-keyword-area');
        var $searchKeywordDelete = $('#searchDelete');
        var $searchTab = $('#search-keyword-tab');
        var $searchContent = $searchmenu.find('.layout-search-content')
        var $searchForm = $('#search-form');
        var $searchScroller = $searchmenu.find('.layout-search-wrapper');
        var eventCheckCount = true;
        var $searchTrackingData = {};

        var searchControl = {
            off: function (type) {
                if (! $searchResult.is(':visible') || type === 'keep') {
                    $searchmenu.removeClass('__active');
                }

                // KM-2184 : cs : ���̾������ �Է��ؽ�Ʈ ����
                if(type !== 'keep'){
                    $searchResult.hide();
                    $searchKeyword.show();
                    $searchInput.val('');
                }

                initSearchContentHeight();
                fixedControl.off();
                trackingDataSearch('close', false);
            },
            on: function () {
                $searchmenu.addClass('__active');
                initSearchContentHeight();
                fixedControl.on();
            }
        };
        $searchInput.on('keyup keydown', function(){
            if($('#edit').val() !== 'Y') $('#edit').val('Y');
            searchDeleteCheck();
        });

        // KM-2184 : cs : �Է��ؽ�Ʈ ����
        $searchKeywordDelete.on('click', function(){
            $searchResult.hide();
            $searchKeyword.show();
            $searchInput.val('');
            searchDeleteCheck();
        });
        function searchDeleteCheck(){ // �˻�â �ؽ�Ʈ �ְų� ������ ��üũ
            if($searchInput.val()){
                if(!$searchKeywordDelete.hasClass('on')){
                    $searchKeywordDelete.addClass('on');
                }
            }else{
                if($searchKeywordDelete.hasClass('on')){
                    $searchKeywordDelete.removeClass('on');
                }
            }
        }

        $('#search-area-close').on('click', function (event) {
            event.preventDefault();
            searchControl.off('keep');
        });

        $("#search-area-open").on('click', function () {
            // KM-1483 Amplitude
            trackingDataSearch('set');

            searchControl.on();
            // ��õ �˻�� �ִ� ��츦 ����ؼ� �˻����� ��� �ִ� ��쿡�� focus()
            if($(".inp_search").val() == '') {
                if (appWebCheck !== "ios" && deviceCheck !== "ios") $(".inp_search").focus();
            }
            searchDeleteCheck();
        });

        $searchmenu.on('click', function (event) {
            if ( $(event.target).closest($searchBody).length === 0 ) {
                if(!eventCheckCount) return;
                searchControl.off('keep');
            }
        });

        function KeywordStorage (name, maxLength, saveCallback) {
            this.name = name;
            this.maxLength = maxLength;
            this.useLocalStorage = isLocalStorageNameSupported();
            this._fakeStorage = '[]';
            this.storage = JSON.parse((this.useLocalStorage ? (window.localStorage[this.name] || this._fakeStorage) : this._fakeStorage));
            this.saveCallback = saveCallback;
            this.save();
        }

        KeywordStorage.prototype.save = function () {
            if (this.storage.length > this.maxLength) {
                this.storage.splice(0, this.storage.length - this.maxLength);
            }
            (this.useLocalStorage ? (window.localStorage || this._fakeStorage) : this._fakeStorage)[this.name] = JSON.stringify(this.storage);
            this.saveCallback && this.saveCallback.call(this);
        };

        KeywordStorage.prototype.push = function (value) {
            if (~this.indexOf(value)) {
                this.delete(this.indexOf(value));
            }
            if ($.trim(value) === '') {
                return;
            }
            this.storage.push(value);
            this.save();
        };

        KeywordStorage.prototype.getArray = function () {
            return this.storage;
        };

        KeywordStorage.prototype.indexOf = function (value) {
            return this.storage.indexOf(value);
        };

        KeywordStorage.prototype.delete = function (index) {
            this.storage.splice(index, 1);
            this.save();
        };

        var $earlySearchTemplate = $('#search-early-item-template').html();
        var $earlyKeywordList = $('#early-keyword-list');

        var kws = new KeywordStorage('early-keyword', 10, function () {
            $earlyKeywordList.empty();
            for (var dataArray = this.getArray(), i = dataArray.length; i--;) {
                var template = $earlySearchTemplate.replace(/#\{keyword\}/g, dataArray[i]);
                $earlyKeywordList.append( template.replace(/#\{index\}/g, i) );
            }
        });

        function initSearchContentHeight () {
            var $windowHeight = window.screen.height * 0.4;
            var $realHeight = 135//($windowHeight - $searchForm.height() - $searchTab.height() - 50);
            $searchBody.css('max-height', $windowHeight + 'px');
            $searchScroller.each(function () {
                //$(this).height( ($(window).height() / 2) - $searchForm.height() - $searchTab.height() - 50 );
                var $this = $(this);
                if ($this.height() > $realHeight || !$this.height()) {
                    $this.css('height', $realHeight + 'px');
                } else {
                    $this.css('height', $this.height() + 'px');
                }
                if (!$this.data('IScroll')) {
                    $this.data('IScroll', new IScroll(this, {
                        mouseWheel: true,
                        click: true
                    }));
                }
                $this.data('IScroll').refresh();
            });
        }

        $(window).on('resize load', initSearchContentHeight);

        $searchTab.on('click', '.tab_search', function (event) {
            event.preventDefault();
            var $this = $(this);
            var $showContent = $($this.attr('href'));
            if ($showContent.length && !$this.hasClass('__active')) {
                //$searchmenu.find('.__active').removeClass('__active');
                $showContent.addClass('__active');
                $showContent.siblings('.__active').removeClass('__active');
                $this.closest('.layout-search-tab').find('.__active').removeClass('__active');
                $this.addClass('__active');
                initSearchContentHeight();
            }
        })

        $searchmenu.on('click', '[data-keyword]', function (event) {
            event.preventDefault();
            var $this = $(this);
            $searchInput.val($this.data('keyword'));

            // KM-1483 Amplitude
            $searchTrackingData = {
                selection_type : $this.data('style'),
                keyword : $this.data('keyword'),
                package_id : null,
                package_name : null,
                position :$this.parent().index() + 1,
            }
            // END : KM-1483 Amplitude

            $searchForm.trigger('submit');
        });

        $searchmenu.on('click', '#early-keyword-list .btn_del', function (event) {
            event.preventDefault();
            //$(this).closest('.layout-search-early-item').remove();

            if(eventCheckCount){
                eventCheckCount = false;
                kws.delete( $(this).data("index") );
                setTimeout(function(){
                    eventCheckCount = true;
                },1000);
            }
        });

        var $searchResultItemTemplate = $('#search-result-item-template').html();
        var $searchResultNoItemTemplate = $('#search-result-no-item-template').html();
        var $searchResultList = $('#search-result-list');
        var $searchXhr = null;
        var searchTimer = null;

        //$searchForm.on('submit', function ($e) {
        /**
         * @function
         * @description $searchInput�� �Է��� �˻�� �˻��Ѵ�. �Է¾� �߿� ���� / ������ ĳġ�� ��� ��û�� ������ �ʴ´�.
         * @since 2020.09.15
         * @author kurly-jhlim
         */
        function searchEvent () {
            // �Է��� �˻�� ������� �ϼ����� ���� �ѱ��� ���Խ����� �ɷ����� ����� ��û���� �ƴ����� �Ǵ��ϴ� Boolean�� ������ �����Ѵ�.
            var searchKeyword = $searchInput.val();
            if (searchKeyword.trim()) {
                searchDeleteCheck();
                clearTimeout(searchTimer);
                if ($searchXhr !== null) {
                    $searchXhr.abort();
                }
                searchTimer = setTimeout(function () {
                    // cancelRequest�� true�� ��� ��û�� ����ϰ� setTimeout�� clear �Ѵ�.
                    var reg = new RegExp(/([^0-9\uAC00-\uD7A3a-z\x20]$)/i);
                    var cancelRequest = reg.test(searchKeyword);
                    if (cancelRequest) {
                      return clearTimeout(searchTimer);
                    }
                    $searchXhr = $.getJSON('/m2/proc/mAjaxAction.php', {'mode': 'search_keyword', 'kw': searchKeyword}, function (searchResult) {
                        $searchResultList.empty();

                        if(searchResult === null) {
                          return false;
                        }

                        if (!searchResult.length) {
                            $searchResultList.append($searchResultNoItemTemplate);
                        }
                        $.each(searchResult, function (index, data) {
                            var template = $searchResultItemTemplate;
                            template = template.replace(/#\{goodsno\}/g, data.no);
                            template = template.replace(/#\{goodsnm\}/g, data.name);
                            $searchResultList.append(template);
                        });

                        if(searchKeyword.trim()){
                            $searchResult.show();
                            $searchKeyword.hide();
                        }else{
                            $searchResult.hide();
                            $searchKeyword.show();
                        }
                        initSearchContentHeight();

                        searchTimer = $searchXhr = null;

                        $searchResultList.find('a').on('click', function(e){
                            // KM-1483 Amplitude
                            e.preventDefault();
                            var $this = $(this);
                            $searchTrackingData = {
                                selection_type : 'suggestion_product',
                                keyword : searchKeyword,
                                package_id : $this.data('no'),
                                package_name : $this.text(),
                                position : $this.parent().index() + 1,
                            }
                            trackingDataSearch('result', $searchTrackingData);
                            // End : KM-1483 Amplitude

                            location.href = $this.attr('href');
                        });
                    });
                },500);
            } else {
                $searchResult.hide();
                $searchKeyword.show();
            }

        }
        $searchInput.on('input', searchEvent);
        $searchForm.on('submit', saveRecentSearchKeyword);
    }

    function saveRecentSearchKeyword() {
        if ($searchInput.val().trim()) {
            // KM-1483 Amplitude
            if( typeof $searchTrackingData.selection_type === 'undefined'){
                $searchTrackingData = {
                    selection_type : 'keyword',
                    keyword : $searchInput.val(),
                    package_id : null,
                    package_name : null,
                    position : null,
                }
            }
            trackingDataSearch('result', $searchTrackingData);
            // END : KM-1483 Amplitude
            kws.push($searchInput.val());
        }
        return true;
    }

    function preventDefault (event) {
        event.preventDefault();
    }

    // ��Ӵٿ� ����� ����� ���������� ��� : �ֹ�����, �ֹ�����
    $('.box_type .btn_view').on('click', function(e){
        e.preventDefault();
        if(!$(this).parents('.box_type').hasClass('on')){
            $(this).parents('.box_type').addClass('on');
            $(this).parents('.box_type').find('.box_view').slideDown(100);
        }else{
            $(this).parents('.box_type').removeClass('on');
            $(this).parents('.box_type').find('.box_view').slideUp(100);
        }
    });


    // �˻�
    /**
     * �˻� ���̾� �׳� �ݴ� ���
     * screen_name : �˻����̾� ��� ������ screen_name
     * browse_tab_name : �˻����̾� ��� ������ tab_name
     * previous_screen_name : 'search'
     * sign_up_source_screen_name : 'search'
     * browse_event_name : 'select_search_tab'
     * event_name : null
     * @param type
     * @param data
     */
    var searchPrevBucket = {};
    function trackingDataSearch(type, _action_data){
        if(type === 'set'){
            searchPrevBucket = KurlyTracker.getBucket();
            // �˻��� ���̾�Ÿ������ �׳� ������ ���� �������� tab_name ���� ���� ������ �־����.
            KurlyTracker.setAction('select_search_tab').sendData();
            KurlyTracker.setScreenName('search').setTabName('search');
        }
        if(type === 'result'){
            KurlyTracker.setEventInfo(_action_data.selection_type);
            KurlyTracker.setAction('select_search', _action_data).sendData();
        }
        if(type === 'close'){
            KurlyTracker.setScreenName(searchPrevBucket.screen_name).setTabName(searchPrevBucket.browse_tab_name)._setBrowseData();
        }
    }
});
