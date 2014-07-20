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
    var extendNative$2258 = function (native$2405, prop$2406, f$2407) {
        return Object.defineProperty(native$2405, prop$2406, { value: f$2407 });
    };
    var withMeta$2259 = function (f$2408, meta$2409) {
        var keys$2410 = Object.keys(meta$2409);
        keys$2410.forEach(function (name$2411) {
            Object.defineProperty(f$2408, '__' + name$2411, { value: meta$2409[name$2411] });
        });
        return f$2408;
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
    var curry$2260 = function (f$2412, n$2413) {
        var arity$2414 = typeof n$2413 !== 'undefined' ? n$2413 : typeof f$2412.__arity !== 'undefined' ? f$2412.__arity : f$2412.length, name$2415 = f$2412.name || f$2412.__name;
        if (arity$2414 < 2)
            return f$2412;
        var curriedFn$2416 = withMeta$2259(function () {
                var args$2417 = [].slice.call(arguments, 0, arity$2414), realArity$2418 = args$2417.filter(function (x$2420) {
                        return x$2420 !== __$2257;
                    }).length, self$2419 = this;
                if (realArity$2418 >= arity$2414)
                    return f$2412.apply(self$2419, arguments);
                else {
                    var g$2421 = withMeta$2259(function () {
                            var partialArgs$2422 = [].slice.call(arguments), newArgs$2423 = [];
                            for (var i$2424 = 0; i$2424 < args$2417.length; i$2424++)
                                newArgs$2423[i$2424] = args$2417[i$2424] === __$2257 ? partialArgs$2422.length === 0 ? undefined : partialArgs$2422.shift() : args$2417[i$2424];
                            return curriedFn$2416.apply(self$2419, newArgs$2423.concat(partialArgs$2422));
                        }, {
                            name: name$2415,
                            arity: arity$2414 - realArity$2418,
                            curried: true
                        });
                    g$2421.toString = curriedFn$2416.toString.bind(curriedFn$2416);
                    return g$2421;
                }
            }, {
                name: name$2415,
                arity: arity$2414,
                curried: true
            });
        curriedFn$2416.toString = f$2412.toString.bind(f$2412);
        return curriedFn$2416;
    };
    extendNative$2258(Function.prototype, 'curry', function (n$2425) {
        return curry$2260(this, n$2425);
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
        var fns$2426 = __slice$2254.call(arguments), self$2427 = this;
        return fns$2426.reduce(function (f$2428, g$2429) {
            return function () {
                return f$2428.call(self$2427, g$2429.apply(self$2427, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2263 = function (name$2430, spec$2431) {
        return {
            name: name$2430,
            spec: spec$2431,
            instance: function (type$2432, impl$2433) {
                var name$2434 = this.name, spec$2435 = this.spec, constructor$2436 = spec$2435.constructor, proto$2437 = spec$2435.prototype, k$2438;
                Object.keys(constructor$2436 || {}).map(function (field$2439) {
                    if (constructor$2436[field$2439] === Protocol$2263.required && !impl$2433.hasOwnProperty(field$2439) && !type$2432.hasOwnProperty(field$2439))
                        throw Protocol$2263.required(name$2434, field$2439);
                    else if (!type$2432.hasOwnProperty(field$2439) && !impl$2433.hasOwnProperty(field$2439))
                        type$2432[field$2439] = function () {
                            return constructor$2436[field$2439].curry().apply(this, [this].concat(__slice$2254.call(arguments)));
                        };
                    else if (impl$2433.hasOwnProperty(field$2439))
                        type$2432[field$2439] = function () {
                            return impl$2433[field$2439].curry().apply(this, [this].concat(__slice$2254.call(arguments)));
                        };
                });
                Object.keys(proto$2437 || {}).map(function (field$2440) {
                    if (proto$2437[field$2440] === Protocol$2263.required && !impl$2433.hasOwnProperty(field$2440) && !type$2432.prototype.hasOwnProperty(field$2440))
                        throw Protocol$2263.required(name$2434, field$2440);
                    else if (!type$2432.prototype.hasOwnProperty(field$2440) && !impl$2433.hasOwnProperty(field$2440))
                        type$2432.prototype[field$2440] = function () {
                            return proto$2437[field$2440].curry().apply(this, [this].concat(__slice$2254.call(arguments)));
                        };
                    else if (impl$2433.hasOwnProperty(field$2440))
                        type$2432.prototype[field$2440] = function () {
                            return impl$2433[field$2440].curry().apply(this, [this].concat(__slice$2254.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2263.required = function (name$2441, field$2442) {
        return new Error(name$2441 + ' expected required field: \'' + field$2442 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2266(protocol$2443, type$2444, impl$2445) {
        return function instance$2266(protocol$2446, type$2447, impl$2448) {
            return protocol$2446.instance(type$2447, impl$2448);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2307(x$2449) {
        return function not$2307(x$2450) {
            return !x$2450;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2308(xs$2451) {
        return function and$2308(xs$2452) {
            return xs$2452.every(function (x$2453) {
                return !!x$2453;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2309(xs$2454) {
        return function or$2309(xs$2455) {
            return xs$2455.some(function (x$2456) {
                return !!x$2456;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2310(x$2457) {
        return function isObject$2310(x$2458) {
            return function (a0$2459) {
                if (Object.prototype.toString.call(a0$2459) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2458);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2311(x$2460) {
        return function isArray$2311(x$2461) {
            return function (a0$2462) {
                if (Array.isArray ? Array.isArray(a0$2462) : Object.prototype.toString.call(a0$2462) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2461);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2312(x$2463) {
        return function isNumber$2312(x$2464) {
            return function (a0$2465) {
                if (typeof a0$2465 === 'number' || Object.prototype.toString.call(a0$2465) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2464);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2313(x$2466) {
        return function isRegExp$2313(x$2467) {
            return function (a0$2468) {
                if (Object.prototype.toString.call(a0$2468) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2467);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2314(x$2469) {
        return function isString$2314(x$2470) {
            return function (a0$2471) {
                if (typeof a0$2471 === 'string' || Object.prototype.toString.call(a0$2471) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2470);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2315(x$2472) {
        return function isNull$2315(x$2473) {
            return function (a0$2474) {
                if (a0$2474 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2473);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2316(x$2475) {
        return function isUndef$2316(x$2476) {
            return function (a0$2477) {
                if (a0$2477 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2476);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2317(x$2478) {
        return function exists$2317(x$2479) {
            return function (x$2480) {
                return not$2307(or$2309(x$2480));
            }([
                isNull$2315(x$2479),
                isUndef$2316(x$2479)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2318(a$2481, b$2482) {
        return function plus$2318(a$2483, b$2484) {
            return a$2483 + b$2484;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2319(a$2485, b$2486) {
        return function minus$2319(a$2487, b$2488) {
            return a$2487 - b$2488;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2320(a$2489, b$2490) {
        return function times$2320(a$2491, b$2492) {
            return a$2491 * b$2492;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2321(a$2493, b$2494) {
        return function div$2321(a$2495, b$2496) {
            return a$2495 / b$2496;
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2323 = Protocol$2263('Functor', { prototype: { map: Protocol$2263.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2325(f$2497, xs$2498) {
        return function map$2325(f$2499, xs$2500) {
            return xs$2500.map(f$2499);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2327 = Protocol$2263('Applicative', { prototype: { ap: Protocol$2263.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2329(f$2501, xs$2502) {
        return function ap$2329(f$2503, xs$2504) {
            return f$2503.ap(xs$2504);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2331 = Protocol$2263('Monad', {
            constructor: {
                of: function (x$2505) {
                    return this.prototype.of(x$2505);
                }
            },
            prototype: {
                of: Protocol$2263.required,
                chain: Protocol$2263.required,
                map: function (self$2510, f$2511) {
                    return self$2510.chain(compose$2261(self$2510.of, f$2511).bind(this));
                }.curry(),
                ap: function (self$2512, x$2513) {
                    return self$2512.chain(map$2325(__$2257, x$2513).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2333(xs$2514, f$2515) {
        return function chain$2333(xs$2516, f$2517) {
            return xs$2516.chain(f$2517);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2335(f$2518, x$2519) {
        return function pure$2335(f$2520, x$2521) {
            return f$2520.of ? f$2520.of(x$2521) : f$2520.constructor.of(x$2521);
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Monoid                   **
        // ***************************************************************
        Monoid$2337 = Protocol$2263('Monoid', {
            constructor: {
                empty: function () {
                    return this.prototype.empty();
                }
            },
            prototype: {
                empty: Protocol$2263.required,
                concat: Protocol$2263.required
            }
        });
    // concat :: (Monoid a) => a -> a -> a
    function concat$2339(a$2522, b$2523) {
        return function concat$2339(a$2524, b$2525) {
            return a$2524.concat(b$2525);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2343 = function () {
            function Sum$2526(_0$2528) {
                if (!(this instanceof Sum$2526)) {
                    return new Sum$2526(_0$2528);
                }
                if (typeof _0$2528 === 'number' || Object.prototype.toString.call(_0$2528) === '[object Number]') {
                    this['0'] = _0$2528;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2526.prototype.length = 1;
            var derived$2527 = Base$2252.derive({
                    name: 'Sum',
                    constructor: Sum$2526,
                    prototype: Sum$2526.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2526,
                            prototype: Sum$2526.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2527.constructor;
        }();
    instance$2266(Monoid$2337, Sum$2343, {
        empty: function (self$2534) {
            return Sum$2343(0);
        }.curry(),
        concat: function (a$2535, b$2536) {
            return function (a0$2537, a1$2538) {
                var r0$2539 = Sum$2343.unapply(a0$2537);
                if (r0$2539 != null && r0$2539.length === 1) {
                    var r1$2540 = Sum$2343.unapply(a1$2538);
                    if (r1$2540 != null && r1$2540.length === 1) {
                        var x$2541 = r0$2539[0];
                        var y$2542 = r1$2540[0];
                        return Sum$2343(x$2541 + y$2542);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2535, b$2536);
        }.curry()
    });
    function getSum$2351(x$2543) {
        return function getSum$2351(x$2544) {
            return function (a0$2545) {
                var r0$2546 = Sum$2343.unapply(a0$2545);
                if (r0$2546 != null && r0$2546.length === 1) {
                    var x$2547 = r0$2546[0];
                    return x$2547;
                }
                throw new TypeError('No match');
            }.call(this, x$2544);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2352 = function () {
            function Product$2548(_0$2550) {
                if (!(this instanceof Product$2548)) {
                    return new Product$2548(_0$2550);
                }
                if (typeof _0$2550 === 'number' || Object.prototype.toString.call(_0$2550) === '[object Number]') {
                    this['0'] = _0$2550;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2548.prototype.length = 1;
            var derived$2549 = Base$2252.derive({
                    name: 'Product',
                    constructor: Product$2548,
                    prototype: Product$2548.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2548,
                            prototype: Product$2548.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2549.constructor;
        }();
    instance$2266(Monoid$2337, Product$2352, {
        empty: function (self$2556) {
            return Product$2352(1);
        }.curry(),
        concat: function (a$2557, b$2558) {
            return function (a0$2559, a1$2560) {
                var r0$2561 = Product$2352.unapply(a0$2559);
                if (r0$2561 != null && r0$2561.length === 1) {
                    var r1$2562 = Product$2352.unapply(a1$2560);
                    if (r1$2562 != null && r1$2562.length === 1) {
                        var x$2563 = r0$2561[0];
                        var y$2564 = r1$2562[0];
                        return Product$2352(x$2563 * y$2564);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2557, b$2558);
        }.curry()
    });
    function getProduct$2360(x$2565) {
        return function getProduct$2360(x$2566) {
            return function (a0$2567) {
                var r0$2568 = Product$2352.unapply(a0$2567);
                if (r0$2568 != null && r0$2568.length === 1) {
                    var x$2569 = r0$2568[0];
                    return x$2569;
                }
                throw new TypeError('No match');
            }.call(this, x$2566);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2361 = function () {
            function Max$2570(_0$2572) {
                if (!(this instanceof Max$2570)) {
                    return new Max$2570(_0$2572);
                }
                if (typeof _0$2572 === 'number' || Object.prototype.toString.call(_0$2572) === '[object Number]') {
                    this['0'] = _0$2572;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2570.prototype.length = 1;
            var derived$2571 = Base$2252.derive({
                    name: 'Max',
                    constructor: Max$2570,
                    prototype: Max$2570.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2570,
                            prototype: Max$2570.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2571.constructor;
        }();
    instance$2266(Monoid$2337, Max$2361, {
        empty: function (self$2578) {
            return Max$2361(-Infinity);
        }.curry(),
        concat: function (a$2579, b$2580) {
            return function (a0$2581, a1$2582) {
                var r0$2583 = Max$2361.unapply(a0$2581);
                if (r0$2583 != null && r0$2583.length === 1) {
                    var r1$2584 = Max$2361.unapply(a1$2582);
                    if (r1$2584 != null && r1$2584.length === 1) {
                        var x$2585 = r0$2583[0];
                        var y$2586 = r1$2584[0];
                        return Max$2361(x$2585 > y$2586 ? x$2585 : y$2586);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2579, b$2580);
        }.curry()
    });
    function getMax$2369(x$2587) {
        return function getMax$2369(x$2588) {
            return function (a0$2589) {
                var r0$2590 = Max$2361.unapply(a0$2589);
                if (r0$2590 != null && r0$2590.length === 1) {
                    var x$2591 = r0$2590[0];
                    return x$2591;
                }
                throw new TypeError('No match');
            }.call(this, x$2588);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2370 = function () {
            function Min$2592(_0$2594) {
                if (!(this instanceof Min$2592)) {
                    return new Min$2592(_0$2594);
                }
                if (typeof _0$2594 === 'number' || Object.prototype.toString.call(_0$2594) === '[object Number]') {
                    this['0'] = _0$2594;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2592.prototype.length = 1;
            var derived$2593 = Base$2252.derive({
                    name: 'Min',
                    constructor: Min$2592,
                    prototype: Min$2592.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2592,
                            prototype: Min$2592.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2593.constructor;
        }();
    instance$2266(Monoid$2337, Min$2370, {
        empty: function (self$2600) {
            return Min$2370(Infinity);
        }.curry(),
        concat: function (a$2601, b$2602) {
            return function (a0$2603, a1$2604) {
                var r0$2605 = Min$2370.unapply(a0$2603);
                if (r0$2605 != null && r0$2605.length === 1) {
                    var r1$2606 = Min$2370.unapply(a1$2604);
                    if (r1$2606 != null && r1$2606.length === 1) {
                        var x$2607 = r0$2605[0];
                        var y$2608 = r1$2606[0];
                        return Min$2370(x$2607 < y$2608 ? x$2607 : y$2608);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2601, b$2602);
        }.curry()
    });
    function getMin$2378(x$2609) {
        return function getMin$2378(x$2610) {
            return function (a0$2611) {
                var r0$2612 = Min$2370.unapply(a0$2611);
                if (r0$2612 != null && r0$2612.length === 1) {
                    var x$2613 = r0$2612[0];
                    return x$2613;
                }
                throw new TypeError('No match');
            }.call(this, x$2610);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2379 = function () {
            function Option$2614() {
            }
            function Some$2615(val$2618) {
                if (!(this instanceof Some$2615)) {
                    return new Some$2615(val$2618);
                }
                this.val = val$2618;
            }
            Some$2615.prototype = new Option$2614();
            Some$2615.prototype.constructor = Some$2615;
            function None$2616() {
            }
            None$2616.prototype = new Option$2614();
            None$2616.prototype.constructor = None$2616;
            var derived$2617 = Base$2252.derive({
                    name: 'Option',
                    constructor: Option$2614,
                    prototype: Option$2614.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2615,
                            prototype: Some$2615.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2616,
                            prototype: None$2616.prototype
                        }
                    ]
                });
            Option$2614.Some = derived$2617.variants[0].constructor;
            Option$2614.None = new derived$2617.variants[1].constructor();
            return Option$2614;
        }();
    var Some$2380 = Option$2379.Some;
    var None$2381 = Option$2379.None;
    instance$2266(Monad$2331, Option$2379, {
        of: function (self$2624, x$2625) {
            return Some$2380(x$2625);
        }.curry(),
        chain: function (self$2626, f$2627) {
            return function (a0$2628, a1$2629) {
                var r0$2630 = Some$2380.unapply(a0$2628);
                if (r0$2630 != null && (r0$2630.length === 1 && (typeof a1$2629 === 'function' || Object.prototype.toString.call(a1$2629) === '[object Function]'))) {
                    var x$2631 = r0$2630[0];
                    return f$2627(x$2631);
                }
                if ((None$2381.hasInstance ? None$2381.hasInstance(a0$2628) : a0$2628 instanceof None$2381) && (typeof a1$2629 === 'function' || Object.prototype.toString.call(a1$2629) === '[object Function]')) {
                    return None$2381;
                }
                throw new TypeError('No match');
            }.call(this, self$2626, f$2627);
        }.curry()
    });
    instance$2266(Monoid$2337, Option$2379, {
        empty: function (self$2637) {
            return None$2381;
        }.curry(),
        concat: function (a$2638, b$2639) {
            return function (a0$2640, a1$2641) {
                if ((Option$2379.hasInstance ? Option$2379.hasInstance(a0$2640) : a0$2640 instanceof Option$2379) && (None$2381.hasInstance ? None$2381.hasInstance(a1$2641) : a1$2641 instanceof None$2381)) {
                    return a$2638;
                }
                if ((None$2381.hasInstance ? None$2381.hasInstance(a0$2640) : a0$2640 instanceof None$2381) && (Option$2379.hasInstance ? Option$2379.hasInstance(a1$2641) : a1$2641 instanceof Option$2379)) {
                    return b$2639;
                }
                var r0$2642 = Some$2380.unapply(a0$2640);
                if (r0$2642 != null && r0$2642.length === 1) {
                    var r1$2643 = Some$2380.unapply(a1$2641);
                    if (r1$2643 != null && r1$2643.length === 1) {
                        var v1$2644 = r0$2642[0];
                        var v2$2645 = r1$2643[0];
                        return Some$2380(v1$2644.concat(v2$2645));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2638, b$2639);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2385 = function () {
            function Either$2646() {
            }
            function Left$2647(l$2650) {
                if (!(this instanceof Left$2647)) {
                    return new Left$2647(l$2650);
                }
                this.l = l$2650;
            }
            Left$2647.prototype = new Either$2646();
            Left$2647.prototype.constructor = Left$2647;
            function Right$2648(r$2651) {
                if (!(this instanceof Right$2648)) {
                    return new Right$2648(r$2651);
                }
                this.r = r$2651;
            }
            Right$2648.prototype = new Either$2646();
            Right$2648.prototype.constructor = Right$2648;
            var derived$2649 = Base$2252.derive({
                    name: 'Either',
                    constructor: Either$2646,
                    prototype: Either$2646.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2647,
                            prototype: Left$2647.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2648,
                            prototype: Right$2648.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2646.Left = derived$2649.variants[0].constructor;
            Either$2646.Right = derived$2649.variants[1].constructor;
            return Either$2646;
        }();
    var Left$2386 = Either$2385.Left;
    var Right$2387 = Either$2385.Right;
    instance$2266(Monad$2331, Either$2385, {
        of: function (self$2657, x$2658) {
            return Right$2387(x$2658);
        }.curry(),
        chain: function (self$2659, f$2660) {
            return function (a0$2661, a1$2662) {
                var r0$2663 = Right$2387.unapply(a0$2661);
                if (r0$2663 != null && (r0$2663.length === 1 && (typeof a1$2662 === 'function' || Object.prototype.toString.call(a1$2662) === '[object Function]'))) {
                    var x$2665 = r0$2663[0];
                    return f$2660(x$2665);
                }
                var r1$2664 = Left$2386.unapply(a0$2661);
                if (r1$2664 != null && r1$2664.length === 1) {
                    var x$2665 = r1$2664[0];
                    return self$2659;
                }
                throw new TypeError('No match');
            }.call(this, self$2659, f$2660);
        }.curry()
    });
    instance$2266(Monoid$2337, Either$2385, {
        empty: function (self$2671) {
            return Left$2386();
        }.curry(),
        concat: function (a$2672, b$2673) {
            return function (a0$2674, a1$2675) {
                if (Either$2385.hasInstance ? Either$2385.hasInstance(a0$2674) : a0$2674 instanceof Either$2385) {
                    var r0$2678 = Left$2386.unapply(a1$2675);
                    if (r0$2678 != null && r0$2678.length === 1) {
                        var x$2679 = r0$2678[0];
                        return a$2672;
                    }
                }
                var r1$2676 = Left$2386.unapply(a0$2674);
                if (r1$2676 != null && (r1$2676.length === 1 && (Either$2385.hasInstance ? Either$2385.hasInstance(a1$2675) : a1$2675 instanceof Either$2385))) {
                    var x$2679 = r1$2676[0];
                    return b$2673;
                }
                var r2$2677 = Right$2387.unapply(a0$2674);
                if (r2$2677 != null && r2$2677.length === 1) {
                    var r3$2680 = Right$2387.unapply(a1$2675);
                    if (r3$2680 != null && r3$2680.length === 1) {
                        var r1$2681 = r2$2677[0];
                        var r2$2682 = r3$2680[0];
                        return Right$2387(r1$2681.concat(r2$2682));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2672, b$2673);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2389(f$2683, acc$2684, xs$2685) {
        return function foldl$2389(f$2686, acc$2687, xs$2688) {
            return xs$2688.reduce(f$2686, acc$2687);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2391(f$2689, xs$2690) {
        return function foldl1$2391(f$2691, xs$2692) {
            return xs$2692.reduce(f$2691);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2393(f$2693, acc$2694, xs$2695) {
        return function foldr$2393(f$2696, acc$2697, xs$2698) {
            return xs$2698.reduceRight(f$2696, acc$2697);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2395(f$2699, xs$2700) {
        return function foldr1$2395(f$2701, xs$2702) {
            return xs$2702.reduceRight(f$2701);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2398(xs$2703) {
        return function flatten$2398(xs$2704) {
            return foldl1$2391(function (xs$2705, ys$2706) {
                return xs$2705.concat(ys$2706);
            }.curry(), xs$2704);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2258(Array, 'of', function (x$2707) {
        return [x$2707];
    }.curry());
    extendNative$2258(Array.prototype, 'ap', function (x$2708) {
        return this.chain(map$2325(__$2257, x$2708).bind(this));
    }.curry());
    extendNative$2258(Array.prototype, 'chain', function (f$2709) {
        return function (x$2710) {
            return flatten$2398(map$2325(f$2709)(x$2710));
        }(this);
    }.curry());
    module.exports = {
        Core: {
            __: __$2257,
            curry: curry$2260,
            compose: compose$2261,
            Protocol: Protocol$2263,
            instance: instance$2266
        },
        Predicates: {
            not: not$2307,
            and: and$2308,
            or: or$2309,
            isObject: isObject$2310,
            isArray: isArray$2311,
            isNumber: isNumber$2312,
            isRegExp: isRegExp$2313,
            isString: isString$2314,
            isNull: isNull$2315,
            isUndef: isUndef$2316,
            exists: exists$2317
        },
        Math: {
            plus: plus$2318,
            minus: minus$2319,
            times: times$2320,
            div: div$2321
        },
        Number: {
            Sum: {
                Sum: Sum$2343,
                getSum: getSum$2351
            },
            Product: {
                Product: Product$2352,
                getProduct: getProduct$2360
            },
            Max: {
                Max: Max$2361,
                getMax: getMax$2369
            },
            Min: {
                Min: Min$2370,
                getMin: getMin$2378
            }
        },
        Data: {
            Either: {
                Either: Either$2385,
                Left: Left$2386,
                Right: Right$2387
            },
            Option: {
                Option: Option$2379,
                Some: Some$2380,
                None: None$2381
            },
            Collection: {
                foldl: foldl$2389,
                foldl1: foldl1$2391,
                foldr: foldr$2393,
                foldr1: foldr1$2395,
                flatten: flatten$2398
            }
        },
        Control: {
            Functor: { map: map$2325 },
            Applicative: { ap: ap$2329 },
            Monad: {
                Monad: Monad$2331,
                chain: chain$2333
            },
            Monoid: {
                Monoid: Monoid$2337,
                concat: concat$2339
            }
        }
    };
}());
//# sourceMappingURL=curry.js.map