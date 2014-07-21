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
    var extendNative$2517 = function (native$2706, prop$2707, f$2708) {
        return Object.defineProperty(native$2706, prop$2707, {
            value: function () {
                return f$2708.apply(this, [this].concat(__slice$2513.call(arguments)));
            }
        });
    };
    var withMeta$2518 = function (f$2709, meta$2710) {
        var keys$2711 = Object.keys(meta$2710);
        keys$2711.forEach(function (name$2712) {
            Object.defineProperty(f$2709, '__' + name$2712, { value: meta$2710[name$2712] });
        });
        return f$2709;
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
    var curry$2519 = function (f$2713, n$2714) {
        var arity$2715 = typeof n$2714 !== 'undefined' ? n$2714 : typeof f$2713.__arity !== 'undefined' ? f$2713.__arity : f$2713.length, name$2716 = f$2713.name || f$2713.__name;
        if (arity$2715 < 2)
            return f$2713;
        var curriedFn$2717 = withMeta$2518(function () {
                var args$2718 = [].slice.call(arguments, 0, arity$2715), realArity$2719 = args$2718.filter(function (x$2721) {
                        return x$2721 !== __$2516;
                    }).length, self$2720 = this;
                if (realArity$2719 >= arity$2715)
                    return f$2713.apply(self$2720, arguments);
                else {
                    var g$2722 = withMeta$2518(function () {
                            var partialArgs$2723 = [].slice.call(arguments), newArgs$2724 = [];
                            for (var i$2725 = 0; i$2725 < args$2718.length; i$2725++)
                                newArgs$2724[i$2725] = args$2718[i$2725] === __$2516 ? partialArgs$2723.length === 0 ? undefined : partialArgs$2723.shift() : args$2718[i$2725];
                            return curriedFn$2717.apply(self$2720, newArgs$2724.concat(partialArgs$2723));
                        }, {
                            name: name$2716,
                            arity: arity$2715 - realArity$2719,
                            curried: true
                        });
                    g$2722.toString = curriedFn$2717.toString.bind(curriedFn$2717);
                    return g$2722;
                }
            }, {
                name: name$2716,
                arity: arity$2715,
                curried: true
            });
        curriedFn$2717.toString = f$2713.toString.bind(f$2713);
        return curriedFn$2717;
    };
    extendNative$2517(Function.prototype, 'curry', function (self$2726, n$2727) {
        return curry$2519(self$2726, n$2727);
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
        var fns$2728 = __slice$2513.call(arguments), self$2729 = this;
        return fns$2728.reduce(function (f$2730, g$2731) {
            return function () {
                return f$2730.call(self$2729, g$2731.apply(self$2729, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2522 = function (name$2732, spec$2733) {
        return {
            name: name$2732,
            spec: spec$2733,
            instance: function (type$2734, impl$2735) {
                var name$2736 = this.name, spec$2737 = this.spec, constructor$2738 = spec$2737.constructor, proto$2739 = spec$2737.prototype, k$2740;
                Object.keys(constructor$2738 || {}).map(function (field$2741) {
                    if (constructor$2738[field$2741] === Protocol$2522.required && !impl$2735.hasOwnProperty(field$2741) && !type$2734.hasOwnProperty(field$2741))
                        throw Protocol$2522.required(name$2736, field$2741);
                    else if (!type$2734.hasOwnProperty(field$2741) && !impl$2735.hasOwnProperty(field$2741))
                        type$2734[field$2741] = function () {
                            return constructor$2738[field$2741].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2735.hasOwnProperty(field$2741))
                        type$2734[field$2741] = function () {
                            return impl$2735[field$2741].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
                Object.keys(proto$2739 || {}).map(function (field$2742) {
                    if (proto$2739[field$2742] === Protocol$2522.required && !impl$2735.hasOwnProperty(field$2742) && !type$2734.prototype.hasOwnProperty(field$2742))
                        throw Protocol$2522.required(name$2736, field$2742);
                    else if (!type$2734.prototype.hasOwnProperty(field$2742) && !impl$2735.hasOwnProperty(field$2742))
                        type$2734.prototype[field$2742] = function () {
                            return proto$2739[field$2742].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2735.hasOwnProperty(field$2742))
                        type$2734.prototype[field$2742] = function () {
                            return impl$2735[field$2742].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2522.required = function (name$2743, field$2744) {
        return new Error(name$2743 + ' expected required field: \'' + field$2744 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2525(protocol$2745, type$2746, impl$2747) {
        return function instance$2525(protocol$2748, type$2749, impl$2750) {
            return protocol$2748.instance(type$2749, impl$2750);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2582(x$2751) {
        return function not$2582(x$2752) {
            return !x$2752;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2583(xs$2753) {
        return function and$2583(xs$2754) {
            return xs$2754.every(function (x$2755) {
                return !!x$2755;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2584(xs$2756) {
        return function or$2584(xs$2757) {
            return xs$2757.some(function (x$2758) {
                return !!x$2758;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2585(x$2759) {
        return function isObject$2585(x$2760) {
            return function (a0$2761) {
                if (Object.prototype.toString.call(a0$2761) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2760);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2586(x$2762) {
        return function isArray$2586(x$2763) {
            return function (a0$2764) {
                if (Array.isArray ? Array.isArray(a0$2764) : Object.prototype.toString.call(a0$2764) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2763);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2587(x$2765) {
        return function isNumber$2587(x$2766) {
            return function (a0$2767) {
                if (typeof a0$2767 === 'number' || Object.prototype.toString.call(a0$2767) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2766);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2588(x$2768) {
        return function isRegExp$2588(x$2769) {
            return function (a0$2770) {
                if (Object.prototype.toString.call(a0$2770) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2769);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2589(x$2771) {
        return function isString$2589(x$2772) {
            return function (a0$2773) {
                if (typeof a0$2773 === 'string' || Object.prototype.toString.call(a0$2773) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2772);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2590(x$2774) {
        return function isNull$2590(x$2775) {
            return function (a0$2776) {
                if (a0$2776 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2775);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2591(x$2777) {
        return function isUndef$2591(x$2778) {
            return function (a0$2779) {
                if (a0$2779 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2778);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2592(x$2780) {
        return function exists$2592(x$2781) {
            return function (x$2782) {
                return not$2582(or$2584(x$2782));
            }([
                isNull$2590(x$2781),
                isUndef$2591(x$2781)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2593(a$2783, b$2784) {
        return function plus$2593(a$2785, b$2786) {
            return a$2785 + b$2786;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2594(a$2787, b$2788) {
        return function minus$2594(a$2789, b$2790) {
            return a$2789 - b$2790;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2595(a$2791, b$2792) {
        return function times$2595(a$2793, b$2794) {
            return a$2793 * b$2794;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2596(a$2795, b$2796) {
        return function div$2596(a$2797, b$2798) {
            return a$2797 / b$2798;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                      CurryJS.Function                     **
    // ***************************************************************
    // id :: a -> a
    function id$2597(x$2799) {
        return function id$2597(x$2800) {
            return x$2800;
        }.curry().apply(null, arguments);
    }
    // constant :: a -> b -> a
    function constant$2598(x$2801) {
        return function constant$2598(x$2802) {
            return function (_$2803) {
                return x$2802;
            }.curry();
        }.curry().apply(null, arguments);
    }
    // unary :: Function -> (a -> b)
    function unary$2599(f$2804) {
        return function unary$2599(f$2805) {
            return function (x$2806) {
                return f$2805(x$2806);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // binary :: Function -> (a -> b -> c)
    function binary$2600(f$2807) {
        return function binary$2600(f$2808) {
            return function (x$2809, y$2810) {
                return f$2808(x$2809, y$2810);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // ternary :: Function -> (a -> b -> c -> d)
    function ternary$2601(f$2811) {
        return function ternary$2601(f$2812) {
            return function (x$2813, y$2814, z$2815) {
                return f$2812(x$2813, y$2814, z$2815);
            }.curry();
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2603 = Protocol$2522('Functor', { prototype: { map: Protocol$2522.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2605(f$2816, xs$2817) {
        return function map$2605(f$2818, xs$2819) {
            return xs$2819.map(unary$2599(f$2818));
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2607 = Protocol$2522('Applicative', { prototype: { ap: Protocol$2522.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2609(f$2820, xs$2821) {
        return function ap$2609(f$2822, xs$2823) {
            return f$2822.ap(xs$2823);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2611 = Protocol$2522('Monad', {
            constructor: {
                of: function (x$2825) {
                    return this.prototype.of(x$2825);
                }.curry()
            },
            prototype: {
                of: Protocol$2522.required,
                chain: Protocol$2522.required,
                map: function (self$2831, f$2832) {
                    return self$2831.chain(function (x$2833) {
                        return self$2831.of(f$2832(x$2833));
                    }.bind(this));
                }.curry(),
                ap: function (self$2834, x$2835) {
                    return self$2834.chain(map$2605(__$2516, x$2835).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2613(xs$2836, f$2837) {
        return function chain$2613(xs$2838, f$2839) {
            return xs$2838.chain(f$2839);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2615(f$2840, x$2841) {
        return function pure$2615(f$2842, x$2843) {
            return f$2842.of ? f$2842.of(x$2843) : f$2842.constructor.of(x$2843);
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
    function concat$2619(a$2846, b$2847) {
        return function concat$2619(a$2848, b$2849) {
            return a$2848.concat(b$2849);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2623 = function () {
            function Sum$2850(_0$2852) {
                if (!(this instanceof Sum$2850)) {
                    return new Sum$2850(_0$2852);
                }
                if (typeof _0$2852 === 'number' || Object.prototype.toString.call(_0$2852) === '[object Number]') {
                    this['0'] = _0$2852;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2850.prototype.length = 1;
            var derived$2851 = Base$2511.derive({
                    name: 'Sum',
                    constructor: Sum$2850,
                    prototype: Sum$2850.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2850,
                            prototype: Sum$2850.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2851.constructor;
        }();
    instance$2525(Monoid$2617, Sum$2623, {
        empty: function () {
            return Sum$2623(0);
        }.curry(),
        concat: function (a$2860, b$2861) {
            return function (a0$2862, a1$2863) {
                var r0$2864 = Sum$2623.unapply(a0$2862);
                if (r0$2864 != null && r0$2864.length === 1) {
                    var r1$2865 = Sum$2623.unapply(a1$2863);
                    if (r1$2865 != null && r1$2865.length === 1) {
                        var x$2866 = r0$2864[0];
                        var y$2867 = r1$2865[0];
                        return Sum$2623(x$2866 + y$2867);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2860, b$2861);
        }.curry()
    });
    function getSum$2632(x$2868) {
        return function getSum$2632(x$2869) {
            return function (a0$2870) {
                var r0$2871 = Sum$2623.unapply(a0$2870);
                if (r0$2871 != null && r0$2871.length === 1) {
                    var x$2872 = r0$2871[0];
                    return x$2872;
                }
                throw new TypeError('No match');
            }.call(this, x$2869);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2633 = function () {
            function Product$2873(_0$2875) {
                if (!(this instanceof Product$2873)) {
                    return new Product$2873(_0$2875);
                }
                if (typeof _0$2875 === 'number' || Object.prototype.toString.call(_0$2875) === '[object Number]') {
                    this['0'] = _0$2875;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2873.prototype.length = 1;
            var derived$2874 = Base$2511.derive({
                    name: 'Product',
                    constructor: Product$2873,
                    prototype: Product$2873.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2873,
                            prototype: Product$2873.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2874.constructor;
        }();
    instance$2525(Monoid$2617, Product$2633, {
        empty: function (self$2882) {
            return Product$2633(1);
        }.curry(),
        concat: function (a$2883, b$2884) {
            return function (a0$2885, a1$2886) {
                var r0$2887 = Product$2633.unapply(a0$2885);
                if (r0$2887 != null && r0$2887.length === 1) {
                    var r1$2888 = Product$2633.unapply(a1$2886);
                    if (r1$2888 != null && r1$2888.length === 1) {
                        var x$2889 = r0$2887[0];
                        var y$2890 = r1$2888[0];
                        return Product$2633(x$2889 * y$2890);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2883, b$2884);
        }.curry()
    });
    function getProduct$2642(x$2891) {
        return function getProduct$2642(x$2892) {
            return function (a0$2893) {
                var r0$2894 = Product$2633.unapply(a0$2893);
                if (r0$2894 != null && r0$2894.length === 1) {
                    var x$2895 = r0$2894[0];
                    return x$2895;
                }
                throw new TypeError('No match');
            }.call(this, x$2892);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2643 = function () {
            function Max$2896(_0$2898) {
                if (!(this instanceof Max$2896)) {
                    return new Max$2896(_0$2898);
                }
                if (typeof _0$2898 === 'number' || Object.prototype.toString.call(_0$2898) === '[object Number]') {
                    this['0'] = _0$2898;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2896.prototype.length = 1;
            var derived$2897 = Base$2511.derive({
                    name: 'Max',
                    constructor: Max$2896,
                    prototype: Max$2896.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2896,
                            prototype: Max$2896.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2897.constructor;
        }();
    instance$2525(Monoid$2617, Max$2643, {
        empty: function (self$2905) {
            return Max$2643(-Infinity);
        }.curry(),
        concat: function (a$2906, b$2907) {
            return function (a0$2908, a1$2909) {
                var r0$2910 = Max$2643.unapply(a0$2908);
                if (r0$2910 != null && r0$2910.length === 1) {
                    var r1$2911 = Max$2643.unapply(a1$2909);
                    if (r1$2911 != null && r1$2911.length === 1) {
                        var x$2912 = r0$2910[0];
                        var y$2913 = r1$2911[0];
                        return Max$2643(x$2912 > y$2913 ? x$2912 : y$2913);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2906, b$2907);
        }.curry()
    });
    function getMax$2652(x$2914) {
        return function getMax$2652(x$2915) {
            return function (a0$2916) {
                var r0$2917 = Max$2643.unapply(a0$2916);
                if (r0$2917 != null && r0$2917.length === 1) {
                    var x$2918 = r0$2917[0];
                    return x$2918;
                }
                throw new TypeError('No match');
            }.call(this, x$2915);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2653 = function () {
            function Min$2919(_0$2921) {
                if (!(this instanceof Min$2919)) {
                    return new Min$2919(_0$2921);
                }
                if (typeof _0$2921 === 'number' || Object.prototype.toString.call(_0$2921) === '[object Number]') {
                    this['0'] = _0$2921;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2919.prototype.length = 1;
            var derived$2920 = Base$2511.derive({
                    name: 'Min',
                    constructor: Min$2919,
                    prototype: Min$2919.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2919,
                            prototype: Min$2919.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2920.constructor;
        }();
    instance$2525(Monoid$2617, Min$2653, {
        empty: function (self$2928) {
            return Min$2653(Infinity);
        }.curry(),
        concat: function (a$2929, b$2930) {
            return function (a0$2931, a1$2932) {
                var r0$2933 = Min$2653.unapply(a0$2931);
                if (r0$2933 != null && r0$2933.length === 1) {
                    var r1$2934 = Min$2653.unapply(a1$2932);
                    if (r1$2934 != null && r1$2934.length === 1) {
                        var x$2935 = r0$2933[0];
                        var y$2936 = r1$2934[0];
                        return Min$2653(x$2935 < y$2936 ? x$2935 : y$2936);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2929, b$2930);
        }.curry()
    });
    function getMin$2662(x$2937) {
        return function getMin$2662(x$2938) {
            return function (a0$2939) {
                var r0$2940 = Min$2653.unapply(a0$2939);
                if (r0$2940 != null && r0$2940.length === 1) {
                    var x$2941 = r0$2940[0];
                    return x$2941;
                }
                throw new TypeError('No match');
            }.call(this, x$2938);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2663 = function () {
            function Option$2942() {
            }
            function Some$2943(val$2946) {
                if (!(this instanceof Some$2943)) {
                    return new Some$2943(val$2946);
                }
                this.val = val$2946;
            }
            Some$2943.prototype = new Option$2942();
            Some$2943.prototype.constructor = Some$2943;
            function None$2944() {
            }
            None$2944.prototype = new Option$2942();
            None$2944.prototype.constructor = None$2944;
            var derived$2945 = Base$2511.derive({
                    name: 'Option',
                    constructor: Option$2942,
                    prototype: Option$2942.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2943,
                            prototype: Some$2943.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2944,
                            prototype: None$2944.prototype
                        }
                    ]
                });
            Option$2942.Some = derived$2945.variants[0].constructor;
            Option$2942.None = new derived$2945.variants[1].constructor();
            return Option$2942;
        }();
    var Some$2664 = Option$2663.Some;
    var None$2665 = Option$2663.None;
    instance$2525(Monad$2611, Option$2663, {
        of: function (self$2953, x$2954) {
            return Some$2664(x$2954);
        }.curry(),
        chain: function (self$2955, f$2956) {
            return function (a0$2957, a1$2958) {
                var r0$2959 = Some$2664.unapply(a0$2957);
                if (r0$2959 != null && (r0$2959.length === 1 && (typeof a1$2958 === 'function' || Object.prototype.toString.call(a1$2958) === '[object Function]'))) {
                    var x$2960 = r0$2959[0];
                    return f$2956(x$2960);
                }
                if ((None$2665.hasInstance ? None$2665.hasInstance(a0$2957) : a0$2957 instanceof None$2665) && (typeof a1$2958 === 'function' || Object.prototype.toString.call(a1$2958) === '[object Function]')) {
                    return None$2665;
                }
                throw new TypeError('No match');
            }.call(this, self$2955, f$2956);
        }.curry()
    });
    instance$2525(Monoid$2617, Option$2663, {
        empty: function (self$2967) {
            return None$2665;
        }.curry(),
        concat: function (a$2968, b$2969) {
            return function (a0$2970, a1$2971) {
                if ((Option$2663.hasInstance ? Option$2663.hasInstance(a0$2970) : a0$2970 instanceof Option$2663) && (None$2665.hasInstance ? None$2665.hasInstance(a1$2971) : a1$2971 instanceof None$2665)) {
                    return a$2968;
                }
                if ((None$2665.hasInstance ? None$2665.hasInstance(a0$2970) : a0$2970 instanceof None$2665) && (Option$2663.hasInstance ? Option$2663.hasInstance(a1$2971) : a1$2971 instanceof Option$2663)) {
                    return b$2969;
                }
                var r0$2972 = Some$2664.unapply(a0$2970);
                if (r0$2972 != null && r0$2972.length === 1) {
                    var r1$2973 = Some$2664.unapply(a1$2971);
                    if (r1$2973 != null && r1$2973.length === 1) {
                        var v1$2974 = r0$2972[0];
                        var v2$2975 = r1$2973[0];
                        return Some$2664(v1$2974.concat(v2$2975));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2968, b$2969);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2669 = function () {
            function Either$2976() {
            }
            function Left$2977(l$2980) {
                if (!(this instanceof Left$2977)) {
                    return new Left$2977(l$2980);
                }
                this.l = l$2980;
            }
            Left$2977.prototype = new Either$2976();
            Left$2977.prototype.constructor = Left$2977;
            function Right$2978(r$2981) {
                if (!(this instanceof Right$2978)) {
                    return new Right$2978(r$2981);
                }
                this.r = r$2981;
            }
            Right$2978.prototype = new Either$2976();
            Right$2978.prototype.constructor = Right$2978;
            var derived$2979 = Base$2511.derive({
                    name: 'Either',
                    constructor: Either$2976,
                    prototype: Either$2976.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2977,
                            prototype: Left$2977.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2978,
                            prototype: Right$2978.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2976.Left = derived$2979.variants[0].constructor;
            Either$2976.Right = derived$2979.variants[1].constructor;
            return Either$2976;
        }();
    var Left$2670 = Either$2669.Left;
    var Right$2671 = Either$2669.Right;
    instance$2525(Monad$2611, Either$2669, {
        of: function (self$2988, x$2989) {
            return Right$2671(x$2989);
        }.curry(),
        chain: function (self$2990, f$2991) {
            return function (a0$2992, a1$2993) {
                var r0$2994 = Right$2671.unapply(a0$2992);
                if (r0$2994 != null && (r0$2994.length === 1 && (typeof a1$2993 === 'function' || Object.prototype.toString.call(a1$2993) === '[object Function]'))) {
                    var x$2996 = r0$2994[0];
                    return f$2991(x$2996);
                }
                var r1$2995 = Left$2670.unapply(a0$2992);
                if (r1$2995 != null && r1$2995.length === 1) {
                    var x$2996 = r1$2995[0];
                    return self$2990;
                }
                throw new TypeError('No match');
            }.call(this, self$2990, f$2991);
        }.curry()
    });
    instance$2525(Monoid$2617, Either$2669, {
        empty: function (self$3003) {
            return Left$2670();
        }.curry(),
        concat: function (a$3004, b$3005) {
            return function (a0$3006, a1$3007) {
                if (Either$2669.hasInstance ? Either$2669.hasInstance(a0$3006) : a0$3006 instanceof Either$2669) {
                    var r0$3010 = Left$2670.unapply(a1$3007);
                    if (r0$3010 != null && r0$3010.length === 1) {
                        var x$3011 = r0$3010[0];
                        return a$3004;
                    }
                }
                var r1$3008 = Left$2670.unapply(a0$3006);
                if (r1$3008 != null && (r1$3008.length === 1 && (Either$2669.hasInstance ? Either$2669.hasInstance(a1$3007) : a1$3007 instanceof Either$2669))) {
                    var x$3011 = r1$3008[0];
                    return b$3005;
                }
                var r2$3009 = Right$2671.unapply(a0$3006);
                if (r2$3009 != null && r2$3009.length === 1) {
                    var r3$3012 = Right$2671.unapply(a1$3007);
                    if (r3$3012 != null && r3$3012.length === 1) {
                        var r1$3013 = r2$3009[0];
                        var r2$3014 = r3$3012[0];
                        return Right$2671(r1$3013.concat(r2$3014));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$3004, b$3005);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2673(f$3015, acc$3016, xs$3017) {
        return function foldl$2673(f$3018, acc$3019, xs$3020) {
            return xs$3020.reduce(binary$2600(f$3018), acc$3019);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2675(f$3021, xs$3022) {
        return function foldl1$2675(f$3023, xs$3024) {
            return xs$3024.reduce(binary$2600(f$3023));
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2677(f$3025, acc$3026, xs$3027) {
        return function foldr$2677(f$3028, acc$3029, xs$3030) {
            return xs$3030.reduceRight(binary$2600(f$3028), acc$3029);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2679(f$3031, xs$3032) {
        return function foldr1$2679(f$3033, xs$3034) {
            return xs$3034.reduceRight(binary$2600(f$3033));
        }.curry().apply(null, arguments);
    }
    ;
    // filter :: (a -> Bool) -> [a] -> [a]
    function filter$2683(f$3035, xs$3036) {
        return function filter$2683(f$3037, xs$3038) {
            return xs$3038.filter(unary$2599(f$3037));
        }.curry().apply(null, arguments);
    }
    // head :: [a] -> Option a
    function head$2684(xs$3039) {
        return function head$2684(xs$3040) {
            return xs$3040.head();
        }.curry().apply(null, arguments);
    }
    // tail :: [a] -> [a]
    function tail$2685(xs$3041) {
        return function tail$2685(xs$3042) {
            return xs$3042.tail();
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2688(xs$3043) {
        return function flatten$2688(xs$3044) {
            return foldl1$2675(function (xs$3045, ys$3046) {
                return xs$3045.concat(ys$3046);
            }.curry(), xs$3044);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2517(Array, 'of', function (self$3047, x$3048) {
        return [x$3048];
    }.curry());
    extendNative$2517(Array.prototype, 'ap', function (self$3049, x$3050) {
        return this.chain(map$2605(__$2516, x$3050).bind(this));
    }.curry());
    extendNative$2517(Array.prototype, 'chain', function (self$3051, f$3052) {
        return function (x$3053) {
            return flatten$2688(map$2605(f$3052)(x$3053));
        }(this);
    }.curry());
    extendNative$2517(Array.prototype, 'head', function (self$3054) {
        return self$3054[0] ? Some$2664(self$3054[0]) : None$2665;
    }.curry());
    extendNative$2517(Array.prototype, 'tail', function (self$3055) {
        return self$3055.slice(1);
    }.curry());
    // ***************************************************************
    // **                       CurryJS.String                      **
    // ***************************************************************
    Object.defineProperty(String.prototype, 'reduce', {
        value: function (f$3056, acc$3057) {
            var xs$3058 = this.split('');
            return exists$2592(acc$3057) ? xs$3058.reduce(f$3056, acc$3057) : xs$3058.reduce(f$3056);
        }
    });
    extendNative$2517(String.prototype, 'filter', function (self$3059, f$3060) {
        return self$3059.split('').filter(f$3060).join('');
    }.curry());
    extendNative$2517(String.prototype, 'head', function (self$3061) {
        return self$3061.split('').head();
    }.curry());
    extendNative$2517(String.prototype, 'tail', function (self$3062) {
        return self$3062.split('').tail();
    }.curry());
    // ***************************************************************
    // **                   CurryJS.Data.Object                     **
    // ***************************************************************
    // merge :: Object -> Object -> Object
    var merge$2700 = function (a$3063, b$3064) {
        var newObj$3065 = {}, k$3066;
        for (k$3066 in b$3064) {
            if (b$3064.hasOwnProperty(k$3066))
                newObj$3065[k$3066] = b$3064[k$3066];
        }
        for (k$3066 in a$3063) {
            if (a$3063.hasOwnProperty(k$3066))
                newObj$3065[k$3066] = a$3063[k$3066];
        }
        return newObj$3065;
    };
    // set :: Object -> String -> a
    function set$2703(o$3067, k$3068, v$3069) {
        return function set$2703(o$3070, k$3071, v$3072) {
            return function () {
                var newObj$3074 = {};
                var foo$3076 = newObj$3074[k$3071] = v$3072;
                return merge$2700(o$3070, newObj$3074);
            }();
        }.curry().apply(null, arguments);
    }
    ;
    extendNative$2517(Object.prototype, 'map', function (self$3077, f$3078) {
        return foldl$2673(function (o$3079, k$3080) {
            return set$2703(o$3079, k$3080, f$3078(self$3077[k$3080]));
        }.curry(), {}, Object.keys(self$3077));
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
                filter: filter$2683,
                head: head$2684,
                tail: tail$2685,
                flatten: flatten$2688
            },
            Object: {
                merge: merge$2700,
                set: set$2703
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