/**
 * @ Author: zhongly
 * @ Create time: 2021-03-15 21:50:56
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-16 16:39:39
 * @ Description: 深拷贝 - 循环引用
 */


function clone(target, map = new WeakMap()) {
    if (typeof target === 'object') {
        const isArray = Array.isArray(target);
        const cloneTarget = isArray ? [] : {};
        console.log(11, target);
        if (map.get(target)) {
            return map.get(target);
        }
        console.log(22, target);
        map.set(target, cloneTarget);
        for(var key in target) {
            cloneTarget[key] = clone(target[key], map);
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
target.target = target;

console.time(1);
let t1 = clone(target);
console.timeEnd(2);     // 68.838ms
// console.log(target);
// console.log(t1);
// console.log(target == t1);

