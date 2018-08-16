### 什么是回溯算法

[回溯是递归的一种形式](https://www.cis.upenn.edu/~matuszek/cit594-2012/Pages/backtracking.html)。作者在文章中用树做例子，在一棵树上的回溯，其实就是深度优先搜索。

回溯和 brute force 的区别：brute force 不带脑子，走到 bad leaf 就撞死重来；回溯带脑子，走到 bad leaf ，回到上一个分叉口，走另一条路，另外回溯还会剪支，如果当前路径已经出现了不符合结果的情况，会剪去这条路径。

一般回溯问题有三种：

1. Find a path to success 有没有解
2. Find all paths to success 求所有解
  求所有解的个数
  求所有解的具体信息
3. Find the best path to success 求最优解

回溯可以抽象为一棵树，我们的目标可以是找这个树有没有good leaf，也可以是问有多少个good leaf，也可以是找这些good leaf都在哪，也可以问哪个good leaf最好，分别对应上面所说回溯的问题分类。

第一类问题的解的形式：

```
boolean solve(Node n) {
    if n is a leaf node {
        if the leaf is a goal node, return true
        else return false
    } else {
        for each child c of n {
            if solve(c) succeeds, return true
        }
        return false
    }
}
```

注意到函数的返回值是一个布尔值：这是理解算法的关键。如果 `solve(n)` 为 `true` ，说明节点 n 是解的一部分——也就是说，节点 n 在根到一个目的节点的路径上。我们说 n 是可解的。如果 `solve(n)` 返回 `false` ，就是说没有任何一条从根到任何目的节点到路径包含 n 。

------

第二类问题的解的形式：

```
void solve(Node n) {
    if n is a leaf node {
        if the leaf is a goal node, count++, update result, return;
        else return
    } else {
        for each child c of n {
            solve(c)
        }
    }
}
```

用一个变量 count 记录解的个数。如果需要所有解的信息，每遇到一个 goal node 的时候，把它存起来。

------

第三类问题的解的形式

```
void solve(Node n) {
    if n is a leaf node {
        if the leaf is a goal node, update best result, return;
        else return
    } else {
        for each child c of n {
            solve(c)
        }
    }
}
```

其实和第二类很像，只不过不是直接把 goal node 存起来，而是每次都和当前上一个 goal node 作比较，总是保留最好的那个。

------

#### leetCode 51. N-Queens

