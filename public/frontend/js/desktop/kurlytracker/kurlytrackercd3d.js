/**
 * ��ɸ�
 * var KurlyTracker = kurlyTracker.getTracker()
 * : �ش� ��ġ���� ���� ���� (logo �̺�Ʈ�� ��������Ǿ�, �ش� ��ġ ����( & �� �б� ó�� �����ʿ�)
 * ��ũ����������
 * : KurlyTracker.setScreenName('category')
 * �ǳ��� ������Ʈ
 * : KurlyTracker.setTabName('category');
 * �̺�Ʈ �߻�
 * : KurlyTracker.setAction(_event_name, _action_data).sendData();
 * �̺�Ʈ �߻� ������, ������ �����Ͱ� ���� ���
 *
 * : KurlyTracker.setAction(_event_name).sendData();
 * �̺�Ʈ���� ���� �ʿ��� ���(�̺�Ʈ �߻��� Ư�� �̺�Ʈ�� �߻�)
 * : KurlyTracker.setEventInfo(_event_info);
 *
 * : KurlyTracker.setUserProperties(data);
 *  userProperties ���� ���� 1ȸ�� ���� �ϸ� ��
 *
 * : KurlyTracker.sendUserProperties(data);
 * ���������� ����
 */
// KM-1483 Amplitude ����
var kurlyTracker = (function(global) {
  var SSID = 'amplitudeBucket';
  var SSBID = 'amplitudeBrowseBucket';
  var mobileOsApp = mobileOsAppCheck(global.webStatus);
  var cmd = '';

  // utils
  function createUid(){
    function s4() {
      return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  /**
   * �۹���üũ : '2.19.2','205.19.0'
   * @param {object} window.webStatus
   * @returns {null|string} string I or A
   */
  function mobileOsAppCheck(app){
    if(typeof app === 'undefined' || typeof app.verCheck === 'undefined'){
      return null;
    }
    if(
      app
      && app.appDevice === 'I'
      && (Number(app.verCheck[0]) > 205 || Number(app.verCheck[1]) >= 19)
    ) {
      return app.appDevice;
    }

    if(
      app
      && app.appDevice === 'A'
      && (
        (Number(app.verCheck[0]) > 2 || Number(app.verCheck[1]) >= 20)
        || (Number(app.verCheck[1]) == 19 && Number(app.verCheck[2]) >= 2 )
      )
    ){
      return app.appDevice;
    }
    return null;
  }

  /**
   * @param { category : string | name : string | data : object }
   * category�� screen_name �϶��� data ����
   * category�� event �϶��� data ����
   * : app������ data�� �־ ��� ���ϴ� ��� ������, �׷���� data ���� �־ ����� ����
   *
   front �������� ó�� �ؾ� �ϴ� ����
   // ��ǰ �ı� ��
   screen_name : product_review_detail,
   event_name :  view_review_detail
   *
   * @param sendAppData : https://kurly0521.atlassian.net/wiki/spaces/MKA/pages/890011902
   * {category: String , data: Object } or {category: String , name : String data: Object }
   */
  function sendApp(sendAppData){
    var jsonData = JSON.stringify(sendAppData)
    if(mobileOsApp === 'I'){
      global.webkit.messageHandlers.behaviorEvent.postMessage(jsonData);
    }else{
      global.Android.handleBehaviorEvent(jsonData);
    }
  }


  // ���������ϱ�(SSID, SSBID)
  function saveSessionStorage(data, key) {
    var storageKey = key ? key : SSID;
    global.sessionStorage.setItem(storageKey, JSON.stringify(data));
  }
  // ����� ���� ��������(SSID, SSBID)
  function getSessionStorage(key, defaultData){
    var storedData = defaultData ? defaultData : {};
    try {
      var _storedData = global.sessionStorage.getItem(key)
      if (_storedData) {
        storedData = JSON.parse(_storedData)
      }
    } catch(e) {
      console.log(e)
    }
    return storedData;
  }


  // constants
  /**
   * �ش� NAME�� �ִ� ��쿡�� �ش� ���� ����(SSID, SSBID)�� ����
   */
  var BROWSE_TARGET = { // browse_screen_name
    TAB_NAME: [
      'home', 'category', 'search', 'my_kurly'
    ],
    SCREEN_NAME: [
      'category',
      'search',
      'my_kurly',
      'recommendation',
      'new_product',
      'popular_product',
      'bargain',
      'event_list',
      'category_product_list',
      'search_product_list',
      // 'product_list', // KM-5133 browser_screen_name���� product_list ����
      'order_history',
      'my_reviewable_list',
      'my_review_history',
      'recipe_detail',
      'kurly_pass_guide'
    ],
    EVENT_NAME: [ // browse_event_name
      'select_home_tab',
      'select_category_tab',
      'select_search_tab',
      'select_my_kurly_tab',
      'select_recommendation_subtab',
      'select_new_product_subtab',
      'select_popular_product_subtab',
      'select_bargain_subtab',
      'select_event_list_subtab',
      'select_category',
      'select_search',
      'select_event_list_banner',
      'select_frequently_purchase_product_list',
      'select_main_logo',
      'select_category_banner',
      'select_category_subtab'
    ],
    EVENT_INFO: [ // browse_event_info
      'select_event_list_banner',
      'select_search',
      'select_category',
      'select',
      'select_category_banner',
      'select_category_subtab'
    ],
    SIGN_UP: 'sign_up',
    LOGIN: 'login'
  }

  var storedBucket = getSessionStorage(SSID, {});

  /**
   * {
     *  tab_name: {String} browse_tab_name,
      event_name: {String} browse_event_name,
      event_info: {String} browse_event_info,
     * }
   */
  var browseData = getSessionStorage(SSBID, {});

  /**
   * ����� ������ webStatus ���� production or development ���� ��������
   */
  function isProduction() {
    return global.webStatus ? global.webStatus.is_release_build : false
  }

  var bucketData = {
    browse_id: storedBucket.browse_id || createUid(), // Ž��������(browse_id) `������ �� ����` �� ������Ʈ
    screen_name: storedBucket.screen_name || null,
    previous_screen_name: storedBucket.previous_screen_name || null,
    sign_up_source_screen_name: storedBucket.sign_up_source_screen_name || null,
    is_release_build: storedBucket.is_release_build || isProduction(),
    browse_screen_name: storedBucket.browse_screen_name || null,
    browse_tab_name: storedBucket.browse_tab_name || null,
    browse_event_name: storedBucket.browse_event_name || null,
    browse_event_info: storedBucket.browse_event_info || null,
  };

  var actionData = {};

  function objectAssign(obj){
    var object = {};
    for(var key in obj){
      object[key] = obj[key];
    }
    return object
  }

  var _kurlyTracker = {
    /**
     * kurly tracker instance �����б�
     */
    getTracker: function() {
      return this
    },

    /**
     * ���� ���� ���� ����
     */
    setUserProperties: function(userProperties) {
      if (typeof amplitude === 'undefined') {
        console.error('amplitude is not defined!!!');
        return false;
      }

      var sessionData = getSessionStorage('amplitudeUserProperties', {'cust_no': -1});

      if (typeof userProperties.cust_no !== 'undefined' && sessionData.cust_no !== userProperties.cust_no) {
        if (userProperties.cust_no > 0) {
          amplitude.getInstance().setUserProperties(userProperties);
        } else {
          amplitude.getInstance().clearUserProperties();
        }
        saveSessionStorage(userProperties, 'amplitudeUserProperties');
      } else if (typeof userProperties.center_code !== 'undefined' && userProperties.center_code !== '') {
        // KM-5133 CC�ڵ� �߰�
        amplitude.getInstance().setUserProperties(userProperties);
      }
    },

    /**
     * get actoin
     */
    getAction: function() {
      return objectAssign(actionData) // Object.assign({}, actionData)
    },

    /**
     * get bucket
     */
    getBucket: function() {
      return objectAssign(bucketData) //Object.assign({}, bucketData);
    },

    /**
     * set action
     * @param {String} name action name
     * @param {Object} _action action data
     */
    setAction: function(_event_name, _action){
      if(!mobileOsApp){
        this.setEventName(_event_name);
        if(!_action){
          actionData = {};
          return this;
        }
      }
      switch(_event_name){
        case 'purchase_success' : // �����ϱ� ���� ����(�����Ϸ�)
          // User Properties Update
          if(!mobileOsApp) {
            this.sendUserProperties(_action.userPropertiesData);
          }

          // event
          actionData = {
            transaction_id : _action.ordno,
            is_first_purchase : _action.is_first,
            purchase_tag : 'purchase',
            payment_method : _action.payment_method,
            total_price : _action.total_price,
            delivery_type : _action.delivery_type,
            sku_count : _action.payment_products.length,
            total_origin_price : _action.total_origin_price,
            delivery_charge : _action.delivery_charge,
            coupon_discount_amount : _action.coupon_use_price,
            point_discount_amount : _action.point_discount_amount,
            is_direct_purchase : _action.is_direct_purchase,
            coupon_id : null,
            coupon_name : null,
            product_discount_amount : _action.product_discount_amount,
          };
          if(mobileOsApp){
            actionData.purchase_products = _action.payment_products;
          }
          if(_action.is_first === true){
            actionData.purchase_tag = 'first_purchase';
          }
          if(_action.coupon_id !== ''){
            actionData.coupon_id = _action.coupon_id
          }
          if(_action.coupon_name !== ''){
            actionData.coupon_name = _action.coupon_name
          }
          break;
        case 'purchase_product' : // ������ ������ ��ǰ�� ���� ����
          // User Properties Update
          if(!mobileOsApp) {
            this.sendUserProperties(_action.userPropertiesData);
          }
          actionData = _action.item;
          break;
        case 'select_product' : // ��ǰ ��Ͽ��� ��ǰ�� ������ ���(*��ǰ �� �������� �����Ǵ� Ŭ�� ��ư)
        case 'select_product_shortcut' : // ��ǰ ��Ͽ��� ��ǰ ���� ȭ������ �̵��ϴ� īƮ ��ư Ŭ��
          actionData = {
            server_sort_type:  _action.server_sort_type,
            default_sort_type: _action.default_sort_type || '',
            selection_sort_type: _action.selection_sort_type || '',
            is_soldout : _action.sold_out,
            position : _action.position + 1,
            origin_price : _action.original_price,
            price : _action.price,
            package_id : _action.no,
            package_name : _action.name,
          };

          // KM-4988 �˻� ȭ���� ���� ��ǰ�� �������� ��
          if (typeof _action.search.keyword !== 'undefined'
              && _action.search.keyword !== '') {
            actionData.package_count = _action.search.packageCount;
            actionData.keyword = _action.search.keyword;
          }

          break;
        case 'view_product_detail' : // ��ǰ �� ȭ�� ��ȸ
          actionData = {
            package_id : _action.no,
            package_name : _action.name,
            is_soldout: _action.is_sold_out,
            origin_price: _action.original_price,
            price: _action.discounted_price,
          }
          break;
        case 'select_purchase' : // ��ǰ �� ȭ�鿡�� '��ٱ���' ��ư Ŭ��
          actionData = {
            package_id: _action.no,
            package_name: _action.name,
            is_soldout: _action.is_sold_out,
            origin_price: _action.original_price,
            price: _action.discounted_price,
          }
          break;
        case 'view_product_selection' : // ��ǰ�󼼿��� ��ٱ��ϴ�� ���̾�
          actionData = {
            package_id: _action.no,
            package_name: _action.name,
            referrer_event: _action.referrer_event
          }
          break;
        case 'view_review_detail' : // ��ǰ �ı� ��
          /**
           * ��Ű���� ������ �ֹ��ϴ� ��� ��ǰ �ı��ۼ��� �ı�� ���� ����.
           */
          actionData = {
            position : _action.position,
            has_image : _action.thumbnail_image_url ? true : false,
            is_best : _action.is_best ? true : false,
            package_id : _action.product_no,
            package_name : _action.product_name,
            product_id : _action.product_no,
            product_name : _action.product_name,
            user_grade : _action.user_grade,
            origin_price : _action.original_price,
            price : _action.price
          };
          if(typeof _action.parent_product_no !== 'undefined'){
            actionData.package_id = _action.parent_product_no;
            actionData.package_name = _action.parent_product_name;
            actionData.product_id = _action.product_no;
            actionData.product_name = _action.product_name;
          }
          if(typeof _action.type !== 'undefined' && _action.type === 1){
            actionData.is_best = true;
          }
          break;
        case 'add_to_cart_success' :  // ��ٱ��� ��� ���� ����
          var i, lenAction = _action.length, original_price = 0, discounted_price = 0;
          for(i = 0; i < lenAction; i++){
            if(i === 0){
              actionData = {
                package_id: _action[i].parent_id,
                package_name: _action[i].parent_name,
                is_direct_purchase: _action[i].is_buy_now,
                sku_count: lenAction,
                total_origin_price: 0,
                total_price: 0,
              }
            }
            original_price += Number(_action[i].original_price) * Number(_action[i].ea);
            discounted_price += Number(_action[i].discounted_price) * Number(_action[i].ea);
          }
          actionData.total_origin_price = original_price;
          actionData.total_price = discounted_price;
          break;
        case 'add_to_cart_product' :  // ��ٱ��� ��� ���� API ���� �� ���� �ٷα��Ŵ� ��ư Ŭ�� �� ����
          actionData = {
            is_direct_purchase: _action.is_buy_now,
            package_id: _action.parent_id,
            package_name: _action.parent_name,
            product_id: _action.no,
            product_name: _action.parent_name,
            origin_price: _action.original_price,
            price: _action.discounted_price,
            quantity: _action.ea,
            total_origin_price: _action.original_price * _action.ea,
            total_price: _action.discounted_price * _action.ea,
          }
          if(_action.is_package){
            actionData.product_id = _action.product_no;
            actionData.product_name = _action.name;
          }
          break;
        case 'add_to_cart_fail' : // ��ٱ��� ��� ���� ����
          actionData = {
            message : _action
          }
          break;
        case 'invite_friends' :
          actionData.is_eventCheck = true;
          break;
        // case 'remove_cart_product_success': // ��ٱ��� ���������� ����ó����
        //   actionData = {
        //     is_soldout: _action.sold_out,
        //     origin_price: _action.original_price || null,
        //     price: _action.price || null,
        //     package_id: _action.no || null,
        //     package_name: _action.name,
        //     product_id: _action.no || null,
        //     product_name: _action.name,
        //     quantity: _action.ea || 0,
        //     selection_type : _action.type
        //   }
        //   if(_action.is_package){ // �θ����� ����
        //     actionData.package_id = _action.parent_no || null;
        //     actionData.package_name = _action.parent_name;
        //   }
        //   break;
        case 'sign_up_success' :
        case 'view_sign_up' :
          /**
           * todo back-end���� �Ϸ�� : 'ȸ�� ����' ȭ�� ���Կ� �⿩�� ȭ�� �̸��߰� �ʿ�
           * @type {string}
           */
          actionData.sign_up_source_screen_name = '';
          break;
        default :
          actionData = _action;
          break;
      }

      /**
       * action_data�� ���� ������Ʈ�Ŀ� �ۿ� ���� �ʿ�
       */
      if(mobileOsApp){
        sendApp({category:'event', name: _event_name, data: actionData});
      }

      return this;
    },

    /**
     * set bucket
     * @param {Object} _bucket bucket data
     */
    setBucket: function(_bucket) {
      if (_bucket === null) {
        throw new Error('��Ŷ�� null�̵Ǹ� �ȵ˴ϴ�.');
      }

      var _transaction_id = _bucket.transaction_id;

      var _screen_name = _bucket.screen_name;

      /**
       * �Ʒ� 3���� browseData �� ���� �ϰ� send �� bucket �� ������Ʈ�Ѵ�.
       */
      var _tab_name = _bucket.tab_name;
      var _event_name = _bucket.event_name;
      var _event_info = _bucket.event_info;

      browseData = {
        tab_name: _tab_name,
        event_name: _event_name,
        event_info: _event_info,
      };

      bucketData.previous_screen_name = bucketData.screen_name;
      bucketData.screen_name = _screen_name;


      if (_transaction_id) {
        bucketData.transaction_id = _transaction_id;
      }

      if(_screen_name !== BROWSE_TARGET.SIGN_UP && _screen_name !== BROWSE_TARGET.LOGIN) {
        bucketData.sign_up_source_screen_name = _screen_name;
      }

      saveSessionStorage(bucketData);
      return this;
    },

    setScreenName: function(_screen_name) {
      cmd = 'setScreenName : ' + _screen_name;

      if(bucketData.screen_name !== null && bucketData.screen_name !==_screen_name){
        bucketData.previous_screen_name = bucketData.screen_name;
      }

      bucketData.screen_name = _screen_name;

      if(_screen_name !== BROWSE_TARGET.SIGN_UP && _screen_name !== BROWSE_TARGET.LOGIN) {
        bucketData.sign_up_source_screen_name = _screen_name;
      }

      if(mobileOsApp){
        sendApp({category:'screen_name', name:_screen_name});
      }

      if(BROWSE_TARGET.SCREEN_NAME.indexOf(bucketData.screen_name) > -1){
        bucketData.browse_screen_name = bucketData.screen_name;
      }

      saveSessionStorage(bucketData);
      return this;
    },

    setEventName: function(_event_name) {
      cmd = 'setEventName : ' + _event_name;
      bucketData.event_name = _event_name;
      browseData.event_name = _event_name;

      saveSessionStorage(bucketData);
      saveSessionStorage(browseData, SSBID);
      return this;
    },

    setTabName: function(_tab_name) {
      cmd = 'setTabName : ' + _tab_name;
      bucketData.browse_tab_name = _tab_name;
      browseData.tab_name = _tab_name;

      saveSessionStorage(bucketData);
      saveSessionStorage(browseData, SSBID);
      return this;
    },

    setEventInfo: function(_event_info) {
      cmd = 'setEventInfo : ' + _event_info;
      browseData.event_info = _event_info;

      saveSessionStorage(browseData, SSBID);
      return this;
    },

    /**
     * amplitude ������?
     */
    sendData: function() {
      if(mobileOsApp){
        return false;
      }
      // amplitude ������
      sendAmplitude()
      function sendAmplitude() {
        /**
         * payload�� actionData�� bucketData�� ���ļ� amplitude�� ������.
         */
        var payload = actionData;

        for(var key in bucketData){
          // bucket property �߿� null�� ���� ������
          if(bucketData[key] !== null){
            payload[key] = bucketData[key];
          }
          if(bucketData.screen_name !== BROWSE_TARGET.SIGN_UP && bucketData.screen_name !== BROWSE_TARGET.LOGIN && typeof payload.sign_up_source_screen_name !== 'undefined') {
            delete payload.sign_up_source_screen_name;
          }
        }
        // console.log('event_name : ' ,bucketData.event_name)
        // console.table(payload)
        global.amplitude.getInstance().logEvent(bucketData.event_name, payload);
      }

      /**
       * ���� �Ŀ� bucket�� browse property ������Ʈ �ϱ�
       */
      this._setBrowseData()
    },
    /**
     * User Properties Update
     * @param data : Object
     */
    sendUserProperties: function(data){
      amplitude.getInstance().setUserProperties(data);
    },
    /**
     * setBrowseData
     */
    _setBrowseData: function() {
      // browse_id [������Ʈ]
      // script�� uuid ����
      // 1) add_to_cart_success �̺�Ʈ �߻�
      // 2) �� ���� ��
      // 3) todo �α���/�α׾ƿ� �� (php���� �ϴ°� ������ ������...)
      if (browseData.event_name === 'add_to_cart_success') {
        bucketData.browse_id = createUid()
      }

      if(BROWSE_TARGET.SCREEN_NAME.indexOf(bucketData.screen_name) > -1){
        bucketData.browse_screen_name = bucketData.screen_name;
      }

      if (BROWSE_TARGET.TAB_NAME.indexOf(browseData.tab_name) > -1) {
        if(bucketData.browse_tab_name !== browseData.tab_name){
          bucketData.browse_screen_name = null;
          if(BROWSE_TARGET.SCREEN_NAME.indexOf(bucketData.screen_name) > -1){
            bucketData.browse_screen_name = bucketData.screen_name;
          }
        }
        bucketData.browse_tab_name = browseData.tab_name;
      }

      if (browseData.event_name) {
        if (
          BROWSE_TARGET.EVENT_NAME.indexOf(browseData.event_name) > -1 ||
          isSectionName(browseData.event_name)
        ) {
          bucketData.browse_event_name = browseData.event_name;
          bucketData.browse_event_info = null;
        }

        if (
          BROWSE_TARGET.EVENT_INFO.indexOf(browseData.event_name) > -1 ||
          isSectionName(browseData.event_name)
        ) {
          if (browseData.event_info) {
            bucketData.browse_event_info = browseData.event_info;
          }
        }
      }

      function isSectionName(target) {
        var doNotInclude = 'select_recommendation_subtab';
        var sectionPrefix = 'select_recommendation_';
        var isInclude = doNotInclude === target;
        var result = target.slice(0, 22) === sectionPrefix;

        return isInclude ? false : result
      }

      saveSessionStorage(bucketData);
    },
    /**
     * direct App Send data
     * @param data : https://kurly0521.atlassian.net/wiki/spaces/MKA/pages/890011902
     * {category: String , data: Object } or {category: String , name : String data: Object }
     */
    directAppAction: function(data){
      sendApp(data);
    }
  }
  return _kurlyTracker
})(window);

var KurlyTracker = kurlyTracker.getTracker();


// �ֹ��� ����
var KurlyTrackerOrder = function(section, type, property){
  var eventName = '', actionData = {};
  switch(section) {
    case 'folding':
      // type => true/false => open/close
      eventName = 'select_expand_button';
      actionData = {
        section: property
      }
      break;
    case 'receiver':
      if(type === 'success'){
        eventName = 'submit_shipping_address_success';
      }else if(type === 'fail'){
        eventName = 'submit_shipping_address_fail';
      }else if(type === 'sameClick'){
        eventName = 'select_same_customer_information_button';
      }else if(type === 'sameCheck'){
        eventName = 'impression_same_customer_information_button';
      }
      if (typeof property !== 'undefined') {
        actionData = {
          message: property
        }
      }
      break;
    case 'reception':
      eventName = type === 'success' ? 'submit_pick_up_location_success' : 'submit_pick_up_location_fail';
      if (typeof property !== 'undefined') {
        actionData = {
          message: property
        }
      }
      break;
    case 'destination':
      eventName = 'select_shipping_address_setting';
      actionData = {
        selection_type: type === 'pass' ? '�̹������' : '�⺻�����'
      }
      break;
    case 'reusable':
      if(type === 'selectPackingType') {
        eventName = 'select_packing_type';
        actionData = property;
      }
      break;
    default:
      break;
  }
  KurlyTracker.setAction(eventName, actionData).sendData();
}

// ��ũ ó��
var KurlyTrackerLink = function(link, eventName, actionData, option) {
  if (typeof actionData === 'undefined') {
    actionData = {};
  }

  KurlyTracker.setAction(eventName, actionData).sendData();

  if (typeof option !== 'undefined' && option.openWindow) {
    window.open(link, '_blank');
  } else {
    window.location.href = link;
  }
}
