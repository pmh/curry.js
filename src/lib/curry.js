(function () {
    'use strict';
    var __slice$2080 = [].slice;
    /* CurryJS.Core */
    var __$2082 = function noop() {
    };
    var extendNative$2084 = function (native$2092, prop$2093, f$2094) {
        return Object.defineProperty(native$2092, prop$2093, { value: f$2094 });
    };
    var withMeta$2086 = function (f$2095, meta$2096) {
        var keys$2097 = Object.keys(meta$2096);
        keys$2097.forEach(function (name$2099) {
            Object.defineProperty(f$2095, '__' + name$2099, { value: meta$2096[name$2099] });
        });
        return f$2095;
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
    var curry$2088 = function (f$2100) {
        var arity$2101 = typeof f$2100.__arity === 'undefined' ? f$2100.length : f$2100.__arity, name$2102 = f$2100.name || f$2100.__name;
        var curriedFn$2104 = withMeta$2086(function () {
                var args$2106 = [].slice.call(arguments, 0, arity$2101), realArity$2107 = args$2106.filter(function (x$2109) {
                        return x$2109 !== __$2082;
                    }).length, self$2108 = this;
                if (realArity$2107 >= arity$2101)
                    return f$2100.apply(self$2108, arguments);
                else {
                    var g$2111 = withMeta$2086(function () {
                            var partialArgs$2112 = [].slice.call(arguments), newArgs$2113 = [];
                            for (var i$2114 = 0; i$2114 < args$2106.length; i$2114++)
                                newArgs$2113[i$2114] = args$2106[i$2114] === __$2082 ? partialArgs$2112.length === 0 ? undefined : partialArgs$2112.shift() : args$2106[i$2114];
                            return curriedFn$2104.apply(self$2108, newArgs$2113.concat(partialArgs$2112));
                        }, {
                            name: name$2102,
                            arity: arity$2101 - realArity$2107,
                            curried: true
                        });
                    g$2111.toString = curriedFn$2104.toString.bind(curriedFn$2104);
                    return g$2111;
                }
            }, {
                name: name$2102,
                arity: arity$2101,
                curried: true
            });
        curriedFn$2104.toString = f$2100.toString.bind(f$2100);
        return curriedFn$2104;
    };
    extendNative$2084(Function.prototype, 'curry', function () {
        return curry$2088(this);
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
    var compose$2091 = function () {
        var fns$2115 = __slice$2080.call(arguments), self$2116 = this;
        return fns$2115.reduce(function (f$2118, g$2119) {
            return function () {
                return f$2118.call(self$2116, g$2119.apply(self$2116, arguments));
            };
        });
    };
    module.exports = {
        Core: {
            __: __$2082,
            curry: curry$2088,
            compose: compose$2091
        }
    };
}());
//# sourceMappingURL=curry.js.map