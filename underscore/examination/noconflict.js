(function(root){
    var preUnderscore = root._;

    _.noConflict = function(){
        root._ = preUnderscore;
        return this;
    }
})(window);