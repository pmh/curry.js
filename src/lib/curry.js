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
    var extendNative$2148 = function (native$2173, prop$2174, f$2175) {
        return Object.defineProperty(native$2173, prop$2174, { value: f$2175 });
    };
    var withMeta$2149 = function (f$2176, meta$2177) {
        var keys$2178 = Object.keys(meta$2177);
        keys$2178.forEach(function (name$2179) {
            Object.defineProperty(f$2176, '__' + name$2179, { value: meta$2177[name$2179] });
        });
        return f$2176;
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
    var curry$2150 = function (f$2180, n$2181) {
        var arity$2182 = typeof n$2181 !== 'undefined' ? n$2181 : typeof f$2180.__arity !== 'undefined' ? f$2180.__arity : f$2180.length, name$2183 = f$2180.name || f$2180.__name;
        var curriedFn$2184 = withMeta$2149(function () {
                var args$2185 = [].slice.call(arguments, 0, arity$2182), realArity$2186 = args$2185.filter(function (x$2188) {
                        return x$2188 !== __$2147;
                    }).length, self$2187 = this;
                if (realArity$2186 >= arity$2182)
                    return f$2180.apply(self$2187, arguments);
                else {
                    var g$2189 = withMeta$2149(function () {
                            var partialArgs$2190 = [].slice.call(arguments), newArgs$2191 = [];
                            for (var i$2192 = 0; i$2192 < args$2185.length; i$2192++)
                                newArgs$2191[i$2192] = args$2185[i$2192] === __$2147 ? partialArgs$2190.length === 0 ? undefined : partialArgs$2190.shift() : args$2185[i$2192];
                            return curriedFn$2184.apply(self$2187, newArgs$2191.concat(partialArgs$2190));
                        }, {
                            name: name$2183,
                            arity: arity$2182 - realArity$2186,
                            curried: true
                        });
                    g$2189.toString = curriedFn$2184.toString.bind(curriedFn$2184);
                    return g$2189;
                }
            }, {
                name: name$2183,
                arity: arity$2182,
                curried: true
            });
        curriedFn$2184.toString = f$2180.toString.bind(f$2180);
        return curriedFn$2184;
    };
    extendNative$2148(Function.prototype, 'curry', function (n$2193) {
        return curry$2150(this, n$2193);
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
        var fns$2194 = __slice$2146.call(arguments), self$2195 = this;
        return fns$2194.reduce(function (f$2196, g$2197) {
            return function () {
                return f$2196.call(self$2195, g$2197.apply(self$2195, arguments));
            };
        });
    };
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2154(f$2198, xs$2199) {
        return function $_name(f$2200, xs$2201) {
            return xs$2201.map(f$2200);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2157(f$2202, xs$2203) {
        return function $_name(f$2204, xs$2205) {
            return xs$2205.ap(f$2204);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2160(xs$2206, f$2207) {
        return function $_name(xs$2208, f$2209) {
            return xs$2208.chain(f$2209);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2163(f$2210, acc$2211, xs$2212) {
        return function $_name(f$2213, acc$2214, xs$2215) {
            return xs$2215.reduce(f$2213, acc$2214);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2166(f$2216, xs$2217) {
        return function $_name(f$2218, xs$2219) {
            return xs$2219.reduce(f$2218);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2169(f$2220, acc$2221, xs$2222) {
        return function $_name(f$2223, acc$2224, xs$2225) {
            return xs$2225.reduceRight(f$2223, acc$2224);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2172(f$2226, xs$2227) {
        return function $_name(f$2228, xs$2229) {
            return xs$2229.reduceRight(f$2228);
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
                foldl: foldl$2163,
                foldl1: foldl1$2166,
                foldr: foldr$2169,
                foldr1: foldr1$2172
            }
        },
        Control: {
            Functor: { map: map$2154 },
            Applicative: { ap: ap$2157 },
            Monad: { chain: chain$2160 }
        }
    };
}());
//# sourceMappingURL=curry.js.map