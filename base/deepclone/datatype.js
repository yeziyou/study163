/**
 * @ Author: zhongly
 * @ Create time: 2021-03-16 10:36:41
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-16 11:18:28
 * @ Description: 数据类型
 */


function getType(target) {
    return Object.prototype.toString.call(target);
}

console.log(getType(1));
console.log(getType('1'));
console.log(getType(true));
console.log(getType(null));
console.log(getType(undefined));
console.log(getType(Symbol()));
console.log(getType(new RegExp()));
console.log(getType(new Error()));
console.log(getType(Math));
console.log(getType(JSON));

console.log(getType(function(){}));

console.log(getType([]));
console.log(getType({}));
console.log(getType(new Map()));
console.log(getType(new WeakMap()));
console.log(getType(new Set()));
console.log(getType(new WeakSet()));
