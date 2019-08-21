(function(){
    function _isNaN(){
        if (_.isFunction(Number.isNaN)){
            return Number.isNaN
        } else {
            return function(value){
                if (_.isNumber(value) && value != value) {
                    return true;
                }
                return false;
            }
        }
    }
    _.isNaN = _isNaN();

    _.filterNaN = function(obj){
        return _.filter(obj, function(item){
            return !_.isNaN(item);
        })
    }

})();


