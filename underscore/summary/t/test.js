(function(root) {
	var _ = function(){
		
	};
	//[this._wrapped, function(){}]
	_.unique = function(arr, callbacks) {
		var ret = [];
		var target,i = 0;
		for (; i < arr.length; i++) {
			target = callbacks ? callbacks(arr[i]) : arr[i];
			if (ret.indexOf(target) === -1) {
                 ret.push(target);
			}
		}
		return ret;
	}
	
	_.map = function(){
		
	}
	root._ = _;
})(this);
