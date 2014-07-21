(function () {
    'use strict';
    var Base$2511 = require('./adt-derivers').Base;
    var __slice$2513 = [].slice;
    var __toString$2515 = {}.toString;
    // ***************************************************************
    // **                       CurryJS.Core                        **
    // ***************************************************************
    // __ :: () -> ()
    var __$2516 = function noop() {
    };
    var extendNative$2517 = function (native$2699, prop$2700, f$2701) {
        return Object.defineProperty(native$2699, prop$2700, {
            value: function () {
                return f$2701.apply(this, [this].concat(__slice$2513.call(arguments)));
            }
        });
    };
    var withMeta$2518 = function (f$2702, meta$2703) {
        var keys$2704 = Object.keys(meta$2703);
        keys$2704.forEach(function (name$2705) {
            Object.defineProperty(f$2702, '__' + name$2705, { value: meta$2703[name$2705] });
        });
        return f$2702;
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
    var curry$2519 = function (f$2706, n$2707) {
        var arity$2708 = typeof n$2707 !== 'undefined' ? n$2707 : typeof f$2706.__arity !== 'undefined' ? f$2706.__arity : f$2706.length, name$2709 = f$2706.name || f$2706.__name;
        if (arity$2708 < 2)
            return f$2706;
        var curriedFn$2710 = withMeta$2518(function () {
                var args$2711 = [].slice.call(arguments, 0, arity$2708), realArity$2712 = args$2711.filter(function (x$2714) {
                        return x$2714 !== __$2516;
                    }).length, self$2713 = this;
                if (realArity$2712 >= arity$2708)
                    return f$2706.apply(self$2713, arguments);
                else {
                    var g$2715 = withMeta$2518(function () {
                            var partialArgs$2716 = [].slice.call(arguments), newArgs$2717 = [];
                            for (var i$2718 = 0; i$2718 < args$2711.length; i$2718++)
                                newArgs$2717[i$2718] = args$2711[i$2718] === __$2516 ? partialArgs$2716.length === 0 ? undefined : partialArgs$2716.shift() : args$2711[i$2718];
                            return curriedFn$2710.apply(self$2713, newArgs$2717.concat(partialArgs$2716));
                        }, {
                            name: name$2709,
                            arity: arity$2708 - realArity$2712,
                            curried: true
                        });
                    g$2715.toString = curriedFn$2710.toString.bind(curriedFn$2710);
                    return g$2715;
                }
            }, {
                name: name$2709,
                arity: arity$2708,
                curried: true
            });
        curriedFn$2710.toString = f$2706.toString.bind(f$2706);
        return curriedFn$2710;
    };
    extendNative$2517(Function.prototype, 'curry', function (self$2719, n$2720) {
        return curry$2519(self$2719, n$2720);
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
    var compose$2520 = function () {
        var fns$2721 = __slice$2513.call(arguments), self$2722 = this;
        return fns$2721.reduce(function (f$2723, g$2724) {
            return function () {
                return f$2723.call(self$2722, g$2724.apply(self$2722, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2522 = function (name$2725, spec$2726) {
        return {
            name: name$2725,
            spec: spec$2726,
            instance: function (type$2727, impl$2728) {
                var name$2729 = this.name, spec$2730 = this.spec, constructor$2731 = spec$2730.constructor, proto$2732 = spec$2730.prototype, k$2733;
                Object.keys(constructor$2731 || {}).map(function (field$2734) {
                    if (constructor$2731[field$2734] === Protocol$2522.required && !impl$2728.hasOwnProperty(field$2734) && !type$2727.hasOwnProperty(field$2734))
                        throw Protocol$2522.required(name$2729, field$2734);
                    else if (!type$2727.hasOwnProperty(field$2734) && !impl$2728.hasOwnProperty(field$2734))
                        type$2727[field$2734] = function () {
                            return constructor$2731[field$2734].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2728.hasOwnProperty(field$2734))
                        type$2727[field$2734] = function () {
                            return impl$2728[field$2734].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
                Object.keys(proto$2732 || {}).map(function (field$2735) {
                    if (proto$2732[field$2735] === Protocol$2522.required && !impl$2728.hasOwnProperty(field$2735) && !type$2727.prototype.hasOwnProperty(field$2735))
                        throw Protocol$2522.required(name$2729, field$2735);
                    else if (!type$2727.prototype.hasOwnProperty(field$2735) && !impl$2728.hasOwnProperty(field$2735))
                        type$2727.prototype[field$2735] = function () {
                            return proto$2732[field$2735].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2728.hasOwnProperty(field$2735))
                        type$2727.prototype[field$2735] = function () {
                            return impl$2728[field$2735].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2522.required = function (name$2736, field$2737) {
        return new Error(name$2736 + ' expected required field: \'' + field$2737 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2525(protocol$2738, type$2739, impl$2740) {
        return function instance$2525(protocol$2741, type$2742, impl$2743) {
            return protocol$2741.instance(type$2742, impl$2743);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2582(x$2744) {
        return function not$2582(x$2745) {
            return !x$2745;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2583(xs$2746) {
        return function and$2583(xs$2747) {
            return xs$2747.every(function (x$2748) {
                return !!x$2748;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2584(xs$2749) {
        return function or$2584(xs$2750) {
            return xs$2750.some(function (x$2751) {
                return !!x$2751;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2585(x$2752) {
        return function isObject$2585(x$2753) {
            return function (a0$2754) {
                if (Object.prototype.toString.call(a0$2754) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2753);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2586(x$2755) {
        return function isArray$2586(x$2756) {
            return function (a0$2757) {
                if (Array.isArray ? Array.isArray(a0$2757) : Object.prototype.toString.call(a0$2757) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2756);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2587(x$2758) {
        return function isNumber$2587(x$2759) {
            return function (a0$2760) {
                if (typeof a0$2760 === 'number' || Object.prototype.toString.call(a0$2760) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2759);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2588(x$2761) {
        return function isRegExp$2588(x$2762) {
            return function (a0$2763) {
                if (Object.prototype.toString.call(a0$2763) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2762);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2589(x$2764) {
        return function isString$2589(x$2765) {
            return function (a0$2766) {
                if (typeof a0$2766 === 'string' || Object.prototype.toString.call(a0$2766) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2765);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2590(x$2767) {
        return function isNull$2590(x$2768) {
            return function (a0$2769) {
                if (a0$2769 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2768);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2591(x$2770) {
        return function isUndef$2591(x$2771) {
            return function (a0$2772) {
                if (a0$2772 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2771);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2592(x$2773) {
        return function exists$2592(x$2774) {
            return function (x$2775) {
                return not$2582(or$2584(x$2775));
            }([
                isNull$2590(x$2774),
                isUndef$2591(x$2774)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2593(a$2776, b$2777) {
        return function plus$2593(a$2778, b$2779) {
            return a$2778 + b$2779;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2594(a$2780, b$2781) {
        return function minus$2594(a$2782, b$2783) {
            return a$2782 - b$2783;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2595(a$2784, b$2785) {
        return function times$2595(a$2786, b$2787) {
            return a$2786 * b$2787;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2596(a$2788, b$2789) {
        return function div$2596(a$2790, b$2791) {
            return a$2790 / b$2791;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                      CurryJS.Function                     **
    // ***************************************************************
    // id :: a -> a
    function id$2597(x$2792) {
        return function id$2597(x$2793) {
            return x$2793;
        }.curry().apply(null, arguments);
    }
    // constant :: a -> b -> a
    function constant$2598(x$2794) {
        return function constant$2598(x$2795) {
            return function (_$2796) {
                return x$2795;
            }.curry();
        }.curry().apply(null, arguments);
    }
    // unary :: Function -> (a -> b)
    function unary$2599(f$2797) {
        return function unary$2599(f$2798) {
            return function (x$2799) {
                return f$2798(x$2799);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // binary :: Function -> (a -> b -> c)
    function binary$2600(f$2800) {
        return function binary$2600(f$2801) {
            return function (x$2802, y$2803) {
                return f$2801(x$2802, y$2803);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // ternary :: Function -> (a -> b -> c -> d)
    function ternary$2601(f$2804) {
        return function ternary$2601(f$2805) {
            return function (x$2806, y$2807, z$2808) {
                return f$2805(x$2806, y$2807, z$2808);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                       CurryJS.String                      **
    // ***************************************************************
    Object.defineProperty(String.prototype, 'reduce', {
        value: function (f$2809, acc$2810) {
            var xs$2811 = this.split('');
            return exists$2592(acc$2810) ? xs$2811.reduce(f$2809, acc$2810) : xs$2811.reduce(f$2809);
        }
    });
    extendNative$2517(String.prototype, 'filter', function (self$2812, f$2813) {
        return self$2812.split('').filter(f$2813).join('');
    }.curry());
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2604 = Protocol$2522('Functor', { prototype: { map: Protocol$2522.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2606(f$2814, xs$2815) {
        return function map$2606(f$2816, xs$2817) {
            return xs$2817.map(unary$2599(f$2816));
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2608 = Protocol$2522('Applicative', { prototype: { ap: Protocol$2522.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2610(f$2818, xs$2819) {
        return function ap$2610(f$2820, xs$2821) {
            return f$2820.ap(xs$2821);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2612 = Protocol$2522('Monad', {
            constructor: {
                of: function (x$2823) {
                    return this.prototype.of(x$2823);
                }.curry()
            },
            prototype: {
                of: Protocol$2522.required,
                chain: Protocol$2522.required,
                map: function (self$2829, f$2830) {
                    return self$2829.chain(function (x$2831) {
                        return self$2829.of(f$2830(x$2831));
                    }.bind(this));
                }.curry(),
                ap: function (self$2832, x$2833) {
                    return self$2832.chain(map$2606(__$2516, x$2833).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2614(xs$2834, f$2835) {
        return function chain$2614(xs$2836, f$2837) {
            return xs$2836.chain(f$2837);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2616(f$2838, x$2839) {
        return function pure$2616(f$2840, x$2841) {
            return f$2840.of ? f$2840.of(x$2841) : f$2840.constructor.of(x$2841);
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Monoid                   **
        // ***************************************************************
        Monoid$2618 = Protocol$2522('Monoid', {
            constructor: {
                empty: function () {
                    return this.prototype.empty();
                }.curry()
            },
            prototype: {
                empty: Protocol$2522.required,
                concat: Protocol$2522.required
            }
        });
    // concat :: (Monoid a) => a -> a -> a
    function concat$2620(a$2844, b$2845) {
        return function concat$2620(a$2846, b$2847) {
            return a$2846.concat(b$2847);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2624 = function () {
            function Sum$2848(_0$2850) {
                if (!(this instanceof Sum$2848)) {
                    return new Sum$2848(_0$2850);
                }
                if (typeof _0$2850 === 'number' || Object.prototype.toString.call(_0$2850) === '[object Number]') {
                    this['0'] = _0$2850;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2848.prototype.length = 1;
            var derived$2849 = Base$2511.derive({
                    name: 'Sum',
                    constructor: Sum$2848,
                    prototype: Sum$2848.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2848,
                            prototype: Sum$2848.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2849.constructor;
        }();
    instance$2525(Monoid$2618, Sum$2624, {
        empty: function () {
            return Sum$2624(0);
        }.curry(),
        concat: function (a$2858, b$2859) {
            return function (a0$2860, a1$2861) {
                var r0$2862 = Sum$2624.unapply(a0$2860);
                if (r0$2862 != null && r0$2862.length === 1) {
                    var r1$2863 = Sum$2624.unapply(a1$2861);
                    if (r1$2863 != null && r1$2863.length === 1) {
                        var x$2864 = r0$2862[0];
                        var y$2865 = r1$2863[0];
                        return Sum$2624(x$2864 + y$2865);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2858, b$2859);
        }.curry()
    });
    function getSum$2633(x$2866) {
        return function getSum$2633(x$2867) {
            return function (a0$2868) {
                var r0$2869 = Sum$2624.unapply(a0$2868);
                if (r0$2869 != null && r0$2869.length === 1) {
                    var x$2870 = r0$2869[0];
                    return x$2870;
                }
                throw new TypeError('No match');
            }.call(this, x$2867);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2634 = function () {
            function Product$2871(_0$2873) {
                if (!(this instanceof Product$2871)) {
                    return new Product$2871(_0$2873);
                }
                if (typeof _0$2873 === 'number' || Object.prototype.toString.call(_0$2873) === '[object Number]') {
                    this['0'] = _0$2873;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2871.prototype.length = 1;
            var derived$2872 = Base$2511.derive({
                    name: 'Product',
                    constructor: Product$2871,
                    prototype: Product$2871.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2871,
                            prototype: Product$2871.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2872.constructor;
        }();
    instance$2525(Monoid$2618, Product$2634, {
        empty: function (self$2880) {
            return Product$2634(1);
        }.curry(),
        concat: function (a$2881, b$2882) {
            return function (a0$2883, a1$2884) {
                var r0$2885 = Product$2634.unapply(a0$2883);
                if (r0$2885 != null && r0$2885.length === 1) {
                    var r1$2886 = Product$2634.unapply(a1$2884);
                    if (r1$2886 != null && r1$2886.length === 1) {
                        var x$2887 = r0$2885[0];
                        var y$2888 = r1$2886[0];
                        return Product$2634(x$2887 * y$2888);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2881, b$2882);
        }.curry()
    });
    function getProduct$2643(x$2889) {
        return function getProduct$2643(x$2890) {
            return function (a0$2891) {
                var r0$2892 = Product$2634.unapply(a0$2891);
                if (r0$2892 != null && r0$2892.length === 1) {
                    var x$2893 = r0$2892[0];
                    return x$2893;
                }
                throw new TypeError('No match');
            }.call(this, x$2890);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2644 = function () {
            function Max$2894(_0$2896) {
                if (!(this instanceof Max$2894)) {
                    return new Max$2894(_0$2896);
                }
                if (typeof _0$2896 === 'number' || Object.prototype.toString.call(_0$2896) === '[object Number]') {
                    this['0'] = _0$2896;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2894.prototype.length = 1;
            var derived$2895 = Base$2511.derive({
                    name: 'Max',
                    constructor: Max$2894,
                    prototype: Max$2894.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2894,
                            prototype: Max$2894.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2895.constructor;
        }();
    instance$2525(Monoid$2618, Max$2644, {
        empty: function (self$2903) {
            return Max$2644(-Infinity);
        }.curry(),
        concat: function (a$2904, b$2905) {
            return function (a0$2906, a1$2907) {
                var r0$2908 = Max$2644.unapply(a0$2906);
                if (r0$2908 != null && r0$2908.length === 1) {
                    var r1$2909 = Max$2644.unapply(a1$2907);
                    if (r1$2909 != null && r1$2909.length === 1) {
                        var x$2910 = r0$2908[0];
                        var y$2911 = r1$2909[0];
                        return Max$2644(x$2910 > y$2911 ? x$2910 : y$2911);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2904, b$2905);
        }.curry()
    });
    function getMax$2653(x$2912) {
        return function getMax$2653(x$2913) {
            return function (a0$2914) {
                var r0$2915 = Max$2644.unapply(a0$2914);
                if (r0$2915 != null && r0$2915.length === 1) {
                    var x$2916 = r0$2915[0];
                    return x$2916;
                }
                throw new TypeError('No match');
            }.call(this, x$2913);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2654 = function () {
            function Min$2917(_0$2919) {
                if (!(this instanceof Min$2917)) {
                    return new Min$2917(_0$2919);
                }
                if (typeof _0$2919 === 'number' || Object.prototype.toString.call(_0$2919) === '[object Number]') {
                    this['0'] = _0$2919;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2917.prototype.length = 1;
            var derived$2918 = Base$2511.derive({
                    name: 'Min',
                    constructor: Min$2917,
                    prototype: Min$2917.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2917,
                            prototype: Min$2917.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2918.constructor;
        }();
    instance$2525(Monoid$2618, Min$2654, {
        empty: function (self$2926) {
            return Min$2654(Infinity);
        }.curry(),
        concat: function (a$2927, b$2928) {
            return function (a0$2929, a1$2930) {
                var r0$2931 = Min$2654.unapply(a0$2929);
                if (r0$2931 != null && r0$2931.length === 1) {
                    var r1$2932 = Min$2654.unapply(a1$2930);
                    if (r1$2932 != null && r1$2932.length === 1) {
                        var x$2933 = r0$2931[0];
                        var y$2934 = r1$2932[0];
                        return Min$2654(x$2933 < y$2934 ? x$2933 : y$2934);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2927, b$2928);
        }.curry()
    });
    function getMin$2663(x$2935) {
        return function getMin$2663(x$2936) {
            return function (a0$2937) {
                var r0$2938 = Min$2654.unapply(a0$2937);
                if (r0$2938 != null && r0$2938.length === 1) {
                    var x$2939 = r0$2938[0];
                    return x$2939;
                }
                throw new TypeError('No match');
            }.call(this, x$2936);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2664 = function () {
            function Option$2940() {
            }
            function Some$2941(val$2944) {
                if (!(this instanceof Some$2941)) {
                    return new Some$2941(val$2944);
                }
                this.val = val$2944;
            }
            Some$2941.prototype = new Option$2940();
            Some$2941.prototype.constructor = Some$2941;
            function None$2942() {
            }
            None$2942.prototype = new Option$2940();
            None$2942.prototype.constructor = None$2942;
            var derived$2943 = Base$2511.derive({
                    name: 'Option',
                    constructor: Option$2940,
                    prototype: Option$2940.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2941,
                            prototype: Some$2941.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2942,
                            prototype: None$2942.prototype
                        }
                    ]
                });
            Option$2940.Some = derived$2943.variants[0].constructor;
            Option$2940.None = new derived$2943.variants[1].constructor();
            return Option$2940;
        }();
    var Some$2665 = Option$2664.Some;
    var None$2666 = Option$2664.None;
    instance$2525(Monad$2612, Option$2664, {
        of: function (self$2951, x$2952) {
            return Some$2665(x$2952);
        }.curry(),
        chain: function (self$2953, f$2954) {
            return function (a0$2955, a1$2956) {
                var r0$2957 = Some$2665.unapply(a0$2955);
                if (r0$2957 != null && (r0$2957.length === 1 && (typeof a1$2956 === 'function' || Object.prototype.toString.call(a1$2956) === '[object Function]'))) {
                    var x$2958 = r0$2957[0];
                    return f$2954(x$2958);
                }
                if ((None$2666.hasInstance ? None$2666.hasInstance(a0$2955) : a0$2955 instanceof None$2666) && (typeof a1$2956 === 'function' || Object.prototype.toString.call(a1$2956) === '[object Function]')) {
                    return None$2666;
                }
                throw new TypeError('No match');
            }.call(this, self$2953, f$2954);
        }.curry()
    });
    instance$2525(Monoid$2618, Option$2664, {
        empty: function (self$2965) {
            return None$2666;
        }.curry(),
        concat: function (a$2966, b$2967) {
            return function (a0$2968, a1$2969) {
                if ((Option$2664.hasInstance ? Option$2664.hasInstance(a0$2968) : a0$2968 instanceof Option$2664) && (None$2666.hasInstance ? None$2666.hasInstance(a1$2969) : a1$2969 instanceof None$2666)) {
                    return a$2966;
                }
                if ((None$2666.hasInstance ? None$2666.hasInstance(a0$2968) : a0$2968 instanceof None$2666) && (Option$2664.hasInstance ? Option$2664.hasInstance(a1$2969) : a1$2969 instanceof Option$2664)) {
                    return b$2967;
                }
                var r0$2970 = Some$2665.unapply(a0$2968);
                if (r0$2970 != null && r0$2970.length === 1) {
                    var r1$2971 = Some$2665.unapply(a1$2969);
                    if (r1$2971 != null && r1$2971.length === 1) {
                        var v1$2972 = r0$2970[0];
                        var v2$2973 = r1$2971[0];
                        return Some$2665(v1$2972.concat(v2$2973));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2966, b$2967);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2670 = function () {
            function Either$2974() {
            }
            function Left$2975(l$2978) {
                if (!(this instanceof Left$2975)) {
                    return new Left$2975(l$2978);
                }
                this.l = l$2978;
            }
            Left$2975.prototype = new Either$2974();
            Left$2975.prototype.constructor = Left$2975;
            function Right$2976(r$2979) {
                if (!(this instanceof Right$2976)) {
                    return new Right$2976(r$2979);
                }
                this.r = r$2979;
            }
            Right$2976.prototype = new Either$2974();
            Right$2976.prototype.constructor = Right$2976;
            var derived$2977 = Base$2511.derive({
                    name: 'Either',
                    constructor: Either$2974,
                    prototype: Either$2974.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2975,
                            prototype: Left$2975.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2976,
                            prototype: Right$2976.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2974.Left = derived$2977.variants[0].constructor;
            Either$2974.Right = derived$2977.variants[1].constructor;
            return Either$2974;
        }();
    var Left$2671 = Either$2670.Left;
    var Right$2672 = Either$2670.Right;
    instance$2525(Monad$2612, Either$2670, {
        of: function (self$2986, x$2987) {
            return Right$2672(x$2987);
        }.curry(),
        chain: function (self$2988, f$2989) {
            return function (a0$2990, a1$2991) {
                var r0$2992 = Right$2672.unapply(a0$2990);
                if (r0$2992 != null && (r0$2992.length === 1 && (typeof a1$2991 === 'function' || Object.prototype.toString.call(a1$2991) === '[object Function]'))) {
                    var x$2994 = r0$2992[0];
                    return f$2989(x$2994);
                }
                var r1$2993 = Left$2671.unapply(a0$2990);
                if (r1$2993 != null && r1$2993.length === 1) {
                    var x$2994 = r1$2993[0];
                    return self$2988;
                }
                throw new TypeError('No match');
            }.call(this, self$2988, f$2989);
        }.curry()
    });
    instance$2525(Monoid$2618, Either$2670, {
        empty: function (self$3001) {
            return Left$2671();
        }.curry(),
        concat: function (a$3002, b$3003) {
            return function (a0$3004, a1$3005) {
                if (Either$2670.hasInstance ? Either$2670.hasInstance(a0$3004) : a0$3004 instanceof Either$2670) {
                    var r0$3008 = Left$2671.unapply(a1$3005);
                    if (r0$3008 != null && r0$3008.length === 1) {
                        var x$3009 = r0$3008[0];
                        return a$3002;
                    }
                }
                var r1$3006 = Left$2671.unapply(a0$3004);
                if (r1$3006 != null && (r1$3006.length === 1 && (Either$2670.hasInstance ? Either$2670.hasInstance(a1$3005) : a1$3005 instanceof Either$2670))) {
                    var x$3009 = r1$3006[0];
                    return b$3003;
                }
                var r2$3007 = Right$2672.unapply(a0$3004);
                if (r2$3007 != null && r2$3007.length === 1) {
                    var r3$3010 = Right$2672.unapply(a1$3005);
                    if (r3$3010 != null && r3$3010.length === 1) {
                        var r1$3011 = r2$3007[0];
                        var r2$3012 = r3$3010[0];
                        return Right$2672(r1$3011.concat(r2$3012));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$3002, b$3003);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2674(f$3013, acc$3014, xs$3015) {
        return function foldl$2674(f$3016, acc$3017, xs$3018) {
            return xs$3018.reduce(binary$2600(f$3016), acc$3017);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2676(f$3019, xs$3020) {
        return function foldl1$2676(f$3021, xs$3022) {
            return xs$3022.reduce(binary$2600(f$3021));
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2678(f$3023, acc$3024, xs$3025) {
        return function foldr$2678(f$3026, acc$3027, xs$3028) {
            return xs$3028.reduceRight(binary$2600(f$3026), acc$3027);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2680(f$3029, xs$3030) {
        return function foldr1$2680(f$3031, xs$3032) {
            return xs$3032.reduceRight(binary$2600(f$3031));
        }.curry().apply(null, arguments);
    }
    ;
    // filter :: (a -> Bool) -> [a] -> [a]
    function filter$2684(f$3033, xs$3034) {
        return function filter$2684(f$3035, xs$3036) {
            return xs$3036.filter(unary$2599(f$3035));
        }.curry().apply(null, arguments);
    }
    // flatten :: Monoid a => [a] -> a
    function flatten$2685(xs$3037) {
        return function flatten$2685(xs$3038) {
            return foldl1$2676(function (xs$3039, ys$3040) {
                return xs$3039.concat(ys$3040);
            }.curry(), xs$3038);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2517(Array, 'of', function (self$3041, x$3042) {
        return [x$3042];
    }.curry());
    extendNative$2517(Array.prototype, 'ap', function (self$3043, x$3044) {
        return this.chain(map$2606(__$2516, x$3044).bind(this));
    }.curry());
    extendNative$2517(Array.prototype, 'chain', function (self$3045, f$3046) {
        return function (x$3047) {
            return flatten$2685(map$2606(f$3046)(x$3047));
        }(this);
    }.curry());
    console.log(map$2606(function (x$3048, y$3049) {
        return x$3048 * y$3049;
    }.curry(), [
        1,
        2,
        3
    ]));
    // ***************************************************************
    // **                   CurryJS.Data.Object                     **
    // ***************************************************************
    // merge :: Object -> Object -> Object
    var merge$2693 = function (a$3050, b$3051) {
        var newObj$3052 = {}, k$3053;
        for (k$3053 in b$3051) {
            if (b$3051.hasOwnProperty(k$3053))
                newObj$3052[k$3053] = b$3051[k$3053];
        }
        for (k$3053 in a$3050) {
            if (a$3050.hasOwnProperty(k$3053))
                newObj$3052[k$3053] = a$3050[k$3053];
        }
        return newObj$3052;
    };
    // set :: Object -> String -> a
    function set$2696(o$3054, k$3055, v$3056) {
        return function set$2696(o$3057, k$3058, v$3059) {
            return function () {
                var newObj$3061 = {};
                var foo$3063 = newObj$3061[k$3058] = v$3059;
                return merge$2693(o$3057, newObj$3061);
            }();
        }.curry().apply(null, arguments);
    }
    ;
    extendNative$2517(Object.prototype, 'map', function (self$3064, f$3065) {
        return foldl$2674(function (o$3066, k$3067) {
            return set$2696(o$3066, k$3067, f$3065(self$3064[k$3067]));
        }.curry(), {}, Object.keys(self$3064));
    }.curry());
    module.exports = {
        Core: {
            __: __$2516,
            curry: curry$2519,
            compose: compose$2520,
            Protocol: Protocol$2522,
            instance: instance$2525
        },
        Predicates: {
            not: not$2582,
            and: and$2583,
            or: or$2584,
            isObject: isObject$2585,
            isArray: isArray$2586,
            isNumber: isNumber$2587,
            isRegExp: isRegExp$2588,
            isString: isString$2589,
            isNull: isNull$2590,
            isUndef: isUndef$2591,
            exists: exists$2592
        },
        Math: {
            plus: plus$2593,
            minus: minus$2594,
            times: times$2595,
            div: div$2596
        },
        Function: {
            id: id$2597,
            constant: constant$2598,
            unary: unary$2599,
            binary: binary$2600,
            ternary: ternary$2601
        },
        Number: {
            Sum: {
                Sum: Sum$2624,
                getSum: getSum$2633
            },
            Product: {
                Product: Product$2634,
                getProduct: getProduct$2643
            },
            Max: {
                Max: Max$2644,
                getMax: getMax$2653
            },
            Min: {
                Min: Min$2654,
                getMin: getMin$2663
            }
        },
        Data: {
            Either: {
                Either: Either$2670,
                Left: Left$2671,
                Right: Right$2672
            },
            Option: {
                Option: Option$2664,
                Some: Some$2665,
                None: None$2666
            },
            Collection: {
                foldl: foldl$2674,
                foldl1: foldl1$2676,
                foldr: foldr$2678,
                foldr1: foldr1$2680,
                filter: filter$2684,
                flatten: flatten$2685
            },
            Object: {
                merge: merge$2693,
                set: set$2696
            }
        },
        Control: {
            Functor: { map: map$2606 },
            Applicative: { ap: ap$2610 },
            Monad: {
                Monad: Monad$2612,
                chain: chain$2614
            },
            Monoid: {
                Monoid: Monoid$2618,
                concat: concat$2620
            }
        }
    };
}());
//# sourceMappingURL=curry.js.map