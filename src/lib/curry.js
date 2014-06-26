(function () {
    'use strict';
    var Base$2144 = require('./adt-derivers').Base;
    var __slice$2146 = [].slice;
    /* CurryJS.Core */
    var __$2147 = function noop() {
    };
    var extendNative$2148 = function (native$2164, prop$2165, f$2166) {
        return Object.defineProperty(native$2164, prop$2165, { value: f$2166 });
    };
    var withMeta$2149 = function (f$2167, meta$2168) {
        var keys$2169 = Object.keys(meta$2168);
        keys$2169.forEach(function (name$2170) {
            Object.defineProperty(f$2167, '__' + name$2170, { value: meta$2168[name$2170] });
        });
        return f$2167;
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
    var curry$2150 = function (f$2171, n$2172) {
        var arity$2173 = typeof n$2172 !== 'undefined' ? n$2172 : typeof f$2171.__arity !== 'undefined' ? f$2171.__arity : f$2171.length, name$2174 = f$2171.name || f$2171.__name;
        var curriedFn$2175 = withMeta$2149(function () {
                var args$2176 = [].slice.call(arguments, 0, arity$2173), realArity$2177 = args$2176.filter(function (x$2179) {
                        return x$2179 !== __$2147;
                    }).length, self$2178 = this;
                if (realArity$2177 >= arity$2173)
                    return f$2171.apply(self$2178, arguments);
                else {
                    var g$2180 = withMeta$2149(function () {
                            var partialArgs$2181 = [].slice.call(arguments), newArgs$2182 = [];
                            for (var i$2183 = 0; i$2183 < args$2176.length; i$2183++)
                                newArgs$2182[i$2183] = args$2176[i$2183] === __$2147 ? partialArgs$2181.length === 0 ? undefined : partialArgs$2181.shift() : args$2176[i$2183];
                            return curriedFn$2175.apply(self$2178, newArgs$2182.concat(partialArgs$2181));
                        }, {
                            name: name$2174,
                            arity: arity$2173 - realArity$2177,
                            curried: true
                        });
                    g$2180.toString = curriedFn$2175.toString.bind(curriedFn$2175);
                    return g$2180;
                }
            }, {
                name: name$2174,
                arity: arity$2173,
                curried: true
            });
        curriedFn$2175.toString = f$2171.toString.bind(f$2171);
        return curriedFn$2175;
    };
    extendNative$2148(Function.prototype, 'curry', function (n$2184) {
        return curry$2150(this, n$2184);
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
    var compose$2151 = function () {
        var fns$2185 = __slice$2146.call(arguments), self$2186 = this;
        return fns$2185.reduce(function (f$2187, g$2188) {
            return function () {
                return f$2187.call(self$2186, g$2188.apply(self$2186, arguments));
            };
        });
    };
    // CurryJS.Data.Collection
    /*
  * foldl :: (a -> b -> a) -> a -> [b] -> a
  */
    function foldl$2154(f$2189, acc$2190, xs$2191) {
        return function $_name(f$2192, acc$2193, xs$2194) {
            return xs$2194.reduce(f$2192, acc$2193);
        }.curry().apply(null, arguments);
    }
    ;
    /*
  * foldl1 :: (a -> a -> a) -> [a] -> a
  */
    function foldl1$2157(f$2195, xs$2196) {
        return function $_name(f$2197, xs$2198) {
            return xs$2198.reduce(f$2197);
        }.curry().apply(null, arguments);
    }
    ;
    /*
  * foldr :: (a -> b -> b) -> b -> [a] -> b
  */
    function foldr$2160(f$2199, acc$2200, xs$2201) {
        return function $_name(f$2202, acc$2203, xs$2204) {
            return xs$2204.reduceRight(f$2202, acc$2203);
        }.curry().apply(null, arguments);
    }
    ;
    /*
  * foldr1 :: (a -> a -> a) -> [a] -> a
  */
    function foldr1$2163(f$2205, xs$2206) {
        return function $_name(f$2207, xs$2208) {
            return xs$2208.reduceRight(f$2207);
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        Core: {
            __: __$2147,
            curry: curry$2150,
            compose: compose$2151
        },
        Data: {
            Collection: {
                foldl: foldl$2154,
                foldl1: foldl1$2157,
                foldr: foldr$2160,
                foldr1: foldr1$2163
            }
        }
    };
}());
//# sourceMappingURL=curry.js.map