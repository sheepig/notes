参考： [前端常见跨域解决方案（全）](https://segmentfault.com/a/1190000011145364)

### 跨域的定义

广义的跨域： 

> 1.资源跳转： A链接、重定向、表单提交
> 2.资源嵌入： <link>、<script>、<img>、<frame>等dom标签，还有样式中background:url()、@font-face()等文件外链
> 3.脚本请求： js发起的ajax请求、dom和js对象的跨域操作等

其实我们通常所说的跨域是狭义的，是由浏览器同源策略限制的一类请求场景。

#### 什么是同源策略？
同源策略/SOP（Same origin policy）是一种约定，由Netscape公司1995年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。

同源策略限制以下几种行为：

> 1. Cookie、LocalStorage 和 IndexDB 无法读取
> 2. DOM 和 Js对象无法获得
> 3. AJAX 请求不能发送

### 常见跨域

```
URL                                      说明                    是否允许通信
http://www.domain.com/a.js
http://www.domain.com/b.js         同一域名，不同文件或路径           允许
http://www.domain.com/lab/c.js

http://www.domain.com:8000/a.js
http://www.domain.com/b.js         同一域名，不同端口                不允许
 
http://www.domain.com/a.js
https://www.domain.com/b.js        同一域名，不同协议                不允许
 
http://www.domain.com/a.js
http://192.168.4.12/b.js           域名和域名对应相同ip              不允许
 
http://www.domain.com/a.js
http://x.domain.com/b.js           主域相同，子域不同                不允许
http://domain.com/c.js
 
http://www.domain1.com/a.js
http://www.domain2.com/b.js        不同域名                         不允许
```

### 跨域解决方案

1、 通过jsonp跨域
2、 document.domain + iframe跨域
3、 location.hash + iframe
4、 window.name + iframe跨域
5、 postMessage跨域
6、 跨域资源共享（CORS）
7、 nginx代理跨域
8、 nodejs中间件代理跨域
9、 WebSocket协议跨域

#### 通过jsonp跨域

通常为了减轻web服务器的负载，我们把js、css，img等静态资源分离到另一台独立域名的服务器上，在html页面中再通过相应的标签从不同域名下加载静态资源，而被浏览器允许，基于此原理，我们可以通过动态创建script，再请求一个带参网址实现跨域通信。


##### js

```javascript
<script>
    var script = document.createElement('script');
    script.type='text/javascript';
    script.src = 'http://localhost:3001/info?user=admin&callback=onBack';
    document.head.appendChild(script);
    function onBack(res) {
        alert(JSON.stringify(res));
    }
</script>
```

##### client && server

```javascript
// client
const http = require('http');
const fs = require('fs');

var server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    fs.createReadStream(`${__dirname}/index.html`).pipe(res);
}).listen(3000);

console.log('client on port 3000');
```

```javascript
const http = require('http');
const url = require('url');

var server = http.createServer();

server.on('request', (req, res) => {
    var params = url.parse(req.url).query;
    var query = {};
    paramList = params.split(/\s*&\s*/);
    for (let i = 0; i < paramList.length; i++) {
        let obj = {};
        let params = paramList[i].split(/\s*=\s*/);
        obj[params[0]] =  params[1] ? params[1] : null;
        Object.assign(query, obj);
    }
    delete paramList;
    let fn = query.callback;
    res.writeHead(200, {
        'Content-Type': 'text/javascript'
    });
    res.write(fn + '(' + JSON.stringify(query) + ')');
    res.end();
})

server.listen('3001');

console.log('server on port 3001');
```

刷新 `localhost:3000` ，可以看到 alert 的信息。

jsonp 缺点：只支持 get 请求。

#### document.domain + iframe跨域

此方案仅限主域相同，子域不同的跨域应用场景。

实现原理：两个页面都通过js强制设置document.domain为基础主域，就实现了同域。

1.）父窗口：(http://www.domain.com/a.html)

```javascript
<iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
<script>
    document.domain = 'domain.com';
    var user = 'admin';
</script>
```

2.）子窗口：(http://child.domain.com/b.html)

```javascript
<script>
    document.domain = 'domain.com';
    // 获取父窗口中变量
    alert('get js data from parent ---> ' + window.parent.user);
</script>
```

#### location.hash + iframe 

实现原理： a欲与b跨域相互通信，通过中间页c来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。

具体实现：A域：a.html -> B域：b.html -> A域：c.html，a与b不同域只能通过hash值单向通信，b与c也不同域也只能单向通信，但c与a同域，所以c可通过parent.parent访问a页面所有对象。

1.）a.html：(http://www.domain1.com/a.html)

```javascript
<iframe id="iframe" src="http://www.domain2.com/b.html" style="display:none;"></iframe>
<script>
    var iframe = document.getElementById('iframe');

    // 向b.html传hash值
    setTimeout(function() {
        iframe.src = iframe.src + '#user=admin';
    }, 1000);
    
    // 开放给同域c.html的回调方法
    function onCallback(res) {
        alert('data from c.html ---> ' + res);
    }
</script>
```

2.）b.html：(http://www.domain2.com/b.html)

```javascript
<iframe id="iframe" src="http://www.domain1.com/c.html" style="display:none;"></iframe>
<script>
    var iframe = document.getElementById('iframe');

    // 监听a.html传来的hash值，再传给c.html
    window.onhashchange = function () {
        iframe.src = iframe.src + location.hash;
    };
</script>
```

3.）c.html：(http://www.domain1.com/c.html)

```javascript
<script>
    // 监听b.html传来的hash值
    window.onhashchange = function () {
        // 再通过操作同域a.html的js回调，将结果传回
        window.parent.parent.onCallback('hello: ' + location.hash.replace('#user=', ''));
    };
</script>
```

#### window.name + iframe

window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。

`localhost:3000/index.html` 跨域访问 `localhost:3001/b.html` 信息。

index.html
```javascript
<script>
var proxy = function(url, callback) {
    var state = 0;
    var iframe = document.createElement('iframe');

    // loaing cross-origin page
    iframe.src=url;

    iframe.onload = function() {
        if (state === 1) {
            // second loaded: proxy page ,get data from window.name
            callback(iframe.contentWindow.name);
            destoryFrame();

        } else if (state === 0) {
            // first loaded: cross-origin page, redirect to the proxy page(in same origin)
            iframe.contentWindow.location = 'http://localhost:3000/proxy.html';
            state = 1;
        }
    }

    document.body.appendChild(iframe);

    function destoryFrame() {
        iframe.contentWindow.document.write('');
        iframe.contentWindow.close();
        document.body.removeChild(iframe);
    }
}

proxy('http://localhost:3001/b.html', function(data) {
    alert(data);
});
</script>
```

b.html

```javascript
<script>
    window.name = 'This is domain2 data!';
</script>
```

启动本地服务：

```javascript
const http = require('http');
const fs = require('fs');
const url = require('url');

var server = http.createServer((req, res) => {
    var uri = url.parse(req.url);
    if (uri.pathname == '/index.html') {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        fs.createReadStream(`${__dirname}/index.html`).pipe(res);
    } else if (uri.pathname== '/proxy.html') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end();
    }
}).listen(3000);

console.log('server on port 3000');
```

```javascript
const http = require('http');
const fs = require('fs');
const url = require('url');

var server = http.createServer((req, res) => {
    var uri = url.parse(req.url);
    if (uri.pathname == '/b.html') {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        fs.createReadStream(`${__dirname}/b.html`).pipe(res);
    }
}).listen(3001);

console.log('server on port 3001');
```

`proxy.html` 是和 `index.html` 同域页面。空页面即可。

总结：通过iframe的src属性由外域转向本地域，跨域数据即由iframe的window.name从外域传递到本地域。

#### [postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)

postMessage是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一，它可用于解决以下方面的问题：
a.） 页面和其打开的新窗口的数据传递
b.） 多窗口之间消息传递
c.） 页面与嵌套的iframe消息传递
d.） 上面三个场景的跨域数据传递

例子是 possMessage + iframe

```javascript
// a.html
<iframe id="iframe" src="http://localhost:3001"></iframe>
<script>
var data = {
    msg: "It's port 3000"
};
var iframe = document.getElementById('iframe');
iframe.onload = function() {
    iframe.contentWindow.postMessage(JSON.stringify(data), 'http://localhost:3001');
}

window.addEventListener('message', function(e) {
    alert(e.data);
});
</script> 
```

```javascript
<script>
window.addEventListener('message', function(e) {
    alert(e.data);
    var data = JSON.parse(e.data);
    if(data) {
        var response = 'receive:' + data.msg;
        window.parent.postMessage(response,'http://localhost:3000');
    }
});
</script>
```

#### CORS

[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

请求方法是以下三种方法之一：

HEAD
GET
POST

HTTP的头信息不超出以下几种字段：

>
Accept                     【请求头】客户端所希望接受的数据类型
Accept-Language            【请求头】客户端所希望接受的语言类型
Content-Language           【实体头】客户端发送的实体数据语言
Last-Event-ID              详见[SSE](http://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)
Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

>
application/x-www-form-urlencoded       原生 form 表单
multipart/form-data                     文件
text/plain                              纯文本

对简单请求，浏览器会在请求头加上 Origin 字段。Origin 字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

如果Origin指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头信息没有包含Access-Control-Allow-Origin字段（详见下文），就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200。

如果Origin指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

>
Access-Control-Allow-Origin      [必须]
Access-Control-Allow-Credentials [可选]
Access-Control-Expose-Headers    [可选]

非简单请求：非简单请求是那种对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json。非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。【OPTION请求】

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。

"预检"请求的头信息包括两个特殊字段。

（1）Access-Control-Request-Method

该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法

（2）Access-Control-Request-Headers

该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段


服务器回应的其他CORS相关字段如下。

（1）Access-Control-Allow-Methods

该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

（2）Access-Control-Allow-Headers

如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。

（3）Access-Control-Allow-Credentials

该字段与简单请求时的含义相同。

（4）Access-Control-Max-Age

该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。

#### cookie跨域

[cookie 简介](https://segmentfault.com/a/1190000004556040)
[XMLHttpRequest](https://segmentfault.com/a/1190000004322487#articleHeader13)




















