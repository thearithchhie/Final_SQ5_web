
// 2021-05-13 상품상세 탭 고정 처리
window.addEventListener('load', function (){
    var $tab = document.querySelector('.goods-view-tab');
    if($tab){
        $tab.addEventListener('click', setTabAnchor);
        window.addEventListener('scroll', tabFixed);
    }
})

//Fixed product detail Tab
function tabFixed(){
    var $gnb = document.querySelector('#gnb.gnb_stop');
    var $layout = document.getElementById('goods-view-infomation'); //기준점

    if(!$layout || !$gnb) {
      return;
    }

    //Calculate ScrollTop
    var scrollTop = window.pageYOffset + $gnb.clientHeight;
    var $layoutTop = $($layout, window).offset().top;

    if(scrollTop > $layoutTop){
        setTapPosition();
    }else{
        setOriginPosition();
    }
}

//Fixing tabs naturally
function setTapPosition(){
    var $tab = document.querySelector('.goods-view-tab');
    var $layoutDesc = document.getElementById('goods-description');

    var isExistClass = $tab.classList.contains('fixed') || $layoutDesc.classList.contains('fixed_tab');
    if(isExistClass){
        return;
    }

    $layoutDesc.classList.add('fixed_tab');
    $tab.classList.add('fixed');
}

//Tab back to its original position
function setOriginPosition() {
    var $gnb = document.querySelector('#gnb.gnb_stop');
    var $tab = document.querySelector('.goods-view-tab');
    var $layoutDesc = document.getElementById('goods-description');
    $tab.removeAttribute('style');
    $gnb.removeAttribute('style');
    $tab.classList.remove('fixed');

    if($layoutDesc.classList.contains('fixed_tab')){
        $layoutDesc.classList.remove('fixed_tab');
    }
}

var selectedAnchor = '';
function setTabAnchor(e){
  e.preventDefault();
  var hash = e.target.closest('a').getAttribute('href');

  // KMF-369 hash가 null 일경우 error가 발생되어 아래 script가 정상작동 되지 않는 이슈가 확인되어 이슈 수정
  if(hash === selectedAnchor || hash === null) {
    return false;
  }
  selectedAnchor = hash;

  var $beforeItem = document.querySelector('.goods-view-infomation-tab-anchor.__active');

  $beforeItem.classList.remove('__active');
  e.target.closest('a').classList.add('__active');

  setScroll(hash);
  setAmplitude(hash);
}

function setScroll(hash) {
  var $container = $(hash);
  var gnbHeight = document.querySelector('#gnb').clientHeight;
  var tab = document.querySelector('.goods-view-tab');

  var scrollPosition = $container.offset().top - gnbHeight;

  if (!tab.classList.contains('fixed')) {
    scrollPosition -= tab.clientHeight;
  }

  $('html, body').animate({
      scrollTop: scrollPosition
  }, 500);
}

// KM-1483 Amplitude 연동
function setAmplitude(hash){
    var _event_name;
    switch(hash){
        case '#goods-description':
            _event_name = 'select_product_detail_description_subtab';
            break;
        case '#goods-infomation':
            _event_name = 'select_product_detail_info_subtab';
            break;
        case '#goods-review':
            _event_name = 'select_product_detail_review_subtab';
            break;
        case '#goods-qna':
            _event_name = 'select_product_detail_inquiry_subtab';
            break;
        default :
            break;
    }
    KurlyTracker.setAction(_event_name).sendData();
}
