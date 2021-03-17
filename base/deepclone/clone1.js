/**
 * @ Author: zhongly
 * @ Create time: 2021-03-15 21:34:43
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-16 16:40:07
 * @ Description: 深拷贝 - 只考虑数组和对象的情况
 */

function clone(target) {
    if (typeof target === 'object') {
        const isArray = Array.isArray(target);
        const cloneTarget = isArray ? [] : {};
        for(var key in target) {
            cloneTarget[key] = clone(target[key]);
        }
        return cloneTarget;
    } else {
        return target;
    }
}

var target = {
    field1: 1,
    field2: 'string',
    field3: true,
    field4: [1,2,3],
    field5: {1: 1, 2: 2}
}

console.time(1);
let t1 = clone(target);
console.timeEnd(1);
// console.log(t1);
// console.log(t1 === target);

console.time(2)
let t2 = JSON.parse(JSON.stringify(target));
console.timeEnd(2);
