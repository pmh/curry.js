(function () {
    'use strict';
    var Base$2144 = require('./adt-derivers').Base;
    var __slice$2146 = [].slice;
    // ***************************************************************
    // **                       CurryJS.Core                        **
    // ***************************************************************
    // __ :: () -> ()
    var __$2147 = function noop() {
    };
    var extendNative$2148 = function (native$2176, prop$2177, f$2178) {
        return Object.defineProperty(native$2176, prop$2177, { value: f$2178 });
    };
    var withMeta$2149 = function (f$2179, meta$2180) {
        var keys$2181 = Object.keys(meta$2180);
        keys$2181.forEach(function (name$2182) {
            Object.defineProperty(f$2179, '__' + name$2182, { value: meta$2180[name$2182] });
        });
        return f$2179;
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
    var curry$2150 = function (f$2183, n$2184) {
        var arity$2185 = typeof n$2184 !== 'undefined' ? n$2184 : typeof f$2183.__arity !== 'undefined' ? f$2183.__arity : f$2183.length, name$2186 = f$2183.name || f$2183.__name;
        var curriedFn$2187 = withMeta$2149(function () {
                var args$2188 = [].slice.call(arguments, 0, arity$2185), realArity$2189 = args$2188.filter(function (x$2191) {
                        return x$2191 !== __$2147;
                    }).length, self$2190 = this;
                if (realArity$2189 >= arity$2185)
                    return f$2183.apply(self$2190, arguments);
                else {
                    var g$2192 = withMeta$2149(function () {
                            var partialArgs$2193 = [].slice.call(arguments), newArgs$2194 = [];
                            for (var i$2195 = 0; i$2195 < args$2188.length; i$2195++)
                                newArgs$2194[i$2195] = args$2188[i$2195] === __$2147 ? partialArgs$2193.length === 0 ? undefined : partialArgs$2193.shift() : args$2188[i$2195];
                            return curriedFn$2187.apply(self$2190, newArgs$2194.concat(partialArgs$2193));
                        }, {
                            name: name$2186,
                            arity: arity$2185 - realArity$2189,
                            curried: true
                        });
                    g$2192.toString = curriedFn$2187.toString.bind(curriedFn$2187);
                    return g$2192;
                }
            }, {
                name: name$2186,
                arity: arity$2185,
                curried: true
            });
        curriedFn$2187.toString = f$2183.toString.bind(f$2183);
        return curriedFn$2187;
    };
    extendNative$2148(Function.prototype, 'curry', function (n$2196) {
        return curry$2150(this, n$2196);
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
        var fns$2197 = __slice$2146.call(arguments), self$2198 = this;
        return fns$2197.reduce(function (f$2199, g$2200) {
            return function () {
                return f$2199.call(self$2198, g$2200.apply(self$2198, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: a -> Bool
    function not$2154(x$2201) {
        return function $_name(x$2202) {
            return !x$2202;
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2157(f$2203, xs$2204) {
        return function $_name(f$2205, xs$2206) {
            return xs$2206.map(f$2205);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2160(f$2207, xs$2208) {
        return function $_name(f$2209, xs$2210) {
            return xs$2210.ap(f$2209);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2163(xs$2211, f$2212) {
        return function $_name(xs$2213, f$2214) {
            return xs$2213.chain(f$2214);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2166(f$2215, acc$2216, xs$2217) {
        return function $_name(f$2218, acc$2219, xs$2220) {
            return xs$2220.reduce(f$2218, acc$2219);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2169(f$2221, xs$2222) {
        return function $_name(f$2223, xs$2224) {
            return xs$2224.reduce(f$2223);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2172(f$2225, acc$2226, xs$2227) {
        return function $_name(f$2228, acc$2229, xs$2230) {
            return xs$2230.reduceRight(f$2228, acc$2229);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2175(f$2231, xs$2232) {
        return function $_name(f$2233, xs$2234) {
            return xs$2234.reduceRight(f$2233);
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        Core: {
            __: __$2147,
            curry: curry$2150,
            compose: compose$2151
        },
        Predicates: { not: not$2154 },
        Data: {
            Collection: {
                foldl: foldl$2166,
                foldl1: foldl1$2169,
                foldr: foldr$2172,
                foldr1: foldr1$2175
            }
        },
        Control: {
            Functor: { map: map$2157 },
            Applicative: { ap: ap$2160 },
            Monad: { chain: chain$2163 }
        }
    };
}());
//# sourceMappingURL=curry.js.map