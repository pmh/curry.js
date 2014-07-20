(function () {
    'use strict';
    var Base$2272 = require('./adt-derivers').Base;
    var __slice$2274 = [].slice;
    var __toString$2276 = {}.toString;
    // ***************************************************************
    // **                       CurryJS.Core                        **
    // ***************************************************************
    // __ :: () -> ()
    var __$2277 = function noop() {
    };
    var extendNative$2278 = function (native$2425, prop$2426, f$2427) {
        return Object.defineProperty(native$2425, prop$2426, { value: f$2427 });
    };
    var withMeta$2279 = function (f$2428, meta$2429) {
        var keys$2430 = Object.keys(meta$2429);
        keys$2430.forEach(function (name$2431) {
            Object.defineProperty(f$2428, '__' + name$2431, { value: meta$2429[name$2431] });
        });
        return f$2428;
    };
    /*
  * curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))
  *
  * Given any fixed arity function it returns a new function that can be partially applied.
  *
  * Usage:
  *
  *   times    := curry(fun (a, b) -> a * b);
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
    var curry$2280 = function (f$2432, n$2433) {
        var arity$2434 = typeof n$2433 !== 'undefined' ? n$2433 : typeof f$2432.__arity !== 'undefined' ? f$2432.__arity : f$2432.length, name$2435 = f$2432.name || f$2432.__name;
        if (arity$2434 < 2)
            return f$2432;
        var curriedFn$2436 = withMeta$2279(function () {
                var args$2437 = [].slice.call(arguments, 0, arity$2434), realArity$2438 = args$2437.filter(function (x$2440) {
                        return x$2440 !== __$2277;
                    }).length, self$2439 = this;
                if (realArity$2438 >= arity$2434)
                    return f$2432.apply(self$2439, arguments);
                else {
                    var g$2441 = withMeta$2279(function () {
                            var partialArgs$2442 = [].slice.call(arguments), newArgs$2443 = [];
                            for (var i$2444 = 0; i$2444 < args$2437.length; i$2444++)
                                newArgs$2443[i$2444] = args$2437[i$2444] === __$2277 ? partialArgs$2442.length === 0 ? undefined : partialArgs$2442.shift() : args$2437[i$2444];
                            return curriedFn$2436.apply(self$2439, newArgs$2443.concat(partialArgs$2442));
                        }, {
                            name: name$2435,
                            arity: arity$2434 - realArity$2438,
                            curried: true
                        });
                    g$2441.toString = curriedFn$2436.toString.bind(curriedFn$2436);
                    return g$2441;
                }
            }, {
                name: name$2435,
                arity: arity$2434,
                curried: true
            });
        curriedFn$2436.toString = f$2432.toString.bind(f$2432);
        return curriedFn$2436;
    };
    extendNative$2278(Function.prototype, 'curry', function (n$2445) {
        return curry$2280(this, n$2445);
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
    var compose$2281 = function () {
        var fns$2446 = __slice$2274.call(arguments), self$2447 = this;
        return fns$2446.reduce(function (f$2448, g$2449) {
            return function () {
                return f$2448.call(self$2447, g$2449.apply(self$2447, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2283 = function (name$2450, spec$2451) {
        return {
            name: name$2450,
            spec: spec$2451,
            instance: function (type$2452, impl$2453) {
                var name$2454 = this.name, spec$2455 = this.spec, constructor$2456 = spec$2455.constructor, proto$2457 = spec$2455.prototype, k$2458;
                Object.keys(constructor$2456 || {}).map(function (field$2459) {
                    if (constructor$2456[field$2459] === Protocol$2283.required && !impl$2453.hasOwnProperty(field$2459) && !type$2452.hasOwnProperty(field$2459))
                        throw Protocol$2283.required(name$2454, field$2459);
                    else if (!type$2452.hasOwnProperty(field$2459) && !impl$2453.hasOwnProperty(field$2459))
                        type$2452[field$2459] = function () {
                            return constructor$2456[field$2459].curry().apply(this, [this].concat(__slice$2274.call(arguments)));
                        };
                    else if (impl$2453.hasOwnProperty(field$2459))
                        type$2452[field$2459] = function () {
                            return impl$2453[field$2459].curry().apply(this, [this].concat(__slice$2274.call(arguments)));
                        };
                });
                Object.keys(proto$2457 || {}).map(function (field$2460) {
                    if (proto$2457[field$2460] === Protocol$2283.required && !impl$2453.hasOwnProperty(field$2460) && !type$2452.prototype.hasOwnProperty(field$2460))
                        throw Protocol$2283.required(name$2454, field$2460);
                    else if (!type$2452.prototype.hasOwnProperty(field$2460) && !impl$2453.hasOwnProperty(field$2460))
                        type$2452.prototype[field$2460] = function () {
                            return proto$2457[field$2460].curry().apply(this, [this].concat(__slice$2274.call(arguments)));
                        };
                    else if (impl$2453.hasOwnProperty(field$2460))
                        type$2452.prototype[field$2460] = function () {
                            return impl$2453[field$2460].curry().apply(this, [this].concat(__slice$2274.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2283.required = function (name$2461, field$2462) {
        return new Error(name$2461 + ' expected required field: \'' + field$2462 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2286(protocol$2463, type$2464, impl$2465) {
        return function instance$2286(protocol$2466, type$2467, impl$2468) {
            return protocol$2466.instance(type$2467, impl$2468);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2327(x$2469) {
        return function not$2327(x$2470) {
            return !x$2470;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2328(xs$2471) {
        return function and$2328(xs$2472) {
            return xs$2472.every(function (x$2473) {
                return !!x$2473;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2329(xs$2474) {
        return function or$2329(xs$2475) {
            return xs$2475.some(function (x$2476) {
                return !!x$2476;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2330(x$2477) {
        return function isObject$2330(x$2478) {
            return function (a0$2479) {
                if (Object.prototype.toString.call(a0$2479) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2478);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2331(x$2480) {
        return function isArray$2331(x$2481) {
            return function (a0$2482) {
                if (Array.isArray ? Array.isArray(a0$2482) : Object.prototype.toString.call(a0$2482) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2481);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2332(x$2483) {
        return function isNumber$2332(x$2484) {
            return function (a0$2485) {
                if (typeof a0$2485 === 'number' || Object.prototype.toString.call(a0$2485) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2484);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2333(x$2486) {
        return function isRegExp$2333(x$2487) {
            return function (a0$2488) {
                if (Object.prototype.toString.call(a0$2488) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2487);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2334(x$2489) {
        return function isString$2334(x$2490) {
            return function (a0$2491) {
                if (typeof a0$2491 === 'string' || Object.prototype.toString.call(a0$2491) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2490);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2335(x$2492) {
        return function isNull$2335(x$2493) {
            return function (a0$2494) {
                if (a0$2494 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2493);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2336(x$2495) {
        return function isUndef$2336(x$2496) {
            return function (a0$2497) {
                if (a0$2497 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2496);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2337(x$2498) {
        return function exists$2337(x$2499) {
            return function (x$2500) {
                return not$2327(or$2329(x$2500));
            }([
                isNull$2335(x$2499),
                isUndef$2336(x$2499)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2338(a$2501, b$2502) {
        return function plus$2338(a$2503, b$2504) {
            return a$2503 + b$2504;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2339(a$2505, b$2506) {
        return function minus$2339(a$2507, b$2508) {
            return a$2507 - b$2508;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2340(a$2509, b$2510) {
        return function times$2340(a$2511, b$2512) {
            return a$2511 * b$2512;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2341(a$2513, b$2514) {
        return function div$2341(a$2515, b$2516) {
            return a$2515 / b$2516;
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2343 = Protocol$2283('Functor', { prototype: { map: Protocol$2283.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2345(f$2517, xs$2518) {
        return function map$2345(f$2519, xs$2520) {
            return xs$2520.map(f$2519);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2347 = Protocol$2283('Applicative', { prototype: { ap: Protocol$2283.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2349(f$2521, xs$2522) {
        return function ap$2349(f$2523, xs$2524) {
            return f$2523.ap(xs$2524);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2351 = Protocol$2283('Monad', {
            constructor: {
                of: function (x$2525) {
                    return this.prototype.of(x$2525);
                }
            },
            prototype: {
                of: Protocol$2283.required,
                chain: Protocol$2283.required,
                map: function (self$2530, f$2531) {
                    return self$2530.chain(compose$2281(self$2530.of, f$2531).bind(this));
                }.curry(),
                ap: function (self$2532, x$2533) {
                    return self$2532.chain(map$2345(__$2277, x$2533).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2353(xs$2534, f$2535) {
        return function chain$2353(xs$2536, f$2537) {
            return xs$2536.chain(f$2537);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2355(f$2538, x$2539) {
        return function pure$2355(f$2540, x$2541) {
            return f$2540.of ? f$2540.of(x$2541) : f$2540.constructor.of(x$2541);
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Monoid                   **
        // ***************************************************************
        Monoid$2357 = Protocol$2283('Monoid', {
            constructor: {
                empty: function () {
                    return this.prototype.empty();
                }
            },
            prototype: {
                empty: Protocol$2283.required,
                concat: Protocol$2283.required
            }
        });
    // concat :: (Monoid a) => a -> a -> a
    function concat$2359(a$2542, b$2543) {
        return function concat$2359(a$2544, b$2545) {
            return a$2544.concat(b$2545);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2363 = function () {
            function Sum$2546(_0$2548) {
                if (!(this instanceof Sum$2546)) {
                    return new Sum$2546(_0$2548);
                }
                if (typeof _0$2548 === 'number' || Object.prototype.toString.call(_0$2548) === '[object Number]') {
                    this['0'] = _0$2548;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2546.prototype.length = 1;
            var derived$2547 = Base$2272.derive({
                    name: 'Sum',
                    constructor: Sum$2546,
                    prototype: Sum$2546.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2546,
                            prototype: Sum$2546.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2547.constructor;
        }();
    instance$2286(Monoid$2357, Sum$2363, {
        empty: function (self$2554) {
            return Sum$2363(0);
        }.curry(),
        concat: function (a$2555, b$2556) {
            return function (a0$2557, a1$2558) {
                var r0$2559 = Sum$2363.unapply(a0$2557);
                if (r0$2559 != null && r0$2559.length === 1) {
                    var r1$2560 = Sum$2363.unapply(a1$2558);
                    if (r1$2560 != null && r1$2560.length === 1) {
                        var x$2561 = r0$2559[0];
                        var y$2562 = r1$2560[0];
                        return Sum$2363(x$2561 + y$2562);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2555, b$2556);
        }.curry()
    });
    function getSum$2371(x$2563) {
        return function getSum$2371(x$2564) {
            return function (a0$2565) {
                var r0$2566 = Sum$2363.unapply(a0$2565);
                if (r0$2566 != null && r0$2566.length === 1) {
                    var x$2567 = r0$2566[0];
                    return x$2567;
                }
                throw new TypeError('No match');
            }.call(this, x$2564);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2372 = function () {
            function Product$2568(_0$2570) {
                if (!(this instanceof Product$2568)) {
                    return new Product$2568(_0$2570);
                }
                if (typeof _0$2570 === 'number' || Object.prototype.toString.call(_0$2570) === '[object Number]') {
                    this['0'] = _0$2570;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2568.prototype.length = 1;
            var derived$2569 = Base$2272.derive({
                    name: 'Product',
                    constructor: Product$2568,
                    prototype: Product$2568.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2568,
                            prototype: Product$2568.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2569.constructor;
        }();
    instance$2286(Monoid$2357, Product$2372, {
        empty: function (self$2576) {
            return Product$2372(1);
        }.curry(),
        concat: function (a$2577, b$2578) {
            return function (a0$2579, a1$2580) {
                var r0$2581 = Product$2372.unapply(a0$2579);
                if (r0$2581 != null && r0$2581.length === 1) {
                    var r1$2582 = Product$2372.unapply(a1$2580);
                    if (r1$2582 != null && r1$2582.length === 1) {
                        var x$2583 = r0$2581[0];
                        var y$2584 = r1$2582[0];
                        return Product$2372(x$2583 * y$2584);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2577, b$2578);
        }.curry()
    });
    function getProduct$2380(x$2585) {
        return function getProduct$2380(x$2586) {
            return function (a0$2587) {
                var r0$2588 = Product$2372.unapply(a0$2587);
                if (r0$2588 != null && r0$2588.length === 1) {
                    var x$2589 = r0$2588[0];
                    return x$2589;
                }
                throw new TypeError('No match');
            }.call(this, x$2586);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2381 = function () {
            function Max$2590(_0$2592) {
                if (!(this instanceof Max$2590)) {
                    return new Max$2590(_0$2592);
                }
                if (typeof _0$2592 === 'number' || Object.prototype.toString.call(_0$2592) === '[object Number]') {
                    this['0'] = _0$2592;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2590.prototype.length = 1;
            var derived$2591 = Base$2272.derive({
                    name: 'Max',
                    constructor: Max$2590,
                    prototype: Max$2590.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2590,
                            prototype: Max$2590.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2591.constructor;
        }();
    instance$2286(Monoid$2357, Max$2381, {
        empty: function () {
            return Max$2381(-Infinity);
        }.curry(),
        concat: function (a$2599, b$2600) {
            return function (a0$2601, a1$2602) {
                var r0$2603 = Max$2381.unapply(a0$2601);
                if (r0$2603 != null && r0$2603.length === 1) {
                    var r1$2604 = Max$2381.unapply(a1$2602);
                    if (r1$2604 != null && r1$2604.length === 1) {
                        var x$2605 = r0$2603[0];
                        var y$2606 = r1$2604[0];
                        return Max$2381(x$2605 > y$2606 ? x$2605 : y$2606);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2599, b$2600);
        }.curry()
    });
    function getMax$2389(x$2607) {
        return function getMax$2389(x$2608) {
            return function (a0$2609) {
                var r0$2610 = Max$2381.unapply(a0$2609);
                if (r0$2610 != null && r0$2610.length === 1) {
                    var x$2611 = r0$2610[0];
                    return x$2611;
                }
                throw new TypeError('No match');
            }.call(this, x$2608);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2390 = function () {
            function Min$2612(_0$2614) {
                if (!(this instanceof Min$2612)) {
                    return new Min$2612(_0$2614);
                }
                if (typeof _0$2614 === 'number' || Object.prototype.toString.call(_0$2614) === '[object Number]') {
                    this['0'] = _0$2614;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2612.prototype.length = 1;
            var derived$2613 = Base$2272.derive({
                    name: 'Min',
                    constructor: Min$2612,
                    prototype: Min$2612.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2612,
                            prototype: Min$2612.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2613.constructor;
        }();
    instance$2286(Monoid$2357, Min$2390, {
        empty: function (self$2620) {
            return Min$2390(Infinity);
        }.curry(),
        concat: function (a$2621, b$2622) {
            return function (a0$2623, a1$2624) {
                var r0$2625 = Min$2390.unapply(a0$2623);
                if (r0$2625 != null && r0$2625.length === 1) {
                    var r1$2626 = Min$2390.unapply(a1$2624);
                    if (r1$2626 != null && r1$2626.length === 1) {
                        var x$2627 = r0$2625[0];
                        var y$2628 = r1$2626[0];
                        return Min$2390(x$2627 < y$2628 ? x$2627 : y$2628);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2621, b$2622);
        }.curry()
    });
    function getMin$2398(x$2629) {
        return function getMin$2398(x$2630) {
            return function (a0$2631) {
                var r0$2632 = Min$2390.unapply(a0$2631);
                if (r0$2632 != null && r0$2632.length === 1) {
                    var x$2633 = r0$2632[0];
                    return x$2633;
                }
                throw new TypeError('No match');
            }.call(this, x$2630);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2399 = function () {
            function Option$2634() {
            }
            function Some$2635(val$2638) {
                if (!(this instanceof Some$2635)) {
                    return new Some$2635(val$2638);
                }
                this.val = val$2638;
            }
            Some$2635.prototype = new Option$2634();
            Some$2635.prototype.constructor = Some$2635;
            function None$2636() {
            }
            None$2636.prototype = new Option$2634();
            None$2636.prototype.constructor = None$2636;
            var derived$2637 = Base$2272.derive({
                    name: 'Option',
                    constructor: Option$2634,
                    prototype: Option$2634.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2635,
                            prototype: Some$2635.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2636,
                            prototype: None$2636.prototype
                        }
                    ]
                });
            Option$2634.Some = derived$2637.variants[0].constructor;
            Option$2634.None = new derived$2637.variants[1].constructor();
            return Option$2634;
        }();
    var Some$2400 = Option$2399.Some;
    var None$2401 = Option$2399.None;
    instance$2286(Monad$2351, Option$2399, {
        of: function (self$2644, x$2645) {
            return Some$2400(x$2645);
        }.curry(),
        chain: function (self$2646, f$2647) {
            return function (a0$2648, a1$2649) {
                var r0$2650 = Some$2400.unapply(a0$2648);
                if (r0$2650 != null && (r0$2650.length === 1 && (typeof a1$2649 === 'function' || Object.prototype.toString.call(a1$2649) === '[object Function]'))) {
                    var x$2651 = r0$2650[0];
                    return f$2647(x$2651);
                }
                if ((None$2401.hasInstance ? None$2401.hasInstance(a0$2648) : a0$2648 instanceof None$2401) && (typeof a1$2649 === 'function' || Object.prototype.toString.call(a1$2649) === '[object Function]')) {
                    return None$2401;
                }
                throw new TypeError('No match');
            }.call(this, self$2646, f$2647);
        }.curry()
    });
    instance$2286(Monoid$2357, Option$2399, {
        empty: function (self$2657) {
            return None$2401;
        }.curry(),
        concat: function (a$2658, b$2659) {
            return function (a0$2660, a1$2661) {
                if ((Option$2399.hasInstance ? Option$2399.hasInstance(a0$2660) : a0$2660 instanceof Option$2399) && (None$2401.hasInstance ? None$2401.hasInstance(a1$2661) : a1$2661 instanceof None$2401)) {
                    return a$2658;
                }
                if ((None$2401.hasInstance ? None$2401.hasInstance(a0$2660) : a0$2660 instanceof None$2401) && (Option$2399.hasInstance ? Option$2399.hasInstance(a1$2661) : a1$2661 instanceof Option$2399)) {
                    return b$2659;
                }
                var r0$2662 = Some$2400.unapply(a0$2660);
                if (r0$2662 != null && r0$2662.length === 1) {
                    var r1$2663 = Some$2400.unapply(a1$2661);
                    if (r1$2663 != null && r1$2663.length === 1) {
                        var v1$2664 = r0$2662[0];
                        var v2$2665 = r1$2663[0];
                        return Some$2400(v1$2664.concat(v2$2665));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2658, b$2659);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2405 = function () {
            function Either$2666() {
            }
            function Left$2667(l$2670) {
                if (!(this instanceof Left$2667)) {
                    return new Left$2667(l$2670);
                }
                this.l = l$2670;
            }
            Left$2667.prototype = new Either$2666();
            Left$2667.prototype.constructor = Left$2667;
            function Right$2668(r$2671) {
                if (!(this instanceof Right$2668)) {
                    return new Right$2668(r$2671);
                }
                this.r = r$2671;
            }
            Right$2668.prototype = new Either$2666();
            Right$2668.prototype.constructor = Right$2668;
            var derived$2669 = Base$2272.derive({
                    name: 'Either',
                    constructor: Either$2666,
                    prototype: Either$2666.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2667,
                            prototype: Left$2667.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2668,
                            prototype: Right$2668.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2666.Left = derived$2669.variants[0].constructor;
            Either$2666.Right = derived$2669.variants[1].constructor;
            return Either$2666;
        }();
    var Left$2406 = Either$2405.Left;
    var Right$2407 = Either$2405.Right;
    instance$2286(Monad$2351, Either$2405, {
        of: function (self$2677, x$2678) {
            return Right$2407(x$2678);
        }.curry(),
        chain: function (self$2679, f$2680) {
            return function (a0$2681, a1$2682) {
                var r0$2683 = Right$2407.unapply(a0$2681);
                if (r0$2683 != null && (r0$2683.length === 1 && (typeof a1$2682 === 'function' || Object.prototype.toString.call(a1$2682) === '[object Function]'))) {
                    var x$2685 = r0$2683[0];
                    return f$2680(x$2685);
                }
                var r1$2684 = Left$2406.unapply(a0$2681);
                if (r1$2684 != null && r1$2684.length === 1) {
                    var x$2685 = r1$2684[0];
                    return self$2679;
                }
                throw new TypeError('No match');
            }.call(this, self$2679, f$2680);
        }.curry()
    });
    instance$2286(Monoid$2357, Either$2405, {
        empty: function (self$2691) {
            return Left$2406();
        }.curry(),
        concat: function (a$2692, b$2693) {
            return function (a0$2694, a1$2695) {
                if (Either$2405.hasInstance ? Either$2405.hasInstance(a0$2694) : a0$2694 instanceof Either$2405) {
                    var r0$2698 = Left$2406.unapply(a1$2695);
                    if (r0$2698 != null && r0$2698.length === 1) {
                        var x$2699 = r0$2698[0];
                        return a$2692;
                    }
                }
                var r1$2696 = Left$2406.unapply(a0$2694);
                if (r1$2696 != null && (r1$2696.length === 1 && (Either$2405.hasInstance ? Either$2405.hasInstance(a1$2695) : a1$2695 instanceof Either$2405))) {
                    var x$2699 = r1$2696[0];
                    return b$2693;
                }
                var r2$2697 = Right$2407.unapply(a0$2694);
                if (r2$2697 != null && r2$2697.length === 1) {
                    var r3$2700 = Right$2407.unapply(a1$2695);
                    if (r3$2700 != null && r3$2700.length === 1) {
                        var r1$2701 = r2$2697[0];
                        var r2$2702 = r3$2700[0];
                        return Right$2407(r1$2701.concat(r2$2702));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2692, b$2693);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2409(f$2703, acc$2704, xs$2705) {
        return function foldl$2409(f$2706, acc$2707, xs$2708) {
            return xs$2708.reduce(f$2706, acc$2707);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2411(f$2709, xs$2710) {
        return function foldl1$2411(f$2711, xs$2712) {
            return xs$2712.reduce(f$2711);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2413(f$2713, acc$2714, xs$2715) {
        return function foldr$2413(f$2716, acc$2717, xs$2718) {
            return xs$2718.reduceRight(f$2716, acc$2717);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2415(f$2719, xs$2720) {
        return function foldr1$2415(f$2721, xs$2722) {
            return xs$2722.reduceRight(f$2721);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2418(xs$2723) {
        return function flatten$2418(xs$2724) {
            return foldl1$2411(function (xs$2725, ys$2726) {
                return xs$2725.concat(ys$2726);
            }.curry(), xs$2724);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2278(Array, 'of', function (x$2727) {
        return [x$2727];
    }.curry());
    extendNative$2278(Array.prototype, 'ap', function (x$2728) {
        return this.chain(map$2345(__$2277, x$2728).bind(this));
    }.curry());
    extendNative$2278(Array.prototype, 'chain', function (f$2729) {
        return function (x$2730) {
            return flatten$2418(map$2345(f$2729)(x$2730));
        }(this);
    }.curry());
    module.exports = {
        Core: {
            __: __$2277,
            curry: curry$2280,
            compose: compose$2281,
            Protocol: Protocol$2283,
            instance: instance$2286
        },
        Predicates: {
            not: not$2327,
            and: and$2328,
            or: or$2329,
            isObject: isObject$2330,
            isArray: isArray$2331,
            isNumber: isNumber$2332,
            isRegExp: isRegExp$2333,
            isString: isString$2334,
            isNull: isNull$2335,
            isUndef: isUndef$2336,
            exists: exists$2337
        },
        Math: {
            plus: plus$2338,
            minus: minus$2339,
            times: times$2340,
            div: div$2341
        },
        Number: {
            Sum: {
                Sum: Sum$2363,
                getSum: getSum$2371
            },
            Product: {
                Product: Product$2372,
                getProduct: getProduct$2380
            },
            Max: {
                Max: Max$2381,
                getMax: getMax$2389
            },
            Min: {
                Min: Min$2390,
                getMin: getMin$2398
            }
        },
        Data: {
            Either: {
                Either: Either$2405,
                Left: Left$2406,
                Right: Right$2407
            },
            Option: {
                Option: Option$2399,
                Some: Some$2400,
                None: None$2401
            },
            Collection: {
                foldl: foldl$2409,
                foldl1: foldl1$2411,
                foldr: foldr$2413,
                foldr1: foldr1$2415,
                flatten: flatten$2418
            }
        },
        Control: {
            Functor: { map: map$2345 },
            Applicative: { ap: ap$2349 },
            Monad: {
                Monad: Monad$2351,
                chain: chain$2353
            },
            Monoid: {
                Monoid: Monoid$2357,
                concat: concat$2359
            }
        }
    };
}());
//# sourceMappingURL=curry.js.map