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
    var extendNative$2517 = function (native$2696, prop$2697, f$2698) {
        return Object.defineProperty(native$2696, prop$2697, {
            value: function () {
                return f$2698.apply(this, [this].concat(__slice$2513.call(arguments)));
            }
        });
    };
    var withMeta$2518 = function (f$2699, meta$2700) {
        var keys$2701 = Object.keys(meta$2700);
        keys$2701.forEach(function (name$2702) {
            Object.defineProperty(f$2699, '__' + name$2702, { value: meta$2700[name$2702] });
        });
        return f$2699;
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
    var curry$2519 = function (f$2703, n$2704) {
        var arity$2705 = typeof n$2704 !== 'undefined' ? n$2704 : typeof f$2703.__arity !== 'undefined' ? f$2703.__arity : f$2703.length, name$2706 = f$2703.name || f$2703.__name;
        if (arity$2705 < 2)
            return f$2703;
        var curriedFn$2707 = withMeta$2518(function () {
                var args$2708 = [].slice.call(arguments, 0, arity$2705), realArity$2709 = args$2708.filter(function (x$2711) {
                        return x$2711 !== __$2516;
                    }).length, self$2710 = this;
                if (realArity$2709 >= arity$2705)
                    return f$2703.apply(self$2710, arguments);
                else {
                    var g$2712 = withMeta$2518(function () {
                            var partialArgs$2713 = [].slice.call(arguments), newArgs$2714 = [];
                            for (var i$2715 = 0; i$2715 < args$2708.length; i$2715++)
                                newArgs$2714[i$2715] = args$2708[i$2715] === __$2516 ? partialArgs$2713.length === 0 ? undefined : partialArgs$2713.shift() : args$2708[i$2715];
                            return curriedFn$2707.apply(self$2710, newArgs$2714.concat(partialArgs$2713));
                        }, {
                            name: name$2706,
                            arity: arity$2705 - realArity$2709,
                            curried: true
                        });
                    g$2712.toString = curriedFn$2707.toString.bind(curriedFn$2707);
                    return g$2712;
                }
            }, {
                name: name$2706,
                arity: arity$2705,
                curried: true
            });
        curriedFn$2707.toString = f$2703.toString.bind(f$2703);
        return curriedFn$2707;
    };
    extendNative$2517(Function.prototype, 'curry', function (self$2716, n$2717) {
        return curry$2519(self$2716, n$2717);
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
        var fns$2718 = __slice$2513.call(arguments), self$2719 = this;
        return fns$2718.reduce(function (f$2720, g$2721) {
            return function () {
                return f$2720.call(self$2719, g$2721.apply(self$2719, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2522 = function (name$2722, spec$2723) {
        return {
            name: name$2722,
            spec: spec$2723,
            instance: function (type$2724, impl$2725) {
                var name$2726 = this.name, spec$2727 = this.spec, constructor$2728 = spec$2727.constructor, proto$2729 = spec$2727.prototype, k$2730;
                Object.keys(constructor$2728 || {}).map(function (field$2731) {
                    if (constructor$2728[field$2731] === Protocol$2522.required && !impl$2725.hasOwnProperty(field$2731) && !type$2724.hasOwnProperty(field$2731))
                        throw Protocol$2522.required(name$2726, field$2731);
                    else if (!type$2724.hasOwnProperty(field$2731) && !impl$2725.hasOwnProperty(field$2731))
                        type$2724[field$2731] = function () {
                            return constructor$2728[field$2731].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2725.hasOwnProperty(field$2731))
                        type$2724[field$2731] = function () {
                            return impl$2725[field$2731].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
                Object.keys(proto$2729 || {}).map(function (field$2732) {
                    if (proto$2729[field$2732] === Protocol$2522.required && !impl$2725.hasOwnProperty(field$2732) && !type$2724.prototype.hasOwnProperty(field$2732))
                        throw Protocol$2522.required(name$2726, field$2732);
                    else if (!type$2724.prototype.hasOwnProperty(field$2732) && !impl$2725.hasOwnProperty(field$2732))
                        type$2724.prototype[field$2732] = function () {
                            return proto$2729[field$2732].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2725.hasOwnProperty(field$2732))
                        type$2724.prototype[field$2732] = function () {
                            return impl$2725[field$2732].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2522.required = function (name$2733, field$2734) {
        return new Error(name$2733 + ' expected required field: \'' + field$2734 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2525(protocol$2735, type$2736, impl$2737) {
        return function instance$2525(protocol$2738, type$2739, impl$2740) {
            return protocol$2738.instance(type$2739, impl$2740);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2582(x$2741) {
        return function not$2582(x$2742) {
            return !x$2742;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2583(xs$2743) {
        return function and$2583(xs$2744) {
            return xs$2744.every(function (x$2745) {
                return !!x$2745;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2584(xs$2746) {
        return function or$2584(xs$2747) {
            return xs$2747.some(function (x$2748) {
                return !!x$2748;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2585(x$2749) {
        return function isObject$2585(x$2750) {
            return function (a0$2751) {
                if (Object.prototype.toString.call(a0$2751) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2750);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2586(x$2752) {
        return function isArray$2586(x$2753) {
            return function (a0$2754) {
                if (Array.isArray ? Array.isArray(a0$2754) : Object.prototype.toString.call(a0$2754) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2753);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2587(x$2755) {
        return function isNumber$2587(x$2756) {
            return function (a0$2757) {
                if (typeof a0$2757 === 'number' || Object.prototype.toString.call(a0$2757) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2756);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2588(x$2758) {
        return function isRegExp$2588(x$2759) {
            return function (a0$2760) {
                if (Object.prototype.toString.call(a0$2760) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2759);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2589(x$2761) {
        return function isString$2589(x$2762) {
            return function (a0$2763) {
                if (typeof a0$2763 === 'string' || Object.prototype.toString.call(a0$2763) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2762);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2590(x$2764) {
        return function isNull$2590(x$2765) {
            return function (a0$2766) {
                if (a0$2766 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2765);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2591(x$2767) {
        return function isUndef$2591(x$2768) {
            return function (a0$2769) {
                if (a0$2769 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2768);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2592(x$2770) {
        return function exists$2592(x$2771) {
            return function (x$2772) {
                return not$2582(or$2584(x$2772));
            }([
                isNull$2590(x$2771),
                isUndef$2591(x$2771)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2593(a$2773, b$2774) {
        return function plus$2593(a$2775, b$2776) {
            return a$2775 + b$2776;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2594(a$2777, b$2778) {
        return function minus$2594(a$2779, b$2780) {
            return a$2779 - b$2780;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2595(a$2781, b$2782) {
        return function times$2595(a$2783, b$2784) {
            return a$2783 * b$2784;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2596(a$2785, b$2786) {
        return function div$2596(a$2787, b$2788) {
            return a$2787 / b$2788;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                      CurryJS.Function                     **
    // ***************************************************************
    // id :: a -> a
    function id$2597(x$2789) {
        return function id$2597(x$2790) {
            return x$2790;
        }.curry().apply(null, arguments);
    }
    // constant :: a -> b -> a
    function constant$2598(x$2791) {
        return function constant$2598(x$2792) {
            return function (_$2793) {
                return x$2792;
            }.curry();
        }.curry().apply(null, arguments);
    }
    // unary :: Function -> (a -> b)
    function unary$2599(f$2794) {
        return function unary$2599(f$2795) {
            return function (x$2796) {
                return f$2795(x$2796);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // binary :: Function -> (a -> b -> c)
    function binary$2600(f$2797) {
        return function binary$2600(f$2798) {
            return function (x$2799, y$2800) {
                return f$2798(x$2799, y$2800);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // ternary :: Function -> (a -> b -> c -> d)
    function ternary$2601(f$2801) {
        return function ternary$2601(f$2802) {
            return function (x$2803, y$2804, z$2805) {
                return f$2802(x$2803, y$2804, z$2805);
            }.curry();
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2603 = Protocol$2522('Functor', { prototype: { map: Protocol$2522.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2605(f$2806, xs$2807) {
        return function map$2605(f$2808, xs$2809) {
            return xs$2809.map(unary$2599(f$2808));
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2607 = Protocol$2522('Applicative', { prototype: { ap: Protocol$2522.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2609(f$2810, xs$2811) {
        return function ap$2609(f$2812, xs$2813) {
            return f$2812.ap(xs$2813);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2611 = Protocol$2522('Monad', {
            constructor: {
                of: function (x$2815) {
                    return this.prototype.of(x$2815);
                }.curry()
            },
            prototype: {
                of: Protocol$2522.required,
                chain: Protocol$2522.required,
                map: function (self$2821, f$2822) {
                    return self$2821.chain(function (x$2823) {
                        return self$2821.of(f$2822(x$2823));
                    }.bind(this));
                }.curry(),
                ap: function (self$2824, x$2825) {
                    return self$2824.chain(map$2605(__$2516, x$2825).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2613(xs$2826, f$2827) {
        return function chain$2613(xs$2828, f$2829) {
            return xs$2828.chain(f$2829);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2615(f$2830, x$2831) {
        return function pure$2615(f$2832, x$2833) {
            return f$2832.of ? f$2832.of(x$2833) : f$2832.constructor.of(x$2833);
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Monoid                   **
        // ***************************************************************
        Monoid$2617 = Protocol$2522('Monoid', {
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
    function concat$2619(a$2836, b$2837) {
        return function concat$2619(a$2838, b$2839) {
            return a$2838.concat(b$2839);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2623 = function () {
            function Sum$2840(_0$2842) {
                if (!(this instanceof Sum$2840)) {
                    return new Sum$2840(_0$2842);
                }
                if (typeof _0$2842 === 'number' || Object.prototype.toString.call(_0$2842) === '[object Number]') {
                    this['0'] = _0$2842;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2840.prototype.length = 1;
            var derived$2841 = Base$2511.derive({
                    name: 'Sum',
                    constructor: Sum$2840,
                    prototype: Sum$2840.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2840,
                            prototype: Sum$2840.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2841.constructor;
        }();
    instance$2525(Monoid$2617, Sum$2623, {
        empty: function () {
            return Sum$2623(0);
        }.curry(),
        concat: function (a$2850, b$2851) {
            return function (a0$2852, a1$2853) {
                var r0$2854 = Sum$2623.unapply(a0$2852);
                if (r0$2854 != null && r0$2854.length === 1) {
                    var r1$2855 = Sum$2623.unapply(a1$2853);
                    if (r1$2855 != null && r1$2855.length === 1) {
                        var x$2856 = r0$2854[0];
                        var y$2857 = r1$2855[0];
                        return Sum$2623(x$2856 + y$2857);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2850, b$2851);
        }.curry()
    });
    function getSum$2632(x$2858) {
        return function getSum$2632(x$2859) {
            return function (a0$2860) {
                var r0$2861 = Sum$2623.unapply(a0$2860);
                if (r0$2861 != null && r0$2861.length === 1) {
                    var x$2862 = r0$2861[0];
                    return x$2862;
                }
                throw new TypeError('No match');
            }.call(this, x$2859);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2633 = function () {
            function Product$2863(_0$2865) {
                if (!(this instanceof Product$2863)) {
                    return new Product$2863(_0$2865);
                }
                if (typeof _0$2865 === 'number' || Object.prototype.toString.call(_0$2865) === '[object Number]') {
                    this['0'] = _0$2865;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2863.prototype.length = 1;
            var derived$2864 = Base$2511.derive({
                    name: 'Product',
                    constructor: Product$2863,
                    prototype: Product$2863.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2863,
                            prototype: Product$2863.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2864.constructor;
        }();
    instance$2525(Monoid$2617, Product$2633, {
        empty: function (self$2872) {
            return Product$2633(1);
        }.curry(),
        concat: function (a$2873, b$2874) {
            return function (a0$2875, a1$2876) {
                var r0$2877 = Product$2633.unapply(a0$2875);
                if (r0$2877 != null && r0$2877.length === 1) {
                    var r1$2878 = Product$2633.unapply(a1$2876);
                    if (r1$2878 != null && r1$2878.length === 1) {
                        var x$2879 = r0$2877[0];
                        var y$2880 = r1$2878[0];
                        return Product$2633(x$2879 * y$2880);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2873, b$2874);
        }.curry()
    });
    function getProduct$2642(x$2881) {
        return function getProduct$2642(x$2882) {
            return function (a0$2883) {
                var r0$2884 = Product$2633.unapply(a0$2883);
                if (r0$2884 != null && r0$2884.length === 1) {
                    var x$2885 = r0$2884[0];
                    return x$2885;
                }
                throw new TypeError('No match');
            }.call(this, x$2882);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2643 = function () {
            function Max$2886(_0$2888) {
                if (!(this instanceof Max$2886)) {
                    return new Max$2886(_0$2888);
                }
                if (typeof _0$2888 === 'number' || Object.prototype.toString.call(_0$2888) === '[object Number]') {
                    this['0'] = _0$2888;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2886.prototype.length = 1;
            var derived$2887 = Base$2511.derive({
                    name: 'Max',
                    constructor: Max$2886,
                    prototype: Max$2886.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2886,
                            prototype: Max$2886.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2887.constructor;
        }();
    instance$2525(Monoid$2617, Max$2643, {
        empty: function (self$2895) {
            return Max$2643(-Infinity);
        }.curry(),
        concat: function (a$2896, b$2897) {
            return function (a0$2898, a1$2899) {
                var r0$2900 = Max$2643.unapply(a0$2898);
                if (r0$2900 != null && r0$2900.length === 1) {
                    var r1$2901 = Max$2643.unapply(a1$2899);
                    if (r1$2901 != null && r1$2901.length === 1) {
                        var x$2902 = r0$2900[0];
                        var y$2903 = r1$2901[0];
                        return Max$2643(x$2902 > y$2903 ? x$2902 : y$2903);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2896, b$2897);
        }.curry()
    });
    function getMax$2652(x$2904) {
        return function getMax$2652(x$2905) {
            return function (a0$2906) {
                var r0$2907 = Max$2643.unapply(a0$2906);
                if (r0$2907 != null && r0$2907.length === 1) {
                    var x$2908 = r0$2907[0];
                    return x$2908;
                }
                throw new TypeError('No match');
            }.call(this, x$2905);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2653 = function () {
            function Min$2909(_0$2911) {
                if (!(this instanceof Min$2909)) {
                    return new Min$2909(_0$2911);
                }
                if (typeof _0$2911 === 'number' || Object.prototype.toString.call(_0$2911) === '[object Number]') {
                    this['0'] = _0$2911;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2909.prototype.length = 1;
            var derived$2910 = Base$2511.derive({
                    name: 'Min',
                    constructor: Min$2909,
                    prototype: Min$2909.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2909,
                            prototype: Min$2909.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2910.constructor;
        }();
    instance$2525(Monoid$2617, Min$2653, {
        empty: function (self$2918) {
            return Min$2653(Infinity);
        }.curry(),
        concat: function (a$2919, b$2920) {
            return function (a0$2921, a1$2922) {
                var r0$2923 = Min$2653.unapply(a0$2921);
                if (r0$2923 != null && r0$2923.length === 1) {
                    var r1$2924 = Min$2653.unapply(a1$2922);
                    if (r1$2924 != null && r1$2924.length === 1) {
                        var x$2925 = r0$2923[0];
                        var y$2926 = r1$2924[0];
                        return Min$2653(x$2925 < y$2926 ? x$2925 : y$2926);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2919, b$2920);
        }.curry()
    });
    function getMin$2662(x$2927) {
        return function getMin$2662(x$2928) {
            return function (a0$2929) {
                var r0$2930 = Min$2653.unapply(a0$2929);
                if (r0$2930 != null && r0$2930.length === 1) {
                    var x$2931 = r0$2930[0];
                    return x$2931;
                }
                throw new TypeError('No match');
            }.call(this, x$2928);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2663 = function () {
            function Option$2932() {
            }
            function Some$2933(val$2936) {
                if (!(this instanceof Some$2933)) {
                    return new Some$2933(val$2936);
                }
                this.val = val$2936;
            }
            Some$2933.prototype = new Option$2932();
            Some$2933.prototype.constructor = Some$2933;
            function None$2934() {
            }
            None$2934.prototype = new Option$2932();
            None$2934.prototype.constructor = None$2934;
            var derived$2935 = Base$2511.derive({
                    name: 'Option',
                    constructor: Option$2932,
                    prototype: Option$2932.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2933,
                            prototype: Some$2933.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2934,
                            prototype: None$2934.prototype
                        }
                    ]
                });
            Option$2932.Some = derived$2935.variants[0].constructor;
            Option$2932.None = new derived$2935.variants[1].constructor();
            return Option$2932;
        }();
    var Some$2664 = Option$2663.Some;
    var None$2665 = Option$2663.None;
    instance$2525(Monad$2611, Option$2663, {
        of: function (self$2943, x$2944) {
            return Some$2664(x$2944);
        }.curry(),
        chain: function (self$2945, f$2946) {
            return function (a0$2947, a1$2948) {
                var r0$2949 = Some$2664.unapply(a0$2947);
                if (r0$2949 != null && (r0$2949.length === 1 && (typeof a1$2948 === 'function' || Object.prototype.toString.call(a1$2948) === '[object Function]'))) {
                    var x$2950 = r0$2949[0];
                    return f$2946(x$2950);
                }
                if ((None$2665.hasInstance ? None$2665.hasInstance(a0$2947) : a0$2947 instanceof None$2665) && (typeof a1$2948 === 'function' || Object.prototype.toString.call(a1$2948) === '[object Function]')) {
                    return None$2665;
                }
                throw new TypeError('No match');
            }.call(this, self$2945, f$2946);
        }.curry()
    });
    instance$2525(Monoid$2617, Option$2663, {
        empty: function (self$2957) {
            return None$2665;
        }.curry(),
        concat: function (a$2958, b$2959) {
            return function (a0$2960, a1$2961) {
                if ((Option$2663.hasInstance ? Option$2663.hasInstance(a0$2960) : a0$2960 instanceof Option$2663) && (None$2665.hasInstance ? None$2665.hasInstance(a1$2961) : a1$2961 instanceof None$2665)) {
                    return a$2958;
                }
                if ((None$2665.hasInstance ? None$2665.hasInstance(a0$2960) : a0$2960 instanceof None$2665) && (Option$2663.hasInstance ? Option$2663.hasInstance(a1$2961) : a1$2961 instanceof Option$2663)) {
                    return b$2959;
                }
                var r0$2962 = Some$2664.unapply(a0$2960);
                if (r0$2962 != null && r0$2962.length === 1) {
                    var r1$2963 = Some$2664.unapply(a1$2961);
                    if (r1$2963 != null && r1$2963.length === 1) {
                        var v1$2964 = r0$2962[0];
                        var v2$2965 = r1$2963[0];
                        return Some$2664(v1$2964.concat(v2$2965));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2958, b$2959);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2669 = function () {
            function Either$2966() {
            }
            function Left$2967(l$2970) {
                if (!(this instanceof Left$2967)) {
                    return new Left$2967(l$2970);
                }
                this.l = l$2970;
            }
            Left$2967.prototype = new Either$2966();
            Left$2967.prototype.constructor = Left$2967;
            function Right$2968(r$2971) {
                if (!(this instanceof Right$2968)) {
                    return new Right$2968(r$2971);
                }
                this.r = r$2971;
            }
            Right$2968.prototype = new Either$2966();
            Right$2968.prototype.constructor = Right$2968;
            var derived$2969 = Base$2511.derive({
                    name: 'Either',
                    constructor: Either$2966,
                    prototype: Either$2966.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2967,
                            prototype: Left$2967.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2968,
                            prototype: Right$2968.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2966.Left = derived$2969.variants[0].constructor;
            Either$2966.Right = derived$2969.variants[1].constructor;
            return Either$2966;
        }();
    var Left$2670 = Either$2669.Left;
    var Right$2671 = Either$2669.Right;
    instance$2525(Monad$2611, Either$2669, {
        of: function (self$2978, x$2979) {
            return Right$2671(x$2979);
        }.curry(),
        chain: function (self$2980, f$2981) {
            return function (a0$2982, a1$2983) {
                var r0$2984 = Right$2671.unapply(a0$2982);
                if (r0$2984 != null && (r0$2984.length === 1 && (typeof a1$2983 === 'function' || Object.prototype.toString.call(a1$2983) === '[object Function]'))) {
                    var x$2986 = r0$2984[0];
                    return f$2981(x$2986);
                }
                var r1$2985 = Left$2670.unapply(a0$2982);
                if (r1$2985 != null && r1$2985.length === 1) {
                    var x$2986 = r1$2985[0];
                    return self$2980;
                }
                throw new TypeError('No match');
            }.call(this, self$2980, f$2981);
        }.curry()
    });
    instance$2525(Monoid$2617, Either$2669, {
        empty: function (self$2993) {
            return Left$2670();
        }.curry(),
        concat: function (a$2994, b$2995) {
            return function (a0$2996, a1$2997) {
                if (Either$2669.hasInstance ? Either$2669.hasInstance(a0$2996) : a0$2996 instanceof Either$2669) {
                    var r0$3000 = Left$2670.unapply(a1$2997);
                    if (r0$3000 != null && r0$3000.length === 1) {
                        var x$3001 = r0$3000[0];
                        return a$2994;
                    }
                }
                var r1$2998 = Left$2670.unapply(a0$2996);
                if (r1$2998 != null && (r1$2998.length === 1 && (Either$2669.hasInstance ? Either$2669.hasInstance(a1$2997) : a1$2997 instanceof Either$2669))) {
                    var x$3001 = r1$2998[0];
                    return b$2995;
                }
                var r2$2999 = Right$2671.unapply(a0$2996);
                if (r2$2999 != null && r2$2999.length === 1) {
                    var r3$3002 = Right$2671.unapply(a1$2997);
                    if (r3$3002 != null && r3$3002.length === 1) {
                        var r1$3003 = r2$2999[0];
                        var r2$3004 = r3$3002[0];
                        return Right$2671(r1$3003.concat(r2$3004));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2994, b$2995);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2673(f$3005, acc$3006, xs$3007) {
        return function foldl$2673(f$3008, acc$3009, xs$3010) {
            return xs$3010.reduce(binary$2600(f$3008), acc$3009);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2675(f$3011, xs$3012) {
        return function foldl1$2675(f$3013, xs$3014) {
            return xs$3014.reduce(binary$2600(f$3013));
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2677(f$3015, acc$3016, xs$3017) {
        return function foldr$2677(f$3018, acc$3019, xs$3020) {
            return xs$3020.reduceRight(binary$2600(f$3018), acc$3019);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2679(f$3021, xs$3022) {
        return function foldr1$2679(f$3023, xs$3024) {
            return xs$3024.reduceRight(binary$2600(f$3023));
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2682(xs$3025) {
        return function flatten$2682(xs$3026) {
            return foldl1$2675(function (xs$3027, ys$3028) {
                return xs$3027.concat(ys$3028);
            }.curry(), xs$3026);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2517(Array, 'of', function (self$3029, x$3030) {
        return [x$3030];
    }.curry());
    extendNative$2517(Array.prototype, 'ap', function (self$3031, x$3032) {
        return this.chain(map$2605(__$2516, x$3032).bind(this));
    }.curry());
    extendNative$2517(Array.prototype, 'chain', function (self$3033, f$3034) {
        return function (x$3035) {
            return flatten$2682(map$2605(f$3034)(x$3035));
        }(this);
    }.curry());
    console.log(map$2605(function (x$3036, y$3037) {
        return x$3036 * y$3037;
    }.curry(), [
        1,
        2,
        3
    ]));
    // ***************************************************************
    // **                   CurryJS.Data.Object                     **
    // ***************************************************************
    // merge :: Object -> Object -> Object
    var merge$2690 = function (a$3038, b$3039) {
        var newObj$3040 = {}, k$3041;
        for (k$3041 in b$3039) {
            if (b$3039.hasOwnProperty(k$3041))
                newObj$3040[k$3041] = b$3039[k$3041];
        }
        for (k$3041 in a$3038) {
            if (a$3038.hasOwnProperty(k$3041))
                newObj$3040[k$3041] = a$3038[k$3041];
        }
        return newObj$3040;
    };
    // set :: Object -> String -> a
    function set$2693(o$3042, k$3043, v$3044) {
        return function set$2693(o$3045, k$3046, v$3047) {
            return function () {
                var newObj$3049 = {};
                var foo$3051 = newObj$3049[k$3046] = v$3047;
                return merge$2690(o$3045, newObj$3049);
            }();
        }.curry().apply(null, arguments);
    }
    ;
    extendNative$2517(Object.prototype, 'map', function (self$3052, f$3053) {
        return foldl$2673(function (o$3054, k$3055) {
            return set$2693(o$3054, k$3055, f$3053(self$3052[k$3055]));
        }.curry(), {}, Object.keys(self$3052));
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
                Sum: Sum$2623,
                getSum: getSum$2632
            },
            Product: {
                Product: Product$2633,
                getProduct: getProduct$2642
            },
            Max: {
                Max: Max$2643,
                getMax: getMax$2652
            },
            Min: {
                Min: Min$2653,
                getMin: getMin$2662
            }
        },
        Data: {
            Either: {
                Either: Either$2669,
                Left: Left$2670,
                Right: Right$2671
            },
            Option: {
                Option: Option$2663,
                Some: Some$2664,
                None: None$2665
            },
            Collection: {
                foldl: foldl$2673,
                foldl1: foldl1$2675,
                foldr: foldr$2677,
                foldr1: foldr1$2679,
                flatten: flatten$2682
            },
            Object: {
                merge: merge$2690,
                set: set$2693
            }
        },
        Control: {
            Functor: { map: map$2605 },
            Applicative: { ap: ap$2609 },
            Monad: {
                Monad: Monad$2611,
                chain: chain$2613
            },
            Monoid: {
                Monoid: Monoid$2617,
                concat: concat$2619
            }
        }
    };
}());
//# sourceMappingURL=curry.js.map