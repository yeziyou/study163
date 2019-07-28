(function($){

    $.fn.extend({
        /**
         * 
         * @param {Object} config 
         * {
         *  {String} selector : 目标元素的选择器 默认为 img
         *  {Object} root: 目标元素的容器元素 为null或者为指定 都指向浏览器视窗
         *  {Number} threshold: 目标元素和root元素相交程度 达到该设置值时 执行目标元素加载 范围为[0-1] 默认为0.25
         *  {String} rootMargin: 控制root元素每一边的收缩或者扩张 ‘10px’ || '10%' 默认为0
         *  {Function} onLoad: 目标元素加载完回调
         * }
         */
        lazyload: function(config) {
            var selector = config.selector || 'img';
            var imgs = this.find(selector);
            var placeholder = this.data('place');
            for (var i = 0, j = imgs.length; i < j; i++){
                imgs[i].src = placeholder;
            }
            
            var observerOptions = {
                root: config.root || null,
                threshold: config.threshold || 0.25,
                rootMargin: config.rootMargin || '0px',
            }

            var observer = this.observer(config);
            observer.call(this, imgs, observerOptions);
        },
        observer: function(config) {
            function callback(entry) {
                var $tg = $(entry.target);
                $tg.attr('src', $tg.data('src'));
                $tg.data('loaded', 'loaded');
                
                config.onLoad && config.onLoad(entry);
            }

            if (typeof IntersectionObserver === 'function') {
                return function(elems, options) {
                    var _observer = new IntersectionObserver(intersectionCallback, options);
                    for (var i = 0, j = elems.length; i < j; i++) {
                        _observer.observe(elems[i]);
                    }
                    function intersectionCallback(entries) {
                        entries.forEach((entry) => {
                            const $tg = $(entry.target);
                            if(entry.isIntersecting && !$tg.data('loaded')){
                                callback(entry);
                            }
                        });
                    }
                }
            } else {
                return function(elems, options) {
                    var root = options.root || window;
                    var free = true;
                    function intersection() {
                        for (var i = 0, j = elems.length; i < j; i++) {
                            if (this.isInViewPort(elems[i], options) && !$(elems[i]).data('loaded')) {
                                callback({
                                    target: elems[i],
                                    tarboundingClientRect: elems[i].getBoundingClientRect(),                                            
                                });
                            }
                        }
                    };
                    intersection.call(this);
                    $(root).on('scroll.lazyload', function(e) {
                        if (free){
                            free = false;
                            setTimeout(() => {
                                intersection.call(this);
                                free = true;
                            }, 200);
                        }
                    }.bind(this));
                }
            }
        },
        isInViewPort: function(elem, options) {
            var $el = $(elem);
            var root = options.root || window;
            var elemHeight = $el.height();
            var rootHeight = $(root).height();
            var rect = elem.getBoundingClientRect();
            var margin = options.rootMargin.indexOf('%') > -1 ? (parseFloat(options.rootMargin) / 100) * rootHeight : parseFloat(options.rootMargin);
            var padding = options.threshold * elemHeight;

            if (rect.top > (- elemHeight + (margin - padding)) && rect.top < (rootHeight + (margin - padding))) {
                return true;
            }
            return false;
        },
    })
})(jQuery);