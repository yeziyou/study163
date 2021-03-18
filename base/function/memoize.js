/**
 * @ Author: zhongly
 * @ Create time: 2021-03-18 10:35:43
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-18 15:21:05
 * @ Description: 缓存函数：将上次的计算结果缓存，遇到同样参数时，直接返回缓存结果
 */

//  问题点 1、如何拿到函数的参数  2、数据存储在哪里

function memoize(fn, hasher) {
    let memoize = function(key) {
        let cache = memoize.cache;
        let address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!cache[address]) cache[address] = fn.apply(this, arguments);
        return cache[address];
    }
    memoize.cache = {};
    return memoize;
}


var count = 0;
var fibonacci = function(n) {
    count++;
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}

fibonacci = memoize(fibonacci);
for(var i = 0; i <= 10; i++) {
    fibonacci(i);
}
console.log(count);

