
"" + [1, 2, 3];

+ [1, 2, 3];

[] + {};

{} + [];

2 + [5];

2 + ["5"];

2 + [];

2 + {};

{} + 2;











console.log("" + [1, 2, 3]);    // "1,2,3"

console.log(+ [1, 2, 3]);       // NaN

console.log([] + {});           // "[object Object]"

console.log({} + []);           // 0

console.log(2 + [5]);           // "25"

console.log(2 + ["5"]);         // "25"

console.log(2 + []);            // "20"

console.log(2 + {});            // "2[object Object]"

console.log({} + 2);            // 2

