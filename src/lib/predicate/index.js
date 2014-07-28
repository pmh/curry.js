(function () {
    'use strict';
    require('../core');
    // not :: Truthy -> Bool
    function not$2553(x$2564) {
        return function not$2553(x$2565) {
            return !x$2565;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2554(xs$2566) {
        return function and$2554(xs$2567) {
            return xs$2567.every(function (x$2568) {
                return !!x$2568;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2555(xs$2569) {
        return function or$2555(xs$2570) {
            return xs$2570.some(function (x$2571) {
                return !!x$2571;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2556(x$2572) {
        return function isObject$2556(x$2573) {
            return function (a0$2574) {
                if (Object.prototype.toString.call(a0$2574) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2573);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2557(x$2575) {
        return function isArray$2557(x$2576) {
            return function (a0$2577) {
                if (Array.isArray ? Array.isArray(a0$2577) : Object.prototype.toString.call(a0$2577) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2576);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2558(x$2578) {
        return function isNumber$2558(x$2579) {
            return function (a0$2580) {
                if (typeof a0$2580 === 'number' || Object.prototype.toString.call(a0$2580) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2579);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2559(x$2581) {
        return function isRegExp$2559(x$2582) {
            return function (a0$2583) {
                if (Object.prototype.toString.call(a0$2583) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2582);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2560(x$2584) {
        return function isString$2560(x$2585) {
            return function (a0$2586) {
                if (typeof a0$2586 === 'string' || Object.prototype.toString.call(a0$2586) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2585);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2561(x$2587) {
        return function isNull$2561(x$2588) {
            return function (a0$2589) {
                if (a0$2589 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2588);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2562(x$2590) {
        return function isUndef$2562(x$2591) {
            return function (a0$2592) {
                if (a0$2592 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2591);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2563(x$2593) {
        return function exists$2563(x$2594) {
            return function (x$2595) {
                return not$2553(or$2555(x$2595));
            }([
                isNull$2561(x$2594),
                isUndef$2562(x$2594)
            ]);
        }.curry().apply(null, arguments);
    }
    module.exports = {
        not: not$2553,
        and: and$2554,
        or: or$2555,
        isObject: isObject$2556,
        isArray: isArray$2557,
        isNumber: isNumber$2558,
        isRegExp: isRegExp$2559,
        isString: isString$2560,
        isNull: isNull$2561,
        isUndef: isUndef$2562,
        exists: exists$2563
    };
}());
//# sourceMappingURL=index.js.map