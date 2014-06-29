(function () {
    'use strict';
    var Base$2144 = require('./adt-derivers').Base;
    var __slice$2146 = [].slice;
    var __toString$2148 = {}.toString;
    // ***************************************************************
    // **                       CurryJS.Core                        **
    // ***************************************************************
    // __ :: () -> ()
    var __$2149 = function noop() {
    };
    var extendNative$2150 = function (native$2199, prop$2200, f$2201) {
        return Object.defineProperty(native$2199, prop$2200, { value: f$2201 });
    };
    var withMeta$2151 = function (f$2202, meta$2203) {
        var keys$2204 = Object.keys(meta$2203);
        keys$2204.forEach(function (name$2205) {
            Object.defineProperty(f$2202, '__' + name$2205, { value: meta$2203[name$2205] });
        });
        return f$2202;
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
    var curry$2152 = function (f$2206, n$2207) {
        var arity$2208 = typeof n$2207 !== 'undefined' ? n$2207 : typeof f$2206.__arity !== 'undefined' ? f$2206.__arity : f$2206.length, name$2209 = f$2206.name || f$2206.__name;
        var curriedFn$2210 = withMeta$2151(function () {
                var args$2211 = [].slice.call(arguments, 0, arity$2208), realArity$2212 = args$2211.filter(function (x$2214) {
                        return x$2214 !== __$2149;
                    }).length, self$2213 = this;
                if (realArity$2212 >= arity$2208)
                    return f$2206.apply(self$2213, arguments);
                else {
                    var g$2215 = withMeta$2151(function () {
                            var partialArgs$2216 = [].slice.call(arguments), newArgs$2217 = [];
                            for (var i$2218 = 0; i$2218 < args$2211.length; i$2218++)
                                newArgs$2217[i$2218] = args$2211[i$2218] === __$2149 ? partialArgs$2216.length === 0 ? undefined : partialArgs$2216.shift() : args$2211[i$2218];
                            return curriedFn$2210.apply(self$2213, newArgs$2217.concat(partialArgs$2216));
                        }, {
                            name: name$2209,
                            arity: arity$2208 - realArity$2212,
                            curried: true
                        });
                    g$2215.toString = curriedFn$2210.toString.bind(curriedFn$2210);
                    return g$2215;
                }
            }, {
                name: name$2209,
                arity: arity$2208,
                curried: true
            });
        curriedFn$2210.toString = f$2206.toString.bind(f$2206);
        return curriedFn$2210;
    };
    extendNative$2150(Function.prototype, 'curry', function (n$2219) {
        return curry$2152(this, n$2219);
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
    var compose$2153 = function () {
        var fns$2220 = __slice$2146.call(arguments), self$2221 = this;
        return fns$2220.reduce(function (f$2222, g$2223) {
            return function () {
                return f$2222.call(self$2221, g$2223.apply(self$2221, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: a -> Bool
    function not$2156(x$2224) {
        return function $_name(x$2225) {
            return !x$2225;
        }.curry().apply(null, arguments);
    }
    ;
    // isObject :: a -> Bool
    function isObject$2161(obj$2226) {
        return function $_name(obj$2227) {
            return function (a0$2230) {
                if (Object.prototype.toString.call(a0$2230) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, obj$2227);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2164(obj$2231) {
        return function $_name(obj$2232) {
            return function (a0$2235) {
                if (Array.isArray ? Array.isArray(a0$2235) : Object.prototype.toString.call(a0$2235) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, obj$2232);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2167(obj$2236) {
        return function $_name(obj$2237) {
            return function (a0$2240) {
                if (typeof a0$2240 === 'number' || Object.prototype.toString.call(a0$2240) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, obj$2237);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2170(obj$2241) {
        return function $_name(obj$2242) {
            return function (a0$2245) {
                if (Object.prototype.toString.call(a0$2245) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, obj$2242);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2173(obj$2246) {
        return function $_name(obj$2247) {
            return function (a0$2250) {
                if (typeof a0$2250 === 'string' || Object.prototype.toString.call(a0$2250) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, obj$2247);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2176(obj$2251) {
        return function $_name(obj$2252) {
            return function (a0$2255) {
                if (a0$2255 === null) {
                    return true;
                }
                return false;
            }.call(this, obj$2252);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2179(obj$2256) {
        return function $_name(obj$2257) {
            return function (a0$2260) {
                if (a0$2260 === void 0) {
                    return true;
                }
                return false;
            }.call(this, obj$2257);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2180(f$2261, xs$2262) {
        return function $_name(f$2263, xs$2264) {
            return xs$2264.map(f$2263);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2183(f$2265, xs$2266) {
        return function $_name(f$2267, xs$2268) {
            return xs$2268.ap(f$2267);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2186(xs$2269, f$2270) {
        return function $_name(xs$2271, f$2272) {
            return xs$2271.chain(f$2272);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2189(f$2273, acc$2274, xs$2275) {
        return function $_name(f$2276, acc$2277, xs$2278) {
            return xs$2278.reduce(f$2276, acc$2277);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2192(f$2279, xs$2280) {
        return function $_name(f$2281, xs$2282) {
            return xs$2282.reduce(f$2281);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2195(f$2283, acc$2284, xs$2285) {
        return function $_name(f$2286, acc$2287, xs$2288) {
            return xs$2288.reduceRight(f$2286, acc$2287);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2198(f$2289, xs$2290) {
        return function $_name(f$2291, xs$2292) {
            return xs$2292.reduceRight(f$2291);
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        Core: {
            __: __$2149,
            curry: curry$2152,
            compose: compose$2153
        },
        Predicates: {
            not: not$2156,
            is: is,
            isObject: isObject$2161,
            isArray: isArray$2164,
            isNumber: isNumber$2167,
            isRegExp: isRegExp$2170,
            isString: isString$2173,
            isNull: isNull$2176,
            isUndef: isUndef$2179
        },
        Data: {
            Collection: {
                foldl: foldl$2189,
                foldl1: foldl1$2192,
                foldr: foldr$2195,
                foldr1: foldr1$2198
            }
        },
        Control: {
            Functor: { map: map$2180 },
            Applicative: { ap: ap$2183 },
            Monad: { chain: chain$2186 }
        }
    };
}());
//# sourceMappingURL=curry.js.map