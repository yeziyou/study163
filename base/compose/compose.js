/**
 * @ Author: zhongly
 * @ Create time: 2021-03-17 17:28:25
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-17 17:43:03
 * @ Description: 复合函数 - 执行顺序从右往左
 */


let add = (x) => x + 10;
let multiply = (x) => x * 10;

function compose() {
    let args = Array.prototype.slice.call(arguments, [0]);

    return function(x) {
        return args.reduceRight(function(res, fn) {
            return fn(res);
        }, x);
    }
}

let cal = compose(multiply, add);
console.log(cal(10));