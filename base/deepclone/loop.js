/**
 * @ Author: zhongly
 * @ Create time: 2021-03-16 09:42:43
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-16 16:47:50
 * @ Description: 循环的性能测试
 */

function loop1(arr) {
    const len = arr.length;
    let i = 0;
    let sum = 0;
    while(i < len) {
        sum += arr[i];
        i++;
    }
}

function loop2(arr) {
    let sum = 0;
    for(let key in arr) {
        sum += arr[key];
    }
}

function loop3(arr) {
    let sum = 0;
    const len = arr.length;
    for (let i = 0; i < len; i++){
        sum += arr[i];
    }
}

const array = [];
for (let i = 0; i < 100000; i++) {
    array.push(i);
}

console.time(1)
loop1(array);
console.timeEnd(1);  // node:6.093ms  chrome:3.035ms

console.time(2)
loop2(array);
console.timeEnd(2);  // node:15.826ms chrome:14.591ms

console.time(3)
loop3(array);
console.timeEnd(3);  // node:3.276ms  chrome:2.222ms

//结论：while和for在浏览器中性能相差不大，for in性能比较差。

