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
    var extendNative$2150 = function (native$2209, prop$2210, f$2211) {
        return Object.defineProperty(native$2209, prop$2210, { value: f$2211 });
    };
    var withMeta$2151 = function (f$2212, meta$2213) {
        var keys$2214 = Object.keys(meta$2213);
        keys$2214.forEach(function (name$2215) {
            Object.defineProperty(f$2212, '__' + name$2215, { value: meta$2213[name$2215] });
        });
        return f$2212;
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
    var curry$2152 = function (f$2216, n$2217) {
        var arity$2218 = typeof n$2217 !== 'undefined' ? n$2217 : typeof f$2216.__arity !== 'undefined' ? f$2216.__arity : f$2216.length, name$2219 = f$2216.name || f$2216.__name;
        var curriedFn$2220 = withMeta$2151(function () {
                var args$2221 = [].slice.call(arguments, 0, arity$2218), realArity$2222 = args$2221.filter(function (x$2224) {
                        return x$2224 !== __$2149;
                    }).length, self$2223 = this;
                if (realArity$2222 >= arity$2218)
                    return f$2216.apply(self$2223, arguments);
                else {
                    var g$2225 = withMeta$2151(function () {
                            var partialArgs$2226 = [].slice.call(arguments), newArgs$2227 = [];
                            for (var i$2228 = 0; i$2228 < args$2221.length; i$2228++)
                                newArgs$2227[i$2228] = args$2221[i$2228] === __$2149 ? partialArgs$2226.length === 0 ? undefined : partialArgs$2226.shift() : args$2221[i$2228];
                            return curriedFn$2220.apply(self$2223, newArgs$2227.concat(partialArgs$2226));
                        }, {
                            name: name$2219,
                            arity: arity$2218 - realArity$2222,
                            curried: true
                        });
                    g$2225.toString = curriedFn$2220.toString.bind(curriedFn$2220);
                    return g$2225;
                }
            }, {
                name: name$2219,
                arity: arity$2218,
                curried: true
            });
        curriedFn$2220.toString = f$2216.toString.bind(f$2216);
        return curriedFn$2220;
    };
    extendNative$2150(Function.prototype, 'curry', function (n$2229) {
        return curry$2152(this, n$2229);
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
        var fns$2230 = __slice$2146.call(arguments), self$2231 = this;
        return fns$2230.reduce(function (f$2232, g$2233) {
            return function () {
                return f$2232.call(self$2231, g$2233.apply(self$2231, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2166(x$2234) {
        return function $_name(x$2235) {
            return !x$2235;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2167(xs$2236) {
        return function $_name(xs$2237) {
            return xs$2237.every(function (x$2238) {
                return !!x$2238;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2168(xs$2239) {
        return function $_name(xs$2240) {
            return xs$2240.some(function (x$2241) {
                return !!x$2241;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2171(obj$2242) {
        return function $_name(obj$2243) {
            return function (a0$2246) {
                if (Object.prototype.toString.call(a0$2246) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, obj$2243);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2174(obj$2247) {
        return function $_name(obj$2248) {
            return function (a0$2251) {
                if (Array.isArray ? Array.isArray(a0$2251) : Object.prototype.toString.call(a0$2251) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, obj$2248);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2177(obj$2252) {
        return function $_name(obj$2253) {
            return function (a0$2256) {
                if (typeof a0$2256 === 'number' || Object.prototype.toString.call(a0$2256) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, obj$2253);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2180(obj$2257) {
        return function $_name(obj$2258) {
            return function (a0$2261) {
                if (Object.prototype.toString.call(a0$2261) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, obj$2258);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2183(obj$2262) {
        return function $_name(obj$2263) {
            return function (a0$2266) {
                if (typeof a0$2266 === 'string' || Object.prototype.toString.call(a0$2266) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, obj$2263);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2186(obj$2267) {
        return function $_name(obj$2268) {
            return function (a0$2271) {
                if (a0$2271 === null) {
                    return true;
                }
                return false;
            }.call(this, obj$2268);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2189(obj$2272) {
        return function $_name(obj$2273) {
            return function (a0$2276) {
                if (a0$2276 === void 0) {
                    return true;
                }
                return false;
            }.call(this, obj$2273);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2190(f$2277, xs$2278) {
        return function $_name(f$2279, xs$2280) {
            return xs$2280.map(f$2279);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2193(f$2281, xs$2282) {
        return function $_name(f$2283, xs$2284) {
            return xs$2284.ap(f$2283);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2196(xs$2285, f$2286) {
        return function $_name(xs$2287, f$2288) {
            return xs$2287.chain(f$2288);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2199(f$2289, acc$2290, xs$2291) {
        return function $_name(f$2292, acc$2293, xs$2294) {
            return xs$2294.reduce(f$2292, acc$2293);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2202(f$2295, xs$2296) {
        return function $_name(f$2297, xs$2298) {
            return xs$2298.reduce(f$2297);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2205(f$2299, acc$2300, xs$2301) {
        return function $_name(f$2302, acc$2303, xs$2304) {
            return xs$2304.reduceRight(f$2302, acc$2303);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2208(f$2305, xs$2306) {
        return function $_name(f$2307, xs$2308) {
            return xs$2308.reduceRight(f$2307);
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
            not: not$2166,
            and: and$2167,
            or: or$2168,
            isObject: isObject$2171,
            isArray: isArray$2174,
            isNumber: isNumber$2177,
            isRegExp: isRegExp$2180,
            isString: isString$2183,
            isNull: isNull$2186,
            isUndef: isUndef$2189
        },
        Data: {
            Collection: {
                foldl: foldl$2199,
                foldl1: foldl1$2202,
                foldr: foldr$2205,
                foldr1: foldr1$2208
            }
        },
        Control: {
            Functor: { map: map$2190 },
            Applicative: { ap: ap$2193 },
            Monad: { chain: chain$2196 }
        }
    };
}());
//# sourceMappingURL=curry.js.map