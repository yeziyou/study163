// 严格模式下的默认绑定
// function foo() { 
//     console.log(111, this.a);
// }

// var a = 2;

// (function(){ 
//     "use strict";

//     function bar() {
//         foo();
//         console.log(222, this.a)
//     }

//     bar(); // 2 
// })();


// 示例2
// var length = 5;
// // 隐式绑定
// function foo() { 
//     console.log(this);
//     console.log(111, this.length );
// }

// function bar() {
//     // length = 3;
//     foo();
//     console.log(this);
//     console.log(222, this.length);
// }

// var obj = { 
//     length: 2,
//     foo: function() {
//         bar();
//     } 
// };

// obj.foo(); // 2


// 示例3 todo 
// var length = 10;
// function fn(){
//     console.log(this);
//     console.log(this.length);
// }
// var obj = {
//     length: 5,
//     method: function (fn1) {
//         console.log(111, this);  //obj

//         arguments[0](); //arguments 2
//         fn1(); //window 10

//         function fn2(){
//             console.log(this); //window
//             console.log(this.length);  //10
//         }
//         fn2();

//         var fn3 = () => {
//             console.log(this);
//             console.log(this.length);
//         }
//         fn3();
//     }
// };
// obj.method(fn, 123);


// 示例4
// function foo() { 
//     console.log( this.a );
// }

// function doFoo(fn) {
//     // fn其实引用的是foo

//     fn(); // <-- 调用位置！
// }

// var obj = { 
//     a: 2,
//     foo: foo 
// };

// var a = "oops, global"; // a是全局对象的属性

// doFoo( obj.foo ); // "oops, global"


// 示例5
function Create(){
    this.a = 1;
}
Create.prototype = {
    get() {
        console.log(this);
        // this.formatData();
        function f(){
            console.log(this);
            this.a = 2;
        }
        f();
        return this.a;
    },
    formatData(){
        console.log(this);
        function f(){
            console.log(this);
            this.a = 2;
        }
        return f();
    }
}
var c = new Create();
c.get();
var d = c.get;
d();