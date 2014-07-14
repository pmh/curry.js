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
    var extendNative$2258 = function (native$2444, prop$2445, f$2446) {
        return Object.defineProperty(native$2444, prop$2445, { value: f$2446 });
    };
    var withMeta$2259 = function (f$2447, meta$2448) {
        var keys$2449 = Object.keys(meta$2448);
        keys$2449.forEach(function (name$2450) {
            Object.defineProperty(f$2447, '__' + name$2450, { value: meta$2448[name$2450] });
        });
        return f$2447;
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
    var curry$2260 = function (f$2451, n$2452) {
        var arity$2453 = typeof n$2452 !== 'undefined' ? n$2452 : typeof f$2451.__arity !== 'undefined' ? f$2451.__arity : f$2451.length, name$2454 = f$2451.name || f$2451.__name;
        if (arity$2453 < 2)
            return f$2451;
        var curriedFn$2455 = withMeta$2259(function () {
                var args$2456 = [].slice.call(arguments, 0, arity$2453), realArity$2457 = args$2456.filter(function (x$2459) {
                        return x$2459 !== __$2257;
                    }).length, self$2458 = this;
                if (realArity$2457 >= arity$2453)
                    return f$2451.apply(self$2458, arguments);
                else {
                    var g$2460 = withMeta$2259(function () {
                            var partialArgs$2461 = [].slice.call(arguments), newArgs$2462 = [];
                            for (var i$2463 = 0; i$2463 < args$2456.length; i$2463++)
                                newArgs$2462[i$2463] = args$2456[i$2463] === __$2257 ? partialArgs$2461.length === 0 ? undefined : partialArgs$2461.shift() : args$2456[i$2463];
                            return curriedFn$2455.apply(self$2458, newArgs$2462.concat(partialArgs$2461));
                        }, {
                            name: name$2454,
                            arity: arity$2453 - realArity$2457,
                            curried: true
                        });
                    g$2460.toString = curriedFn$2455.toString.bind(curriedFn$2455);
                    return g$2460;
                }
            }, {
                name: name$2454,
                arity: arity$2453,
                curried: true
            });
        curriedFn$2455.toString = f$2451.toString.bind(f$2451);
        return curriedFn$2455;
    };
    extendNative$2258(Function.prototype, 'curry', function (n$2464) {
        return curry$2260(this, n$2464);
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
        var fns$2465 = __slice$2254.call(arguments), self$2466 = this;
        return fns$2465.reduce(function (f$2467, g$2468) {
            return function () {
                return f$2467.call(self$2466, g$2468.apply(self$2466, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2355(x$2469) {
        return function not$2355(x$2470) {
            return !x$2470;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2356(xs$2471) {
        return function and$2356(xs$2472) {
            return xs$2472.every(function (x$2473) {
                return !!x$2473;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2357(xs$2474) {
        return function or$2357(xs$2475) {
            return xs$2475.some(function (x$2476) {
                return !!x$2476;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2358(x$2477) {
        return function isObject$2358(x$2478) {
            return function (a0$2479) {
                if (Object.prototype.toString.call(a0$2479) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2478);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2359(x$2480) {
        return function isArray$2359(x$2481) {
            return function (a0$2482) {
                if (Array.isArray ? Array.isArray(a0$2482) : Object.prototype.toString.call(a0$2482) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2481);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2360(x$2483) {
        return function isNumber$2360(x$2484) {
            return function (a0$2485) {
                if (typeof a0$2485 === 'number' || Object.prototype.toString.call(a0$2485) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2484);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2361(x$2486) {
        return function isRegExp$2361(x$2487) {
            return function (a0$2488) {
                if (Object.prototype.toString.call(a0$2488) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2487);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2362(x$2489) {
        return function isString$2362(x$2490) {
            return function (a0$2491) {
                if (typeof a0$2491 === 'string' || Object.prototype.toString.call(a0$2491) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2490);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2363(x$2492) {
        return function isNull$2363(x$2493) {
            return function (a0$2494) {
                if (a0$2494 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2493);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2364(x$2495) {
        return function isUndef$2364(x$2496) {
            return function (a0$2497) {
                if (a0$2497 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2496);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2365(x$2498) {
        return function exists$2365(x$2499) {
            return function (x$2500) {
                return not$2355(or$2357(x$2500));
            }([
                isNull$2363(x$2499),
                isUndef$2364(x$2499)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2366(a$2501, b$2502) {
        return function plus$2366(a$2503, b$2504) {
            return a$2503 + b$2504;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2367(a$2505, b$2506) {
        return function minus$2367(a$2507, b$2508) {
            return a$2507 - b$2508;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2368(a$2509, b$2510) {
        return function times$2368(a$2511, b$2512) {
            return a$2511 * b$2512;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2369(a$2513, b$2514) {
        return function div$2369(a$2515, b$2516) {
            return a$2515 / b$2516;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2370 = function () {
            function Sum$2517(_0$2519) {
                if (!(this instanceof Sum$2517)) {
                    return new Sum$2517(_0$2519);
                }
                if (typeof _0$2519 === 'number' || Object.prototype.toString.call(_0$2519) === '[object Number]') {
                    this['0'] = _0$2519;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2517.prototype.length = 1;
            var derived$2518 = Base$2252.derive({
                    name: 'Sum',
                    constructor: Sum$2517,
                    prototype: Sum$2517.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2517,
                            prototype: Sum$2517.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2518.constructor;
        }();
    Sum$2370.prototype.empty = function () {
        return function (self$2520) {
            return Sum$2370(0);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Sum$2370.prototype.concat = function (other$2521) {
        return function (self$2522, other$2523) {
            return function (a0$2524, a1$2525) {
                var r0$2526 = Sum$2370.unapply(a0$2524);
                if (r0$2526 != null && r0$2526.length === 1) {
                    var r1$2527 = Sum$2370.unapply(a1$2525);
                    if (r1$2527 != null && r1$2527.length === 1) {
                        var x$2528 = r0$2526[0];
                        var y$2529 = r1$2527[0];
                        return Sum$2370(x$2528 + y$2529);
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2522, other$2523);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    function getSum$2371(x$2530) {
        return function getSum$2371(x$2531) {
            return function (a0$2532) {
                var r0$2533 = Sum$2370.unapply(a0$2532);
                if (r0$2533 != null && r0$2533.length === 1) {
                    var x$2534 = r0$2533[0];
                    return x$2534;
                }
                throw new TypeError('No match');
            }.call(this, x$2531);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2372 = function () {
            function Product$2535(_0$2537) {
                if (!(this instanceof Product$2535)) {
                    return new Product$2535(_0$2537);
                }
                if (typeof _0$2537 === 'number' || Object.prototype.toString.call(_0$2537) === '[object Number]') {
                    this['0'] = _0$2537;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2535.prototype.length = 1;
            var derived$2536 = Base$2252.derive({
                    name: 'Product',
                    constructor: Product$2535,
                    prototype: Product$2535.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2535,
                            prototype: Product$2535.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2536.constructor;
        }();
    Product$2372.prototype.empty = function () {
        return function (self$2538) {
            return Product$2372(1);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Product$2372.prototype.concat = function (other$2539) {
        return function (self$2540, other$2541) {
            return function (a0$2542, a1$2543) {
                var r0$2544 = Product$2372.unapply(a0$2542);
                if (r0$2544 != null && r0$2544.length === 1) {
                    var r1$2545 = Product$2372.unapply(a1$2543);
                    if (r1$2545 != null && r1$2545.length === 1) {
                        var x$2546 = r0$2544[0];
                        var y$2547 = r1$2545[0];
                        return Product$2372(x$2546 * y$2547);
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2540, other$2541);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    function getProduct$2373(x$2548) {
        return function getProduct$2373(x$2549) {
            return function (a0$2550) {
                var r0$2551 = Product$2372.unapply(a0$2550);
                if (r0$2551 != null && r0$2551.length === 1) {
                    var x$2552 = r0$2551[0];
                    return x$2552;
                }
                throw new TypeError('No match');
            }.call(this, x$2549);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2374 = function () {
            function Max$2553(_0$2555) {
                if (!(this instanceof Max$2553)) {
                    return new Max$2553(_0$2555);
                }
                if (typeof _0$2555 === 'number' || Object.prototype.toString.call(_0$2555) === '[object Number]') {
                    this['0'] = _0$2555;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2553.prototype.length = 1;
            var derived$2554 = Base$2252.derive({
                    name: 'Max',
                    constructor: Max$2553,
                    prototype: Max$2553.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2553,
                            prototype: Max$2553.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2554.constructor;
        }();
    Max$2374.prototype.empty = function () {
        return function (self$2556) {
            return Max$2374(-Infinity);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Max$2374.prototype.concat = function (other$2557) {
        return function (self$2558, other$2559) {
            return function (a0$2560, a1$2561) {
                var r0$2562 = Max$2374.unapply(a0$2560);
                if (r0$2562 != null && r0$2562.length === 1) {
                    var r1$2563 = Max$2374.unapply(a1$2561);
                    if (r1$2563 != null && r1$2563.length === 1) {
                        var x$2564 = r0$2562[0];
                        var y$2565 = r1$2563[0];
                        return Max$2374(x$2564 > y$2565 ? x$2564 : y$2565);
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2558, other$2559);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    function getMax$2375(x$2566) {
        return function getMax$2375(x$2567) {
            return function (a0$2568) {
                var r0$2569 = Max$2374.unapply(a0$2568);
                if (r0$2569 != null && r0$2569.length === 1) {
                    var x$2570 = r0$2569[0];
                    return x$2570;
                }
                throw new TypeError('No match');
            }.call(this, x$2567);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2376 = function () {
            function Min$2571(_0$2573) {
                if (!(this instanceof Min$2571)) {
                    return new Min$2571(_0$2573);
                }
                if (typeof _0$2573 === 'number' || Object.prototype.toString.call(_0$2573) === '[object Number]') {
                    this['0'] = _0$2573;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2571.prototype.length = 1;
            var derived$2572 = Base$2252.derive({
                    name: 'Min',
                    constructor: Min$2571,
                    prototype: Min$2571.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2571,
                            prototype: Min$2571.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2572.constructor;
        }();
    Min$2376.prototype.empty = function () {
        return function (self$2574) {
            return Min$2376(Infinity);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Min$2376.prototype.concat = function (other$2575) {
        return function (self$2576, other$2577) {
            return function (a0$2578, a1$2579) {
                var r0$2580 = Min$2376.unapply(a0$2578);
                if (r0$2580 != null && r0$2580.length === 1) {
                    var r1$2581 = Min$2376.unapply(a1$2579);
                    if (r1$2581 != null && r1$2581.length === 1) {
                        var x$2582 = r0$2580[0];
                        var y$2583 = r1$2581[0];
                        return Min$2376(x$2582 < y$2583 ? x$2582 : y$2583);
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2576, other$2577);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    function getMin$2377(x$2584) {
        return function getMin$2377(x$2585) {
            return function (a0$2586) {
                var r0$2587 = Min$2376.unapply(a0$2586);
                if (r0$2587 != null && r0$2587.length === 1) {
                    var x$2588 = r0$2587[0];
                    return x$2588;
                }
                throw new TypeError('No match');
            }.call(this, x$2585);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2378(f$2589, xs$2590) {
        return function map$2378(f$2591, xs$2592) {
            return xs$2592.map(f$2591);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2380(f$2593, xs$2594) {
        return function ap$2380(f$2595, xs$2596) {
            return f$2595.ap(xs$2596);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2382(xs$2597, f$2598) {
        return function chain$2382(xs$2599, f$2600) {
            return xs$2599.chain(f$2600);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2387(f$2601, x$2602) {
        return function pure$2387(f$2603, x$2604) {
            return f$2603.of ? f$2603.of(x$2604) : f$2603.constructor.of(x$2604);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2388 = function () {
            function Option$2605() {
            }
            function Some$2606(val$2609) {
                if (!(this instanceof Some$2606)) {
                    return new Some$2606(val$2609);
                }
                this.val = val$2609;
            }
            Some$2606.prototype = new Option$2605();
            Some$2606.prototype.constructor = Some$2606;
            function None$2607() {
            }
            None$2607.prototype = new Option$2605();
            None$2607.prototype.constructor = None$2607;
            var derived$2608 = Base$2252.derive({
                    name: 'Option',
                    constructor: Option$2605,
                    prototype: Option$2605.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2606,
                            prototype: Some$2606.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2607,
                            prototype: None$2607.prototype
                        }
                    ]
                });
            Option$2605.Some = derived$2608.variants[0].constructor;
            Option$2605.None = new derived$2608.variants[1].constructor();
            return Option$2605;
        }();
    var Some$2389 = Option$2388.Some;
    var None$2390 = Option$2388.None;
    Option$2388.of = Some$2389;
    Option$2388.prototype.map = function (f$2610) {
        return function (self$2611, f$2612) {
            return self$2611.chain(function (x$2613) {
                return pure$2387(self$2611)(f$2612(x$2613));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2388.prototype.ap = function (x$2614) {
        return function (self$2615, x$2616) {
            return self$2615.chain(map$2378(__$2257, x$2616).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2388.prototype.chain = function (f$2617) {
        return function (self$2618, f$2619) {
            return function (a0$2620, a1$2621) {
                var r0$2622 = Some$2389.unapply(a0$2620);
                if (r0$2622 != null && (r0$2622.length === 1 && (typeof a1$2621 === 'function' || Object.prototype.toString.call(a1$2621) === '[object Function]'))) {
                    var x$2623 = r0$2622[0];
                    return f$2619(x$2623);
                }
                if ((None$2390.hasInstance ? None$2390.hasInstance(a0$2620) : a0$2620 instanceof None$2390) && (typeof a1$2621 === 'function' || Object.prototype.toString.call(a1$2621) === '[object Function]')) {
                    return None$2390;
                }
                throw new TypeError('No match');
            }.call(this, self$2618, f$2619);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2388.prototype.empty = function () {
        return function (self$2624) {
            return None$2390;
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2388.prototype.concat = function (other$2625) {
        return function (self$2626, other$2627) {
            return function (a0$2628, a1$2629) {
                if ((None$2390.hasInstance ? None$2390.hasInstance(a0$2628) : a0$2628 instanceof None$2390) && (Option$2388.hasInstance ? Option$2388.hasInstance(a1$2629) : a1$2629 instanceof Option$2388)) {
                    return other$2627;
                }
                if ((Option$2388.hasInstance ? Option$2388.hasInstance(a0$2628) : a0$2628 instanceof Option$2388) && (None$2390.hasInstance ? None$2390.hasInstance(a1$2629) : a1$2629 instanceof None$2390)) {
                    return self$2626;
                }
                var r0$2630 = Some$2389.unapply(a0$2628);
                if (r0$2630 != null && r0$2630.length === 1) {
                    var r1$2631 = Some$2389.unapply(a1$2629);
                    if (r1$2631 != null && r1$2631.length === 1) {
                        var v1$2632 = r0$2630[0];
                        var v2$2633 = r1$2631[0];
                        return Some$2389(v1$2632.concat(v2$2633));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2626, other$2627);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2409 = function () {
            function Either$2634() {
            }
            function Left$2635(l$2638) {
                if (!(this instanceof Left$2635)) {
                    return new Left$2635(l$2638);
                }
                this.l = l$2638;
            }
            Left$2635.prototype = new Either$2634();
            Left$2635.prototype.constructor = Left$2635;
            function Right$2636(r$2639) {
                if (!(this instanceof Right$2636)) {
                    return new Right$2636(r$2639);
                }
                this.r = r$2639;
            }
            Right$2636.prototype = new Either$2634();
            Right$2636.prototype.constructor = Right$2636;
            var derived$2637 = Base$2252.derive({
                    name: 'Either',
                    constructor: Either$2634,
                    prototype: Either$2634.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2635,
                            prototype: Left$2635.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2636,
                            prototype: Right$2636.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2634.Left = derived$2637.variants[0].constructor;
            Either$2634.Right = derived$2637.variants[1].constructor;
            return Either$2634;
        }();
    var Left$2410 = Either$2409.Left;
    var Right$2411 = Either$2409.Right;
    Either$2409.of = Right$2411;
    Either$2409.prototype.map = function (f$2640) {
        return function (self$2641, f$2642) {
            return self$2641.chain(function (x$2643) {
                return pure$2387(self$2641)(f$2642(x$2643));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2409.prototype.ap = function (x$2644) {
        return function (self$2645, x$2646) {
            return self$2645.chain(map$2378(__$2257, x$2646).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2409.prototype.chain = function (f$2647) {
        return function (self$2648, f$2649) {
            return function (a0$2650, a1$2651) {
                var r0$2652 = Right$2411.unapply(a0$2650);
                if (r0$2652 != null && (r0$2652.length === 1 && (typeof a1$2651 === 'function' || Object.prototype.toString.call(a1$2651) === '[object Function]'))) {
                    var x$2654 = r0$2652[0];
                    return f$2649(x$2654);
                }
                var r1$2653 = Left$2410.unapply(a0$2650);
                if (r1$2653 != null && r1$2653.length === 1) {
                    var x$2654 = r1$2653[0];
                    return self$2648;
                }
                throw new TypeError('No match');
            }.call(this, self$2648, f$2649);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2409.prototype.empty = function () {
        return function (self$2655) {
            return Left$2410();
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2409.prototype.concat = function (other$2656) {
        return function (self$2657, other$2658) {
            return function (a0$2659, a1$2660) {
                var r0$2661 = Left$2410.unapply(a0$2659);
                if (r0$2661 != null && (r0$2661.length === 1 && (Either$2409.hasInstance ? Either$2409.hasInstance(a1$2660) : a1$2660 instanceof Either$2409))) {
                    var x$2663 = r0$2661[0];
                    return other$2658;
                }
                if (Either$2409.hasInstance ? Either$2409.hasInstance(a0$2659) : a0$2659 instanceof Either$2409) {
                    var r1$2664 = Left$2410.unapply(a1$2660);
                    if (r1$2664 != null && r1$2664.length === 1) {
                        var x$2663 = r1$2664[0];
                        return self$2657;
                    }
                }
                var r2$2662 = Right$2411.unapply(a0$2659);
                if (r2$2662 != null && r2$2662.length === 1) {
                    var r3$2665 = Right$2411.unapply(a1$2660);
                    if (r3$2665 != null && r3$2665.length === 1) {
                        var r1$2666 = r2$2662[0];
                        var r2$2667 = r3$2665[0];
                        return Right$2411(r1$2666.concat(r2$2667));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2657, other$2658);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2428(f$2668, acc$2669, xs$2670) {
        return function foldl$2428(f$2671, acc$2672, xs$2673) {
            return xs$2673.reduce(f$2671, acc$2672);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2430(f$2674, xs$2675) {
        return function foldl1$2430(f$2676, xs$2677) {
            return xs$2677.reduce(f$2676);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2432(f$2678, acc$2679, xs$2680) {
        return function foldr$2432(f$2681, acc$2682, xs$2683) {
            return xs$2683.reduceRight(f$2681, acc$2682);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2434(f$2684, xs$2685) {
        return function foldr1$2434(f$2686, xs$2687) {
            return xs$2687.reduceRight(f$2686);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2437(xs$2688) {
        return function flatten$2437(xs$2689) {
            return foldl1$2430(function (xs$2690, ys$2691) {
                return xs$2690.concat(ys$2691);
            }.curry(), xs$2689);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2258(Array, 'of', function (x$2692) {
        return [x$2692];
    }.curry());
    extendNative$2258(Array.prototype, 'ap', function (x$2693) {
        return this.chain(map$2378(__$2257, x$2693).bind(this));
    }.curry());
    extendNative$2258(Array.prototype, 'chain', function (f$2694) {
        return function (x$2695) {
            return flatten$2437(map$2378(f$2694)(x$2695));
        }(this);
    }.curry());
    module.exports = {
        Core: {
            __: __$2257,
            curry: curry$2260,
            compose: compose$2261
        },
        Predicates: {
            not: not$2355,
            and: and$2356,
            or: or$2357,
            isObject: isObject$2358,
            isArray: isArray$2359,
            isNumber: isNumber$2360,
            isRegExp: isRegExp$2361,
            isString: isString$2362,
            isNull: isNull$2363,
            isUndef: isUndef$2364,
            exists: exists$2365
        },
        Math: {
            plus: plus$2366,
            minus: minus$2367,
            times: times$2368,
            div: div$2369
        },
        Number: {
            Sum: {
                Sum: Sum$2370,
                getSum: getSum$2371
            },
            Product: {
                Product: Product$2372,
                getProduct: getProduct$2373
            },
            Max: {
                Max: Max$2374,
                getMax: getMax$2375
            },
            Min: {
                Min: Min$2376,
                getMin: getMin$2377
            }
        },
        Data: {
            Either: {
                Either: Either$2409,
                Left: Left$2410,
                Right: Right$2411
            },
            Option: {
                Option: Option$2388,
                Some: Some$2389,
                None: None$2390
            },
            Collection: {
                foldl: foldl$2428,
                foldl1: foldl1$2430,
                foldr: foldr$2432,
                foldr1: foldr1$2434,
                flatten: flatten$2437
            }
        },
        Control: {
            Functor: { map: map$2378 },
            Applicative: { ap: ap$2380 },
            Monad: { chain: chain$2382 }
        }
    };
}());
//# sourceMappingURL=curry.js.map