var _ = {};
//获取时间戳  （ms
_.now = Date.now;

_.debounce = function(func, wait, immediate) {   //ajax     1000s
	var lastTime, timeOut, args, result;

	//逻辑  防抖节流 
	var later = function() {
		var last = _.now() - lastTime; // _.now() （change   lastTime  （change
		// console.log(222, lastTime); //11   大于 1500    小于 1500
		if (last < wait) { //last(change)  固定值1500
			timeOut = setTimeout(later, wait - last);   //1500 - 11  1400 
		} else {
			timeOut = null;
			if (!immediate) {
				result = func.apply(null, args);
			}
		}
	}

	return function() { //防抖函数
		args = arguments;
		//首次触发防抖函数的时间戳
		lastTime = _.now();
		//立即调用满足两个条件
		var callNow = immediate && !timeOut;
		if (!timeOut) {
			timeOut = setTimeout(later, wait);
		}
		if (callNow) {    //立即执行 处理函数
			result = func.apply(null, args);
		}
		return result;
	}
}
//防抖函数   频率   === 时间戳  === 对比  

/*
               437
debounce.js:11 301
debounce.js:11 0
debounce.js:11 3
debounce.js:11 500
debounce.js:11 1500


逐步增大 
防抖函数  核心    上一次调用防抖函数  与这一次调用防抖函数是否间隔了1500

时间戳
0  50  100   ....  1500   调用 处理函数
1  2   3   4  ....N  


 50   70  1500       调用 处理函数    
0  50  120  15120
1  2   3   4  ....N  


timeOut = setTimeout(later, wait - last);
*/
