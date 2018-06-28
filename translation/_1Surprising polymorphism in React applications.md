> 原文链接 [Surprising polymorphism in React applications](https://medium.com/@bmeurer/surprising-polymorphism-in-react-applications-63015b50abc)

## React 的多态性

现今，基于 [React](https://facebook.github.io/react/) 的 Web app 通常使用一些不可变的数据结构来管理状态，比如流行的 [Redux](http://redux.js.org/) 状态容器。 这种模式有几点好处，并且在 React/Redux 的领域之外愈加受欢迎。

这种机制的核心便是所谓的 `reducers`，它们是函数，根据触发的 `action` 更改某个状态到下一个状态————比如响应用户交互。有了这个核心的抽象概念，复杂的 `state` 和 `reducers` 可以组合成简化版本，方便了代码分段下的单元测试。请看下面来自于 [Redux 文档](http://redux.js.org/docs/basics/ExampleTodoList.html)的例子：

```javascript
const todo = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state
      }

      return Object.assign({}, state, {
        completed: !state.completed
      })

    default:
      return state
  }
}
```

`todo` reducer 响应 `action` 将现存的 `state` 映射到一个新的 `state`。