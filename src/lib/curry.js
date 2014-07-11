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
    var extendNative$2258 = function (native$2399, prop$2400, f$2401) {
        return Object.defineProperty(native$2399, prop$2400, { value: f$2401 });
    };
    var withMeta$2259 = function (f$2402, meta$2403) {
        var keys$2404 = Object.keys(meta$2403);
        keys$2404.forEach(function (name$2405) {
            Object.defineProperty(f$2402, '__' + name$2405, { value: meta$2403[name$2405] });
        });
        return f$2402;
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
    var curry$2260 = function (f$2406, n$2407) {
        var arity$2408 = typeof n$2407 !== 'undefined' ? n$2407 : typeof f$2406.__arity !== 'undefined' ? f$2406.__arity : f$2406.length, name$2409 = f$2406.name || f$2406.__name;
        if (arity$2408 < 2)
            return f$2406;
        var curriedFn$2410 = withMeta$2259(function () {
                var args$2411 = [].slice.call(arguments, 0, arity$2408), realArity$2412 = args$2411.filter(function (x$2414) {
                        return x$2414 !== __$2257;
                    }).length, self$2413 = this;
                if (realArity$2412 >= arity$2408)
                    return f$2406.apply(self$2413, arguments);
                else {
                    var g$2415 = withMeta$2259(function () {
                            var partialArgs$2416 = [].slice.call(arguments), newArgs$2417 = [];
                            for (var i$2418 = 0; i$2418 < args$2411.length; i$2418++)
                                newArgs$2417[i$2418] = args$2411[i$2418] === __$2257 ? partialArgs$2416.length === 0 ? undefined : partialArgs$2416.shift() : args$2411[i$2418];
                            return curriedFn$2410.apply(self$2413, newArgs$2417.concat(partialArgs$2416));
                        }, {
                            name: name$2409,
                            arity: arity$2408 - realArity$2412,
                            curried: true
                        });
                    g$2415.toString = curriedFn$2410.toString.bind(curriedFn$2410);
                    return g$2415;
                }
            }, {
                name: name$2409,
                arity: arity$2408,
                curried: true
            });
        curriedFn$2410.toString = f$2406.toString.bind(f$2406);
        return curriedFn$2410;
    };
    extendNative$2258(Function.prototype, 'curry', function (n$2419) {
        return curry$2260(this, n$2419);
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
        var fns$2420 = __slice$2254.call(arguments), self$2421 = this;
        return fns$2420.reduce(function (f$2422, g$2423) {
            return function () {
                return f$2422.call(self$2421, g$2423.apply(self$2421, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2316(x$2424) {
        return function not$2316(x$2425) {
            return !x$2425;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2317(xs$2426) {
        return function and$2317(xs$2427) {
            return xs$2427.every(function (x$2428) {
                return !!x$2428;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2318(xs$2429) {
        return function or$2318(xs$2430) {
            return xs$2430.some(function (x$2431) {
                return !!x$2431;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2319(x$2432) {
        return function isObject$2319(x$2433) {
            return function (a0$2434) {
                if (Object.prototype.toString.call(a0$2434) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2433);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2320(x$2435) {
        return function isArray$2320(x$2436) {
            return function (a0$2437) {
                if (Array.isArray ? Array.isArray(a0$2437) : Object.prototype.toString.call(a0$2437) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2436);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2321(x$2438) {
        return function isNumber$2321(x$2439) {
            return function (a0$2440) {
                if (typeof a0$2440 === 'number' || Object.prototype.toString.call(a0$2440) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2439);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2322(x$2441) {
        return function isRegExp$2322(x$2442) {
            return function (a0$2443) {
                if (Object.prototype.toString.call(a0$2443) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2442);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2323(x$2444) {
        return function isString$2323(x$2445) {
            return function (a0$2446) {
                if (typeof a0$2446 === 'string' || Object.prototype.toString.call(a0$2446) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2445);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2324(x$2447) {
        return function isNull$2324(x$2448) {
            return function (a0$2449) {
                if (a0$2449 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2448);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2325(x$2450) {
        return function isUndef$2325(x$2451) {
            return function (a0$2452) {
                if (a0$2452 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2451);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2326(x$2453) {
        return function exists$2326(x$2454) {
            return function (x$2455) {
                return not$2316(or$2318(x$2455));
            }([
                isNull$2324(x$2454),
                isUndef$2325(x$2454)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2327(a$2456, b$2457) {
        return function plus$2327(a$2458, b$2459) {
            return a$2458 + b$2459;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2328(a$2460, b$2461) {
        return function minus$2328(a$2462, b$2463) {
            return a$2462 - b$2463;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2329(a$2464, b$2465) {
        return function times$2329(a$2466, b$2467) {
            return a$2466 * b$2467;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2330(a$2468, b$2469) {
        return function div$2330(a$2470, b$2471) {
            return a$2470 / b$2471;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                      CurryJS.Number                       **
    // *************************************************************** 
    var Sum$2331 = function () {
            function Sum$2472(_0$2474) {
                if (!(this instanceof Sum$2472)) {
                    return new Sum$2472(_0$2474);
                }
                if (typeof _0$2474 === 'number' || Object.prototype.toString.call(_0$2474) === '[object Number]') {
                    this['0'] = _0$2474;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2472.prototype.length = 1;
            var derived$2473 = Base$2252.derive({
                    name: 'Sum',
                    constructor: Sum$2472,
                    prototype: Sum$2472.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2472,
                            prototype: Sum$2472.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2473.constructor;
        }();
    Sum$2331.prototype.empty = function () {
        return function (self$2475) {
            return Sum$2331(0);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Sum$2331.prototype.concat = function (other$2476) {
        return function (self$2477, other$2478) {
            return function (a0$2479, a1$2480) {
                var r0$2481 = Sum$2331.unapply(a0$2479);
                if (r0$2481 != null && r0$2481.length === 1) {
                    var r1$2482 = Sum$2331.unapply(a1$2480);
                    if (r1$2482 != null && r1$2482.length === 1) {
                        var x$2483 = r0$2481[0];
                        var y$2484 = r1$2482[0];
                        return Sum$2331(x$2483 + y$2484);
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2477, other$2478);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    function getSum$2332(x$2485) {
        return function getSum$2332(x$2486) {
            return function (a0$2487) {
                var r0$2488 = Sum$2331.unapply(a0$2487);
                if (r0$2488 != null && r0$2488.length === 1) {
                    var x$2489 = r0$2488[0];
                    return x$2489;
                }
                throw new TypeError('No match');
            }.call(this, x$2486);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2333(f$2490, xs$2491) {
        return function map$2333(f$2492, xs$2493) {
            return xs$2493.map(f$2492);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2335(f$2494, xs$2495) {
        return function ap$2335(f$2496, xs$2497) {
            return f$2496.ap(xs$2497);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2337(xs$2498, f$2499) {
        return function chain$2337(xs$2500, f$2501) {
            return xs$2500.chain(f$2501);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2342(f$2502, x$2503) {
        return function pure$2342(f$2504, x$2505) {
            return f$2504.of ? f$2504.of(x$2505) : f$2504.constructor.of(x$2505);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2343 = function () {
            function Option$2506() {
            }
            function Some$2507(val$2510) {
                if (!(this instanceof Some$2507)) {
                    return new Some$2507(val$2510);
                }
                this.val = val$2510;
            }
            Some$2507.prototype = new Option$2506();
            Some$2507.prototype.constructor = Some$2507;
            function None$2508() {
            }
            None$2508.prototype = new Option$2506();
            None$2508.prototype.constructor = None$2508;
            var derived$2509 = Base$2252.derive({
                    name: 'Option',
                    constructor: Option$2506,
                    prototype: Option$2506.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2507,
                            prototype: Some$2507.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2508,
                            prototype: None$2508.prototype
                        }
                    ]
                });
            Option$2506.Some = derived$2509.variants[0].constructor;
            Option$2506.None = new derived$2509.variants[1].constructor();
            return Option$2506;
        }();
    var Some$2344 = Option$2343.Some;
    var None$2345 = Option$2343.None;
    Option$2343.of = Some$2344;
    Option$2343.prototype.map = function (f$2511) {
        return function (self$2512, f$2513) {
            return self$2512.chain(function (x$2514) {
                return pure$2342(self$2512)(f$2513(x$2514));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2343.prototype.ap = function (x$2515) {
        return function (self$2516, x$2517) {
            return self$2516.chain(map$2333(__$2257, x$2517).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2343.prototype.chain = function (f$2518) {
        return function (self$2519, f$2520) {
            return function (a0$2521, a1$2522) {
                var r0$2523 = Some$2344.unapply(a0$2521);
                if (r0$2523 != null && (r0$2523.length === 1 && (typeof a1$2522 === 'function' || Object.prototype.toString.call(a1$2522) === '[object Function]'))) {
                    var x$2524 = r0$2523[0];
                    return f$2520(x$2524);
                }
                if ((None$2345.hasInstance ? None$2345.hasInstance(a0$2521) : a0$2521 instanceof None$2345) && (typeof a1$2522 === 'function' || Object.prototype.toString.call(a1$2522) === '[object Function]')) {
                    return None$2345;
                }
                throw new TypeError('No match');
            }.call(this, self$2519, f$2520);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2343.prototype.empty = function () {
        return function (self$2525) {
            return None$2345;
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2343.prototype.concat = function (other$2526) {
        return function (self$2527, other$2528) {
            return function (a0$2529, a1$2530) {
                if ((None$2345.hasInstance ? None$2345.hasInstance(a0$2529) : a0$2529 instanceof None$2345) && (Option$2343.hasInstance ? Option$2343.hasInstance(a1$2530) : a1$2530 instanceof Option$2343)) {
                    return other$2528;
                }
                if ((Option$2343.hasInstance ? Option$2343.hasInstance(a0$2529) : a0$2529 instanceof Option$2343) && (None$2345.hasInstance ? None$2345.hasInstance(a1$2530) : a1$2530 instanceof None$2345)) {
                    return self$2527;
                }
                var r0$2531 = Some$2344.unapply(a0$2529);
                if (r0$2531 != null && r0$2531.length === 1) {
                    var r1$2532 = Some$2344.unapply(a1$2530);
                    if (r1$2532 != null && r1$2532.length === 1) {
                        var v1$2533 = r0$2531[0];
                        var v2$2534 = r1$2532[0];
                        return Some$2344(v1$2533.concat(v2$2534));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2527, other$2528);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2364 = function () {
            function Either$2535() {
            }
            function Left$2536(l$2539) {
                if (!(this instanceof Left$2536)) {
                    return new Left$2536(l$2539);
                }
                this.l = l$2539;
            }
            Left$2536.prototype = new Either$2535();
            Left$2536.prototype.constructor = Left$2536;
            function Right$2537(r$2540) {
                if (!(this instanceof Right$2537)) {
                    return new Right$2537(r$2540);
                }
                this.r = r$2540;
            }
            Right$2537.prototype = new Either$2535();
            Right$2537.prototype.constructor = Right$2537;
            var derived$2538 = Base$2252.derive({
                    name: 'Either',
                    constructor: Either$2535,
                    prototype: Either$2535.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2536,
                            prototype: Left$2536.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2537,
                            prototype: Right$2537.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2535.Left = derived$2538.variants[0].constructor;
            Either$2535.Right = derived$2538.variants[1].constructor;
            return Either$2535;
        }();
    var Left$2365 = Either$2364.Left;
    var Right$2366 = Either$2364.Right;
    Either$2364.of = Right$2366;
    Either$2364.prototype.map = function (f$2541) {
        return function (self$2542, f$2543) {
            return self$2542.chain(function (x$2544) {
                return pure$2342(self$2542)(f$2543(x$2544));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2364.prototype.ap = function (x$2545) {
        return function (self$2546, x$2547) {
            return self$2546.chain(map$2333(__$2257, x$2547).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2364.prototype.chain = function (f$2548) {
        return function (self$2549, f$2550) {
            return function (a0$2551, a1$2552) {
                var r0$2553 = Right$2366.unapply(a0$2551);
                if (r0$2553 != null && (r0$2553.length === 1 && (typeof a1$2552 === 'function' || Object.prototype.toString.call(a1$2552) === '[object Function]'))) {
                    var x$2555 = r0$2553[0];
                    return f$2550(x$2555);
                }
                var r1$2554 = Left$2365.unapply(a0$2551);
                if (r1$2554 != null && r1$2554.length === 1) {
                    var x$2555 = r1$2554[0];
                    return self$2549;
                }
                throw new TypeError('No match');
            }.call(this, self$2549, f$2550);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2364.prototype.empty = function () {
        return function (self$2556) {
            return Left$2365();
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2364.prototype.concat = function (other$2557) {
        return function (self$2558, other$2559) {
            return function (a0$2560, a1$2561) {
                var r0$2562 = Left$2365.unapply(a0$2560);
                if (r0$2562 != null && (r0$2562.length === 1 && (Either$2364.hasInstance ? Either$2364.hasInstance(a1$2561) : a1$2561 instanceof Either$2364))) {
                    var x$2564 = r0$2562[0];
                    return other$2559;
                }
                if (Either$2364.hasInstance ? Either$2364.hasInstance(a0$2560) : a0$2560 instanceof Either$2364) {
                    var r1$2565 = Left$2365.unapply(a1$2561);
                    if (r1$2565 != null && r1$2565.length === 1) {
                        var x$2564 = r1$2565[0];
                        return self$2558;
                    }
                }
                var r2$2563 = Right$2366.unapply(a0$2560);
                if (r2$2563 != null && r2$2563.length === 1) {
                    var r3$2566 = Right$2366.unapply(a1$2561);
                    if (r3$2566 != null && r3$2566.length === 1) {
                        var r1$2567 = r2$2563[0];
                        var r2$2568 = r3$2566[0];
                        return Right$2366(r1$2567.concat(r2$2568));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2558, other$2559);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2383(f$2569, acc$2570, xs$2571) {
        return function foldl$2383(f$2572, acc$2573, xs$2574) {
            return xs$2574.reduce(f$2572, acc$2573);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2385(f$2575, xs$2576) {
        return function foldl1$2385(f$2577, xs$2578) {
            return xs$2578.reduce(f$2577);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2387(f$2579, acc$2580, xs$2581) {
        return function foldr$2387(f$2582, acc$2583, xs$2584) {
            return xs$2584.reduceRight(f$2582, acc$2583);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2389(f$2585, xs$2586) {
        return function foldr1$2389(f$2587, xs$2588) {
            return xs$2588.reduceRight(f$2587);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2392(xs$2589) {
        return function flatten$2392(xs$2590) {
            return foldl1$2385(function (xs$2591, ys$2592) {
                return xs$2591.concat(ys$2592);
            }.curry(), xs$2590);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2258(Array, 'of', function (x$2593) {
        return [x$2593];
    }.curry());
    extendNative$2258(Array.prototype, 'ap', function (x$2594) {
        return this.chain(map$2333(__$2257, x$2594).bind(this));
    }.curry());
    extendNative$2258(Array.prototype, 'chain', function (f$2595) {
        return function (x$2596) {
            return flatten$2392(map$2333(f$2595)(x$2596));
        }(this);
    }.curry());
    module.exports = {
        Core: {
            __: __$2257,
            curry: curry$2260,
            compose: compose$2261
        },
        Predicates: {
            not: not$2316,
            and: and$2317,
            or: or$2318,
            isObject: isObject$2319,
            isArray: isArray$2320,
            isNumber: isNumber$2321,
            isRegExp: isRegExp$2322,
            isString: isString$2323,
            isNull: isNull$2324,
            isUndef: isUndef$2325,
            exists: exists$2326
        },
        Math: {
            plus: plus$2327,
            minus: minus$2328,
            times: times$2329,
            div: div$2330
        },
        Number: {
            Sum: {
                Sum: Sum$2331,
                getSum: getSum$2332
            }
        },
        Data: {
            Either: {
                Either: Either$2364,
                Left: Left$2365,
                Right: Right$2366
            },
            Option: {
                Option: Option$2343,
                Some: Some$2344,
                None: None$2345
            },
            Collection: {
                foldl: foldl$2383,
                foldl1: foldl1$2385,
                foldr: foldr$2387,
                foldr1: foldr1$2389,
                flatten: flatten$2392
            }
        },
        Control: {
            Functor: { map: map$2333 },
            Applicative: { ap: ap$2335 },
            Monad: { chain: chain$2337 }
        }
    };
}());
//# sourceMappingURL=curry.js.map