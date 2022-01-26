// ������ �޸�
Vue.filter("commaFilter",function(num){
    num = String(num);
    return num.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
});

// �ݿø� ó��  
Vue.filter("mathRoundFilter",function(num){
    return Math.round(num);
});

// ����� �ú���
Vue.filter("dateViewFilter",function(num,type){
    var date = new Date(num);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(String(month).length < 2) month = "0"+month;
    var day = date.getDate();
    if(String(day).length < 2) day = "0"+day;
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    if(type == 'short'){
        num = year.toString().substr(-2) + "." + month + "." + day;
    }else if(type == 'hhmm'){
        num = hours + '�� ' + minutes.substr(-2) + '��';
    }else if(type == 'notime'){
        num = year + "." + month + "." + day;
    }else if(type == 'kor'){
        num = year.toString().substr(-2) + "�� " + month + "�� " + day + "��";
    }else{
        num = year+"."+month+"."+day+" "+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }
    return num;
});

// ��â, ���� ó��  
Vue.filter("locationFilter",function(event, url){
    if(event.ctrlKey || event.button === 1){
        window.open(url);
    }else if(event.shiftKey){
        window.open(url, '', '_blank');
    }else{
        location.href = url;
    }
});