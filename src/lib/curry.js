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
    var extendNative$2258 = function (native$2376, prop$2377, f$2378) {
        return Object.defineProperty(native$2376, prop$2377, { value: f$2378 });
    };
    var withMeta$2259 = function (f$2379, meta$2380) {
        var keys$2381 = Object.keys(meta$2380);
        keys$2381.forEach(function (name$2382) {
            Object.defineProperty(f$2379, '__' + name$2382, { value: meta$2380[name$2382] });
        });
        return f$2379;
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
    var curry$2260 = function (f$2383, n$2384) {
        var arity$2385 = typeof n$2384 !== 'undefined' ? n$2384 : typeof f$2383.__arity !== 'undefined' ? f$2383.__arity : f$2383.length, name$2386 = f$2383.name || f$2383.__name;
        if (arity$2385 < 2)
            return f$2383;
        var curriedFn$2387 = withMeta$2259(function () {
                var args$2388 = [].slice.call(arguments, 0, arity$2385), realArity$2389 = args$2388.filter(function (x$2391) {
                        return x$2391 !== __$2257;
                    }).length, self$2390 = this;
                if (realArity$2389 >= arity$2385)
                    return f$2383.apply(self$2390, arguments);
                else {
                    var g$2392 = withMeta$2259(function () {
                            var partialArgs$2393 = [].slice.call(arguments), newArgs$2394 = [];
                            for (var i$2395 = 0; i$2395 < args$2388.length; i$2395++)
                                newArgs$2394[i$2395] = args$2388[i$2395] === __$2257 ? partialArgs$2393.length === 0 ? undefined : partialArgs$2393.shift() : args$2388[i$2395];
                            return curriedFn$2387.apply(self$2390, newArgs$2394.concat(partialArgs$2393));
                        }, {
                            name: name$2386,
                            arity: arity$2385 - realArity$2389,
                            curried: true
                        });
                    g$2392.toString = curriedFn$2387.toString.bind(curriedFn$2387);
                    return g$2392;
                }
            }, {
                name: name$2386,
                arity: arity$2385,
                curried: true
            });
        curriedFn$2387.toString = f$2383.toString.bind(f$2383);
        return curriedFn$2387;
    };
    extendNative$2258(Function.prototype, 'curry', function (n$2396) {
        return curry$2260(this, n$2396);
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
        var fns$2397 = __slice$2254.call(arguments), self$2398 = this;
        return fns$2397.reduce(function (f$2399, g$2400) {
            return function () {
                return f$2399.call(self$2398, g$2400.apply(self$2398, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2299(x$2401) {
        return function not$2299(x$2402) {
            return !x$2402;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2300(xs$2403) {
        return function and$2300(xs$2404) {
            return xs$2404.every(function (x$2405) {
                return !!x$2405;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2301(xs$2406) {
        return function or$2301(xs$2407) {
            return xs$2407.some(function (x$2408) {
                return !!x$2408;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2302(x$2409) {
        return function isObject$2302(x$2410) {
            return function (a0$2411) {
                if (Object.prototype.toString.call(a0$2411) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2410);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2303(x$2412) {
        return function isArray$2303(x$2413) {
            return function (a0$2414) {
                if (Array.isArray ? Array.isArray(a0$2414) : Object.prototype.toString.call(a0$2414) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2413);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2304(x$2415) {
        return function isNumber$2304(x$2416) {
            return function (a0$2417) {
                if (typeof a0$2417 === 'number' || Object.prototype.toString.call(a0$2417) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2416);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2305(x$2418) {
        return function isRegExp$2305(x$2419) {
            return function (a0$2420) {
                if (Object.prototype.toString.call(a0$2420) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2419);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2306(x$2421) {
        return function isString$2306(x$2422) {
            return function (a0$2423) {
                if (typeof a0$2423 === 'string' || Object.prototype.toString.call(a0$2423) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2422);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2307(x$2424) {
        return function isNull$2307(x$2425) {
            return function (a0$2426) {
                if (a0$2426 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2425);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2308(x$2427) {
        return function isUndef$2308(x$2428) {
            return function (a0$2429) {
                if (a0$2429 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2428);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2309(x$2430) {
        return function exists$2309(x$2431) {
            return function (x$2432) {
                return not$2299(or$2301(x$2432));
            }([
                isNull$2307(x$2431),
                isUndef$2308(x$2431)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2310(f$2433, xs$2434) {
        return function map$2310(f$2435, xs$2436) {
            return xs$2436.map(f$2435);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2312(f$2437, xs$2438) {
        return function ap$2312(f$2439, xs$2440) {
            return f$2439.ap(xs$2440);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2314(xs$2441, f$2442) {
        return function chain$2314(xs$2443, f$2444) {
            return xs$2443.chain(f$2444);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2319(f$2445, x$2446) {
        return function pure$2319(f$2447, x$2448) {
            return f$2447.of ? f$2447.of(x$2448) : f$2447.constructor.of(x$2448);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2320 = function () {
            function Option$2449() {
            }
            function Some$2450(val$2453) {
                if (!(this instanceof Some$2450)) {
                    return new Some$2450(val$2453);
                }
                this.val = val$2453;
            }
            Some$2450.prototype = new Option$2449();
            Some$2450.prototype.constructor = Some$2450;
            function None$2451() {
            }
            None$2451.prototype = new Option$2449();
            None$2451.prototype.constructor = None$2451;
            var derived$2452 = Base$2252.derive({
                    name: 'Option',
                    constructor: Option$2449,
                    prototype: Option$2449.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2450,
                            prototype: Some$2450.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2451,
                            prototype: None$2451.prototype
                        }
                    ]
                });
            Option$2449.Some = derived$2452.variants[0].constructor;
            Option$2449.None = new derived$2452.variants[1].constructor();
            return Option$2449;
        }();
    var Some$2321 = Option$2320.Some;
    var None$2322 = Option$2320.None;
    Option$2320.of = Some$2321;
    Option$2320.prototype.map = function (f$2454) {
        return function (self$2455, f$2456) {
            return self$2455.chain(function (x$2457) {
                return pure$2319(self$2455)(f$2456(x$2457));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2320.prototype.ap = function (x$2458) {
        return function (self$2459, x$2460) {
            return self$2459.chain(map$2310(__$2257, x$2460).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2320.prototype.chain = function (f$2461) {
        return function (self$2462, f$2463) {
            return function (a0$2464, a1$2465) {
                var r0$2466 = Some$2321.unapply(a0$2464);
                if (r0$2466 != null && (r0$2466.length === 1 && (typeof a1$2465 === 'function' || Object.prototype.toString.call(a1$2465) === '[object Function]'))) {
                    var x$2467 = r0$2466[0];
                    return f$2463(x$2467);
                }
                if ((None$2322.hasInstance ? None$2322.hasInstance(a0$2464) : a0$2464 instanceof None$2322) && (typeof a1$2465 === 'function' || Object.prototype.toString.call(a1$2465) === '[object Function]')) {
                    return None$2322;
                }
                throw new TypeError('No match');
            }.call(this, self$2462, f$2463);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2320.prototype.empty = function () {
        return function (self$2468) {
            return None$2322;
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2320.prototype.concat = function (other$2469) {
        return function (self$2470, other$2471) {
            return function (a0$2472, a1$2473) {
                if ((None$2322.hasInstance ? None$2322.hasInstance(a0$2472) : a0$2472 instanceof None$2322) && (Option$2320.hasInstance ? Option$2320.hasInstance(a1$2473) : a1$2473 instanceof Option$2320)) {
                    return other$2471;
                }
                if ((Option$2320.hasInstance ? Option$2320.hasInstance(a0$2472) : a0$2472 instanceof Option$2320) && (None$2322.hasInstance ? None$2322.hasInstance(a1$2473) : a1$2473 instanceof None$2322)) {
                    return self$2470;
                }
                var r0$2474 = Some$2321.unapply(a0$2472);
                if (r0$2474 != null && r0$2474.length === 1) {
                    var r1$2475 = Some$2321.unapply(a1$2473);
                    if (r1$2475 != null && r1$2475.length === 1) {
                        var v1$2476 = r0$2474[0];
                        var v2$2477 = r1$2475[0];
                        return Some$2321(v1$2476.concat(v2$2477));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2470, other$2471);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2341 = function () {
            function Either$2478() {
            }
            function Left$2479(l$2482) {
                if (!(this instanceof Left$2479)) {
                    return new Left$2479(l$2482);
                }
                this.l = l$2482;
            }
            Left$2479.prototype = new Either$2478();
            Left$2479.prototype.constructor = Left$2479;
            function Right$2480(r$2483) {
                if (!(this instanceof Right$2480)) {
                    return new Right$2480(r$2483);
                }
                this.r = r$2483;
            }
            Right$2480.prototype = new Either$2478();
            Right$2480.prototype.constructor = Right$2480;
            var derived$2481 = Base$2252.derive({
                    name: 'Either',
                    constructor: Either$2478,
                    prototype: Either$2478.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2479,
                            prototype: Left$2479.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2480,
                            prototype: Right$2480.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2478.Left = derived$2481.variants[0].constructor;
            Either$2478.Right = derived$2481.variants[1].constructor;
            return Either$2478;
        }();
    var Left$2342 = Either$2341.Left;
    var Right$2343 = Either$2341.Right;
    Either$2341.of = Right$2343;
    Either$2341.prototype.map = function (f$2484) {
        return function (self$2485, f$2486) {
            return self$2485.chain(function (x$2487) {
                return pure$2319(self$2485)(f$2486(x$2487));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2341.prototype.ap = function (x$2488) {
        return function (self$2489, x$2490) {
            return self$2489.chain(map$2310(__$2257, x$2490).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2341.prototype.chain = function (f$2491) {
        return function (self$2492, f$2493) {
            return function (a0$2494, a1$2495) {
                var r0$2496 = Right$2343.unapply(a0$2494);
                if (r0$2496 != null && (r0$2496.length === 1 && (typeof a1$2495 === 'function' || Object.prototype.toString.call(a1$2495) === '[object Function]'))) {
                    var x$2498 = r0$2496[0];
                    return f$2493(x$2498);
                }
                var r1$2497 = Left$2342.unapply(a0$2494);
                if (r1$2497 != null && r1$2497.length === 1) {
                    var x$2498 = r1$2497[0];
                    return self$2492;
                }
                throw new TypeError('No match');
            }.call(this, self$2492, f$2493);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2341.prototype.empty = function () {
        return function (self$2499) {
            return Left$2342();
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2341.prototype.concat = function (other$2500) {
        return function (self$2501, other$2502) {
            return function (a0$2503, a1$2504) {
                var r0$2505 = Left$2342.unapply(a0$2503);
                if (r0$2505 != null && (r0$2505.length === 1 && (Either$2341.hasInstance ? Either$2341.hasInstance(a1$2504) : a1$2504 instanceof Either$2341))) {
                    var x$2507 = r0$2505[0];
                    return other$2502;
                }
                if (Either$2341.hasInstance ? Either$2341.hasInstance(a0$2503) : a0$2503 instanceof Either$2341) {
                    var r1$2508 = Left$2342.unapply(a1$2504);
                    if (r1$2508 != null && r1$2508.length === 1) {
                        var x$2507 = r1$2508[0];
                        return self$2501;
                    }
                }
                var r2$2506 = Right$2343.unapply(a0$2503);
                if (r2$2506 != null && r2$2506.length === 1) {
                    var r3$2509 = Right$2343.unapply(a1$2504);
                    if (r3$2509 != null && r3$2509.length === 1) {
                        var r1$2510 = r2$2506[0];
                        var r2$2511 = r3$2509[0];
                        return Right$2343(r1$2510.concat(r2$2511));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2501, other$2502);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2360(f$2512, acc$2513, xs$2514) {
        return function foldl$2360(f$2515, acc$2516, xs$2517) {
            return xs$2517.reduce(f$2515, acc$2516);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2362(f$2518, xs$2519) {
        return function foldl1$2362(f$2520, xs$2521) {
            return xs$2521.reduce(f$2520);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2364(f$2522, acc$2523, xs$2524) {
        return function foldr$2364(f$2525, acc$2526, xs$2527) {
            return xs$2527.reduceRight(f$2525, acc$2526);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2366(f$2528, xs$2529) {
        return function foldr1$2366(f$2530, xs$2531) {
            return xs$2531.reduceRight(f$2530);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2369(xs$2532) {
        return function flatten$2369(xs$2533) {
            return foldl1$2362(function (xs$2534, ys$2535) {
                return xs$2534.concat(ys$2535);
            }.curry(), xs$2533);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2258(Array, 'of', function (x$2536) {
        return [x$2536];
    }.curry());
    extendNative$2258(Array.prototype, 'ap', function (x$2537) {
        return this.chain(map$2310(__$2257, x$2537).bind(this));
    }.curry());
    extendNative$2258(Array.prototype, 'chain', function (f$2538) {
        return function (x$2539) {
            return flatten$2369(map$2310(f$2538)(x$2539));
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
            Either: {
                Either: Either$2341,
                Left: Left$2342,
                Right: Right$2343
            },
            Option: {
                Option: Option$2320,
                Some: Some$2321,
                None: None$2322
            },
            Collection: {
                foldl: foldl$2360,
                foldl1: foldl1$2362,
                foldr: foldr$2364,
                foldr1: foldr1$2366,
                flatten: flatten$2369
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