/**
 * @ Author: zhongly
 * @ Create time: 2021-03-17 17:41:27
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-17 17:45:50
 * @ Description: 复合函数 - 执行顺序从左往右
 */


let add = (x) => x + 10;
let multiply = (x) => x * 10;

function compose1() {
    let args = Array.prototype.slice.call(arguments, [0]);

    return function(x) {
        return args.reduce(function(res, fn) {
            return fn(res);
        }, x);
    }
}

let cal1 = compose1(add, multiply);
console.log(cal1(10));


function compose2() {
    let args = Array.prototype.slice.call(arguments, [0]);
    args = args.reverse();
    return function(x) {
        return args.reduceRight(function(res, fn) {
            return fn(res);
        }, x);
    }
}

let cal2 = compose1(add, multiply);
console.log(cal2(10));