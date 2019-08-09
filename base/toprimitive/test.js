console.log('1');

var p = new Promise(function(resolve) {
    console.log('7');
    resolve();
});

setTimeout(function() {
    console.log('2');
    async function fn1() {
        await fn2();
        console.log('3');
    }
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
    fn1();
});

async function fn2() {
    console.log('6');
};

p.then(function() {
    console.log('8')
});

setTimeout(function() {
    console.log('9');
    new Promise(function(resolve) {
        console.log('10');
        resolve();
    }).then(function() {
        console.log('11')
    })
})

1 7 8 2 4 6 5 3 9 10 11