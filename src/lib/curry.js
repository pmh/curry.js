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
    var extendNative$2150 = function (native$2204, prop$2205, f$2206) {
        return Object.defineProperty(native$2204, prop$2205, { value: f$2206 });
    };
    var withMeta$2151 = function (f$2207, meta$2208) {
        var keys$2209 = Object.keys(meta$2208);
        keys$2209.forEach(function (name$2210) {
            Object.defineProperty(f$2207, '__' + name$2210, { value: meta$2208[name$2210] });
        });
        return f$2207;
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
    var curry$2152 = function (f$2211, n$2212) {
        var arity$2213 = typeof n$2212 !== 'undefined' ? n$2212 : typeof f$2211.__arity !== 'undefined' ? f$2211.__arity : f$2211.length, name$2214 = f$2211.name || f$2211.__name;
        var curriedFn$2215 = withMeta$2151(function () {
                var args$2216 = [].slice.call(arguments, 0, arity$2213), realArity$2217 = args$2216.filter(function (x$2219) {
                        return x$2219 !== __$2149;
                    }).length, self$2218 = this;
                if (realArity$2217 >= arity$2213)
                    return f$2211.apply(self$2218, arguments);
                else {
                    var g$2220 = withMeta$2151(function () {
                            var partialArgs$2221 = [].slice.call(arguments), newArgs$2222 = [];
                            for (var i$2223 = 0; i$2223 < args$2216.length; i$2223++)
                                newArgs$2222[i$2223] = args$2216[i$2223] === __$2149 ? partialArgs$2221.length === 0 ? undefined : partialArgs$2221.shift() : args$2216[i$2223];
                            return curriedFn$2215.apply(self$2218, newArgs$2222.concat(partialArgs$2221));
                        }, {
                            name: name$2214,
                            arity: arity$2213 - realArity$2217,
                            curried: true
                        });
                    g$2220.toString = curriedFn$2215.toString.bind(curriedFn$2215);
                    return g$2220;
                }
            }, {
                name: name$2214,
                arity: arity$2213,
                curried: true
            });
        curriedFn$2215.toString = f$2211.toString.bind(f$2211);
        return curriedFn$2215;
    };
    extendNative$2150(Function.prototype, 'curry', function (n$2224) {
        return curry$2152(this, n$2224);
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
        var fns$2225 = __slice$2146.call(arguments), self$2226 = this;
        return fns$2225.reduce(function (f$2227, g$2228) {
            return function () {
                return f$2227.call(self$2226, g$2228.apply(self$2226, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2162(x$2229) {
        return function $_name(x$2230) {
            return !x$2230;
        }.curry().apply(null, arguments);
    }
    // and :: Truthy -> Truthy -> Bool
    function and$2163(xs$2231) {
        return function $_name(xs$2232) {
            return xs$2232.every(function (x$2233) {
                return !!x$2233;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2166(obj$2234) {
        return function $_name(obj$2235) {
            return function (a0$2238) {
                if (Object.prototype.toString.call(a0$2238) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, obj$2235);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2169(obj$2239) {
        return function $_name(obj$2240) {
            return function (a0$2243) {
                if (Array.isArray ? Array.isArray(a0$2243) : Object.prototype.toString.call(a0$2243) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, obj$2240);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2172(obj$2244) {
        return function $_name(obj$2245) {
            return function (a0$2248) {
                if (typeof a0$2248 === 'number' || Object.prototype.toString.call(a0$2248) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, obj$2245);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2175(obj$2249) {
        return function $_name(obj$2250) {
            return function (a0$2253) {
                if (Object.prototype.toString.call(a0$2253) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, obj$2250);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2178(obj$2254) {
        return function $_name(obj$2255) {
            return function (a0$2258) {
                if (typeof a0$2258 === 'string' || Object.prototype.toString.call(a0$2258) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, obj$2255);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2181(obj$2259) {
        return function $_name(obj$2260) {
            return function (a0$2263) {
                if (a0$2263 === null) {
                    return true;
                }
                return false;
            }.call(this, obj$2260);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2184(obj$2264) {
        return function $_name(obj$2265) {
            return function (a0$2268) {
                if (a0$2268 === void 0) {
                    return true;
                }
                return false;
            }.call(this, obj$2265);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2185(f$2269, xs$2270) {
        return function $_name(f$2271, xs$2272) {
            return xs$2272.map(f$2271);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2188(f$2273, xs$2274) {
        return function $_name(f$2275, xs$2276) {
            return xs$2276.ap(f$2275);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2191(xs$2277, f$2278) {
        return function $_name(xs$2279, f$2280) {
            return xs$2279.chain(f$2280);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2194(f$2281, acc$2282, xs$2283) {
        return function $_name(f$2284, acc$2285, xs$2286) {
            return xs$2286.reduce(f$2284, acc$2285);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2197(f$2287, xs$2288) {
        return function $_name(f$2289, xs$2290) {
            return xs$2290.reduce(f$2289);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2200(f$2291, acc$2292, xs$2293) {
        return function $_name(f$2294, acc$2295, xs$2296) {
            return xs$2296.reduceRight(f$2294, acc$2295);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2203(f$2297, xs$2298) {
        return function $_name(f$2299, xs$2300) {
            return xs$2300.reduceRight(f$2299);
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
            not: not$2162,
            and: and$2163,
            isObject: isObject$2166,
            isArray: isArray$2169,
            isNumber: isNumber$2172,
            isRegExp: isRegExp$2175,
            isString: isString$2178,
            isNull: isNull$2181,
            isUndef: isUndef$2184
        },
        Data: {
            Collection: {
                foldl: foldl$2194,
                foldl1: foldl1$2197,
                foldr: foldr$2200,
                foldr1: foldr1$2203
            }
        },
        Control: {
            Functor: { map: map$2185 },
            Applicative: { ap: ap$2188 },
            Monad: { chain: chain$2191 }
        }
    };
}());
//# sourceMappingURL=curry.js.map