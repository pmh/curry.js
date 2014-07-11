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
    var extendNative$2258 = function (native$2384, prop$2385, f$2386) {
        return Object.defineProperty(native$2384, prop$2385, { value: f$2386 });
    };
    var withMeta$2259 = function (f$2387, meta$2388) {
        var keys$2389 = Object.keys(meta$2388);
        keys$2389.forEach(function (name$2390) {
            Object.defineProperty(f$2387, '__' + name$2390, { value: meta$2388[name$2390] });
        });
        return f$2387;
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
    var curry$2260 = function (f$2391, n$2392) {
        var arity$2393 = typeof n$2392 !== 'undefined' ? n$2392 : typeof f$2391.__arity !== 'undefined' ? f$2391.__arity : f$2391.length, name$2394 = f$2391.name || f$2391.__name;
        if (arity$2393 < 2)
            return f$2391;
        var curriedFn$2395 = withMeta$2259(function () {
                var args$2396 = [].slice.call(arguments, 0, arity$2393), realArity$2397 = args$2396.filter(function (x$2399) {
                        return x$2399 !== __$2257;
                    }).length, self$2398 = this;
                if (realArity$2397 >= arity$2393)
                    return f$2391.apply(self$2398, arguments);
                else {
                    var g$2400 = withMeta$2259(function () {
                            var partialArgs$2401 = [].slice.call(arguments), newArgs$2402 = [];
                            for (var i$2403 = 0; i$2403 < args$2396.length; i$2403++)
                                newArgs$2402[i$2403] = args$2396[i$2403] === __$2257 ? partialArgs$2401.length === 0 ? undefined : partialArgs$2401.shift() : args$2396[i$2403];
                            return curriedFn$2395.apply(self$2398, newArgs$2402.concat(partialArgs$2401));
                        }, {
                            name: name$2394,
                            arity: arity$2393 - realArity$2397,
                            curried: true
                        });
                    g$2400.toString = curriedFn$2395.toString.bind(curriedFn$2395);
                    return g$2400;
                }
            }, {
                name: name$2394,
                arity: arity$2393,
                curried: true
            });
        curriedFn$2395.toString = f$2391.toString.bind(f$2391);
        return curriedFn$2395;
    };
    extendNative$2258(Function.prototype, 'curry', function (n$2404) {
        return curry$2260(this, n$2404);
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
        var fns$2405 = __slice$2254.call(arguments), self$2406 = this;
        return fns$2405.reduce(function (f$2407, g$2408) {
            return function () {
                return f$2407.call(self$2406, g$2408.apply(self$2406, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2303(x$2409) {
        return function not$2303(x$2410) {
            return !x$2410;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2304(xs$2411) {
        return function and$2304(xs$2412) {
            return xs$2412.every(function (x$2413) {
                return !!x$2413;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2305(xs$2414) {
        return function or$2305(xs$2415) {
            return xs$2415.some(function (x$2416) {
                return !!x$2416;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2306(x$2417) {
        return function isObject$2306(x$2418) {
            return function (a0$2419) {
                if (Object.prototype.toString.call(a0$2419) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2418);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2307(x$2420) {
        return function isArray$2307(x$2421) {
            return function (a0$2422) {
                if (Array.isArray ? Array.isArray(a0$2422) : Object.prototype.toString.call(a0$2422) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2421);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2308(x$2423) {
        return function isNumber$2308(x$2424) {
            return function (a0$2425) {
                if (typeof a0$2425 === 'number' || Object.prototype.toString.call(a0$2425) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2424);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2309(x$2426) {
        return function isRegExp$2309(x$2427) {
            return function (a0$2428) {
                if (Object.prototype.toString.call(a0$2428) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2427);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2310(x$2429) {
        return function isString$2310(x$2430) {
            return function (a0$2431) {
                if (typeof a0$2431 === 'string' || Object.prototype.toString.call(a0$2431) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2430);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2311(x$2432) {
        return function isNull$2311(x$2433) {
            return function (a0$2434) {
                if (a0$2434 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2433);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2312(x$2435) {
        return function isUndef$2312(x$2436) {
            return function (a0$2437) {
                if (a0$2437 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2436);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2313(x$2438) {
        return function exists$2313(x$2439) {
            return function (x$2440) {
                return not$2303(or$2305(x$2440));
            }([
                isNull$2311(x$2439),
                isUndef$2312(x$2439)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2314(a$2441, b$2442) {
        return function plus$2314(a$2443, b$2444) {
            return a$2443 + b$2444;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2315(a$2445, b$2446) {
        return function minus$2315(a$2447, b$2448) {
            return a$2447 - b$2448;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2316(a$2449, b$2450) {
        return function times$2316(a$2451, b$2452) {
            return a$2451 * b$2452;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2317(a$2453, b$2454) {
        return function div$2317(a$2455, b$2456) {
            return a$2455 / b$2456;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2318(f$2457, xs$2458) {
        return function map$2318(f$2459, xs$2460) {
            return xs$2460.map(f$2459);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2320(f$2461, xs$2462) {
        return function ap$2320(f$2463, xs$2464) {
            return f$2463.ap(xs$2464);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2322(xs$2465, f$2466) {
        return function chain$2322(xs$2467, f$2468) {
            return xs$2467.chain(f$2468);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2327(f$2469, x$2470) {
        return function pure$2327(f$2471, x$2472) {
            return f$2471.of ? f$2471.of(x$2472) : f$2471.constructor.of(x$2472);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2328 = function () {
            function Option$2473() {
            }
            function Some$2474(val$2477) {
                if (!(this instanceof Some$2474)) {
                    return new Some$2474(val$2477);
                }
                this.val = val$2477;
            }
            Some$2474.prototype = new Option$2473();
            Some$2474.prototype.constructor = Some$2474;
            function None$2475() {
            }
            None$2475.prototype = new Option$2473();
            None$2475.prototype.constructor = None$2475;
            var derived$2476 = Base$2252.derive({
                    name: 'Option',
                    constructor: Option$2473,
                    prototype: Option$2473.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2474,
                            prototype: Some$2474.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2475,
                            prototype: None$2475.prototype
                        }
                    ]
                });
            Option$2473.Some = derived$2476.variants[0].constructor;
            Option$2473.None = new derived$2476.variants[1].constructor();
            return Option$2473;
        }();
    var Some$2329 = Option$2328.Some;
    var None$2330 = Option$2328.None;
    Option$2328.of = Some$2329;
    Option$2328.prototype.map = function (f$2478) {
        return function (self$2479, f$2480) {
            return self$2479.chain(function (x$2481) {
                return pure$2327(self$2479)(f$2480(x$2481));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2328.prototype.ap = function (x$2482) {
        return function (self$2483, x$2484) {
            return self$2483.chain(map$2318(__$2257, x$2484).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2328.prototype.chain = function (f$2485) {
        return function (self$2486, f$2487) {
            return function (a0$2488, a1$2489) {
                var r0$2490 = Some$2329.unapply(a0$2488);
                if (r0$2490 != null && (r0$2490.length === 1 && (typeof a1$2489 === 'function' || Object.prototype.toString.call(a1$2489) === '[object Function]'))) {
                    var x$2491 = r0$2490[0];
                    return f$2487(x$2491);
                }
                if ((None$2330.hasInstance ? None$2330.hasInstance(a0$2488) : a0$2488 instanceof None$2330) && (typeof a1$2489 === 'function' || Object.prototype.toString.call(a1$2489) === '[object Function]')) {
                    return None$2330;
                }
                throw new TypeError('No match');
            }.call(this, self$2486, f$2487);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2328.prototype.empty = function () {
        return function (self$2492) {
            return None$2330;
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2328.prototype.concat = function (other$2493) {
        return function (self$2494, other$2495) {
            return function (a0$2496, a1$2497) {
                if ((None$2330.hasInstance ? None$2330.hasInstance(a0$2496) : a0$2496 instanceof None$2330) && (Option$2328.hasInstance ? Option$2328.hasInstance(a1$2497) : a1$2497 instanceof Option$2328)) {
                    return other$2495;
                }
                if ((Option$2328.hasInstance ? Option$2328.hasInstance(a0$2496) : a0$2496 instanceof Option$2328) && (None$2330.hasInstance ? None$2330.hasInstance(a1$2497) : a1$2497 instanceof None$2330)) {
                    return self$2494;
                }
                var r0$2498 = Some$2329.unapply(a0$2496);
                if (r0$2498 != null && r0$2498.length === 1) {
                    var r1$2499 = Some$2329.unapply(a1$2497);
                    if (r1$2499 != null && r1$2499.length === 1) {
                        var v1$2500 = r0$2498[0];
                        var v2$2501 = r1$2499[0];
                        return Some$2329(v1$2500.concat(v2$2501));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2494, other$2495);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2349 = function () {
            function Either$2502() {
            }
            function Left$2503(l$2506) {
                if (!(this instanceof Left$2503)) {
                    return new Left$2503(l$2506);
                }
                this.l = l$2506;
            }
            Left$2503.prototype = new Either$2502();
            Left$2503.prototype.constructor = Left$2503;
            function Right$2504(r$2507) {
                if (!(this instanceof Right$2504)) {
                    return new Right$2504(r$2507);
                }
                this.r = r$2507;
            }
            Right$2504.prototype = new Either$2502();
            Right$2504.prototype.constructor = Right$2504;
            var derived$2505 = Base$2252.derive({
                    name: 'Either',
                    constructor: Either$2502,
                    prototype: Either$2502.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2503,
                            prototype: Left$2503.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2504,
                            prototype: Right$2504.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2502.Left = derived$2505.variants[0].constructor;
            Either$2502.Right = derived$2505.variants[1].constructor;
            return Either$2502;
        }();
    var Left$2350 = Either$2349.Left;
    var Right$2351 = Either$2349.Right;
    Either$2349.of = Right$2351;
    Either$2349.prototype.map = function (f$2508) {
        return function (self$2509, f$2510) {
            return self$2509.chain(function (x$2511) {
                return pure$2327(self$2509)(f$2510(x$2511));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2349.prototype.ap = function (x$2512) {
        return function (self$2513, x$2514) {
            return self$2513.chain(map$2318(__$2257, x$2514).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2349.prototype.chain = function (f$2515) {
        return function (self$2516, f$2517) {
            return function (a0$2518, a1$2519) {
                var r0$2520 = Right$2351.unapply(a0$2518);
                if (r0$2520 != null && (r0$2520.length === 1 && (typeof a1$2519 === 'function' || Object.prototype.toString.call(a1$2519) === '[object Function]'))) {
                    var x$2522 = r0$2520[0];
                    return f$2517(x$2522);
                }
                var r1$2521 = Left$2350.unapply(a0$2518);
                if (r1$2521 != null && r1$2521.length === 1) {
                    var x$2522 = r1$2521[0];
                    return self$2516;
                }
                throw new TypeError('No match');
            }.call(this, self$2516, f$2517);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2349.prototype.empty = function () {
        return function (self$2523) {
            return Left$2350();
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2349.prototype.concat = function (other$2524) {
        return function (self$2525, other$2526) {
            return function (a0$2527, a1$2528) {
                var r0$2529 = Left$2350.unapply(a0$2527);
                if (r0$2529 != null && (r0$2529.length === 1 && (Either$2349.hasInstance ? Either$2349.hasInstance(a1$2528) : a1$2528 instanceof Either$2349))) {
                    var x$2531 = r0$2529[0];
                    return other$2526;
                }
                if (Either$2349.hasInstance ? Either$2349.hasInstance(a0$2527) : a0$2527 instanceof Either$2349) {
                    var r1$2532 = Left$2350.unapply(a1$2528);
                    if (r1$2532 != null && r1$2532.length === 1) {
                        var x$2531 = r1$2532[0];
                        return self$2525;
                    }
                }
                var r2$2530 = Right$2351.unapply(a0$2527);
                if (r2$2530 != null && r2$2530.length === 1) {
                    var r3$2533 = Right$2351.unapply(a1$2528);
                    if (r3$2533 != null && r3$2533.length === 1) {
                        var r1$2534 = r2$2530[0];
                        var r2$2535 = r3$2533[0];
                        return Right$2351(r1$2534.concat(r2$2535));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2525, other$2526);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2368(f$2536, acc$2537, xs$2538) {
        return function foldl$2368(f$2539, acc$2540, xs$2541) {
            return xs$2541.reduce(f$2539, acc$2540);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2370(f$2542, xs$2543) {
        return function foldl1$2370(f$2544, xs$2545) {
            return xs$2545.reduce(f$2544);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2372(f$2546, acc$2547, xs$2548) {
        return function foldr$2372(f$2549, acc$2550, xs$2551) {
            return xs$2551.reduceRight(f$2549, acc$2550);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2374(f$2552, xs$2553) {
        return function foldr1$2374(f$2554, xs$2555) {
            return xs$2555.reduceRight(f$2554);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2377(xs$2556) {
        return function flatten$2377(xs$2557) {
            return foldl1$2370(function (xs$2558, ys$2559) {
                return xs$2558.concat(ys$2559);
            }.curry(), xs$2557);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2258(Array, 'of', function (x$2560) {
        return [x$2560];
    }.curry());
    extendNative$2258(Array.prototype, 'ap', function (x$2561) {
        return this.chain(map$2318(__$2257, x$2561).bind(this));
    }.curry());
    extendNative$2258(Array.prototype, 'chain', function (f$2562) {
        return function (x$2563) {
            return flatten$2377(map$2318(f$2562)(x$2563));
        }(this);
    }.curry());
    module.exports = {
        Core: {
            __: __$2257,
            curry: curry$2260,
            compose: compose$2261
        },
        Predicates: {
            not: not$2303,
            and: and$2304,
            or: or$2305,
            isObject: isObject$2306,
            isArray: isArray$2307,
            isNumber: isNumber$2308,
            isRegExp: isRegExp$2309,
            isString: isString$2310,
            isNull: isNull$2311,
            isUndef: isUndef$2312,
            exists: exists$2313
        },
        Math: {
            plus: plus$2314,
            minus: minus$2315,
            times: times$2316,
            div: div$2317
        },
        Data: {
            Either: {
                Either: Either$2349,
                Left: Left$2350,
                Right: Right$2351
            },
            Option: {
                Option: Option$2328,
                Some: Some$2329,
                None: None$2330
            },
            Collection: {
                foldl: foldl$2368,
                foldl1: foldl1$2370,
                foldr: foldr$2372,
                foldr1: foldr1$2374,
                flatten: flatten$2377
            }
        },
        Control: {
            Functor: { map: map$2318 },
            Applicative: { ap: ap$2320 },
            Monad: { chain: chain$2322 }
        }
    };
}());
//# sourceMappingURL=curry.js.map