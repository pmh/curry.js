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
    var extendNative$2258 = function (native$2414, prop$2415, f$2416) {
        return Object.defineProperty(native$2414, prop$2415, { value: f$2416 });
    };
    var withMeta$2259 = function (f$2417, meta$2418) {
        var keys$2419 = Object.keys(meta$2418);
        keys$2419.forEach(function (name$2420) {
            Object.defineProperty(f$2417, '__' + name$2420, { value: meta$2418[name$2420] });
        });
        return f$2417;
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
    var curry$2260 = function (f$2421, n$2422) {
        var arity$2423 = typeof n$2422 !== 'undefined' ? n$2422 : typeof f$2421.__arity !== 'undefined' ? f$2421.__arity : f$2421.length, name$2424 = f$2421.name || f$2421.__name;
        if (arity$2423 < 2)
            return f$2421;
        var curriedFn$2425 = withMeta$2259(function () {
                var args$2426 = [].slice.call(arguments, 0, arity$2423), realArity$2427 = args$2426.filter(function (x$2429) {
                        return x$2429 !== __$2257;
                    }).length, self$2428 = this;
                if (realArity$2427 >= arity$2423)
                    return f$2421.apply(self$2428, arguments);
                else {
                    var g$2430 = withMeta$2259(function () {
                            var partialArgs$2431 = [].slice.call(arguments), newArgs$2432 = [];
                            for (var i$2433 = 0; i$2433 < args$2426.length; i$2433++)
                                newArgs$2432[i$2433] = args$2426[i$2433] === __$2257 ? partialArgs$2431.length === 0 ? undefined : partialArgs$2431.shift() : args$2426[i$2433];
                            return curriedFn$2425.apply(self$2428, newArgs$2432.concat(partialArgs$2431));
                        }, {
                            name: name$2424,
                            arity: arity$2423 - realArity$2427,
                            curried: true
                        });
                    g$2430.toString = curriedFn$2425.toString.bind(curriedFn$2425);
                    return g$2430;
                }
            }, {
                name: name$2424,
                arity: arity$2423,
                curried: true
            });
        curriedFn$2425.toString = f$2421.toString.bind(f$2421);
        return curriedFn$2425;
    };
    extendNative$2258(Function.prototype, 'curry', function (n$2434) {
        return curry$2260(this, n$2434);
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
        var fns$2435 = __slice$2254.call(arguments), self$2436 = this;
        return fns$2435.reduce(function (f$2437, g$2438) {
            return function () {
                return f$2437.call(self$2436, g$2438.apply(self$2436, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2329(x$2439) {
        return function not$2329(x$2440) {
            return !x$2440;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2330(xs$2441) {
        return function and$2330(xs$2442) {
            return xs$2442.every(function (x$2443) {
                return !!x$2443;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2331(xs$2444) {
        return function or$2331(xs$2445) {
            return xs$2445.some(function (x$2446) {
                return !!x$2446;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2332(x$2447) {
        return function isObject$2332(x$2448) {
            return function (a0$2449) {
                if (Object.prototype.toString.call(a0$2449) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2448);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2333(x$2450) {
        return function isArray$2333(x$2451) {
            return function (a0$2452) {
                if (Array.isArray ? Array.isArray(a0$2452) : Object.prototype.toString.call(a0$2452) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2451);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2334(x$2453) {
        return function isNumber$2334(x$2454) {
            return function (a0$2455) {
                if (typeof a0$2455 === 'number' || Object.prototype.toString.call(a0$2455) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2454);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2335(x$2456) {
        return function isRegExp$2335(x$2457) {
            return function (a0$2458) {
                if (Object.prototype.toString.call(a0$2458) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2457);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2336(x$2459) {
        return function isString$2336(x$2460) {
            return function (a0$2461) {
                if (typeof a0$2461 === 'string' || Object.prototype.toString.call(a0$2461) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2460);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2337(x$2462) {
        return function isNull$2337(x$2463) {
            return function (a0$2464) {
                if (a0$2464 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2463);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2338(x$2465) {
        return function isUndef$2338(x$2466) {
            return function (a0$2467) {
                if (a0$2467 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2466);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2339(x$2468) {
        return function exists$2339(x$2469) {
            return function (x$2470) {
                return not$2329(or$2331(x$2470));
            }([
                isNull$2337(x$2469),
                isUndef$2338(x$2469)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2340(a$2471, b$2472) {
        return function plus$2340(a$2473, b$2474) {
            return a$2473 + b$2474;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2341(a$2475, b$2476) {
        return function minus$2341(a$2477, b$2478) {
            return a$2477 - b$2478;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2342(a$2479, b$2480) {
        return function times$2342(a$2481, b$2482) {
            return a$2481 * b$2482;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2343(a$2483, b$2484) {
        return function div$2343(a$2485, b$2486) {
            return a$2485 / b$2486;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2344 = function () {
            function Sum$2487(_0$2489) {
                if (!(this instanceof Sum$2487)) {
                    return new Sum$2487(_0$2489);
                }
                if (typeof _0$2489 === 'number' || Object.prototype.toString.call(_0$2489) === '[object Number]') {
                    this['0'] = _0$2489;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2487.prototype.length = 1;
            var derived$2488 = Base$2252.derive({
                    name: 'Sum',
                    constructor: Sum$2487,
                    prototype: Sum$2487.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2487,
                            prototype: Sum$2487.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2488.constructor;
        }();
    Sum$2344.prototype.empty = function () {
        return function (self$2490) {
            return Sum$2344(0);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Sum$2344.prototype.concat = function (other$2491) {
        return function (self$2492, other$2493) {
            return function (a0$2494, a1$2495) {
                var r0$2496 = Sum$2344.unapply(a0$2494);
                if (r0$2496 != null && r0$2496.length === 1) {
                    var r1$2497 = Sum$2344.unapply(a1$2495);
                    if (r1$2497 != null && r1$2497.length === 1) {
                        var x$2498 = r0$2496[0];
                        var y$2499 = r1$2497[0];
                        return Sum$2344(x$2498 + y$2499);
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2492, other$2493);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    function getSum$2345(x$2500) {
        return function getSum$2345(x$2501) {
            return function (a0$2502) {
                var r0$2503 = Sum$2344.unapply(a0$2502);
                if (r0$2503 != null && r0$2503.length === 1) {
                    var x$2504 = r0$2503[0];
                    return x$2504;
                }
                throw new TypeError('No match');
            }.call(this, x$2501);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2346 = function () {
            function Product$2505(_0$2507) {
                if (!(this instanceof Product$2505)) {
                    return new Product$2505(_0$2507);
                }
                if (typeof _0$2507 === 'number' || Object.prototype.toString.call(_0$2507) === '[object Number]') {
                    this['0'] = _0$2507;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2505.prototype.length = 1;
            var derived$2506 = Base$2252.derive({
                    name: 'Product',
                    constructor: Product$2505,
                    prototype: Product$2505.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2505,
                            prototype: Product$2505.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2506.constructor;
        }();
    Product$2346.prototype.empty = function () {
        return function (self$2508) {
            return Product$2346(1);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Product$2346.prototype.concat = function (other$2509) {
        return function (self$2510, other$2511) {
            return function (a0$2512, a1$2513) {
                var r0$2514 = Product$2346.unapply(a0$2512);
                if (r0$2514 != null && r0$2514.length === 1) {
                    var r1$2515 = Product$2346.unapply(a1$2513);
                    if (r1$2515 != null && r1$2515.length === 1) {
                        var x$2516 = r0$2514[0];
                        var y$2517 = r1$2515[0];
                        return Product$2346(x$2516 * y$2517);
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2510, other$2511);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    function getProduct$2347(x$2518) {
        return function getProduct$2347(x$2519) {
            return function (a0$2520) {
                var r0$2521 = Product$2346.unapply(a0$2520);
                if (r0$2521 != null && r0$2521.length === 1) {
                    var x$2522 = r0$2521[0];
                    return x$2522;
                }
                throw new TypeError('No match');
            }.call(this, x$2519);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2348(f$2523, xs$2524) {
        return function map$2348(f$2525, xs$2526) {
            return xs$2526.map(f$2525);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2350(f$2527, xs$2528) {
        return function ap$2350(f$2529, xs$2530) {
            return f$2529.ap(xs$2530);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2352(xs$2531, f$2532) {
        return function chain$2352(xs$2533, f$2534) {
            return xs$2533.chain(f$2534);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2357(f$2535, x$2536) {
        return function pure$2357(f$2537, x$2538) {
            return f$2537.of ? f$2537.of(x$2538) : f$2537.constructor.of(x$2538);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2358 = function () {
            function Option$2539() {
            }
            function Some$2540(val$2543) {
                if (!(this instanceof Some$2540)) {
                    return new Some$2540(val$2543);
                }
                this.val = val$2543;
            }
            Some$2540.prototype = new Option$2539();
            Some$2540.prototype.constructor = Some$2540;
            function None$2541() {
            }
            None$2541.prototype = new Option$2539();
            None$2541.prototype.constructor = None$2541;
            var derived$2542 = Base$2252.derive({
                    name: 'Option',
                    constructor: Option$2539,
                    prototype: Option$2539.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2540,
                            prototype: Some$2540.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2541,
                            prototype: None$2541.prototype
                        }
                    ]
                });
            Option$2539.Some = derived$2542.variants[0].constructor;
            Option$2539.None = new derived$2542.variants[1].constructor();
            return Option$2539;
        }();
    var Some$2359 = Option$2358.Some;
    var None$2360 = Option$2358.None;
    Option$2358.of = Some$2359;
    Option$2358.prototype.map = function (f$2544) {
        return function (self$2545, f$2546) {
            return self$2545.chain(function (x$2547) {
                return pure$2357(self$2545)(f$2546(x$2547));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2358.prototype.ap = function (x$2548) {
        return function (self$2549, x$2550) {
            return self$2549.chain(map$2348(__$2257, x$2550).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2358.prototype.chain = function (f$2551) {
        return function (self$2552, f$2553) {
            return function (a0$2554, a1$2555) {
                var r0$2556 = Some$2359.unapply(a0$2554);
                if (r0$2556 != null && (r0$2556.length === 1 && (typeof a1$2555 === 'function' || Object.prototype.toString.call(a1$2555) === '[object Function]'))) {
                    var x$2557 = r0$2556[0];
                    return f$2553(x$2557);
                }
                if ((None$2360.hasInstance ? None$2360.hasInstance(a0$2554) : a0$2554 instanceof None$2360) && (typeof a1$2555 === 'function' || Object.prototype.toString.call(a1$2555) === '[object Function]')) {
                    return None$2360;
                }
                throw new TypeError('No match');
            }.call(this, self$2552, f$2553);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2358.prototype.empty = function () {
        return function (self$2558) {
            return None$2360;
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2358.prototype.concat = function (other$2559) {
        return function (self$2560, other$2561) {
            return function (a0$2562, a1$2563) {
                if ((None$2360.hasInstance ? None$2360.hasInstance(a0$2562) : a0$2562 instanceof None$2360) && (Option$2358.hasInstance ? Option$2358.hasInstance(a1$2563) : a1$2563 instanceof Option$2358)) {
                    return other$2561;
                }
                if ((Option$2358.hasInstance ? Option$2358.hasInstance(a0$2562) : a0$2562 instanceof Option$2358) && (None$2360.hasInstance ? None$2360.hasInstance(a1$2563) : a1$2563 instanceof None$2360)) {
                    return self$2560;
                }
                var r0$2564 = Some$2359.unapply(a0$2562);
                if (r0$2564 != null && r0$2564.length === 1) {
                    var r1$2565 = Some$2359.unapply(a1$2563);
                    if (r1$2565 != null && r1$2565.length === 1) {
                        var v1$2566 = r0$2564[0];
                        var v2$2567 = r1$2565[0];
                        return Some$2359(v1$2566.concat(v2$2567));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2560, other$2561);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2379 = function () {
            function Either$2568() {
            }
            function Left$2569(l$2572) {
                if (!(this instanceof Left$2569)) {
                    return new Left$2569(l$2572);
                }
                this.l = l$2572;
            }
            Left$2569.prototype = new Either$2568();
            Left$2569.prototype.constructor = Left$2569;
            function Right$2570(r$2573) {
                if (!(this instanceof Right$2570)) {
                    return new Right$2570(r$2573);
                }
                this.r = r$2573;
            }
            Right$2570.prototype = new Either$2568();
            Right$2570.prototype.constructor = Right$2570;
            var derived$2571 = Base$2252.derive({
                    name: 'Either',
                    constructor: Either$2568,
                    prototype: Either$2568.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2569,
                            prototype: Left$2569.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2570,
                            prototype: Right$2570.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2568.Left = derived$2571.variants[0].constructor;
            Either$2568.Right = derived$2571.variants[1].constructor;
            return Either$2568;
        }();
    var Left$2380 = Either$2379.Left;
    var Right$2381 = Either$2379.Right;
    Either$2379.of = Right$2381;
    Either$2379.prototype.map = function (f$2574) {
        return function (self$2575, f$2576) {
            return self$2575.chain(function (x$2577) {
                return pure$2357(self$2575)(f$2576(x$2577));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2379.prototype.ap = function (x$2578) {
        return function (self$2579, x$2580) {
            return self$2579.chain(map$2348(__$2257, x$2580).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2379.prototype.chain = function (f$2581) {
        return function (self$2582, f$2583) {
            return function (a0$2584, a1$2585) {
                var r0$2586 = Right$2381.unapply(a0$2584);
                if (r0$2586 != null && (r0$2586.length === 1 && (typeof a1$2585 === 'function' || Object.prototype.toString.call(a1$2585) === '[object Function]'))) {
                    var x$2588 = r0$2586[0];
                    return f$2583(x$2588);
                }
                var r1$2587 = Left$2380.unapply(a0$2584);
                if (r1$2587 != null && r1$2587.length === 1) {
                    var x$2588 = r1$2587[0];
                    return self$2582;
                }
                throw new TypeError('No match');
            }.call(this, self$2582, f$2583);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2379.prototype.empty = function () {
        return function (self$2589) {
            return Left$2380();
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2379.prototype.concat = function (other$2590) {
        return function (self$2591, other$2592) {
            return function (a0$2593, a1$2594) {
                var r0$2595 = Left$2380.unapply(a0$2593);
                if (r0$2595 != null && (r0$2595.length === 1 && (Either$2379.hasInstance ? Either$2379.hasInstance(a1$2594) : a1$2594 instanceof Either$2379))) {
                    var x$2597 = r0$2595[0];
                    return other$2592;
                }
                if (Either$2379.hasInstance ? Either$2379.hasInstance(a0$2593) : a0$2593 instanceof Either$2379) {
                    var r1$2598 = Left$2380.unapply(a1$2594);
                    if (r1$2598 != null && r1$2598.length === 1) {
                        var x$2597 = r1$2598[0];
                        return self$2591;
                    }
                }
                var r2$2596 = Right$2381.unapply(a0$2593);
                if (r2$2596 != null && r2$2596.length === 1) {
                    var r3$2599 = Right$2381.unapply(a1$2594);
                    if (r3$2599 != null && r3$2599.length === 1) {
                        var r1$2600 = r2$2596[0];
                        var r2$2601 = r3$2599[0];
                        return Right$2381(r1$2600.concat(r2$2601));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2591, other$2592);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2398(f$2602, acc$2603, xs$2604) {
        return function foldl$2398(f$2605, acc$2606, xs$2607) {
            return xs$2607.reduce(f$2605, acc$2606);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2400(f$2608, xs$2609) {
        return function foldl1$2400(f$2610, xs$2611) {
            return xs$2611.reduce(f$2610);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2402(f$2612, acc$2613, xs$2614) {
        return function foldr$2402(f$2615, acc$2616, xs$2617) {
            return xs$2617.reduceRight(f$2615, acc$2616);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2404(f$2618, xs$2619) {
        return function foldr1$2404(f$2620, xs$2621) {
            return xs$2621.reduceRight(f$2620);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2407(xs$2622) {
        return function flatten$2407(xs$2623) {
            return foldl1$2400(function (xs$2624, ys$2625) {
                return xs$2624.concat(ys$2625);
            }.curry(), xs$2623);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2258(Array, 'of', function (x$2626) {
        return [x$2626];
    }.curry());
    extendNative$2258(Array.prototype, 'ap', function (x$2627) {
        return this.chain(map$2348(__$2257, x$2627).bind(this));
    }.curry());
    extendNative$2258(Array.prototype, 'chain', function (f$2628) {
        return function (x$2629) {
            return flatten$2407(map$2348(f$2628)(x$2629));
        }(this);
    }.curry());
    module.exports = {
        Core: {
            __: __$2257,
            curry: curry$2260,
            compose: compose$2261
        },
        Predicates: {
            not: not$2329,
            and: and$2330,
            or: or$2331,
            isObject: isObject$2332,
            isArray: isArray$2333,
            isNumber: isNumber$2334,
            isRegExp: isRegExp$2335,
            isString: isString$2336,
            isNull: isNull$2337,
            isUndef: isUndef$2338,
            exists: exists$2339
        },
        Math: {
            plus: plus$2340,
            minus: minus$2341,
            times: times$2342,
            div: div$2343
        },
        Number: {
            Sum: {
                Sum: Sum$2344,
                getSum: getSum$2345
            },
            Product: {
                Product: Product$2346,
                getProduct: getProduct$2347
            }
        },
        Data: {
            Either: {
                Either: Either$2379,
                Left: Left$2380,
                Right: Right$2381
            },
            Option: {
                Option: Option$2358,
                Some: Some$2359,
                None: None$2360
            },
            Collection: {
                foldl: foldl$2398,
                foldl1: foldl1$2400,
                foldr: foldr$2402,
                foldr1: foldr1$2404,
                flatten: flatten$2407
            }
        },
        Control: {
            Functor: { map: map$2348 },
            Applicative: { ap: ap$2350 },
            Monad: { chain: chain$2352 }
        }
    };
}());
//# sourceMappingURL=curry.js.map