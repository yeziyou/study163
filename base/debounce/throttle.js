/**
 * @ Author: zhongly
 * @ Create time: 2021-03-18 18:21:19
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-19 16:51:51
 * @ Description: 节流函数 - setTimeout 时间戳
 */
(function(){
    // setTimeout
    function throttle(fn, delay) {
        let timer;
        return function(...args) {
            if (timer) return;
            timer = setTimeout(() => {
                fn(args);
                timer = null;
            }, delay);
        }
    }
    // 时间戳
    // 意义何在？？？
    function throttle2(fn, delay) {
        let timer, now, last;
        return function(...args) {
            if (timer) return;
            now = new Date().getTime();
            if (last) {
                if (now - last >= delay) {
                    fn(args);
                    last = now;
                }
                return;
            }
            timer = setTimeout(() => {
                fn(args);
                timer = null;
                last = now;
            }, delay);
        }
    }

    let handleClick = function() {
        console.log('节流：我被点击了');
    }
    handleClick = throttle2(handleClick, 1000);

    document.querySelector('.throttle').onclick = function() {
        handleClick();
    }
})()
