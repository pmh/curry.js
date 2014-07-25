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
    var extendNative$2517 = function (native$2718, prop$2719, f$2720) {
        return Object.defineProperty(native$2718, prop$2719, {
            value: function () {
                return f$2720.apply(this, [this].concat(__slice$2513.call(arguments)));
            }
        });
    };
    var withMeta$2518 = function (f$2721, meta$2722) {
        var keys$2723 = Object.keys(meta$2722);
        keys$2723.forEach(function (name$2724) {
            Object.defineProperty(f$2721, '__' + name$2724, { value: meta$2722[name$2724] });
        });
        return f$2721;
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
    var curry$2519 = function (f$2725, n$2726) {
        var arity$2727 = typeof n$2726 !== 'undefined' ? n$2726 : typeof f$2725.__arity !== 'undefined' ? f$2725.__arity : f$2725.length, name$2728 = f$2725.name || f$2725.__name;
        if (arity$2727 < 2)
            return f$2725;
        var curriedFn$2729 = withMeta$2518(function () {
                var args$2730 = [].slice.call(arguments, 0, arity$2727), realArity$2731 = args$2730.filter(function (x$2733) {
                        return x$2733 !== __$2516;
                    }).length, self$2732 = this;
                if (realArity$2731 >= arity$2727)
                    return f$2725.apply(self$2732, arguments);
                else {
                    var g$2734 = withMeta$2518(function () {
                            var partialArgs$2735 = [].slice.call(arguments), newArgs$2736 = [];
                            for (var i$2737 = 0; i$2737 < args$2730.length; i$2737++)
                                newArgs$2736[i$2737] = args$2730[i$2737] === __$2516 ? partialArgs$2735.length === 0 ? undefined : partialArgs$2735.shift() : args$2730[i$2737];
                            return curriedFn$2729.apply(self$2732, newArgs$2736.concat(partialArgs$2735));
                        }, {
                            name: name$2728,
                            arity: arity$2727 - realArity$2731,
                            curried: true
                        });
                    g$2734.toString = curriedFn$2729.toString.bind(curriedFn$2729);
                    return g$2734;
                }
            }, {
                name: name$2728,
                arity: arity$2727,
                curried: true
            });
        curriedFn$2729.toString = f$2725.toString.bind(f$2725);
        return curriedFn$2729;
    };
    extendNative$2517(Function.prototype, 'curry', function (self$2738, n$2739) {
        return curry$2519(self$2738, n$2739);
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
        var fns$2740 = __slice$2513.call(arguments), self$2741 = this;
        return fns$2740.reduce(function (f$2742, g$2743) {
            return function () {
                return f$2742.call(self$2741, g$2743.apply(self$2741, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2522 = function (name$2744, spec$2745) {
        return {
            name: name$2744,
            spec: spec$2745,
            instance: function (type$2746, impl$2747) {
                var name$2748 = this.name, spec$2749 = this.spec, constructor$2750 = spec$2749.constructor, proto$2751 = spec$2749.prototype, k$2752;
                Object.keys(constructor$2750 || {}).map(function (field$2753) {
                    if (constructor$2750[field$2753] === Protocol$2522.required && !impl$2747.hasOwnProperty(field$2753) && !type$2746.hasOwnProperty(field$2753))
                        throw Protocol$2522.required(name$2748, field$2753);
                    else if (!type$2746.hasOwnProperty(field$2753) && !impl$2747.hasOwnProperty(field$2753))
                        type$2746[field$2753] = function () {
                            return constructor$2750[field$2753].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2747.hasOwnProperty(field$2753))
                        type$2746[field$2753] = function () {
                            return impl$2747[field$2753].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
                Object.keys(proto$2751 || {}).map(function (field$2754) {
                    if (proto$2751[field$2754] === Protocol$2522.required && !impl$2747.hasOwnProperty(field$2754) && !type$2746.prototype.hasOwnProperty(field$2754))
                        throw Protocol$2522.required(name$2748, field$2754);
                    else if (!type$2746.prototype.hasOwnProperty(field$2754) && !impl$2747.hasOwnProperty(field$2754))
                        type$2746.prototype[field$2754] = function () {
                            return proto$2751[field$2754].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2747.hasOwnProperty(field$2754))
                        type$2746.prototype[field$2754] = function () {
                            return impl$2747[field$2754].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2522.required = function (name$2755, field$2756) {
        return new Error(name$2755 + ' expected required field: \'' + field$2756 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2525(protocol$2757, type$2758, impl$2759) {
        return function instance$2525(protocol$2760, type$2761, impl$2762) {
            return protocol$2760.instance(type$2761, impl$2762);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2582(x$2763) {
        return function not$2582(x$2764) {
            return !x$2764;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2583(xs$2765) {
        return function and$2583(xs$2766) {
            return xs$2766.every(function (x$2767) {
                return !!x$2767;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2584(xs$2768) {
        return function or$2584(xs$2769) {
            return xs$2769.some(function (x$2770) {
                return !!x$2770;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2585(x$2771) {
        return function isObject$2585(x$2772) {
            return function (a0$2773) {
                if (Object.prototype.toString.call(a0$2773) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2772);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2586(x$2774) {
        return function isArray$2586(x$2775) {
            return function (a0$2776) {
                if (Array.isArray ? Array.isArray(a0$2776) : Object.prototype.toString.call(a0$2776) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2775);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2587(x$2777) {
        return function isNumber$2587(x$2778) {
            return function (a0$2779) {
                if (typeof a0$2779 === 'number' || Object.prototype.toString.call(a0$2779) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2778);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2588(x$2780) {
        return function isRegExp$2588(x$2781) {
            return function (a0$2782) {
                if (Object.prototype.toString.call(a0$2782) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2781);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2589(x$2783) {
        return function isString$2589(x$2784) {
            return function (a0$2785) {
                if (typeof a0$2785 === 'string' || Object.prototype.toString.call(a0$2785) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2784);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2590(x$2786) {
        return function isNull$2590(x$2787) {
            return function (a0$2788) {
                if (a0$2788 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2787);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2591(x$2789) {
        return function isUndef$2591(x$2790) {
            return function (a0$2791) {
                if (a0$2791 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2790);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2592(x$2792) {
        return function exists$2592(x$2793) {
            return function (x$2794) {
                return not$2582(or$2584(x$2794));
            }([
                isNull$2590(x$2793),
                isUndef$2591(x$2793)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2593(a$2795, b$2796) {
        return function plus$2593(a$2797, b$2798) {
            return a$2797 + b$2798;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2594(a$2799, b$2800) {
        return function minus$2594(a$2801, b$2802) {
            return a$2801 - b$2802;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2595(a$2803, b$2804) {
        return function times$2595(a$2805, b$2806) {
            return a$2805 * b$2806;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2596(a$2807, b$2808) {
        return function div$2596(a$2809, b$2810) {
            return a$2809 / b$2810;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                      CurryJS.Function                     **
    // ***************************************************************
    // id :: a -> a
    function id$2597(x$2811) {
        return function id$2597(x$2812) {
            return x$2812;
        }.curry().apply(null, arguments);
    }
    // constant :: a -> b -> a
    function constant$2598(x$2813) {
        return function constant$2598(x$2814) {
            return function (_$2815) {
                return x$2814;
            }.curry();
        }.curry().apply(null, arguments);
    }
    // unary :: Function -> (a -> b)
    function unary$2599(f$2816) {
        return function unary$2599(f$2817) {
            return function (x$2818) {
                return f$2817(x$2818);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // binary :: Function -> (a -> b -> c)
    function binary$2600(f$2819) {
        return function binary$2600(f$2820) {
            return function (x$2821, y$2822) {
                return f$2820(x$2821, y$2822);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // ternary :: Function -> (a -> b -> c -> d)
    function ternary$2601(f$2823) {
        return function ternary$2601(f$2824) {
            return function (x$2825, y$2826, z$2827) {
                return f$2824(x$2825, y$2826, z$2827);
            }.curry();
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2603 = Protocol$2522('Functor', { prototype: { map: Protocol$2522.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2605(f$2828, xs$2829) {
        return function map$2605(f$2830, xs$2831) {
            return xs$2831.map(unary$2599(f$2830));
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2607 = Protocol$2522('Applicative', { prototype: { ap: Protocol$2522.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2609(f$2832, xs$2833) {
        return function ap$2609(f$2834, xs$2835) {
            return f$2834.ap(xs$2835);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2611 = Protocol$2522('Monad', {
            constructor: {
                of: function (x$2837) {
                    return this.prototype.of(x$2837);
                }.curry()
            },
            prototype: {
                of: Protocol$2522.required,
                chain: Protocol$2522.required,
                map: function (self$2843, f$2844) {
                    return self$2843.chain(function (x$2845) {
                        return self$2843.of(f$2844(x$2845));
                    }.bind(this));
                }.curry(),
                ap: function (self$2846, x$2847) {
                    return self$2846.chain(map$2605(__$2516, x$2847).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2613(xs$2848, f$2849) {
        return function chain$2613(xs$2850, f$2851) {
            return xs$2850.chain(f$2851);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2615(f$2852, x$2853) {
        return function pure$2615(f$2854, x$2855) {
            return f$2854.of ? f$2854.of(x$2855) : f$2854.constructor.of(x$2855);
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
    function concat$2619(a$2858, b$2859) {
        return function concat$2619(a$2860, b$2861) {
            return a$2860.concat(b$2861);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2623 = function () {
            function Sum$2862(_0$2864) {
                if (!(this instanceof Sum$2862)) {
                    return new Sum$2862(_0$2864);
                }
                if (typeof _0$2864 === 'number' || Object.prototype.toString.call(_0$2864) === '[object Number]') {
                    this['0'] = _0$2864;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2862.prototype.length = 1;
            var derived$2863 = Base$2511.derive({
                    name: 'Sum',
                    constructor: Sum$2862,
                    prototype: Sum$2862.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2862,
                            prototype: Sum$2862.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2863.constructor;
        }();
    instance$2525(Monoid$2617, Sum$2623, {
        empty: function () {
            return Sum$2623(0);
        }.curry(),
        concat: function (a$2872, b$2873) {
            return function (a0$2874, a1$2875) {
                var r0$2876 = Sum$2623.unapply(a0$2874);
                if (r0$2876 != null && r0$2876.length === 1) {
                    var r1$2877 = Sum$2623.unapply(a1$2875);
                    if (r1$2877 != null && r1$2877.length === 1) {
                        var x$2878 = r0$2876[0];
                        var y$2879 = r1$2877[0];
                        return Sum$2623(x$2878 + y$2879);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2872, b$2873);
        }.curry()
    });
    function getSum$2632(x$2880) {
        return function getSum$2632(x$2881) {
            return function (a0$2882) {
                var r0$2883 = Sum$2623.unapply(a0$2882);
                if (r0$2883 != null && r0$2883.length === 1) {
                    var x$2884 = r0$2883[0];
                    return x$2884;
                }
                throw new TypeError('No match');
            }.call(this, x$2881);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2633 = function () {
            function Product$2885(_0$2887) {
                if (!(this instanceof Product$2885)) {
                    return new Product$2885(_0$2887);
                }
                if (typeof _0$2887 === 'number' || Object.prototype.toString.call(_0$2887) === '[object Number]') {
                    this['0'] = _0$2887;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2885.prototype.length = 1;
            var derived$2886 = Base$2511.derive({
                    name: 'Product',
                    constructor: Product$2885,
                    prototype: Product$2885.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2885,
                            prototype: Product$2885.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2886.constructor;
        }();
    instance$2525(Monoid$2617, Product$2633, {
        empty: function (self$2894) {
            return Product$2633(1);
        }.curry(),
        concat: function (a$2895, b$2896) {
            return function (a0$2897, a1$2898) {
                var r0$2899 = Product$2633.unapply(a0$2897);
                if (r0$2899 != null && r0$2899.length === 1) {
                    var r1$2900 = Product$2633.unapply(a1$2898);
                    if (r1$2900 != null && r1$2900.length === 1) {
                        var x$2901 = r0$2899[0];
                        var y$2902 = r1$2900[0];
                        return Product$2633(x$2901 * y$2902);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2895, b$2896);
        }.curry()
    });
    function getProduct$2642(x$2903) {
        return function getProduct$2642(x$2904) {
            return function (a0$2905) {
                var r0$2906 = Product$2633.unapply(a0$2905);
                if (r0$2906 != null && r0$2906.length === 1) {
                    var x$2907 = r0$2906[0];
                    return x$2907;
                }
                throw new TypeError('No match');
            }.call(this, x$2904);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2643 = function () {
            function Max$2908(_0$2910) {
                if (!(this instanceof Max$2908)) {
                    return new Max$2908(_0$2910);
                }
                if (typeof _0$2910 === 'number' || Object.prototype.toString.call(_0$2910) === '[object Number]') {
                    this['0'] = _0$2910;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2908.prototype.length = 1;
            var derived$2909 = Base$2511.derive({
                    name: 'Max',
                    constructor: Max$2908,
                    prototype: Max$2908.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2908,
                            prototype: Max$2908.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2909.constructor;
        }();
    instance$2525(Monoid$2617, Max$2643, {
        empty: function (self$2917) {
            return Max$2643(-Infinity);
        }.curry(),
        concat: function (a$2918, b$2919) {
            return function (a0$2920, a1$2921) {
                var r0$2922 = Max$2643.unapply(a0$2920);
                if (r0$2922 != null && r0$2922.length === 1) {
                    var r1$2923 = Max$2643.unapply(a1$2921);
                    if (r1$2923 != null && r1$2923.length === 1) {
                        var x$2924 = r0$2922[0];
                        var y$2925 = r1$2923[0];
                        return Max$2643(x$2924 > y$2925 ? x$2924 : y$2925);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2918, b$2919);
        }.curry()
    });
    function getMax$2652(x$2926) {
        return function getMax$2652(x$2927) {
            return function (a0$2928) {
                var r0$2929 = Max$2643.unapply(a0$2928);
                if (r0$2929 != null && r0$2929.length === 1) {
                    var x$2930 = r0$2929[0];
                    return x$2930;
                }
                throw new TypeError('No match');
            }.call(this, x$2927);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2653 = function () {
            function Min$2931(_0$2933) {
                if (!(this instanceof Min$2931)) {
                    return new Min$2931(_0$2933);
                }
                if (typeof _0$2933 === 'number' || Object.prototype.toString.call(_0$2933) === '[object Number]') {
                    this['0'] = _0$2933;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2931.prototype.length = 1;
            var derived$2932 = Base$2511.derive({
                    name: 'Min',
                    constructor: Min$2931,
                    prototype: Min$2931.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2931,
                            prototype: Min$2931.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2932.constructor;
        }();
    instance$2525(Monoid$2617, Min$2653, {
        empty: function (self$2940) {
            return Min$2653(Infinity);
        }.curry(),
        concat: function (a$2941, b$2942) {
            return function (a0$2943, a1$2944) {
                var r0$2945 = Min$2653.unapply(a0$2943);
                if (r0$2945 != null && r0$2945.length === 1) {
                    var r1$2946 = Min$2653.unapply(a1$2944);
                    if (r1$2946 != null && r1$2946.length === 1) {
                        var x$2947 = r0$2945[0];
                        var y$2948 = r1$2946[0];
                        return Min$2653(x$2947 < y$2948 ? x$2947 : y$2948);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2941, b$2942);
        }.curry()
    });
    function getMin$2662(x$2949) {
        return function getMin$2662(x$2950) {
            return function (a0$2951) {
                var r0$2952 = Min$2653.unapply(a0$2951);
                if (r0$2952 != null && r0$2952.length === 1) {
                    var x$2953 = r0$2952[0];
                    return x$2953;
                }
                throw new TypeError('No match');
            }.call(this, x$2950);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2663 = function () {
            function Option$2954() {
            }
            function Some$2955(val$2958) {
                if (!(this instanceof Some$2955)) {
                    return new Some$2955(val$2958);
                }
                this.val = val$2958;
            }
            Some$2955.prototype = new Option$2954();
            Some$2955.prototype.constructor = Some$2955;
            function None$2956() {
            }
            None$2956.prototype = new Option$2954();
            None$2956.prototype.constructor = None$2956;
            var derived$2957 = Base$2511.derive({
                    name: 'Option',
                    constructor: Option$2954,
                    prototype: Option$2954.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2955,
                            prototype: Some$2955.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2956,
                            prototype: None$2956.prototype
                        }
                    ]
                });
            Option$2954.Some = derived$2957.variants[0].constructor;
            Option$2954.None = new derived$2957.variants[1].constructor();
            return Option$2954;
        }();
    var Some$2664 = Option$2663.Some;
    var None$2665 = Option$2663.None;
    instance$2525(Monad$2611, Option$2663, {
        of: function (self$2965, x$2966) {
            return Some$2664(x$2966);
        }.curry(),
        chain: function (self$2967, f$2968) {
            return function (a0$2969, a1$2970) {
                var r0$2971 = Some$2664.unapply(a0$2969);
                if (r0$2971 != null && (r0$2971.length === 1 && (typeof a1$2970 === 'function' || Object.prototype.toString.call(a1$2970) === '[object Function]'))) {
                    var x$2972 = r0$2971[0];
                    return f$2968(x$2972);
                }
                if ((None$2665.hasInstance ? None$2665.hasInstance(a0$2969) : a0$2969 instanceof None$2665) && (typeof a1$2970 === 'function' || Object.prototype.toString.call(a1$2970) === '[object Function]')) {
                    return None$2665;
                }
                throw new TypeError('No match');
            }.call(this, self$2967, f$2968);
        }.curry()
    });
    instance$2525(Monoid$2617, Option$2663, {
        empty: function (self$2979) {
            return None$2665;
        }.curry(),
        concat: function (a$2980, b$2981) {
            return function (a0$2982, a1$2983) {
                if ((Option$2663.hasInstance ? Option$2663.hasInstance(a0$2982) : a0$2982 instanceof Option$2663) && (None$2665.hasInstance ? None$2665.hasInstance(a1$2983) : a1$2983 instanceof None$2665)) {
                    return a$2980;
                }
                if ((None$2665.hasInstance ? None$2665.hasInstance(a0$2982) : a0$2982 instanceof None$2665) && (Option$2663.hasInstance ? Option$2663.hasInstance(a1$2983) : a1$2983 instanceof Option$2663)) {
                    return b$2981;
                }
                var r0$2984 = Some$2664.unapply(a0$2982);
                if (r0$2984 != null && r0$2984.length === 1) {
                    var r1$2985 = Some$2664.unapply(a1$2983);
                    if (r1$2985 != null && r1$2985.length === 1) {
                        var v1$2986 = r0$2984[0];
                        var v2$2987 = r1$2985[0];
                        return Some$2664(v1$2986.concat(v2$2987));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2980, b$2981);
        }.curry()
    });
    // maybe :: b -> (a -> b) -> Option a -> b
    function maybe$2679(n$2988, f$2989, option$2990) {
        return function maybe$2679(n$2991, f$2992, option$2993) {
            return function (a0$2994, a1$2995, a2$2996) {
                if (None$2665.hasInstance ? None$2665.hasInstance(a2$2996) : a2$2996 instanceof None$2665) {
                    var n$2998 = a0$2994;
                    return n$2998;
                }
                var r0$2997 = Some$2664.unapply(a2$2996);
                if (r0$2997 != null && r0$2997.length === 1) {
                    var f$2999 = a1$2995;
                    var x$3000 = r0$2997[0];
                    return f$2999(x$3000);
                }
                throw new TypeError('No match');
            }.call(this, n$2991, f$2992, option$2993);
        }.curry().apply(null, arguments);
    }
    // fromOption :: a -> Option a -> a
    function fromOption$2680(n$3001, o$3002) {
        return function fromOption$2680(n$3003, o$3004) {
            return function (a0$3005) {
                var r0$3006 = Some$2664.unapply(a0$3005);
                if (r0$3006 != null && r0$3006.length === 1) {
                    var x$3007 = r0$3006[0];
                    return x$3007;
                }
                if (None$2665.hasInstance ? None$2665.hasInstance(a0$3005) : a0$3005 instanceof None$2665) {
                    return n$3003;
                }
                throw new TypeError('No match');
            }.call(this, o$3004);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2681 = function () {
            function Either$3008() {
            }
            function Left$3009(l$3012) {
                if (!(this instanceof Left$3009)) {
                    return new Left$3009(l$3012);
                }
                this.l = l$3012;
            }
            Left$3009.prototype = new Either$3008();
            Left$3009.prototype.constructor = Left$3009;
            function Right$3010(r$3013) {
                if (!(this instanceof Right$3010)) {
                    return new Right$3010(r$3013);
                }
                this.r = r$3013;
            }
            Right$3010.prototype = new Either$3008();
            Right$3010.prototype.constructor = Right$3010;
            var derived$3011 = Base$2511.derive({
                    name: 'Either',
                    constructor: Either$3008,
                    prototype: Either$3008.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$3009,
                            prototype: Left$3009.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$3010,
                            prototype: Right$3010.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$3008.Left = derived$3011.variants[0].constructor;
            Either$3008.Right = derived$3011.variants[1].constructor;
            return Either$3008;
        }();
    var Left$2682 = Either$2681.Left;
    var Right$2683 = Either$2681.Right;
    instance$2525(Monad$2611, Either$2681, {
        of: function (self$3020, x$3021) {
            return Right$2683(x$3021);
        }.curry(),
        chain: function (self$3022, f$3023) {
            return function (a0$3024, a1$3025) {
                var r0$3026 = Right$2683.unapply(a0$3024);
                if (r0$3026 != null && (r0$3026.length === 1 && (typeof a1$3025 === 'function' || Object.prototype.toString.call(a1$3025) === '[object Function]'))) {
                    var x$3028 = r0$3026[0];
                    return f$3023(x$3028);
                }
                var r1$3027 = Left$2682.unapply(a0$3024);
                if (r1$3027 != null && r1$3027.length === 1) {
                    var x$3028 = r1$3027[0];
                    return self$3022;
                }
                throw new TypeError('No match');
            }.call(this, self$3022, f$3023);
        }.curry()
    });
    instance$2525(Monoid$2617, Either$2681, {
        empty: function (self$3035) {
            return Left$2682();
        }.curry(),
        concat: function (a$3036, b$3037) {
            return function (a0$3038, a1$3039) {
                if (Either$2681.hasInstance ? Either$2681.hasInstance(a0$3038) : a0$3038 instanceof Either$2681) {
                    var r0$3042 = Left$2682.unapply(a1$3039);
                    if (r0$3042 != null && r0$3042.length === 1) {
                        var x$3043 = r0$3042[0];
                        return a$3036;
                    }
                }
                var r1$3040 = Left$2682.unapply(a0$3038);
                if (r1$3040 != null && (r1$3040.length === 1 && (Either$2681.hasInstance ? Either$2681.hasInstance(a1$3039) : a1$3039 instanceof Either$2681))) {
                    var x$3043 = r1$3040[0];
                    return b$3037;
                }
                var r2$3041 = Right$2683.unapply(a0$3038);
                if (r2$3041 != null && r2$3041.length === 1) {
                    var r3$3044 = Right$2683.unapply(a1$3039);
                    if (r3$3044 != null && r3$3044.length === 1) {
                        var r1$3045 = r2$3041[0];
                        var r2$3046 = r3$3044[0];
                        return Right$2683(r1$3045.concat(r2$3046));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$3036, b$3037);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2685(f$3047, acc$3048, xs$3049) {
        return function foldl$2685(f$3050, acc$3051, xs$3052) {
            return xs$3052.reduce(binary$2600(f$3050), acc$3051);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2687(f$3053, xs$3054) {
        return function foldl1$2687(f$3055, xs$3056) {
            return xs$3056.reduce(binary$2600(f$3055));
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2689(f$3057, acc$3058, xs$3059) {
        return function foldr$2689(f$3060, acc$3061, xs$3062) {
            return xs$3062.reduceRight(binary$2600(f$3060), acc$3061);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2691(f$3063, xs$3064) {
        return function foldr1$2691(f$3065, xs$3066) {
            return xs$3066.reduceRight(binary$2600(f$3065));
        }.curry().apply(null, arguments);
    }
    ;
    // filter :: (a -> Bool) -> [a] -> [a]
    function filter$2695(f$3067, xs$3068) {
        return function filter$2695(f$3069, xs$3070) {
            return xs$3070.filter(unary$2599(f$3069));
        }.curry().apply(null, arguments);
    }
    // head :: [a] -> Option a
    function head$2696(xs$3071) {
        return function head$2696(xs$3072) {
            return xs$3072.head();
        }.curry().apply(null, arguments);
    }
    // tail :: [a] -> [a]
    function tail$2697(xs$3073) {
        return function tail$2697(xs$3074) {
            return xs$3074.tail();
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2700(xs$3075) {
        return function flatten$2700(xs$3076) {
            return foldl1$2687(function (xs$3077, ys$3078) {
                return xs$3077.concat(ys$3078);
            }.curry(), xs$3076);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2517(Array, 'of', function (self$3079, x$3080) {
        return [x$3080];
    }.curry());
    extendNative$2517(Array.prototype, 'ap', function (self$3081, x$3082) {
        return this.chain(map$2605(__$2516, x$3082).bind(this));
    }.curry());
    extendNative$2517(Array.prototype, 'chain', function (self$3083, f$3084) {
        return function (x$3085) {
            return flatten$2700(map$2605(f$3084)(x$3085));
        }(this);
    }.curry());
    extendNative$2517(Array.prototype, 'head', function (self$3086) {
        return self$3086[0] ? Some$2664(self$3086[0]) : None$2665;
    }.curry());
    extendNative$2517(Array.prototype, 'tail', function (self$3087) {
        return self$3087.slice(1);
    }.curry());
    // ***************************************************************
    // **                       CurryJS.String                      **
    // ***************************************************************
    Object.defineProperty(String.prototype, 'reduce', {
        value: function (f$3088, acc$3089) {
            var xs$3090 = this.split('');
            return exists$2592(acc$3089) ? xs$3090.reduce(f$3088, acc$3089) : xs$3090.reduce(f$3088);
        }
    });
    extendNative$2517(String.prototype, 'filter', function (self$3091, f$3092) {
        return self$3091.split('').filter(f$3092).join('');
    }.curry());
    extendNative$2517(String.prototype, 'head', function (self$3093) {
        return self$3093.split('').head();
    }.curry());
    extendNative$2517(String.prototype, 'tail', function (self$3094) {
        return self$3094.split('').tail();
    }.curry());
    // ***************************************************************
    // **                   CurryJS.Data.Object                     **
    // ***************************************************************
    // merge :: Object -> Object -> Object
    var merge$2712 = function (a$3095, b$3096) {
        var newObj$3097 = {}, k$3098;
        for (k$3098 in b$3096) {
            if (b$3096.hasOwnProperty(k$3098))
                newObj$3097[k$3098] = b$3096[k$3098];
        }
        for (k$3098 in a$3095) {
            if (a$3095.hasOwnProperty(k$3098))
                newObj$3097[k$3098] = a$3095[k$3098];
        }
        return newObj$3097;
    };
    // set :: Object -> String -> a
    function set$2715(o$3099, k$3100, v$3101) {
        return function set$2715(o$3102, k$3103, v$3104) {
            return function () {
                var newObj$3106 = {};
                var foo$3108 = newObj$3106[k$3103] = v$3104;
                return merge$2712(o$3102, newObj$3106);
            }();
        }.curry().apply(null, arguments);
    }
    ;
    extendNative$2517(Object.prototype, 'map', function (self$3109, f$3110) {
        return foldl$2685(function (o$3111, k$3112) {
            return set$2715(o$3111, k$3112, f$3110(self$3109[k$3112]));
        }.curry(), {}, Object.keys(self$3109));
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
                Either: Either$2681,
                Left: Left$2682,
                Right: Right$2683
            },
            Option: {
                Option: Option$2663,
                Some: Some$2664,
                None: None$2665,
                maybe: maybe$2679,
                fromOption: fromOption$2680
            },
            Collection: {
                foldl: foldl$2685,
                foldl1: foldl1$2687,
                foldr: foldr$2689,
                foldr1: foldr1$2691,
                filter: filter$2695,
                head: head$2696,
                tail: tail$2697,
                flatten: flatten$2700
            },
            Object: {
                merge: merge$2712,
                set: set$2715
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