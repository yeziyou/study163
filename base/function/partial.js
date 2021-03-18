/**
 * @ Author: zhongly
 * @ Create time: 2021-03-18 17:09:31
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-18 17:12:33
 * @ Description: 偏函数 - 固定其中的部分参数，执行剩余的参数
 */

function add(a, b, c){
    return a + b + c;
}

var add5 = add.bind(null, 5, 5);
console.log(add5(6));
console.log(add5(7));