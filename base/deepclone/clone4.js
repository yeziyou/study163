/**
 * @ Author: zhongly
 * @ Create time: 2021-03-16 10:19:40
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-17 15:20:51
 * @ Description: 深拷贝 - 考虑各个数据类型
 */

function forEach(arr, iteratee) {
    const len = arr.length;
    for(let i = 0; i < len; i++){
        iteratee(arr[i], i);
    }
    return arr;
}

function getConstructor(target, type) {
    let Cons = target.constructor;
    return new Cons();
}

function getType(target) {
    return Object.prototype.toString.call(target);
}

var deepTag = ['[object Object]', '[object Array]', '[object Map]', '[object Set]'];
function clone(target) {
    let type = getType(target);

    if (!deepTag.includes(type)) {
        return cloneOther(target);
    }

    return cloneObject(target);
}

function cloneObject(target, map = new WeakMap()) {
    let type = getType(target);

    let cloneTarget;
    if (deepTag.includes(type)) {
        cloneTarget = getConstructor(target);
    }

    if (map.get(target)) {
        return map.get(target);
    }
    map.set(target, cloneTarget);

    if (type == '[object Map]'){
        target.forEach(function(value, key){
            cloneTarget.set(key, clone(value, map));
        })
        return cloneTarget;
    }

    if (type == '[object Set]') {
        target.forEach(function(value){
            cloneTarget.add(clone(value, map));
        })
        return cloneTarget;
    }

    let isArray = Array.isArray(target);
    let keys = isArray ? target : Object.keys(target);
    forEach(keys, function(value, key) {
        if (!isArray) {
            key = value;
        }
        cloneTarget[key] = clone(target[key], map);
    })
    return cloneTarget;
}

function cloneOther(target) {
    let type = getType(target);
    switch(type) {
        case '[object RegExp]':
            return cloneRegExp(target);
        case '[obejct Symbol]':
            return cloneSymbol(target);
        // case '[object Function]':
        //     return cloneFunc(target);
        case '[object Date]':
            return cloneDate(target);
        // case '[object Undefined]':
        //     return undefined;
        // case '[object Null]':
        //     return null;
        default: 
            return target;
    }
}

function cloneRegExp(target) {
    return new target.constructor(target.source);
}

function cloneSymbol(target) {
    return Symbol.prototype.valueOf.call(target);
}

// function cloneFunc(target) {
//     return target;
// }

function cloneDate(target) {
    return new target.constructor(target.getTime());
}


const map = new Map();
map.set('key', 'value');
map.set('ConardLi', 'code秘密花园');


const set = new Set();
set.add('ConardLi');
set.add('code秘密花园');


const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8],
    empty: null,
    map,
    set,
    bool: true,
    num: 2,
    str: 'test',
    symbol: Symbol(1),
    date: new Date(1615965172431),
    reg: /\d+/,
//     error: new Error(),
    fn1: () => {
        console.log('code秘密花园');
    },
    fn2: function (a, b) {
        return a + b;
    }
};

let t1 = clone(target);
console.log(t1);