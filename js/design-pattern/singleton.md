## Singleton

单例限制了类的实例化次数只有一次。从经典意义上来说，Singleton 模式，在该实例不存在的情况下，可以通过一个方法创建一个类来实现创建类的新实例；如果实例已经存在，它会简单地返回该对象的引用。

适用性描述：

 - 当类只能有一个实例而且客户可以从一个众所周知的访问点访问它时
 - 该唯一的实例应该是通过子类化可扩展的，并且客户应该无需更改代码就能使用一个扩展的实例时。

### 设计思想

利用闭包储存一个唯一实例，并暴露访问接口。可以定义在第一次调用接口的时候，去初始化实例。