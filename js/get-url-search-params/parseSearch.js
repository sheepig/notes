function parseSearch(url) {
    var result = {};
    let arr = url.split('?');
    if (arr.length == 1) {
        return null;
    }
    let search = arr[1].split('&');
    for (var i = 0; i < search.length; i++) {
        var param = search[i].split('='); // 单个参数
        console.log('params:', param);
        
        if (param[0] == '') {
            return null;
        } else {
            result[param[0]] = decodeURI(param[1]);
        }
    }
    return result;
}