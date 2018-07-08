## 正则解析一个完整的 url

### url 组成
hash -- `#`开头的 fragment identifier

href -- 完整的 url

origin —- 包含协议到pathname之前的内容

host -- 完整主机名，包含`:`和端口

hostname -- 主机名，不包含端口

pathname -- 服务器上访问资源的路径`/`开头

port -- 端口号

protocol -- url使用的协议，包含末尾的`:`

search -- query string，`?`开头

### 匹配规则解析

/([^:]+:)/
匹配非`:`字符一次或多次直到遇到 :
