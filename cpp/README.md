### 处理输入

[关于 cin 输入](./utils/inputs.md)

### trick

#### ASCII 码转为对应十进制数字

[ASCII table](http://www.asciitable.com/) 可以看到 ASCII 码一共 256 个。

```cpp
char s = 'f';
int a = s - 0; // 直接减数字 0 即可
```

如果是要把 `'7'` 这样的字符转为数字 7 ，则：

```cpp
'7' - '0'
```

#### ASCII 码映射哈希表

可以用一个 int 数组的下标指代任一个 ASCII 码信息，下标就是这个 ASCII 码转为 int 的值。

```cpp
int charset[255] = {-1};
int index = 'b' - 0;
charset[index] = /* some value */;
```

### 算法

[回溯](./backtracking/note.md)