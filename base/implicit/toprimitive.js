var a = [1, 2, 3]
a.valueOf = function () {
    console.log('trigger valueOf')
    // return '321';
    return [1,2,3];
}
a.toString = function(){
    console.log('trigger toString');
    return '123';
}
var obj = {};
obj[a] = 'hello';
// console.log(obj);
// console.log(a - 1);





var b = new Date();
b.valueOf = function() {
    
}