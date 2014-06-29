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
    var extendNative$2150 = function (native$2214, prop$2215, f$2216) {
        return Object.defineProperty(native$2214, prop$2215, { value: f$2216 });
    };
    var withMeta$2151 = function (f$2217, meta$2218) {
        var keys$2219 = Object.keys(meta$2218);
        keys$2219.forEach(function (name$2220) {
            Object.defineProperty(f$2217, '__' + name$2220, { value: meta$2218[name$2220] });
        });
        return f$2217;
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
    var curry$2152 = function (f$2221, n$2222) {
        var arity$2223 = typeof n$2222 !== 'undefined' ? n$2222 : typeof f$2221.__arity !== 'undefined' ? f$2221.__arity : f$2221.length, name$2224 = f$2221.name || f$2221.__name;
        if (arity$2223 < 2)
            return f$2221;
        var curriedFn$2225 = withMeta$2151(function () {
                var args$2226 = [].slice.call(arguments, 0, arity$2223), realArity$2227 = args$2226.filter(function (x$2229) {
                        return x$2229 !== __$2149;
                    }).length, self$2228 = this;
                if (realArity$2227 >= arity$2223)
                    return f$2221.apply(self$2228, arguments);
                else {
                    var g$2230 = withMeta$2151(function () {
                            var partialArgs$2231 = [].slice.call(arguments), newArgs$2232 = [];
                            for (var i$2233 = 0; i$2233 < args$2226.length; i$2233++)
                                newArgs$2232[i$2233] = args$2226[i$2233] === __$2149 ? partialArgs$2231.length === 0 ? undefined : partialArgs$2231.shift() : args$2226[i$2233];
                            return curriedFn$2225.apply(self$2228, newArgs$2232.concat(partialArgs$2231));
                        }, {
                            name: name$2224,
                            arity: arity$2223 - realArity$2227,
                            curried: true
                        });
                    g$2230.toString = curriedFn$2225.toString.bind(curriedFn$2225);
                    return g$2230;
                }
            }, {
                name: name$2224,
                arity: arity$2223,
                curried: true
            });
        curriedFn$2225.toString = f$2221.toString.bind(f$2221);
        return curriedFn$2225;
    };
    extendNative$2150(Function.prototype, 'curry', function (n$2234) {
        return curry$2152(this, n$2234);
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
        var fns$2235 = __slice$2146.call(arguments), self$2236 = this;
        return fns$2235.reduce(function (f$2237, g$2238) {
            return function () {
                return f$2237.call(self$2236, g$2238.apply(self$2236, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2166(x$2239) {
        return function $_name(x$2240) {
            return !x$2240;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2167(xs$2241) {
        return function $_name(xs$2242) {
            return xs$2242.every(function (x$2243) {
                return !!x$2243;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2168(xs$2244) {
        return function $_name(xs$2245) {
            return xs$2245.some(function (x$2246) {
                return !!x$2246;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2171(x$2247) {
        return function $_name(x$2248) {
            return function (a0$2251) {
                if (Object.prototype.toString.call(a0$2251) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2248);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2174(x$2252) {
        return function $_name(x$2253) {
            return function (a0$2256) {
                if (Array.isArray ? Array.isArray(a0$2256) : Object.prototype.toString.call(a0$2256) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2253);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2177(x$2257) {
        return function $_name(x$2258) {
            return function (a0$2261) {
                if (typeof a0$2261 === 'number' || Object.prototype.toString.call(a0$2261) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2258);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2180(x$2262) {
        return function $_name(x$2263) {
            return function (a0$2266) {
                if (Object.prototype.toString.call(a0$2266) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2263);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2183(x$2267) {
        return function $_name(x$2268) {
            return function (a0$2271) {
                if (typeof a0$2271 === 'string' || Object.prototype.toString.call(a0$2271) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2268);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2186(x$2272) {
        return function $_name(x$2273) {
            return function (a0$2276) {
                if (a0$2276 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2273);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2193(x$2277) {
        return function $_name(x$2278) {
            return function (a0$2281) {
                if (a0$2281 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2278);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2194(x$2282) {
        return function $_name(x$2283) {
            return function (x$2284) {
                return not$2166(or$2168(x$2284));
            }([
                isNull$2186(x$2283),
                isUndef$2193(x$2283)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2195(f$2285, xs$2286) {
        return function $_name(f$2287, xs$2288) {
            return xs$2288.map(f$2287);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2198(f$2289, xs$2290) {
        return function $_name(f$2291, xs$2292) {
            return xs$2292.ap(f$2291);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2201(xs$2293, f$2294) {
        return function $_name(xs$2295, f$2296) {
            return xs$2295.chain(f$2296);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2204(f$2297, acc$2298, xs$2299) {
        return function $_name(f$2300, acc$2301, xs$2302) {
            return xs$2302.reduce(f$2300, acc$2301);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2207(f$2303, xs$2304) {
        return function $_name(f$2305, xs$2306) {
            return xs$2306.reduce(f$2305);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2210(f$2307, acc$2308, xs$2309) {
        return function $_name(f$2310, acc$2311, xs$2312) {
            return xs$2312.reduceRight(f$2310, acc$2311);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2213(f$2313, xs$2314) {
        return function $_name(f$2315, xs$2316) {
            return xs$2316.reduceRight(f$2315);
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
            isUndef: isUndef$2193,
            exists: exists$2194
        },
        Data: {
            Collection: {
                foldl: foldl$2204,
                foldl1: foldl1$2207,
                foldr: foldr$2210,
                foldr1: foldr1$2213
            }
        },
        Control: {
            Functor: { map: map$2195 },
            Applicative: { ap: ap$2198 },
            Monad: { chain: chain$2201 }
        }
    };
}());
//# sourceMappingURL=curry.js.map