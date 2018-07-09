## 函数柯里化

> 参考[JS函数式编程-Currying](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch4.html#%E4%B8%8D%E4%BB%85%E4%BB%85%E6%98%AF%E5%8F%8C%E5%85%B3%E8%AF%AD%E5%92%96%E5%96%B1)

### 定义

概念很简单，调用一个函数时，你可以传入更少参数，这个函数会返回一个接收剩余参数的函数。