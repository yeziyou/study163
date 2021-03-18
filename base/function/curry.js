/**
 * @ Author: zhongly
 * @ Create time: 2021-03-18 15:21:49
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-18 17:14:46
 * @ Description: 柯里化函数
 */

function curry(func) {
    let _curry = function(...args1) {
        if (args1.length >= func.length) {
            return func.apply(this, args1);
        } else {
            return function(...args2) {
                return _curry.apply(this, args1.concat(args2));
            }
        }
    }
    return _curry;
}

var add = function(a, b, c) {
    return a + b + c;
}

// 柯里化
add = curry(add);
console.log(add(1, 2, 3));
console.log(add(1, 2)(3));  
console.log(add(1)(2)(3));  


// 偏函数
add5 = add(5);  //固定部分参数
console.log(add5(6, 7));
console.log(add5(7, 8));
