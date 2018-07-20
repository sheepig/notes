## 给数字添加千分符

`1234567` -> `1,234,567`

这个问题在[stackoverflow上的解答](https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript?rq=1)

### 正则方法

解析参考[正则表达式/\B(?=(\d{3})+(?!\d))/怎样给数字添加千分符的](https://juejin.im/post/5b026bbb5188256720345bb4)

```javascript
function formatNum(num) {
    let pattern = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(pattern, ',');
}
```
如果不想在小数点后添加千分符，可以使用这个版本

```javascript
const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
```

### toLocalString()

详见[MDN Number.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString)