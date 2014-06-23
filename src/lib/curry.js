(function () {
    'use strict';
    var __slice$2076 = [].slice;
    /* CurryJS.Core */
    var __$2078 = function noop() {
    };
    var extendNative$2080 = function (native$2088, prop$2089, f$2090) {
        return Object.defineProperty(native$2088, prop$2089, { value: f$2090 });
    };
    var withMeta$2082 = function (f$2091, meta$2092) {
        var keys$2093 = Object.keys(meta$2092);
        keys$2093.forEach(function (name$2095) {
            Object.defineProperty(f$2091, '__' + name$2095, { value: meta$2092[name$2095] });
        });
        return f$2091;
    };
    /*
  * curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))
  *
  * Given any fixed arity function it returns a new function that can be partially applied.
  *
  * Usage:
  *
  *   times    := curry(fun (a, b) a * b);
  *   timesTwo := times(2);
  *   mod2     := mod(__, 2); // __ can be used as a placeholder for partial application
  *
  *   times(2, 4) //=> 8
  *   times(2)(4) //=> 8
  *   timesTwo(4) //=> 8
  *
  *   mod2(2)     //=> 0
  *   mod2(3)     //=> 1
  */
    var curry$2084 = function (f$2096) {
        var arity$2097 = typeof f$2096.__arity === 'undefined' ? f$2096.length : f$2096.__arity, name$2098 = f$2096.name || f$2096.__name;
        var curriedFn$2100 = withMeta$2082(function () {
                var args$2102 = [].slice.call(arguments, 0, arity$2097), realArity$2103 = args$2102.filter(function (x$2105) {
                        return x$2105 !== __$2078;
                    }).length, self$2104 = this;
                if (realArity$2103 >= arity$2097)
                    return f$2096.apply(self$2104, arguments);
                else {
                    var g$2107 = withMeta$2082(function () {
                            var partialArgs$2108 = [].slice.call(arguments), newArgs$2109 = [];
                            for (var i$2110 = 0; i$2110 < args$2102.length; i$2110++)
                                newArgs$2109[i$2110] = args$2102[i$2110] === __$2078 ? partialArgs$2108.length === 0 ? undefined : partialArgs$2108.shift() : args$2102[i$2110];
                            return curriedFn$2100.apply(self$2104, newArgs$2109.concat(partialArgs$2108));
                        }, {
                            name: name$2098,
                            arity: arity$2097 - realArity$2103,
                            curried: true
                        });
                    g$2107.toString = curriedFn$2100.toString.bind(curriedFn$2100);
                    return g$2107;
                }
            }, {
                name: name$2098,
                arity: arity$2097,
                curried: true
            });
        curriedFn$2100.toString = f$2096.toString.bind(f$2096);
        return curriedFn$2100;
    };
    extendNative$2080(Function.prototype, 'curry', function () {
        return curry$2084(this);
    });
    /*
  * compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)
  *
  * compose takes any number of functions and invokes them right to left
  * passing the value of the previous function to the next.
  *
  * compose(f,g)(x) === f(g(x))
  *
  * Usage:
  *
  * var even = compose(eq (0), mod(__, 2));
  * var odd  = compose(not, even);
  *
  * even (0) => true
  * odd  (0) => false
  * even (1) => false
  * odd  (1) => true
  *
  */
    var compose$2087 = function () {
        var fns$2111 = __slice$2076.call(arguments), self$2112 = this;
        return fns$2111.reduce(function (f$2114, g$2115) {
            return function () {
                return f$2114.call(self$2112, g$2115.apply(self$2112, arguments));
            };
        });
    };
    module.exports = {
        Core: {
            __: __$2078,
            curry: curry$2084,
            compose: compose$2087
        }
    };
}());