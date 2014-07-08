(function () {
    'use strict';
    var Base$2222 = require('./adt-derivers').Base;
    var __slice$2224 = [].slice;
    var __toString$2226 = {}.toString;
    // ***************************************************************
    // **                       CurryJS.Core                        **
    // ***************************************************************
    // __ :: () -> ()
    var __$2227 = function noop() {
    };
    var extendNative$2228 = function (native$2324, prop$2325, f$2326) {
        return Object.defineProperty(native$2324, prop$2325, { value: f$2326 });
    };
    var withMeta$2229 = function (f$2327, meta$2328) {
        var keys$2329 = Object.keys(meta$2328);
        keys$2329.forEach(function (name$2330) {
            Object.defineProperty(f$2327, '__' + name$2330, { value: meta$2328[name$2330] });
        });
        return f$2327;
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
    var curry$2230 = function (f$2331, n$2332) {
        var arity$2333 = typeof n$2332 !== 'undefined' ? n$2332 : typeof f$2331.__arity !== 'undefined' ? f$2331.__arity : f$2331.length, name$2334 = f$2331.name || f$2331.__name;
        if (arity$2333 < 2)
            return f$2331;
        var curriedFn$2335 = withMeta$2229(function () {
                var args$2336 = [].slice.call(arguments, 0, arity$2333), realArity$2337 = args$2336.filter(function (x$2339) {
                        return x$2339 !== __$2227;
                    }).length, self$2338 = this;
                if (realArity$2337 >= arity$2333)
                    return f$2331.apply(self$2338, arguments);
                else {
                    var g$2340 = withMeta$2229(function () {
                            var partialArgs$2341 = [].slice.call(arguments), newArgs$2342 = [];
                            for (var i$2343 = 0; i$2343 < args$2336.length; i$2343++)
                                newArgs$2342[i$2343] = args$2336[i$2343] === __$2227 ? partialArgs$2341.length === 0 ? undefined : partialArgs$2341.shift() : args$2336[i$2343];
                            return curriedFn$2335.apply(self$2338, newArgs$2342.concat(partialArgs$2341));
                        }, {
                            name: name$2334,
                            arity: arity$2333 - realArity$2337,
                            curried: true
                        });
                    g$2340.toString = curriedFn$2335.toString.bind(curriedFn$2335);
                    return g$2340;
                }
            }, {
                name: name$2334,
                arity: arity$2333,
                curried: true
            });
        curriedFn$2335.toString = f$2331.toString.bind(f$2331);
        return curriedFn$2335;
    };
    extendNative$2228(Function.prototype, 'curry', function (n$2344) {
        return curry$2230(this, n$2344);
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
    var compose$2231 = function () {
        var fns$2345 = __slice$2224.call(arguments), self$2346 = this;
        return fns$2345.reduce(function (f$2347, g$2348) {
            return function () {
                return f$2347.call(self$2346, g$2348.apply(self$2346, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2269(x$2349) {
        return function not$2269(x$2350) {
            return !x$2350;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2270(xs$2351) {
        return function and$2270(xs$2352) {
            return xs$2352.every(function (x$2353) {
                return !!x$2353;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2271(xs$2354) {
        return function or$2271(xs$2355) {
            return xs$2355.some(function (x$2356) {
                return !!x$2356;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2272(x$2357) {
        return function isObject$2272(x$2358) {
            return function (a0$2359) {
                if (Object.prototype.toString.call(a0$2359) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2358);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2273(x$2360) {
        return function isArray$2273(x$2361) {
            return function (a0$2362) {
                if (Array.isArray ? Array.isArray(a0$2362) : Object.prototype.toString.call(a0$2362) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2361);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2274(x$2363) {
        return function isNumber$2274(x$2364) {
            return function (a0$2365) {
                if (typeof a0$2365 === 'number' || Object.prototype.toString.call(a0$2365) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2364);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2275(x$2366) {
        return function isRegExp$2275(x$2367) {
            return function (a0$2368) {
                if (Object.prototype.toString.call(a0$2368) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2367);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2276(x$2369) {
        return function isString$2276(x$2370) {
            return function (a0$2371) {
                if (typeof a0$2371 === 'string' || Object.prototype.toString.call(a0$2371) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2370);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2277(x$2372) {
        return function isNull$2277(x$2373) {
            return function (a0$2374) {
                if (a0$2374 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2373);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2278(x$2375) {
        return function isUndef$2278(x$2376) {
            return function (a0$2377) {
                if (a0$2377 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2376);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2279(x$2378) {
        return function exists$2279(x$2379) {
            return function (x$2380) {
                return not$2269(or$2271(x$2380));
            }([
                isNull$2277(x$2379),
                isUndef$2278(x$2379)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2280(f$2381, xs$2382) {
        return function map$2280(f$2383, xs$2384) {
            return xs$2384.map(f$2383);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2282(f$2385, xs$2386) {
        return function ap$2282(f$2387, xs$2388) {
            return f$2387.ap(xs$2388);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2284(xs$2389, f$2390) {
        return function chain$2284(xs$2391, f$2392) {
            return xs$2391.chain(f$2392);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2289(f$2393, x$2394) {
        return function pure$2289(f$2395, x$2396) {
            return f$2395.of ? f$2395.of(x$2396) : f$2395.constructor.of(x$2396);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2290 = function () {
            function Option$2397() {
            }
            function Some$2398(val$2401) {
                if (!(this instanceof Some$2398)) {
                    return new Some$2398(val$2401);
                }
                this.val = val$2401;
            }
            Some$2398.prototype = new Option$2397();
            Some$2398.prototype.constructor = Some$2398;
            function None$2399() {
            }
            None$2399.prototype = new Option$2397();
            None$2399.prototype.constructor = None$2399;
            var derived$2400 = Base$2222.derive({
                    name: 'Option',
                    constructor: Option$2397,
                    prototype: Option$2397.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2398,
                            prototype: Some$2398.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2399,
                            prototype: None$2399.prototype
                        }
                    ]
                });
            Option$2397.Some = derived$2400.variants[0].constructor;
            Option$2397.None = new derived$2400.variants[1].constructor();
            return Option$2397;
        }();
    var Some$2291 = Option$2290.Some;
    var None$2292 = Option$2290.None;
    Option$2290.of = Some$2291;
    Option$2290.prototype.map = function (f$2402) {
        return this.chain(function (x$2403) {
            return pure$2289(this)(f$2402(x$2403));
        }.bind(this));
    }.curry();
    Option$2290.prototype.ap = function (x$2404) {
        return this.chain(map$2280(__$2227, x$2404).bind(this));
    }.curry();
    Option$2290.prototype.chain = function (f$2405) {
        return function (a0$2406) {
            var r0$2407 = Some$2291.unapply(a0$2406);
            if (r0$2407 != null && r0$2407.length === 1) {
                var x$2408 = r0$2407[0];
                return f$2405(x$2408);
            }
            if (None$2292.hasInstance ? None$2292.hasInstance(a0$2406) : a0$2406 instanceof None$2292) {
                return None$2292;
            }
            throw new TypeError('No match');
        }.call(this, this);
    }.curry();
    Option$2290.prototype.empty = function () {
        return None$2292;
    }.curry();
    Option$2290.prototype.concat = function (other$2409) {
        return function (a0$2410, a1$2411) {
            if (None$2292.hasInstance ? None$2292.hasInstance(a0$2410) : a0$2410 instanceof None$2292) {
                return other$2409;
            }
            if (None$2292.hasInstance ? None$2292.hasInstance(a1$2411) : a1$2411 instanceof None$2292) {
                return this;
            }
            var r0$2412 = Some$2291.unapply(a1$2411);
            if (r0$2412 != null && r0$2412.length === 1) {
                var r1$2413 = Some$2291.unapply(a0$2410);
                if (r1$2413 != null && r1$2413.length === 1) {
                    var v1$2414 = r1$2413[0];
                    var v2$2415 = r0$2412[0];
                    return Some$2291(v1$2414.concat(v2$2415));
                }
            }
            throw new TypeError('No match');
        }.call(this, this, other$2409);
    }.curry();
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2308(f$2416, acc$2417, xs$2418) {
        return function foldl$2308(f$2419, acc$2420, xs$2421) {
            return xs$2421.reduce(f$2419, acc$2420);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2310(f$2422, xs$2423) {
        return function foldl1$2310(f$2424, xs$2425) {
            return xs$2425.reduce(f$2424);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2312(f$2426, acc$2427, xs$2428) {
        return function foldr$2312(f$2429, acc$2430, xs$2431) {
            return xs$2431.reduceRight(f$2429, acc$2430);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2314(f$2432, xs$2433) {
        return function foldr1$2314(f$2434, xs$2435) {
            return xs$2435.reduceRight(f$2434);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2317(xs$2436) {
        return function flatten$2317(xs$2437) {
            return foldl1$2310(function (xs$2438, ys$2439) {
                return xs$2438.concat(ys$2439);
            }.curry(), xs$2437);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2228(Array, 'of', function (x$2440) {
        return [x$2440];
    }.curry());
    extendNative$2228(Array.prototype, 'ap', function (x$2441) {
        return this.chain(map$2280(__$2227, x$2441).bind(this));
    }.curry());
    extendNative$2228(Array.prototype, 'chain', function (f$2442) {
        return function (x$2443) {
            return flatten$2317(map$2280(f$2442)(x$2443));
        }(this);
    }.curry());
    module.exports = {
        Core: {
            __: __$2227,
            curry: curry$2230,
            compose: compose$2231
        },
        Predicates: {
            not: not$2269,
            and: and$2270,
            or: or$2271,
            isObject: isObject$2272,
            isArray: isArray$2273,
            isNumber: isNumber$2274,
            isRegExp: isRegExp$2275,
            isString: isString$2276,
            isNull: isNull$2277,
            isUndef: isUndef$2278,
            exists: exists$2279
        },
        Data: {
            Option: {
                Option: Option$2290,
                Some: Some$2291,
                None: None$2292
            },
            Collection: {
                foldl: foldl$2308,
                foldl1: foldl1$2310,
                foldr: foldr$2312,
                foldr1: foldr1$2314,
                flatten: flatten$2317
            }
        },
        Control: {
            Functor: { map: map$2280 },
            Applicative: { ap: ap$2282 },
            Monad: { chain: chain$2284 }
        }
    };
}());
//# sourceMappingURL=curry.js.map