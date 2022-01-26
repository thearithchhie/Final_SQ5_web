/**
 * �ۺб�ó�� �ʿ�
 * @type {{sendData: sendData, urlCheck: urlCheck}}
 */
var trackerEvent = (function(global) {
    var webStatus = global.appResult;

    /**
     * @type {
     *   key | string : value | stirng
     *   keyword : string ( page check url) | boolean ( false )
     *   screenName : string (�ʼ���)
     *   skip : boolean
     *   eventName : string
     * }
     */
    var EVENTPAGE = [
        {
            keyword: 'kurlyEvent.php?htmid=event/join', // �ű�ȸ��
            screenName: 'sign_up_benefit', // important
            skip: webStatus.is_sess, // ��ȸ�� �϶��� ����
            eventName: 'view_event_detail'
        },
        {
            keyword: 'event/kurly.htm&name=friend', // ģ���ʴ�
            screenName: 'friend_invitation',
            eventName: 'view_event_detail',
        },
        {
            keyword: 'event/kurly.htm&name=lovers', // ������
            screenName: 'membership_guide',
            skip: !webStatus.is_sess, // ȸ�� �϶��� ����
            eventName: 'view_event_detail'
        },
        {
          keyword: 'event/kurlyEvent.php?htmid', // �̺�Ʈ ������
          screenName: 'event_detail',
          eventName: 'view_event_detail'
        },
        {
            keyword: false, // ��Ÿ
            screenName: 'event_detail'
        }
    ];

    var _setTrackerEvent = {
        /**
         * ������ �������� �̺�Ʈ ����
         */
        initEvent: function(){
            var setPage, count = 0, pageUrl = decodeURIComponent(location.href), i, iLen = EVENTPAGE.length - 1;

            for(i = 0; i < iLen; i++){
                EVENTPAGE[i].url = pageUrl;
                if(EVENTPAGE[i].keyword && pageUrl.indexOf(EVENTPAGE[i].keyword) !== -1){
                    if(typeof EVENTPAGE[i].skip === 'undefined' || !EVENTPAGE[i].skip){
                        setPage = EVENTPAGE[i];
                        this.sendAmplitude(EVENTPAGE[i]);
                        count++;
                    }
                    break; // view_event_detail �ߺ� ȣ�� ����
                }
            }

            if(count === 0){
                setPage = EVENTPAGE[iLen];
                this.sendAmplitude(EVENTPAGE[iLen])
            }

            this.shareEvent(setPage);
        },
        /**
         * Ư�� �������� �����ϱ� �̺�Ʈ ����
         * @param data | Object
         */
        shareEvent: function(data){
            var that = this;

            $(document).on('click', '[data-opt]', function() {
                data.channel = $(this).data('opt');
                that.sendAmplitude(data, 'share_event');

                if(data.screenName === 'friend_invitation'){ // ģ���ʴ� �̺�Ʈ �����ϱ�
                    that.sendAppGA(); // app��
                    that.sendBranch(); // branch��
                }
            });
        },
        sendAmplitude: function(data, share){
            if(typeof data.screenName !== 'undefined' && typeof share === 'undefined'){
                KurlyTracker.setScreenName(data.screenName);
            }

            if(typeof data.eventName !== 'undefined'){
                var _eventName = data.eventName, _actionData = {url : data.url};
                if(share === 'share_event'){
                    // _eventName = share; 5�� �����ÿ� �Ʒ� �б�ó�� �����ʿ�
                    // �ȵ���̵� 2.20.0 ���� �ΰ�� invite_friends�� ��������.
                    if(data.screenName === 'friend_invitation' && webStatus && webStatus.appDevice === 'A'){
                        if(Number(webStatus.verCheck[0]) <= 2 && Number(webStatus.verCheck[1]) < 20){
                            _eventName = 'invite_friends';
                        }else{
                            _eventName = share;
                        }
                    }else{
                        _eventName = share;
                    }

                    _actionData = {
                        url: data.url,
                        channel: data.channel
                    };
                }

                if (document.referrer !== '') {
                  _actionData.previous_url = document.referrer;
                }

                KurlyTracker.setAction(_eventName, _actionData).sendData();
            }
        },
        sendBranch: function(){
            if(webStatus.appCheck) {
                return false;
            }

            if(typeof branch === 'undefined'){
                document.addEventListener("branchReady", function(){
                    branch.logEvent("SHARE", {"description": "INVITE_FRIENDS"});
                });
            }else{
                branch.logEvent("SHARE", {"description": "INVITE_FRIENDS"});
            }
        },
        sendAppGA: function(){
            if(!webStatus.appCheck) {
                return false;
            }

            var data = {'category': 'share', 'action': 'invite_friends'}
            data = JSON.stringify(data);
            if (webStatus.appDevice === 'IOS') {
                window.webkit.messageHandlers.gaEvent.postMessage(data);
            } else {
                Android.postEvent(data);
            }
        }
    }

    return _setTrackerEvent
})(window);

trackerEvent.initEvent();
