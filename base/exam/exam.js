(function(root){
    
    function getM(array, type){
        var _type = type || 'max';
        var num = Math[_type].apply(null, array);
        return num;
    }

    function suffle1(array){
        var i = array.length;
        while(i) {
            var j = Math.floor(Math.random() * i--);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function suffle2(array){
        var temp = [];
        var i = array.length;
        while(i) {
            var j = Math.floor(Math.random() * i--);
            temp.push(array[j]);
            array.splice(j, 1);
        }
        return temp;
    }

    function validate(str){
        if (toString.call(str) != '[object String]') return false;
        var reg = /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z\d]{6,12}$/;
        return reg.test(str);
    }

    function format(num){
        var integer = num;
        var decimal, temp;
        if (num.toString().indexOf('.') !== -1) {
            temp = num.toString().split('.');
            integer = temp[0];
            decimal = temp[1];
        }
        var _n = integer.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        return decimal ? `${_n}.${decimal}` : _n;
    }

    root._t = {
        getM,
        suffle1,
        suffle2,
        validate,
        format
    };
})(window);