(function () {
    'use strict';
    var __slice$2042 = [].slice;
    /* CurryJS.Core */
    var __$2044 = function noop() {
    };
    var withMeta$2046 = function (f$2051, meta$2052) {
        var keys$2053 = Object.keys(meta$2052);
        keys$2053.forEach(function (name$2055) {
            Object.defineProperty(f$2051, '__' + name$2055, { value: meta$2052[name$2055] });
        });
        return f$2051;
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
    var curry$2048 = function (f$2056) {
        var arity$2057 = typeof f$2056.__arity === 'undefined' ? f$2056.length : f$2056.__arity, name$2058 = f$2056.name || f$2056.__name;
        var curriedFn$2060 = withMeta$2046(function () {
                var args$2062 = [].slice.call(arguments, 0, arity$2057), realArity$2063 = args$2062.filter(function (x$2065) {
                        return x$2065 !== __$2044;
                    }).length, self$2064 = this;
                if (realArity$2063 >= arity$2057)
                    return f$2056.apply(self$2064, arguments);
                else {
                    var g$2067 = withMeta$2046(function () {
                            var partialArgs$2068 = [].slice.call(arguments), newArgs$2069 = [];
                            for (var i$2070 = 0; i$2070 < args$2062.length; i$2070++)
                                newArgs$2069[i$2070] = args$2062[i$2070] === __$2044 ? partialArgs$2068.length === 0 ? undefined : partialArgs$2068.shift() : args$2062[i$2070];
                            return curriedFn$2060.apply(self$2064, newArgs$2069.concat(partialArgs$2068));
                        }, {
                            name: name$2058,
                            arity: arity$2057 - realArity$2063,
                            curried: true
                        });
                    g$2067.toString = curriedFn$2060.toString.bind(curriedFn$2060);
                    return g$2067;
                }
            }, {
                name: name$2058,
                arity: arity$2057,
                curried: true
            });
        curriedFn$2060.toString = f$2056.toString.bind(f$2056);
        return curriedFn$2060;
    };
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
    var compose$2050 = function () {
        var fns$2071 = __slice$2042.call(arguments), self$2072 = this;
        return fns$2071.reduce(function (f$2074, g$2075) {
            return function () {
                return f$2074.call(self$2072, g$2075.apply(self$2072, arguments));
            };
        });
    };
    module.exports = {
        Core: {
            __: __$2044,
            curry: curry$2048,
            compose: compose$2050
        }
    };
}());