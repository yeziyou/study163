var _ = {};
//获取时间戳  （ms
_.now = Date.now;

_.throttle = function(func, wait, options) {
	//初始值 
	var args, result, lastTime = 0;
	var timeOut = null;
	if (!options) {
		options = {};
	}

	var later = function() {
		lastTime = options.leading === false ? 0 : _.now(); //需求  !lastTime
		timeOut = null;
		func.apply(null, args);
	}

	return function() { //节流函数
		//首次执行节流函数的时间
		var now = _.now();
		args = arguments;
		//是否配置了leading
		if (!lastTime && options.leading === false) {
			lastTime = now;
		}
		//配置了leading  首次执行remaining === 1500   第二次调动及以上  数值逐渐变小

		var remaining = wait - (now - lastTime); //wait 固定值1500  now(change)   固定lastTime（首次调用的时间戳
		console.log(remaining)   //-15****   正数   负数  无配置
		if (remaining <= 0) { //trailing
			if (timeOut) {
				clearTimeout(timeOut);
				timeOut = null;
			}
			lastTime = now;
			result = func.apply(null, args);
		} else if (!timeOut && options.trailing !== false) { //leading
			console.log(remaining)
			timeOut = setTimeout(later, remaining);
		}
		return result;
	}
}


/*
频率   === 时间戳  === 对比   

1：lastTime =  now
 
2：lastTime === new Now

*/
