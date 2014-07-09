(function () {
    'use strict';
    var Base$2252 = require('./adt-derivers').Base;
    var __slice$2254 = [].slice;
    var __toString$2256 = {}.toString;
    // ***************************************************************
    // **                       CurryJS.Core                        **
    // ***************************************************************
    // __ :: () -> ()
    var __$2257 = function noop() {
    };
    var extendNative$2258 = function (native$2355, prop$2356, f$2357) {
        return Object.defineProperty(native$2355, prop$2356, { value: f$2357 });
    };
    var withMeta$2259 = function (f$2358, meta$2359) {
        var keys$2360 = Object.keys(meta$2359);
        keys$2360.forEach(function (name$2361) {
            Object.defineProperty(f$2358, '__' + name$2361, { value: meta$2359[name$2361] });
        });
        return f$2358;
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
    var curry$2260 = function (f$2362, n$2363) {
        var arity$2364 = typeof n$2363 !== 'undefined' ? n$2363 : typeof f$2362.__arity !== 'undefined' ? f$2362.__arity : f$2362.length, name$2365 = f$2362.name || f$2362.__name;
        if (arity$2364 < 2)
            return f$2362;
        var curriedFn$2366 = withMeta$2259(function () {
                var args$2367 = [].slice.call(arguments, 0, arity$2364), realArity$2368 = args$2367.filter(function (x$2370) {
                        return x$2370 !== __$2257;
                    }).length, self$2369 = this;
                if (realArity$2368 >= arity$2364)
                    return f$2362.apply(self$2369, arguments);
                else {
                    var g$2371 = withMeta$2259(function () {
                            var partialArgs$2372 = [].slice.call(arguments), newArgs$2373 = [];
                            for (var i$2374 = 0; i$2374 < args$2367.length; i$2374++)
                                newArgs$2373[i$2374] = args$2367[i$2374] === __$2257 ? partialArgs$2372.length === 0 ? undefined : partialArgs$2372.shift() : args$2367[i$2374];
                            return curriedFn$2366.apply(self$2369, newArgs$2373.concat(partialArgs$2372));
                        }, {
                            name: name$2365,
                            arity: arity$2364 - realArity$2368,
                            curried: true
                        });
                    g$2371.toString = curriedFn$2366.toString.bind(curriedFn$2366);
                    return g$2371;
                }
            }, {
                name: name$2365,
                arity: arity$2364,
                curried: true
            });
        curriedFn$2366.toString = f$2362.toString.bind(f$2362);
        return curriedFn$2366;
    };
    extendNative$2258(Function.prototype, 'curry', function (n$2375) {
        return curry$2260(this, n$2375);
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
    var compose$2261 = function () {
        var fns$2376 = __slice$2254.call(arguments), self$2377 = this;
        return fns$2376.reduce(function (f$2378, g$2379) {
            return function () {
                return f$2378.call(self$2377, g$2379.apply(self$2377, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2299(x$2380) {
        return function not$2299(x$2381) {
            return !x$2381;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2300(xs$2382) {
        return function and$2300(xs$2383) {
            return xs$2383.every(function (x$2384) {
                return !!x$2384;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2301(xs$2385) {
        return function or$2301(xs$2386) {
            return xs$2386.some(function (x$2387) {
                return !!x$2387;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2302(x$2388) {
        return function isObject$2302(x$2389) {
            return function (a0$2390) {
                if (Object.prototype.toString.call(a0$2390) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2389);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2303(x$2391) {
        return function isArray$2303(x$2392) {
            return function (a0$2393) {
                if (Array.isArray ? Array.isArray(a0$2393) : Object.prototype.toString.call(a0$2393) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2392);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2304(x$2394) {
        return function isNumber$2304(x$2395) {
            return function (a0$2396) {
                if (typeof a0$2396 === 'number' || Object.prototype.toString.call(a0$2396) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2395);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2305(x$2397) {
        return function isRegExp$2305(x$2398) {
            return function (a0$2399) {
                if (Object.prototype.toString.call(a0$2399) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2398);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2306(x$2400) {
        return function isString$2306(x$2401) {
            return function (a0$2402) {
                if (typeof a0$2402 === 'string' || Object.prototype.toString.call(a0$2402) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2401);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2307(x$2403) {
        return function isNull$2307(x$2404) {
            return function (a0$2405) {
                if (a0$2405 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2404);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2308(x$2406) {
        return function isUndef$2308(x$2407) {
            return function (a0$2408) {
                if (a0$2408 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2407);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2309(x$2409) {
        return function exists$2309(x$2410) {
            return function (x$2411) {
                return not$2299(or$2301(x$2411));
            }([
                isNull$2307(x$2410),
                isUndef$2308(x$2410)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2310(f$2412, xs$2413) {
        return function map$2310(f$2414, xs$2415) {
            return xs$2415.map(f$2414);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2312(f$2416, xs$2417) {
        return function ap$2312(f$2418, xs$2419) {
            return f$2418.ap(xs$2419);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2314(xs$2420, f$2421) {
        return function chain$2314(xs$2422, f$2423) {
            return xs$2422.chain(f$2423);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2319(f$2424, x$2425) {
        return function pure$2319(f$2426, x$2427) {
            return f$2426.of ? f$2426.of(x$2427) : f$2426.constructor.of(x$2427);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2320 = function () {
            function Option$2428() {
            }
            function Some$2429(val$2432) {
                if (!(this instanceof Some$2429)) {
                    return new Some$2429(val$2432);
                }
                this.val = val$2432;
            }
            Some$2429.prototype = new Option$2428();
            Some$2429.prototype.constructor = Some$2429;
            function None$2430() {
            }
            None$2430.prototype = new Option$2428();
            None$2430.prototype.constructor = None$2430;
            var derived$2431 = Base$2252.derive({
                    name: 'Option',
                    constructor: Option$2428,
                    prototype: Option$2428.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2429,
                            prototype: Some$2429.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2430,
                            prototype: None$2430.prototype
                        }
                    ]
                });
            Option$2428.Some = derived$2431.variants[0].constructor;
            Option$2428.None = new derived$2431.variants[1].constructor();
            return Option$2428;
        }();
    var Some$2321 = Option$2320.Some;
    var None$2322 = Option$2320.None;
    Option$2320.of = Some$2321;
    Option$2320.prototype.map = function (f$2433) {
        return function (self$2434, f$2435) {
            return self$2434.chain(function (x$2436) {
                return pure$2319(self$2434)(f$2435(x$2436));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2320.prototype.ap = function (x$2437) {
        return function (self$2438, x$2439) {
            return self$2438.chain(map$2310(__$2257, x$2439).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2320.prototype.chain = function (f$2440) {
        return function (self$2441, f$2442) {
            return function (a0$2443, a1$2444) {
                var r0$2445 = Some$2321.unapply(a0$2443);
                if (r0$2445 != null && (r0$2445.length === 1 && (typeof a1$2444 === 'function' || Object.prototype.toString.call(a1$2444) === '[object Function]'))) {
                    var x$2446 = r0$2445[0];
                    return f$2442(x$2446);
                }
                if ((None$2322.hasInstance ? None$2322.hasInstance(a0$2443) : a0$2443 instanceof None$2322) && (typeof a1$2444 === 'function' || Object.prototype.toString.call(a1$2444) === '[object Function]')) {
                    return None$2322;
                }
                throw new TypeError('No match');
            }.call(this, self$2441, f$2442);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2320.prototype.empty = function () {
        return function (self$2447) {
            return None$2322;
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2320.prototype.concat = function (other$2448) {
        return function (self$2449, other$2450) {
            return function (a0$2451, a1$2452) {
                if ((None$2322.hasInstance ? None$2322.hasInstance(a0$2451) : a0$2451 instanceof None$2322) && (Option$2320.hasInstance ? Option$2320.hasInstance(a1$2452) : a1$2452 instanceof Option$2320)) {
                    return other$2450;
                }
                if ((Option$2320.hasInstance ? Option$2320.hasInstance(a0$2451) : a0$2451 instanceof Option$2320) && (None$2322.hasInstance ? None$2322.hasInstance(a1$2452) : a1$2452 instanceof None$2322)) {
                    return self$2449;
                }
                var r0$2453 = Some$2321.unapply(a0$2451);
                if (r0$2453 != null && r0$2453.length === 1) {
                    var r1$2454 = Some$2321.unapply(a1$2452);
                    if (r1$2454 != null && r1$2454.length === 1) {
                        var v1$2455 = r0$2453[0];
                        var v2$2456 = r1$2454[0];
                        return Some$2321(v1$2455.concat(v2$2456));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2449, other$2450);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2339(f$2457, acc$2458, xs$2459) {
        return function foldl$2339(f$2460, acc$2461, xs$2462) {
            return xs$2462.reduce(f$2460, acc$2461);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2341(f$2463, xs$2464) {
        return function foldl1$2341(f$2465, xs$2466) {
            return xs$2466.reduce(f$2465);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2343(f$2467, acc$2468, xs$2469) {
        return function foldr$2343(f$2470, acc$2471, xs$2472) {
            return xs$2472.reduceRight(f$2470, acc$2471);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2345(f$2473, xs$2474) {
        return function foldr1$2345(f$2475, xs$2476) {
            return xs$2476.reduceRight(f$2475);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2348(xs$2477) {
        return function flatten$2348(xs$2478) {
            return foldl1$2341(function (xs$2479, ys$2480) {
                return xs$2479.concat(ys$2480);
            }.curry(), xs$2478);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2258(Array, 'of', function (x$2481) {
        return [x$2481];
    }.curry());
    extendNative$2258(Array.prototype, 'ap', function (x$2482) {
        return this.chain(map$2310(__$2257, x$2482).bind(this));
    }.curry());
    extendNative$2258(Array.prototype, 'chain', function (f$2483) {
        return function (x$2484) {
            return flatten$2348(map$2310(f$2483)(x$2484));
        }(this);
    }.curry());
    module.exports = {
        Core: {
            __: __$2257,
            curry: curry$2260,
            compose: compose$2261
        },
        Predicates: {
            not: not$2299,
            and: and$2300,
            or: or$2301,
            isObject: isObject$2302,
            isArray: isArray$2303,
            isNumber: isNumber$2304,
            isRegExp: isRegExp$2305,
            isString: isString$2306,
            isNull: isNull$2307,
            isUndef: isUndef$2308,
            exists: exists$2309
        },
        Data: {
            Option: {
                Option: Option$2320,
                Some: Some$2321,
                None: None$2322
            },
            Collection: {
                foldl: foldl$2339,
                foldl1: foldl1$2341,
                foldr: foldr$2343,
                foldr1: foldr1$2345,
                flatten: flatten$2348
            }
        },
        Control: {
            Functor: { map: map$2310 },
            Applicative: { ap: ap$2312 },
            Monad: { chain: chain$2314 }
        }
    };
}());
//# sourceMappingURL=curry.js.map