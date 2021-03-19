/**
 * @ Author: zhongly
 * @ Create time: 2021-03-18 18:21:08
 * @ Modified by: zhongly
 * @ Modified time: 2021-03-19 15:33:22
 * @ Description: 防抖函数 - setTimeout / 时间戳
 */

(function() {
    // setTimeout
    function debounce(fn, delay) {
        let timer;
        return function(...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn(args);
            }, delay);
        }
    }

    let handleClick = function() {
        console.log('防抖：我被点击了');
    }

    handleClick = debounce(handleClick, 500);

    document.querySelector('.debounce').onclick = function() {
        handleClick();
    }

})()


