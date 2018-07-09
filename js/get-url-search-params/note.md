## 解析url search 参数

例如 `https://test.com/home?index=1&type=Art&city=%E5%B9%BF%E5%B7%9E&enable=` 解析结果：

```javascript
{
    index: 1,
    type: 'Art',
    city: '广州',
    enable: ''
}
```

```javascript
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
```