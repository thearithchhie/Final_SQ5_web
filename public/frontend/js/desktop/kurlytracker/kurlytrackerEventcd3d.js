/**
 * 앱분기처리 필요
 * @type {{sendData: sendData, urlCheck: urlCheck}}
 */
var trackerEvent = (function(global) {
    var webStatus = global.appResult;

    /**
     * @type {
     *   key | string : value | stirng
     *   keyword : string ( page check url) | boolean ( false )
     *   screenName : string (필수값)
     *   skip : boolean
     *   eventName : string
     * }
     */
    var EVENTPAGE = [
        {
            keyword: 'kurlyEvent.php?htmid=event/join', // 신규회원
            screenName: 'sign_up_benefit', // important
            skip: webStatus.is_sess, // 비회원 일때만 보냄
            eventName: 'view_event_detail'
        },
        {
            keyword: 'event/kurly.htm&name=friend', // 친구초대
            screenName: 'friend_invitation',
            eventName: 'view_event_detail',
        },
        {
            keyword: 'event/kurly.htm&name=lovers', // 러버스
            screenName: 'membership_guide',
            skip: !webStatus.is_sess, // 회원 일때만 보냄
            eventName: 'view_event_detail'
        },
        {
          keyword: 'event/kurlyEvent.php?htmid', // 이벤트 페이지
          screenName: 'event_detail',
          eventName: 'view_event_detail'
        },
        {
            keyword: false, // 기타
            screenName: 'event_detail'
        }
    ];

    var _setTrackerEvent = {
        /**
         * 페이지 렌더링시 이벤트 전달
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
                    break; // view_event_detail 중복 호출 방지
                }
            }

            if(count === 0){
                setPage = EVENTPAGE[iLen];
                this.sendAmplitude(EVENTPAGE[iLen])
            }

            this.shareEvent(setPage);
        },
        /**
         * 특정 페이지의 공유하기 이벤트 전달
         * @param data | Object
         */
        shareEvent: function(data){
            var that = this;

            $(document).on('click', '[data-opt]', function() {
                data.channel = $(this).data('opt');
                that.sendAmplitude(data, 'share_event');

                if(data.screenName === 'friend_invitation'){ // 친구초대 이벤트 공유하기
                    that.sendAppGA(); // app용
                    that.sendBranch(); // branch용
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
                    // _eventName = share; 5월 배포시에 아래 분기처리 제거필요
                    // 안드로이드 2.20.0 이하 인경우 invite_friends로 보내야함.
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
