var a = [ 42 ];
var b = [ "43" ];
a.valueOf = function(){
    console.log('a valueOf');
    return [42];
}
a.toString = function(){
    console.log('a toString');
    return '420';
}
a.toNumber = function() {
    console.log('a toNumber');
    return 42;
}
b.valueOf = function(){
    console.log('b valueOf');
    return ["43"];
}
b.toString = function(){
    console.log('b toString');
    return '53';
}


console.log(a < b);  // true