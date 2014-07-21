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
    var extendNative$2517 = function (native$2698, prop$2699, f$2700) {
        return Object.defineProperty(native$2698, prop$2699, {
            value: function () {
                return f$2700.apply(this, [this].concat(__slice$2513.call(arguments)));
            }
        });
    };
    var withMeta$2518 = function (f$2701, meta$2702) {
        var keys$2703 = Object.keys(meta$2702);
        keys$2703.forEach(function (name$2704) {
            Object.defineProperty(f$2701, '__' + name$2704, { value: meta$2702[name$2704] });
        });
        return f$2701;
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
    var curry$2519 = function (f$2705, n$2706) {
        var arity$2707 = typeof n$2706 !== 'undefined' ? n$2706 : typeof f$2705.__arity !== 'undefined' ? f$2705.__arity : f$2705.length, name$2708 = f$2705.name || f$2705.__name;
        if (arity$2707 < 2)
            return f$2705;
        var curriedFn$2709 = withMeta$2518(function () {
                var args$2710 = [].slice.call(arguments, 0, arity$2707), realArity$2711 = args$2710.filter(function (x$2713) {
                        return x$2713 !== __$2516;
                    }).length, self$2712 = this;
                if (realArity$2711 >= arity$2707)
                    return f$2705.apply(self$2712, arguments);
                else {
                    var g$2714 = withMeta$2518(function () {
                            var partialArgs$2715 = [].slice.call(arguments), newArgs$2716 = [];
                            for (var i$2717 = 0; i$2717 < args$2710.length; i$2717++)
                                newArgs$2716[i$2717] = args$2710[i$2717] === __$2516 ? partialArgs$2715.length === 0 ? undefined : partialArgs$2715.shift() : args$2710[i$2717];
                            return curriedFn$2709.apply(self$2712, newArgs$2716.concat(partialArgs$2715));
                        }, {
                            name: name$2708,
                            arity: arity$2707 - realArity$2711,
                            curried: true
                        });
                    g$2714.toString = curriedFn$2709.toString.bind(curriedFn$2709);
                    return g$2714;
                }
            }, {
                name: name$2708,
                arity: arity$2707,
                curried: true
            });
        curriedFn$2709.toString = f$2705.toString.bind(f$2705);
        return curriedFn$2709;
    };
    extendNative$2517(Function.prototype, 'curry', function (self$2718, n$2719) {
        return curry$2519(self$2718, n$2719);
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
        var fns$2720 = __slice$2513.call(arguments), self$2721 = this;
        return fns$2720.reduce(function (f$2722, g$2723) {
            return function () {
                return f$2722.call(self$2721, g$2723.apply(self$2721, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2522 = function (name$2724, spec$2725) {
        return {
            name: name$2724,
            spec: spec$2725,
            instance: function (type$2726, impl$2727) {
                var name$2728 = this.name, spec$2729 = this.spec, constructor$2730 = spec$2729.constructor, proto$2731 = spec$2729.prototype, k$2732;
                Object.keys(constructor$2730 || {}).map(function (field$2733) {
                    if (constructor$2730[field$2733] === Protocol$2522.required && !impl$2727.hasOwnProperty(field$2733) && !type$2726.hasOwnProperty(field$2733))
                        throw Protocol$2522.required(name$2728, field$2733);
                    else if (!type$2726.hasOwnProperty(field$2733) && !impl$2727.hasOwnProperty(field$2733))
                        type$2726[field$2733] = function () {
                            return constructor$2730[field$2733].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2727.hasOwnProperty(field$2733))
                        type$2726[field$2733] = function () {
                            return impl$2727[field$2733].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
                Object.keys(proto$2731 || {}).map(function (field$2734) {
                    if (proto$2731[field$2734] === Protocol$2522.required && !impl$2727.hasOwnProperty(field$2734) && !type$2726.prototype.hasOwnProperty(field$2734))
                        throw Protocol$2522.required(name$2728, field$2734);
                    else if (!type$2726.prototype.hasOwnProperty(field$2734) && !impl$2727.hasOwnProperty(field$2734))
                        type$2726.prototype[field$2734] = function () {
                            return proto$2731[field$2734].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2727.hasOwnProperty(field$2734))
                        type$2726.prototype[field$2734] = function () {
                            return impl$2727[field$2734].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2522.required = function (name$2735, field$2736) {
        return new Error(name$2735 + ' expected required field: \'' + field$2736 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2525(protocol$2737, type$2738, impl$2739) {
        return function instance$2525(protocol$2740, type$2741, impl$2742) {
            return protocol$2740.instance(type$2741, impl$2742);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2582(x$2743) {
        return function not$2582(x$2744) {
            return !x$2744;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2583(xs$2745) {
        return function and$2583(xs$2746) {
            return xs$2746.every(function (x$2747) {
                return !!x$2747;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2584(xs$2748) {
        return function or$2584(xs$2749) {
            return xs$2749.some(function (x$2750) {
                return !!x$2750;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2585(x$2751) {
        return function isObject$2585(x$2752) {
            return function (a0$2753) {
                if (Object.prototype.toString.call(a0$2753) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2752);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2586(x$2754) {
        return function isArray$2586(x$2755) {
            return function (a0$2756) {
                if (Array.isArray ? Array.isArray(a0$2756) : Object.prototype.toString.call(a0$2756) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2755);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2587(x$2757) {
        return function isNumber$2587(x$2758) {
            return function (a0$2759) {
                if (typeof a0$2759 === 'number' || Object.prototype.toString.call(a0$2759) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2758);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2588(x$2760) {
        return function isRegExp$2588(x$2761) {
            return function (a0$2762) {
                if (Object.prototype.toString.call(a0$2762) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2761);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2589(x$2763) {
        return function isString$2589(x$2764) {
            return function (a0$2765) {
                if (typeof a0$2765 === 'string' || Object.prototype.toString.call(a0$2765) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2764);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2590(x$2766) {
        return function isNull$2590(x$2767) {
            return function (a0$2768) {
                if (a0$2768 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2767);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2591(x$2769) {
        return function isUndef$2591(x$2770) {
            return function (a0$2771) {
                if (a0$2771 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2770);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2592(x$2772) {
        return function exists$2592(x$2773) {
            return function (x$2774) {
                return not$2582(or$2584(x$2774));
            }([
                isNull$2590(x$2773),
                isUndef$2591(x$2773)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2593(a$2775, b$2776) {
        return function plus$2593(a$2777, b$2778) {
            return a$2777 + b$2778;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2594(a$2779, b$2780) {
        return function minus$2594(a$2781, b$2782) {
            return a$2781 - b$2782;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2595(a$2783, b$2784) {
        return function times$2595(a$2785, b$2786) {
            return a$2785 * b$2786;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2596(a$2787, b$2788) {
        return function div$2596(a$2789, b$2790) {
            return a$2789 / b$2790;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                      CurryJS.Function                     **
    // ***************************************************************
    // id :: a -> a
    function id$2597(x$2791) {
        return function id$2597(x$2792) {
            return x$2792;
        }.curry().apply(null, arguments);
    }
    // constant :: a -> b -> a
    function constant$2598(x$2793) {
        return function constant$2598(x$2794) {
            return function (_$2795) {
                return x$2794;
            }.curry();
        }.curry().apply(null, arguments);
    }
    // unary :: Function -> (a -> b)
    function unary$2599(f$2796) {
        return function unary$2599(f$2797) {
            return function (x$2798) {
                return f$2797(x$2798);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // binary :: Function -> (a -> b -> c)
    function binary$2600(f$2799) {
        return function binary$2600(f$2800) {
            return function (x$2801, y$2802) {
                return f$2800(x$2801, y$2802);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // ternary :: Function -> (a -> b -> c -> d)
    function ternary$2601(f$2803) {
        return function ternary$2601(f$2804) {
            return function (x$2805, y$2806, z$2807) {
                return f$2804(x$2805, y$2806, z$2807);
            }.curry();
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2603 = Protocol$2522('Functor', { prototype: { map: Protocol$2522.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2605(f$2808, xs$2809) {
        return function map$2605(f$2810, xs$2811) {
            return xs$2811.map(unary$2599(f$2810));
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2607 = Protocol$2522('Applicative', { prototype: { ap: Protocol$2522.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2609(f$2812, xs$2813) {
        return function ap$2609(f$2814, xs$2815) {
            return f$2814.ap(xs$2815);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2611 = Protocol$2522('Monad', {
            constructor: {
                of: function (x$2817) {
                    return this.prototype.of(x$2817);
                }.curry()
            },
            prototype: {
                of: Protocol$2522.required,
                chain: Protocol$2522.required,
                map: function (self$2823, f$2824) {
                    return self$2823.chain(function (x$2825) {
                        return self$2823.of(f$2824(x$2825));
                    }.bind(this));
                }.curry(),
                ap: function (self$2826, x$2827) {
                    return self$2826.chain(map$2605(__$2516, x$2827).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2613(xs$2828, f$2829) {
        return function chain$2613(xs$2830, f$2831) {
            return xs$2830.chain(f$2831);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2615(f$2832, x$2833) {
        return function pure$2615(f$2834, x$2835) {
            return f$2834.of ? f$2834.of(x$2835) : f$2834.constructor.of(x$2835);
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
    function concat$2619(a$2838, b$2839) {
        return function concat$2619(a$2840, b$2841) {
            return a$2840.concat(b$2841);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2623 = function () {
            function Sum$2842(_0$2844) {
                if (!(this instanceof Sum$2842)) {
                    return new Sum$2842(_0$2844);
                }
                if (typeof _0$2844 === 'number' || Object.prototype.toString.call(_0$2844) === '[object Number]') {
                    this['0'] = _0$2844;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2842.prototype.length = 1;
            var derived$2843 = Base$2511.derive({
                    name: 'Sum',
                    constructor: Sum$2842,
                    prototype: Sum$2842.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2842,
                            prototype: Sum$2842.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2843.constructor;
        }();
    instance$2525(Monoid$2617, Sum$2623, {
        empty: function () {
            return Sum$2623(0);
        }.curry(),
        concat: function (a$2852, b$2853) {
            return function (a0$2854, a1$2855) {
                var r0$2856 = Sum$2623.unapply(a0$2854);
                if (r0$2856 != null && r0$2856.length === 1) {
                    var r1$2857 = Sum$2623.unapply(a1$2855);
                    if (r1$2857 != null && r1$2857.length === 1) {
                        var x$2858 = r0$2856[0];
                        var y$2859 = r1$2857[0];
                        return Sum$2623(x$2858 + y$2859);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2852, b$2853);
        }.curry()
    });
    function getSum$2632(x$2860) {
        return function getSum$2632(x$2861) {
            return function (a0$2862) {
                var r0$2863 = Sum$2623.unapply(a0$2862);
                if (r0$2863 != null && r0$2863.length === 1) {
                    var x$2864 = r0$2863[0];
                    return x$2864;
                }
                throw new TypeError('No match');
            }.call(this, x$2861);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2633 = function () {
            function Product$2865(_0$2867) {
                if (!(this instanceof Product$2865)) {
                    return new Product$2865(_0$2867);
                }
                if (typeof _0$2867 === 'number' || Object.prototype.toString.call(_0$2867) === '[object Number]') {
                    this['0'] = _0$2867;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2865.prototype.length = 1;
            var derived$2866 = Base$2511.derive({
                    name: 'Product',
                    constructor: Product$2865,
                    prototype: Product$2865.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2865,
                            prototype: Product$2865.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2866.constructor;
        }();
    instance$2525(Monoid$2617, Product$2633, {
        empty: function (self$2874) {
            return Product$2633(1);
        }.curry(),
        concat: function (a$2875, b$2876) {
            return function (a0$2877, a1$2878) {
                var r0$2879 = Product$2633.unapply(a0$2877);
                if (r0$2879 != null && r0$2879.length === 1) {
                    var r1$2880 = Product$2633.unapply(a1$2878);
                    if (r1$2880 != null && r1$2880.length === 1) {
                        var x$2881 = r0$2879[0];
                        var y$2882 = r1$2880[0];
                        return Product$2633(x$2881 * y$2882);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2875, b$2876);
        }.curry()
    });
    function getProduct$2642(x$2883) {
        return function getProduct$2642(x$2884) {
            return function (a0$2885) {
                var r0$2886 = Product$2633.unapply(a0$2885);
                if (r0$2886 != null && r0$2886.length === 1) {
                    var x$2887 = r0$2886[0];
                    return x$2887;
                }
                throw new TypeError('No match');
            }.call(this, x$2884);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2643 = function () {
            function Max$2888(_0$2890) {
                if (!(this instanceof Max$2888)) {
                    return new Max$2888(_0$2890);
                }
                if (typeof _0$2890 === 'number' || Object.prototype.toString.call(_0$2890) === '[object Number]') {
                    this['0'] = _0$2890;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2888.prototype.length = 1;
            var derived$2889 = Base$2511.derive({
                    name: 'Max',
                    constructor: Max$2888,
                    prototype: Max$2888.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2888,
                            prototype: Max$2888.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2889.constructor;
        }();
    instance$2525(Monoid$2617, Max$2643, {
        empty: function (self$2897) {
            return Max$2643(-Infinity);
        }.curry(),
        concat: function (a$2898, b$2899) {
            return function (a0$2900, a1$2901) {
                var r0$2902 = Max$2643.unapply(a0$2900);
                if (r0$2902 != null && r0$2902.length === 1) {
                    var r1$2903 = Max$2643.unapply(a1$2901);
                    if (r1$2903 != null && r1$2903.length === 1) {
                        var x$2904 = r0$2902[0];
                        var y$2905 = r1$2903[0];
                        return Max$2643(x$2904 > y$2905 ? x$2904 : y$2905);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2898, b$2899);
        }.curry()
    });
    function getMax$2652(x$2906) {
        return function getMax$2652(x$2907) {
            return function (a0$2908) {
                var r0$2909 = Max$2643.unapply(a0$2908);
                if (r0$2909 != null && r0$2909.length === 1) {
                    var x$2910 = r0$2909[0];
                    return x$2910;
                }
                throw new TypeError('No match');
            }.call(this, x$2907);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2653 = function () {
            function Min$2911(_0$2913) {
                if (!(this instanceof Min$2911)) {
                    return new Min$2911(_0$2913);
                }
                if (typeof _0$2913 === 'number' || Object.prototype.toString.call(_0$2913) === '[object Number]') {
                    this['0'] = _0$2913;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2911.prototype.length = 1;
            var derived$2912 = Base$2511.derive({
                    name: 'Min',
                    constructor: Min$2911,
                    prototype: Min$2911.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2911,
                            prototype: Min$2911.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2912.constructor;
        }();
    instance$2525(Monoid$2617, Min$2653, {
        empty: function (self$2920) {
            return Min$2653(Infinity);
        }.curry(),
        concat: function (a$2921, b$2922) {
            return function (a0$2923, a1$2924) {
                var r0$2925 = Min$2653.unapply(a0$2923);
                if (r0$2925 != null && r0$2925.length === 1) {
                    var r1$2926 = Min$2653.unapply(a1$2924);
                    if (r1$2926 != null && r1$2926.length === 1) {
                        var x$2927 = r0$2925[0];
                        var y$2928 = r1$2926[0];
                        return Min$2653(x$2927 < y$2928 ? x$2927 : y$2928);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2921, b$2922);
        }.curry()
    });
    function getMin$2662(x$2929) {
        return function getMin$2662(x$2930) {
            return function (a0$2931) {
                var r0$2932 = Min$2653.unapply(a0$2931);
                if (r0$2932 != null && r0$2932.length === 1) {
                    var x$2933 = r0$2932[0];
                    return x$2933;
                }
                throw new TypeError('No match');
            }.call(this, x$2930);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2663 = function () {
            function Option$2934() {
            }
            function Some$2935(val$2938) {
                if (!(this instanceof Some$2935)) {
                    return new Some$2935(val$2938);
                }
                this.val = val$2938;
            }
            Some$2935.prototype = new Option$2934();
            Some$2935.prototype.constructor = Some$2935;
            function None$2936() {
            }
            None$2936.prototype = new Option$2934();
            None$2936.prototype.constructor = None$2936;
            var derived$2937 = Base$2511.derive({
                    name: 'Option',
                    constructor: Option$2934,
                    prototype: Option$2934.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2935,
                            prototype: Some$2935.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2936,
                            prototype: None$2936.prototype
                        }
                    ]
                });
            Option$2934.Some = derived$2937.variants[0].constructor;
            Option$2934.None = new derived$2937.variants[1].constructor();
            return Option$2934;
        }();
    var Some$2664 = Option$2663.Some;
    var None$2665 = Option$2663.None;
    instance$2525(Monad$2611, Option$2663, {
        of: function (self$2945, x$2946) {
            return Some$2664(x$2946);
        }.curry(),
        chain: function (self$2947, f$2948) {
            return function (a0$2949, a1$2950) {
                var r0$2951 = Some$2664.unapply(a0$2949);
                if (r0$2951 != null && (r0$2951.length === 1 && (typeof a1$2950 === 'function' || Object.prototype.toString.call(a1$2950) === '[object Function]'))) {
                    var x$2952 = r0$2951[0];
                    return f$2948(x$2952);
                }
                if ((None$2665.hasInstance ? None$2665.hasInstance(a0$2949) : a0$2949 instanceof None$2665) && (typeof a1$2950 === 'function' || Object.prototype.toString.call(a1$2950) === '[object Function]')) {
                    return None$2665;
                }
                throw new TypeError('No match');
            }.call(this, self$2947, f$2948);
        }.curry()
    });
    instance$2525(Monoid$2617, Option$2663, {
        empty: function (self$2959) {
            return None$2665;
        }.curry(),
        concat: function (a$2960, b$2961) {
            return function (a0$2962, a1$2963) {
                if ((Option$2663.hasInstance ? Option$2663.hasInstance(a0$2962) : a0$2962 instanceof Option$2663) && (None$2665.hasInstance ? None$2665.hasInstance(a1$2963) : a1$2963 instanceof None$2665)) {
                    return a$2960;
                }
                if ((None$2665.hasInstance ? None$2665.hasInstance(a0$2962) : a0$2962 instanceof None$2665) && (Option$2663.hasInstance ? Option$2663.hasInstance(a1$2963) : a1$2963 instanceof Option$2663)) {
                    return b$2961;
                }
                var r0$2964 = Some$2664.unapply(a0$2962);
                if (r0$2964 != null && r0$2964.length === 1) {
                    var r1$2965 = Some$2664.unapply(a1$2963);
                    if (r1$2965 != null && r1$2965.length === 1) {
                        var v1$2966 = r0$2964[0];
                        var v2$2967 = r1$2965[0];
                        return Some$2664(v1$2966.concat(v2$2967));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2960, b$2961);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2669 = function () {
            function Either$2968() {
            }
            function Left$2969(l$2972) {
                if (!(this instanceof Left$2969)) {
                    return new Left$2969(l$2972);
                }
                this.l = l$2972;
            }
            Left$2969.prototype = new Either$2968();
            Left$2969.prototype.constructor = Left$2969;
            function Right$2970(r$2973) {
                if (!(this instanceof Right$2970)) {
                    return new Right$2970(r$2973);
                }
                this.r = r$2973;
            }
            Right$2970.prototype = new Either$2968();
            Right$2970.prototype.constructor = Right$2970;
            var derived$2971 = Base$2511.derive({
                    name: 'Either',
                    constructor: Either$2968,
                    prototype: Either$2968.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2969,
                            prototype: Left$2969.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2970,
                            prototype: Right$2970.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2968.Left = derived$2971.variants[0].constructor;
            Either$2968.Right = derived$2971.variants[1].constructor;
            return Either$2968;
        }();
    var Left$2670 = Either$2669.Left;
    var Right$2671 = Either$2669.Right;
    instance$2525(Monad$2611, Either$2669, {
        of: function (self$2980, x$2981) {
            return Right$2671(x$2981);
        }.curry(),
        chain: function (self$2982, f$2983) {
            return function (a0$2984, a1$2985) {
                var r0$2986 = Right$2671.unapply(a0$2984);
                if (r0$2986 != null && (r0$2986.length === 1 && (typeof a1$2985 === 'function' || Object.prototype.toString.call(a1$2985) === '[object Function]'))) {
                    var x$2988 = r0$2986[0];
                    return f$2983(x$2988);
                }
                var r1$2987 = Left$2670.unapply(a0$2984);
                if (r1$2987 != null && r1$2987.length === 1) {
                    var x$2988 = r1$2987[0];
                    return self$2982;
                }
                throw new TypeError('No match');
            }.call(this, self$2982, f$2983);
        }.curry()
    });
    instance$2525(Monoid$2617, Either$2669, {
        empty: function (self$2995) {
            return Left$2670();
        }.curry(),
        concat: function (a$2996, b$2997) {
            return function (a0$2998, a1$2999) {
                if (Either$2669.hasInstance ? Either$2669.hasInstance(a0$2998) : a0$2998 instanceof Either$2669) {
                    var r0$3002 = Left$2670.unapply(a1$2999);
                    if (r0$3002 != null && r0$3002.length === 1) {
                        var x$3003 = r0$3002[0];
                        return a$2996;
                    }
                }
                var r1$3000 = Left$2670.unapply(a0$2998);
                if (r1$3000 != null && (r1$3000.length === 1 && (Either$2669.hasInstance ? Either$2669.hasInstance(a1$2999) : a1$2999 instanceof Either$2669))) {
                    var x$3003 = r1$3000[0];
                    return b$2997;
                }
                var r2$3001 = Right$2671.unapply(a0$2998);
                if (r2$3001 != null && r2$3001.length === 1) {
                    var r3$3004 = Right$2671.unapply(a1$2999);
                    if (r3$3004 != null && r3$3004.length === 1) {
                        var r1$3005 = r2$3001[0];
                        var r2$3006 = r3$3004[0];
                        return Right$2671(r1$3005.concat(r2$3006));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2996, b$2997);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2673(f$3007, acc$3008, xs$3009) {
        return function foldl$2673(f$3010, acc$3011, xs$3012) {
            return xs$3012.reduce(binary$2600(f$3010), acc$3011);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2675(f$3013, xs$3014) {
        return function foldl1$2675(f$3015, xs$3016) {
            return xs$3016.reduce(binary$2600(f$3015));
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2677(f$3017, acc$3018, xs$3019) {
        return function foldr$2677(f$3020, acc$3021, xs$3022) {
            return xs$3022.reduceRight(binary$2600(f$3020), acc$3021);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2679(f$3023, xs$3024) {
        return function foldr1$2679(f$3025, xs$3026) {
            return xs$3026.reduceRight(binary$2600(f$3025));
        }.curry().apply(null, arguments);
    }
    ;
    // filter :: (a -> Bool) -> [a] -> [a]
    function filter$2683(f$3027, xs$3028) {
        return function filter$2683(f$3029, xs$3030) {
            return xs$3030.filter(unary$2599(f$3029));
        }.curry().apply(null, arguments);
    }
    // flatten :: Monoid a => [a] -> a
    function flatten$2684(xs$3031) {
        return function flatten$2684(xs$3032) {
            return foldl1$2675(function (xs$3033, ys$3034) {
                return xs$3033.concat(ys$3034);
            }.curry(), xs$3032);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2517(Array, 'of', function (self$3035, x$3036) {
        return [x$3036];
    }.curry());
    extendNative$2517(Array.prototype, 'ap', function (self$3037, x$3038) {
        return this.chain(map$2605(__$2516, x$3038).bind(this));
    }.curry());
    extendNative$2517(Array.prototype, 'chain', function (self$3039, f$3040) {
        return function (x$3041) {
            return flatten$2684(map$2605(f$3040)(x$3041));
        }(this);
    }.curry());
    console.log(map$2605(function (x$3042, y$3043) {
        return x$3042 * y$3043;
    }.curry(), [
        1,
        2,
        3
    ]));
    // ***************************************************************
    // **                   CurryJS.Data.Object                     **
    // ***************************************************************
    // merge :: Object -> Object -> Object
    var merge$2692 = function (a$3044, b$3045) {
        var newObj$3046 = {}, k$3047;
        for (k$3047 in b$3045) {
            if (b$3045.hasOwnProperty(k$3047))
                newObj$3046[k$3047] = b$3045[k$3047];
        }
        for (k$3047 in a$3044) {
            if (a$3044.hasOwnProperty(k$3047))
                newObj$3046[k$3047] = a$3044[k$3047];
        }
        return newObj$3046;
    };
    // set :: Object -> String -> a
    function set$2695(o$3048, k$3049, v$3050) {
        return function set$2695(o$3051, k$3052, v$3053) {
            return function () {
                var newObj$3055 = {};
                var foo$3057 = newObj$3055[k$3052] = v$3053;
                return merge$2692(o$3051, newObj$3055);
            }();
        }.curry().apply(null, arguments);
    }
    ;
    extendNative$2517(Object.prototype, 'map', function (self$3058, f$3059) {
        return foldl$2673(function (o$3060, k$3061) {
            return set$2695(o$3060, k$3061, f$3059(self$3058[k$3061]));
        }.curry(), {}, Object.keys(self$3058));
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
                flatten: flatten$2684
            },
            Object: {
                merge: merge$2692,
                set: set$2695
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