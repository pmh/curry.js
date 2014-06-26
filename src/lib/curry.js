(function () {
    'use strict';
    var Base$2144 = require('./adt-derivers').Base;
    var __slice$2146 = [].slice;
    // *****************************
    // **      CurryJS.Core       **
    // *****************************
    // __ :: () -> ()
    var __$2147 = function noop() {
    };
    var extendNative$2148 = function (native$2167, prop$2168, f$2169) {
        return Object.defineProperty(native$2167, prop$2168, { value: f$2169 });
    };
    var withMeta$2149 = function (f$2170, meta$2171) {
        var keys$2172 = Object.keys(meta$2171);
        keys$2172.forEach(function (name$2173) {
            Object.defineProperty(f$2170, '__' + name$2173, { value: meta$2171[name$2173] });
        });
        return f$2170;
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
    var curry$2150 = function (f$2174, n$2175) {
        var arity$2176 = typeof n$2175 !== 'undefined' ? n$2175 : typeof f$2174.__arity !== 'undefined' ? f$2174.__arity : f$2174.length, name$2177 = f$2174.name || f$2174.__name;
        var curriedFn$2178 = withMeta$2149(function () {
                var args$2179 = [].slice.call(arguments, 0, arity$2176), realArity$2180 = args$2179.filter(function (x$2182) {
                        return x$2182 !== __$2147;
                    }).length, self$2181 = this;
                if (realArity$2180 >= arity$2176)
                    return f$2174.apply(self$2181, arguments);
                else {
                    var g$2183 = withMeta$2149(function () {
                            var partialArgs$2184 = [].slice.call(arguments), newArgs$2185 = [];
                            for (var i$2186 = 0; i$2186 < args$2179.length; i$2186++)
                                newArgs$2185[i$2186] = args$2179[i$2186] === __$2147 ? partialArgs$2184.length === 0 ? undefined : partialArgs$2184.shift() : args$2179[i$2186];
                            return curriedFn$2178.apply(self$2181, newArgs$2185.concat(partialArgs$2184));
                        }, {
                            name: name$2177,
                            arity: arity$2176 - realArity$2180,
                            curried: true
                        });
                    g$2183.toString = curriedFn$2178.toString.bind(curriedFn$2178);
                    return g$2183;
                }
            }, {
                name: name$2177,
                arity: arity$2176,
                curried: true
            });
        curriedFn$2178.toString = f$2174.toString.bind(f$2174);
        return curriedFn$2178;
    };
    extendNative$2148(Function.prototype, 'curry', function (n$2187) {
        return curry$2150(this, n$2187);
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
        var fns$2188 = __slice$2146.call(arguments), self$2189 = this;
        return fns$2188.reduce(function (f$2190, g$2191) {
            return function () {
                return f$2190.call(self$2189, g$2191.apply(self$2189, arguments));
            };
        });
    };
    // *****************************
    // ** CurryJS.Data.Collection **
    // *****************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2154(f$2192, acc$2193, xs$2194) {
        return function $_name(f$2195, acc$2196, xs$2197) {
            return xs$2197.reduce(f$2195, acc$2196);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2157(f$2198, xs$2199) {
        return function $_name(f$2200, xs$2201) {
            return xs$2201.reduce(f$2200);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2160(f$2202, acc$2203, xs$2204) {
        return function $_name(f$2205, acc$2206, xs$2207) {
            return xs$2207.reduceRight(f$2205, acc$2206);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2163(f$2208, xs$2209) {
        return function $_name(f$2210, xs$2211) {
            return xs$2211.reduceRight(f$2210);
        }.curry().apply(null, arguments);
    }
    ;
    // *****************************
    // ** CurryJS.Control.Functor **
    // *****************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2166(f$2212, xs$2213) {
        return function $_name(f$2214, xs$2215) {
            return xs$2215.map(f$2214);
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
        },
        Control: { Functor: { map: map$2166 } }
    };
}());
//# sourceMappingURL=curry.js.map