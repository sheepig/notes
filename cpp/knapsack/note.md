### 01 背包问题

题目： 有 N 件物品和一个容量为 V 的背包。放入第 i 件物品耗费的费用是 Ci ，得到的价值是 Wi 。求解将哪些物品装入背包可使价值总和最大。

思路： 01 背包问题的中，物品只有一件，不可重复放入。用 F(i, v) 表示把前 i 件物品放入容量 v 的背包能获得的最大价值。为对于第 i 件物品，有两个选择：放或者不放。如果不放入第 i 件物品，F(i, v) = F(i-1, v)；
如果放入第 i 件物品，F(i, v) = F(i-1, v-Ci) + Wi 。取这两个值中的较大值，就是要求的 F(i, v) 。

> F(i, v) = max{F(i-1, v, F(i-1, v-Ci) + Wi}

上述思路伪代码如下：

![](https://upload-images.jianshu.io/upload_images/1727685-74ec8d323b9ad703.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/641/format/webp)

时间复杂度 O(VN) ，已经不能再优化。空间复杂度可以优化到 O(V) 。先考虑上面讲的基本思路如何实现，肯定是有一个主循环i ←1 ...N，每次算出来二维数组F[i,0... V ] 的所有值。那么，如果只用一个数组F[0 ... V ]，能不能保证第i次循环结束后F[v] 中表示的就是我们定义的状态F[i,v] 呢？F[i,v] 是由F[i - 1, v] 和F[i - 1, v - Ci] 两个子问题递推而来，能否保证在推F[i, v] 时（也即在第i 次主循环中推F[v] 时）能够取用F[i - 1, v] 和F[i - 1, v - Ci] 的值呢？事实上，这要求在每次主循环中我们以v ←V ... 0 的递减顺序计算F[v]，这样才能保证计算F[v] 时F[v -Ci] 保存的是状态F[i - 1; v - Ci] 的值。伪代码如下：

![](https://upload-images.jianshu.io/upload_images/1727685-c3d5b6cbe772b226.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/521/format/webp)

[leetcode-416](https://leetcode.com/problems/partition-equal-subset-sum/description/): Given a non-empty array containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

Note:

Each of the array element will not exceed 100.

The array size will not exceed 200.

Example 1:

```
Input: [1, 5, 11, 5]

Output: true

Explanation: The array can be partitioned as [1, 5, 5] and [11].
```

Example 2:

```
Input: [1, 2, 3, 5]

Output: false

Explanation: The array cannot be partitioned into equal sum subsets.
```

本题可以抽象为背包问题，物品的数量就是数组的长度，第 i 个物品的价值和重量都一样，即 nums[i] ，背包的大小是所有数字的和的一半。如果背包装满之后，背包的价值等于数字之和的一半，则说明数组可以分裂为两个子数组，两组之和相等。

```cpp
bool canPartition(vector<int>& nums) {
    int N = nums.size();
    int sum = 0, V;
    for (int i = 0; i < N; i++) {
        sum += nums[i];
    }
    V = sum / 2;
    if (V + V != sum) { // sum is odd, then not subsets
        return false;   
    }
    vector<int> dp(V+1, 0);
    for (int i = 0; i < N; i++) {
        for (int v = V; v >= nums[i]; v--) {
            dp[v] = std::max(dp[v-nums[i]] + nums[i], dp[v]);
        }
    }
    return dp[V] == V;
}
```

#### 初始化细节问题

我们看到的求最优解的背包问题题目中，事实上有两种不太相同的问法。有的题目要求“恰好装满背包”时的最优解，有的题目则并没有要求必须把背包装满。一种区别这两种问法的实现方法是在初始化的时候有所不同。如果是第一种问法，要求恰好装满背包，那么在初始化时除了F[0] 为0，其它F[1...V ] 均设为-∞，这样就可以保证最终得到的F[V ] 是一种恰好装满背包的最优解。如果并没有要求必须把背包装满，而是只希望价格尽量大，初始化时应该将F[0...V ]全部设为0。
这是为什么呢？可以这样理解：初始化的F 数组事实上就是在没有任何物品可以放入背包时的合法状态。如果要求背包恰好装满，那么此时只有容量为0 的背包可以在什么也不装且价值为0 的情况下被“恰好装满”，其它容量的背包均没有合法的解，属于未定义的状态，应该被赋值为-∞ 了。如果背包并非必须被装满，那么任何容量的背包都有一个合法解“什么都不装”，这个解的价值为0，所以初始时状态的值也就全部为0了。这个小技巧完全可以推广到其它类型的背包问题，后面不再对进行状态转移之前的初始化进行讲解。

---

### 完全背包问题

题目：有N 种物品和一个容量为V 的背包，每种物品都有无限件可用。放入第i 种物品的费用是Ci，价值是Wi。求解：将哪些物品装入背包，可使这些物品的耗费的费用总和不超过背包容量，且价值总和最大。

思路：这个问题非常类似于01 背包问题，所不同的是每种物品有无限件。也就是从每种物品的角度考虑，与它相关的策略已并非取或不取两种，而是有取0 件、取1 件、取2
件……直至取⌊V /Ci⌋ 件等许多种。如果仍然按照解01 背包时的思路，令F[i; v] 表示前i 种物品恰放入一个容量为v的背包的最大权值。仍然可以按照每种物品不同的策略写出状态转移方程，像这样：

> F(i, v) = max{F(i-1, v-kCi) + kWi |0 ≤ kCi ≤ v|}

这跟 01 背包问题一样有 O(VN) 个状态需要求解，但求解每个状态的时间已经不是常数了，求解状态F[i,v] 的时间是O(v/Ci)，总的复杂度可以认为是O(NV ∑ V/Ci)，是比较大的。将01 背包问题的基本思路加以改进，得到了这样一个清晰的方法。这说明01 背包问题的方程的确是很重要，可以推及其它类型的背包问题。但我们还是要试图改进这个复杂度。

#### 简单的优化

完全背包问题有一个很简单有效的优化，是这样的：若两件物品i、j 满足Ci ≤ Cj且Wi ≥ Wj，则将可以将物品j 直接去掉，不用考虑。这个优化的正确性是显然的：任何情况下都可将价值小费用高的j 换成物美价廉的i，得到的方案至少不会更差。对于随机生成的数据，这个方法往往会大大减少物品的件数，从而加快速度。然而这个并不能改善最坏情况的复杂度，因为有可能特别设计的数据可以一件物品也去不掉。

这个优化可以简单的O(N^2) 地实现，一般都可以承受。另外，针对背包问题而言，比较不错的一种方法是：首先将费用大于V 的物品去掉，然后使用类似计数排序的做法，计算出费用相同的物品中价值最高的是哪个，可以O(V + N) 地完成这个优化。

#### O(VN) 算法

![](https://upload-images.jianshu.io/upload_images/1727685-02c4c61e494d65af.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/506/format/webp)

你会发现，这个伪代码与01 背包问题的伪代码只有v 的循环次序不同而已。
为什么这个算法就可行呢？首先想想为什么01 背包中要按照v 递减的次序来循环。让v 递减是为了保证第i 次循环中的状态F[i; v] 是由状态F[i - 1, v - Ci] 递推而来。换句话说，这正是为了保证每件物品只选一次，保证在考虑“选入第i 件物品”这件策略时，依据的是一个绝无已经选入第i 件物品的子结果F[i -1, v - Ci]。而现在完全背包的特点恰是每种物品可选无限件，所以在考虑“加选一件第i 种物品”这种策略时，却正需要一个可能已选入第i 种物品的子结果F[i, v-Ci]，所以就可以并且必须采用v递增的顺序循环。这就是这个简单的程序为何成立的道理。
值得一提的是，上面的伪代码中两层for 循环的次序可以颠倒。这个结论有可能会带来算法时间常数上的优化。
这个算法也可以由另外的思路得出。例如，将基本思路中求解F[i,v -Ci] 的状态转移方程显式地写出来，代入原方程中，会发现该方程可以等价地变形成这种形式：

> F(i, v) = max{F(i-1, v), F(i, v-Ci) + Wi}

[leetcode-322 Coin Change](https://leetcode.com/problems/coin-change/)

You are given coins of different denominations and a total amount of money amount. Write a function to compute the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

Example 1:

```
Input: coins = [1, 2, 5], amount = 11
Output: 3 
Explanation: 11 = 5 + 5 + 1
```

Example 2:

```
Input: coins = [2], amount = 3
Output: -1
```

Note:

You may assume that you have an infinite number of each kind of coin.

题目分析：用 dp[i] 表示合成金额 i 所需要的最少硬币数。对于某个币值 coin[n] ，如果 i > coin[n] ，即可以添加新硬币，那么有 dp[i] = dp[i-coin[n]] + 1 ,即先合成金额 i - coin[n] ,然后加上当前的硬币（+1）。如果不选择添加新硬币，那么 dp[i] 保持不变。我们要选取使用硬币最少的方案，所以

> dp[i] = min{dp[i], dp[i-coin[n]] + 1}

现在有一个问题，dp 怎么初始化？显然有 dp[0] = 0，因为组合金额为 0 时，不需要花费硬币。在给 dp[i] 赋值的时候，因为我们选取的是最小值，所以后面的 dp[i] 初始化为一个很大的数，我们可以用 MAX_INT ，这里也可以用 amount 的值。这里要注意，在取 dp[i] 的 min 值的时候，需要加上判断，除 i - coin[i] > 0 之外，还需要 dp[i - coin[i]] != MAX_INT ，因为我们要保证金额 i - coin[i] 是可以凑成的。

```cpp
int coinChange(vector<int>& coins, int amount) {
    int MAX = amount + 1;
    vector<int> dp(amount + 1, MAX);
    int N = coins.size();
    dp[0] = 0;
    for (int n = 0; n < N; n++) {
        for (int i = 1; i <= amount; i++) {
            int pre = i - coins[n];
            if (pre >= 0 && dp[pre] != MAX) {
                dp[i] = std::min(dp[i], dp[pre] + 1);
            }
        }
    }
    return dp[amount] == MAX ? -1 : dp[amount];
}
```





> 部分转载自[背包九讲系列1——01背包、完全背包、多重背包](https://www.jianshu.com/p/0b9018bbacd7)