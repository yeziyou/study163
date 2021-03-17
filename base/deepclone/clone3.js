/**
 * @ Author: zhongly
 * @ Create time: 2021-03-15 22:07:17
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-16 16:40:47
 * @ Description: 深拷贝 - 循环优化
 */

function forEach(arr, iteratee) {
    const len = arr.length;
    for(let i = 0; i < len; i++){
        iteratee(arr[i], i);
    }
    return arr;
}

function clone(target, map = new WeakMap()) {
    if (typeof target === 'object') {
        const isArray = Array.isArray(target);
        const cloneTarget = isArray ? [] : {};
        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);

        let keys = isArray ? target : Object.keys(target);
        forEach(keys, function(value, key){
            if (!isArray) {
                key = value;
            }
            cloneTarget[key] = clone(target[key], map);
        })
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
// target.target = target;

console.time(1);
let t1 = clone(target);
console.timeEnd(1);   //8.079ms

console.time(2)
let t2 = JSON.parse(JSON.stringify(target));
console.timeEnd(2);

// 结论：将for in循环换成for循环  时间从68ms -> 8ms  效率提升8.5倍