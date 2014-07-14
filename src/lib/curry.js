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
    var extendNative$2258 = function (native$2429, prop$2430, f$2431) {
        return Object.defineProperty(native$2429, prop$2430, { value: f$2431 });
    };
    var withMeta$2259 = function (f$2432, meta$2433) {
        var keys$2434 = Object.keys(meta$2433);
        keys$2434.forEach(function (name$2435) {
            Object.defineProperty(f$2432, '__' + name$2435, { value: meta$2433[name$2435] });
        });
        return f$2432;
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
    var curry$2260 = function (f$2436, n$2437) {
        var arity$2438 = typeof n$2437 !== 'undefined' ? n$2437 : typeof f$2436.__arity !== 'undefined' ? f$2436.__arity : f$2436.length, name$2439 = f$2436.name || f$2436.__name;
        if (arity$2438 < 2)
            return f$2436;
        var curriedFn$2440 = withMeta$2259(function () {
                var args$2441 = [].slice.call(arguments, 0, arity$2438), realArity$2442 = args$2441.filter(function (x$2444) {
                        return x$2444 !== __$2257;
                    }).length, self$2443 = this;
                if (realArity$2442 >= arity$2438)
                    return f$2436.apply(self$2443, arguments);
                else {
                    var g$2445 = withMeta$2259(function () {
                            var partialArgs$2446 = [].slice.call(arguments), newArgs$2447 = [];
                            for (var i$2448 = 0; i$2448 < args$2441.length; i$2448++)
                                newArgs$2447[i$2448] = args$2441[i$2448] === __$2257 ? partialArgs$2446.length === 0 ? undefined : partialArgs$2446.shift() : args$2441[i$2448];
                            return curriedFn$2440.apply(self$2443, newArgs$2447.concat(partialArgs$2446));
                        }, {
                            name: name$2439,
                            arity: arity$2438 - realArity$2442,
                            curried: true
                        });
                    g$2445.toString = curriedFn$2440.toString.bind(curriedFn$2440);
                    return g$2445;
                }
            }, {
                name: name$2439,
                arity: arity$2438,
                curried: true
            });
        curriedFn$2440.toString = f$2436.toString.bind(f$2436);
        return curriedFn$2440;
    };
    extendNative$2258(Function.prototype, 'curry', function (n$2449) {
        return curry$2260(this, n$2449);
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
        var fns$2450 = __slice$2254.call(arguments), self$2451 = this;
        return fns$2450.reduce(function (f$2452, g$2453) {
            return function () {
                return f$2452.call(self$2451, g$2453.apply(self$2451, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2342(x$2454) {
        return function not$2342(x$2455) {
            return !x$2455;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2343(xs$2456) {
        return function and$2343(xs$2457) {
            return xs$2457.every(function (x$2458) {
                return !!x$2458;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2344(xs$2459) {
        return function or$2344(xs$2460) {
            return xs$2460.some(function (x$2461) {
                return !!x$2461;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2345(x$2462) {
        return function isObject$2345(x$2463) {
            return function (a0$2464) {
                if (Object.prototype.toString.call(a0$2464) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2463);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2346(x$2465) {
        return function isArray$2346(x$2466) {
            return function (a0$2467) {
                if (Array.isArray ? Array.isArray(a0$2467) : Object.prototype.toString.call(a0$2467) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2466);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2347(x$2468) {
        return function isNumber$2347(x$2469) {
            return function (a0$2470) {
                if (typeof a0$2470 === 'number' || Object.prototype.toString.call(a0$2470) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2469);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2348(x$2471) {
        return function isRegExp$2348(x$2472) {
            return function (a0$2473) {
                if (Object.prototype.toString.call(a0$2473) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2472);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2349(x$2474) {
        return function isString$2349(x$2475) {
            return function (a0$2476) {
                if (typeof a0$2476 === 'string' || Object.prototype.toString.call(a0$2476) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2475);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2350(x$2477) {
        return function isNull$2350(x$2478) {
            return function (a0$2479) {
                if (a0$2479 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2478);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2351(x$2480) {
        return function isUndef$2351(x$2481) {
            return function (a0$2482) {
                if (a0$2482 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2481);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2352(x$2483) {
        return function exists$2352(x$2484) {
            return function (x$2485) {
                return not$2342(or$2344(x$2485));
            }([
                isNull$2350(x$2484),
                isUndef$2351(x$2484)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2353(a$2486, b$2487) {
        return function plus$2353(a$2488, b$2489) {
            return a$2488 + b$2489;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2354(a$2490, b$2491) {
        return function minus$2354(a$2492, b$2493) {
            return a$2492 - b$2493;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2355(a$2494, b$2495) {
        return function times$2355(a$2496, b$2497) {
            return a$2496 * b$2497;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2356(a$2498, b$2499) {
        return function div$2356(a$2500, b$2501) {
            return a$2500 / b$2501;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2357 = function () {
            function Sum$2502(_0$2504) {
                if (!(this instanceof Sum$2502)) {
                    return new Sum$2502(_0$2504);
                }
                if (typeof _0$2504 === 'number' || Object.prototype.toString.call(_0$2504) === '[object Number]') {
                    this['0'] = _0$2504;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2502.prototype.length = 1;
            var derived$2503 = Base$2252.derive({
                    name: 'Sum',
                    constructor: Sum$2502,
                    prototype: Sum$2502.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2502,
                            prototype: Sum$2502.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2503.constructor;
        }();
    Sum$2357.prototype.empty = function () {
        return function (self$2505) {
            return Sum$2357(0);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Sum$2357.prototype.concat = function (other$2506) {
        return function (self$2507, other$2508) {
            return function (a0$2509, a1$2510) {
                var r0$2511 = Sum$2357.unapply(a0$2509);
                if (r0$2511 != null && r0$2511.length === 1) {
                    var r1$2512 = Sum$2357.unapply(a1$2510);
                    if (r1$2512 != null && r1$2512.length === 1) {
                        var x$2513 = r0$2511[0];
                        var y$2514 = r1$2512[0];
                        return Sum$2357(x$2513 + y$2514);
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2507, other$2508);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    function getSum$2358(x$2515) {
        return function getSum$2358(x$2516) {
            return function (a0$2517) {
                var r0$2518 = Sum$2357.unapply(a0$2517);
                if (r0$2518 != null && r0$2518.length === 1) {
                    var x$2519 = r0$2518[0];
                    return x$2519;
                }
                throw new TypeError('No match');
            }.call(this, x$2516);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2359 = function () {
            function Product$2520(_0$2522) {
                if (!(this instanceof Product$2520)) {
                    return new Product$2520(_0$2522);
                }
                if (typeof _0$2522 === 'number' || Object.prototype.toString.call(_0$2522) === '[object Number]') {
                    this['0'] = _0$2522;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2520.prototype.length = 1;
            var derived$2521 = Base$2252.derive({
                    name: 'Product',
                    constructor: Product$2520,
                    prototype: Product$2520.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2520,
                            prototype: Product$2520.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2521.constructor;
        }();
    Product$2359.prototype.empty = function () {
        return function (self$2523) {
            return Product$2359(1);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Product$2359.prototype.concat = function (other$2524) {
        return function (self$2525, other$2526) {
            return function (a0$2527, a1$2528) {
                var r0$2529 = Product$2359.unapply(a0$2527);
                if (r0$2529 != null && r0$2529.length === 1) {
                    var r1$2530 = Product$2359.unapply(a1$2528);
                    if (r1$2530 != null && r1$2530.length === 1) {
                        var x$2531 = r0$2529[0];
                        var y$2532 = r1$2530[0];
                        return Product$2359(x$2531 * y$2532);
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2525, other$2526);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    function getProduct$2360(x$2533) {
        return function getProduct$2360(x$2534) {
            return function (a0$2535) {
                var r0$2536 = Product$2359.unapply(a0$2535);
                if (r0$2536 != null && r0$2536.length === 1) {
                    var x$2537 = r0$2536[0];
                    return x$2537;
                }
                throw new TypeError('No match');
            }.call(this, x$2534);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2361 = function () {
            function Max$2538(_0$2540) {
                if (!(this instanceof Max$2538)) {
                    return new Max$2538(_0$2540);
                }
                if (typeof _0$2540 === 'number' || Object.prototype.toString.call(_0$2540) === '[object Number]') {
                    this['0'] = _0$2540;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2538.prototype.length = 1;
            var derived$2539 = Base$2252.derive({
                    name: 'Max',
                    constructor: Max$2538,
                    prototype: Max$2538.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2538,
                            prototype: Max$2538.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2539.constructor;
        }();
    Max$2361.prototype.empty = function () {
        return function (self$2541) {
            return Max$2361(-Infinity);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Max$2361.prototype.concat = function (other$2542) {
        return function (self$2543, other$2544) {
            return function (a0$2545, a1$2546) {
                var r0$2547 = Max$2361.unapply(a0$2545);
                if (r0$2547 != null && r0$2547.length === 1) {
                    var r1$2548 = Max$2361.unapply(a1$2546);
                    if (r1$2548 != null && r1$2548.length === 1) {
                        var x$2549 = r0$2547[0];
                        var y$2550 = r1$2548[0];
                        return Max$2361(x$2549 > y$2550 ? x$2549 : y$2550);
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2543, other$2544);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    function getMax$2362(x$2551) {
        return function getMax$2362(x$2552) {
            return function (a0$2553) {
                var r0$2554 = Max$2361.unapply(a0$2553);
                if (r0$2554 != null && r0$2554.length === 1) {
                    var x$2555 = r0$2554[0];
                    return x$2555;
                }
                throw new TypeError('No match');
            }.call(this, x$2552);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2363(f$2556, xs$2557) {
        return function map$2363(f$2558, xs$2559) {
            return xs$2559.map(f$2558);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2365(f$2560, xs$2561) {
        return function ap$2365(f$2562, xs$2563) {
            return f$2562.ap(xs$2563);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2367(xs$2564, f$2565) {
        return function chain$2367(xs$2566, f$2567) {
            return xs$2566.chain(f$2567);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2372(f$2568, x$2569) {
        return function pure$2372(f$2570, x$2571) {
            return f$2570.of ? f$2570.of(x$2571) : f$2570.constructor.of(x$2571);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2373 = function () {
            function Option$2572() {
            }
            function Some$2573(val$2576) {
                if (!(this instanceof Some$2573)) {
                    return new Some$2573(val$2576);
                }
                this.val = val$2576;
            }
            Some$2573.prototype = new Option$2572();
            Some$2573.prototype.constructor = Some$2573;
            function None$2574() {
            }
            None$2574.prototype = new Option$2572();
            None$2574.prototype.constructor = None$2574;
            var derived$2575 = Base$2252.derive({
                    name: 'Option',
                    constructor: Option$2572,
                    prototype: Option$2572.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2573,
                            prototype: Some$2573.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2574,
                            prototype: None$2574.prototype
                        }
                    ]
                });
            Option$2572.Some = derived$2575.variants[0].constructor;
            Option$2572.None = new derived$2575.variants[1].constructor();
            return Option$2572;
        }();
    var Some$2374 = Option$2373.Some;
    var None$2375 = Option$2373.None;
    Option$2373.of = Some$2374;
    Option$2373.prototype.map = function (f$2577) {
        return function (self$2578, f$2579) {
            return self$2578.chain(function (x$2580) {
                return pure$2372(self$2578)(f$2579(x$2580));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2373.prototype.ap = function (x$2581) {
        return function (self$2582, x$2583) {
            return self$2582.chain(map$2363(__$2257, x$2583).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2373.prototype.chain = function (f$2584) {
        return function (self$2585, f$2586) {
            return function (a0$2587, a1$2588) {
                var r0$2589 = Some$2374.unapply(a0$2587);
                if (r0$2589 != null && (r0$2589.length === 1 && (typeof a1$2588 === 'function' || Object.prototype.toString.call(a1$2588) === '[object Function]'))) {
                    var x$2590 = r0$2589[0];
                    return f$2586(x$2590);
                }
                if ((None$2375.hasInstance ? None$2375.hasInstance(a0$2587) : a0$2587 instanceof None$2375) && (typeof a1$2588 === 'function' || Object.prototype.toString.call(a1$2588) === '[object Function]')) {
                    return None$2375;
                }
                throw new TypeError('No match');
            }.call(this, self$2585, f$2586);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2373.prototype.empty = function () {
        return function (self$2591) {
            return None$2375;
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Option$2373.prototype.concat = function (other$2592) {
        return function (self$2593, other$2594) {
            return function (a0$2595, a1$2596) {
                if ((None$2375.hasInstance ? None$2375.hasInstance(a0$2595) : a0$2595 instanceof None$2375) && (Option$2373.hasInstance ? Option$2373.hasInstance(a1$2596) : a1$2596 instanceof Option$2373)) {
                    return other$2594;
                }
                if ((Option$2373.hasInstance ? Option$2373.hasInstance(a0$2595) : a0$2595 instanceof Option$2373) && (None$2375.hasInstance ? None$2375.hasInstance(a1$2596) : a1$2596 instanceof None$2375)) {
                    return self$2593;
                }
                var r0$2597 = Some$2374.unapply(a0$2595);
                if (r0$2597 != null && r0$2597.length === 1) {
                    var r1$2598 = Some$2374.unapply(a1$2596);
                    if (r1$2598 != null && r1$2598.length === 1) {
                        var v1$2599 = r0$2597[0];
                        var v2$2600 = r1$2598[0];
                        return Some$2374(v1$2599.concat(v2$2600));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2593, other$2594);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2394 = function () {
            function Either$2601() {
            }
            function Left$2602(l$2605) {
                if (!(this instanceof Left$2602)) {
                    return new Left$2602(l$2605);
                }
                this.l = l$2605;
            }
            Left$2602.prototype = new Either$2601();
            Left$2602.prototype.constructor = Left$2602;
            function Right$2603(r$2606) {
                if (!(this instanceof Right$2603)) {
                    return new Right$2603(r$2606);
                }
                this.r = r$2606;
            }
            Right$2603.prototype = new Either$2601();
            Right$2603.prototype.constructor = Right$2603;
            var derived$2604 = Base$2252.derive({
                    name: 'Either',
                    constructor: Either$2601,
                    prototype: Either$2601.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2602,
                            prototype: Left$2602.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2603,
                            prototype: Right$2603.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2601.Left = derived$2604.variants[0].constructor;
            Either$2601.Right = derived$2604.variants[1].constructor;
            return Either$2601;
        }();
    var Left$2395 = Either$2394.Left;
    var Right$2396 = Either$2394.Right;
    Either$2394.of = Right$2396;
    Either$2394.prototype.map = function (f$2607) {
        return function (self$2608, f$2609) {
            return self$2608.chain(function (x$2610) {
                return pure$2372(self$2608)(f$2609(x$2610));
            }.bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2394.prototype.ap = function (x$2611) {
        return function (self$2612, x$2613) {
            return self$2612.chain(map$2363(__$2257, x$2613).bind(this));
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2394.prototype.chain = function (f$2614) {
        return function (self$2615, f$2616) {
            return function (a0$2617, a1$2618) {
                var r0$2619 = Right$2396.unapply(a0$2617);
                if (r0$2619 != null && (r0$2619.length === 1 && (typeof a1$2618 === 'function' || Object.prototype.toString.call(a1$2618) === '[object Function]'))) {
                    var x$2621 = r0$2619[0];
                    return f$2616(x$2621);
                }
                var r1$2620 = Left$2395.unapply(a0$2617);
                if (r1$2620 != null && r1$2620.length === 1) {
                    var x$2621 = r1$2620[0];
                    return self$2615;
                }
                throw new TypeError('No match');
            }.call(this, self$2615, f$2616);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2394.prototype.empty = function () {
        return function (self$2622) {
            return Left$2395();
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    Either$2394.prototype.concat = function (other$2623) {
        return function (self$2624, other$2625) {
            return function (a0$2626, a1$2627) {
                var r0$2628 = Left$2395.unapply(a0$2626);
                if (r0$2628 != null && (r0$2628.length === 1 && (Either$2394.hasInstance ? Either$2394.hasInstance(a1$2627) : a1$2627 instanceof Either$2394))) {
                    var x$2630 = r0$2628[0];
                    return other$2625;
                }
                if (Either$2394.hasInstance ? Either$2394.hasInstance(a0$2626) : a0$2626 instanceof Either$2394) {
                    var r1$2631 = Left$2395.unapply(a1$2627);
                    if (r1$2631 != null && r1$2631.length === 1) {
                        var x$2630 = r1$2631[0];
                        return self$2624;
                    }
                }
                var r2$2629 = Right$2396.unapply(a0$2626);
                if (r2$2629 != null && r2$2629.length === 1) {
                    var r3$2632 = Right$2396.unapply(a1$2627);
                    if (r3$2632 != null && r3$2632.length === 1) {
                        var r1$2633 = r2$2629[0];
                        var r2$2634 = r3$2632[0];
                        return Right$2396(r1$2633.concat(r2$2634));
                    }
                }
                throw new TypeError('No match');
            }.call(this, self$2624, other$2625);
        }.apply(this, [this].concat([].slice.call(arguments)));
    }.curry();
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2413(f$2635, acc$2636, xs$2637) {
        return function foldl$2413(f$2638, acc$2639, xs$2640) {
            return xs$2640.reduce(f$2638, acc$2639);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2415(f$2641, xs$2642) {
        return function foldl1$2415(f$2643, xs$2644) {
            return xs$2644.reduce(f$2643);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2417(f$2645, acc$2646, xs$2647) {
        return function foldr$2417(f$2648, acc$2649, xs$2650) {
            return xs$2650.reduceRight(f$2648, acc$2649);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2419(f$2651, xs$2652) {
        return function foldr1$2419(f$2653, xs$2654) {
            return xs$2654.reduceRight(f$2653);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2422(xs$2655) {
        return function flatten$2422(xs$2656) {
            return foldl1$2415(function (xs$2657, ys$2658) {
                return xs$2657.concat(ys$2658);
            }.curry(), xs$2656);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2258(Array, 'of', function (x$2659) {
        return [x$2659];
    }.curry());
    extendNative$2258(Array.prototype, 'ap', function (x$2660) {
        return this.chain(map$2363(__$2257, x$2660).bind(this));
    }.curry());
    extendNative$2258(Array.prototype, 'chain', function (f$2661) {
        return function (x$2662) {
            return flatten$2422(map$2363(f$2661)(x$2662));
        }(this);
    }.curry());
    module.exports = {
        Core: {
            __: __$2257,
            curry: curry$2260,
            compose: compose$2261
        },
        Predicates: {
            not: not$2342,
            and: and$2343,
            or: or$2344,
            isObject: isObject$2345,
            isArray: isArray$2346,
            isNumber: isNumber$2347,
            isRegExp: isRegExp$2348,
            isString: isString$2349,
            isNull: isNull$2350,
            isUndef: isUndef$2351,
            exists: exists$2352
        },
        Math: {
            plus: plus$2353,
            minus: minus$2354,
            times: times$2355,
            div: div$2356
        },
        Number: {
            Sum: {
                Sum: Sum$2357,
                getSum: getSum$2358
            },
            Product: {
                Product: Product$2359,
                getProduct: getProduct$2360
            },
            Max: {
                Max: Max$2361,
                getMax: getMax$2362
            }
        },
        Data: {
            Either: {
                Either: Either$2394,
                Left: Left$2395,
                Right: Right$2396
            },
            Option: {
                Option: Option$2373,
                Some: Some$2374,
                None: None$2375
            },
            Collection: {
                foldl: foldl$2413,
                foldl1: foldl1$2415,
                foldr: foldr$2417,
                foldr1: foldr1$2419,
                flatten: flatten$2422
            }
        },
        Control: {
            Functor: { map: map$2363 },
            Applicative: { ap: ap$2365 },
            Monad: { chain: chain$2367 }
        }
    };
}());
//# sourceMappingURL=curry.js.map