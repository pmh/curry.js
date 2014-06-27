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
    var extendNative$2148 = function (native$2170, prop$2171, f$2172) {
        return Object.defineProperty(native$2170, prop$2171, { value: f$2172 });
    };
    var withMeta$2149 = function (f$2173, meta$2174) {
        var keys$2175 = Object.keys(meta$2174);
        keys$2175.forEach(function (name$2176) {
            Object.defineProperty(f$2173, '__' + name$2176, { value: meta$2174[name$2176] });
        });
        return f$2173;
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
    var curry$2150 = function (f$2177, n$2178) {
        var arity$2179 = typeof n$2178 !== 'undefined' ? n$2178 : typeof f$2177.__arity !== 'undefined' ? f$2177.__arity : f$2177.length, name$2180 = f$2177.name || f$2177.__name;
        var curriedFn$2181 = withMeta$2149(function () {
                var args$2182 = [].slice.call(arguments, 0, arity$2179), realArity$2183 = args$2182.filter(function (x$2185) {
                        return x$2185 !== __$2147;
                    }).length, self$2184 = this;
                if (realArity$2183 >= arity$2179)
                    return f$2177.apply(self$2184, arguments);
                else {
                    var g$2186 = withMeta$2149(function () {
                            var partialArgs$2187 = [].slice.call(arguments), newArgs$2188 = [];
                            for (var i$2189 = 0; i$2189 < args$2182.length; i$2189++)
                                newArgs$2188[i$2189] = args$2182[i$2189] === __$2147 ? partialArgs$2187.length === 0 ? undefined : partialArgs$2187.shift() : args$2182[i$2189];
                            return curriedFn$2181.apply(self$2184, newArgs$2188.concat(partialArgs$2187));
                        }, {
                            name: name$2180,
                            arity: arity$2179 - realArity$2183,
                            curried: true
                        });
                    g$2186.toString = curriedFn$2181.toString.bind(curriedFn$2181);
                    return g$2186;
                }
            }, {
                name: name$2180,
                arity: arity$2179,
                curried: true
            });
        curriedFn$2181.toString = f$2177.toString.bind(f$2177);
        return curriedFn$2181;
    };
    extendNative$2148(Function.prototype, 'curry', function (n$2190) {
        return curry$2150(this, n$2190);
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
        var fns$2191 = __slice$2146.call(arguments), self$2192 = this;
        return fns$2191.reduce(function (f$2193, g$2194) {
            return function () {
                return f$2193.call(self$2192, g$2194.apply(self$2192, arguments));
            };
        });
    };
    // *****************************
    // ** CurryJS.Data.Collection **
    // *****************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2154(f$2195, acc$2196, xs$2197) {
        return function $_name(f$2198, acc$2199, xs$2200) {
            return xs$2200.reduce(f$2198, acc$2199);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2157(f$2201, xs$2202) {
        return function $_name(f$2203, xs$2204) {
            return xs$2204.reduce(f$2203);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2160(f$2205, acc$2206, xs$2207) {
        return function $_name(f$2208, acc$2209, xs$2210) {
            return xs$2210.reduceRight(f$2208, acc$2209);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2163(f$2211, xs$2212) {
        return function $_name(f$2213, xs$2214) {
            return xs$2214.reduceRight(f$2213);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2166(f$2215, xs$2216) {
        return function $_name(f$2217, xs$2218) {
            return xs$2218.map(f$2217);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2169(f$2219, xs$2220) {
        return function $_name(f$2221, xs$2222) {
            return xs$2222.ap(f$2221);
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
        Control: {
            Functor: { map: map$2166 },
            Applicative: { ap: ap$2169 }
        }
    };
}());
//# sourceMappingURL=curry.js.map