var a = [1, 2, 3]
a.valueOf = function () {
    console.log('trigger valueOf')
    return 'hello';
}
a.toString = function(){
    console.log('trigger toString');
    return '1';
}
// console.log(a.valueOf()); // "hello"
// console.log(a.toString()) // "1,2,3"
var obj = {}
obj[a] = 'hello' // obj是{1,2,3: "hello"}
console.log(obj);
console.log(a - 0);
