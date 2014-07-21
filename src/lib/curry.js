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
    var extendNative$2517 = function (native$2691, prop$2692, f$2693) {
        return Object.defineProperty(native$2691, prop$2692, {
            value: function () {
                return f$2693.apply(this, [this].concat(__slice$2513.call(arguments)));
            }
        });
    };
    var withMeta$2518 = function (f$2694, meta$2695) {
        var keys$2696 = Object.keys(meta$2695);
        keys$2696.forEach(function (name$2697) {
            Object.defineProperty(f$2694, '__' + name$2697, { value: meta$2695[name$2697] });
        });
        return f$2694;
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
    var curry$2519 = function (f$2698, n$2699) {
        var arity$2700 = typeof n$2699 !== 'undefined' ? n$2699 : typeof f$2698.__arity !== 'undefined' ? f$2698.__arity : f$2698.length, name$2701 = f$2698.name || f$2698.__name;
        if (arity$2700 < 2)
            return f$2698;
        var curriedFn$2702 = withMeta$2518(function () {
                var args$2703 = [].slice.call(arguments, 0, arity$2700), realArity$2704 = args$2703.filter(function (x$2706) {
                        return x$2706 !== __$2516;
                    }).length, self$2705 = this;
                if (realArity$2704 >= arity$2700)
                    return f$2698.apply(self$2705, arguments);
                else {
                    var g$2707 = withMeta$2518(function () {
                            var partialArgs$2708 = [].slice.call(arguments), newArgs$2709 = [];
                            for (var i$2710 = 0; i$2710 < args$2703.length; i$2710++)
                                newArgs$2709[i$2710] = args$2703[i$2710] === __$2516 ? partialArgs$2708.length === 0 ? undefined : partialArgs$2708.shift() : args$2703[i$2710];
                            return curriedFn$2702.apply(self$2705, newArgs$2709.concat(partialArgs$2708));
                        }, {
                            name: name$2701,
                            arity: arity$2700 - realArity$2704,
                            curried: true
                        });
                    g$2707.toString = curriedFn$2702.toString.bind(curriedFn$2702);
                    return g$2707;
                }
            }, {
                name: name$2701,
                arity: arity$2700,
                curried: true
            });
        curriedFn$2702.toString = f$2698.toString.bind(f$2698);
        return curriedFn$2702;
    };
    extendNative$2517(Function.prototype, 'curry', function (self$2711, n$2712) {
        return curry$2519(self$2711, n$2712);
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
        var fns$2713 = __slice$2513.call(arguments), self$2714 = this;
        return fns$2713.reduce(function (f$2715, g$2716) {
            return function () {
                return f$2715.call(self$2714, g$2716.apply(self$2714, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2522 = function (name$2717, spec$2718) {
        return {
            name: name$2717,
            spec: spec$2718,
            instance: function (type$2719, impl$2720) {
                var name$2721 = this.name, spec$2722 = this.spec, constructor$2723 = spec$2722.constructor, proto$2724 = spec$2722.prototype, k$2725;
                Object.keys(constructor$2723 || {}).map(function (field$2726) {
                    if (constructor$2723[field$2726] === Protocol$2522.required && !impl$2720.hasOwnProperty(field$2726) && !type$2719.hasOwnProperty(field$2726))
                        throw Protocol$2522.required(name$2721, field$2726);
                    else if (!type$2719.hasOwnProperty(field$2726) && !impl$2720.hasOwnProperty(field$2726))
                        type$2719[field$2726] = function () {
                            return constructor$2723[field$2726].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2720.hasOwnProperty(field$2726))
                        type$2719[field$2726] = function () {
                            return impl$2720[field$2726].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
                Object.keys(proto$2724 || {}).map(function (field$2727) {
                    if (proto$2724[field$2727] === Protocol$2522.required && !impl$2720.hasOwnProperty(field$2727) && !type$2719.prototype.hasOwnProperty(field$2727))
                        throw Protocol$2522.required(name$2721, field$2727);
                    else if (!type$2719.prototype.hasOwnProperty(field$2727) && !impl$2720.hasOwnProperty(field$2727))
                        type$2719.prototype[field$2727] = function () {
                            return proto$2724[field$2727].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2720.hasOwnProperty(field$2727))
                        type$2719.prototype[field$2727] = function () {
                            return impl$2720[field$2727].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2522.required = function (name$2728, field$2729) {
        return new Error(name$2728 + ' expected required field: \'' + field$2729 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2525(protocol$2730, type$2731, impl$2732) {
        return function instance$2525(protocol$2733, type$2734, impl$2735) {
            return protocol$2733.instance(type$2734, impl$2735);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2579(x$2736) {
        return function not$2579(x$2737) {
            return !x$2737;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2580(xs$2738) {
        return function and$2580(xs$2739) {
            return xs$2739.every(function (x$2740) {
                return !!x$2740;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2581(xs$2741) {
        return function or$2581(xs$2742) {
            return xs$2742.some(function (x$2743) {
                return !!x$2743;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2582(x$2744) {
        return function isObject$2582(x$2745) {
            return function (a0$2746) {
                if (Object.prototype.toString.call(a0$2746) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2745);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2583(x$2747) {
        return function isArray$2583(x$2748) {
            return function (a0$2749) {
                if (Array.isArray ? Array.isArray(a0$2749) : Object.prototype.toString.call(a0$2749) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2748);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2584(x$2750) {
        return function isNumber$2584(x$2751) {
            return function (a0$2752) {
                if (typeof a0$2752 === 'number' || Object.prototype.toString.call(a0$2752) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2751);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2585(x$2753) {
        return function isRegExp$2585(x$2754) {
            return function (a0$2755) {
                if (Object.prototype.toString.call(a0$2755) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2754);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2586(x$2756) {
        return function isString$2586(x$2757) {
            return function (a0$2758) {
                if (typeof a0$2758 === 'string' || Object.prototype.toString.call(a0$2758) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2757);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2587(x$2759) {
        return function isNull$2587(x$2760) {
            return function (a0$2761) {
                if (a0$2761 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2760);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2588(x$2762) {
        return function isUndef$2588(x$2763) {
            return function (a0$2764) {
                if (a0$2764 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2763);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2589(x$2765) {
        return function exists$2589(x$2766) {
            return function (x$2767) {
                return not$2579(or$2581(x$2767));
            }([
                isNull$2587(x$2766),
                isUndef$2588(x$2766)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2590(a$2768, b$2769) {
        return function plus$2590(a$2770, b$2771) {
            return a$2770 + b$2771;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2591(a$2772, b$2773) {
        return function minus$2591(a$2774, b$2775) {
            return a$2774 - b$2775;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2592(a$2776, b$2777) {
        return function times$2592(a$2778, b$2779) {
            return a$2778 * b$2779;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2593(a$2780, b$2781) {
        return function div$2593(a$2782, b$2783) {
            return a$2782 / b$2783;
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                      CurryJS.Function                     **
    // ***************************************************************
    // unary :: Function -> (a -> b)
    function unary$2594(f$2784) {
        return function unary$2594(f$2785) {
            return function (x$2786) {
                return f$2785(x$2786);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // binary :: Function -> (a -> b -> c)
    function binary$2595(f$2787) {
        return function binary$2595(f$2788) {
            return function (x$2789, y$2790) {
                return f$2788(x$2789, y$2790);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // ternary :: Function -> (a -> b -> c -> d)
    function ternary$2596(f$2791) {
        return function ternary$2596(f$2792) {
            return function (x$2793, y$2794, z$2795) {
                return f$2792(x$2793, y$2794, z$2795);
            }.curry();
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2598 = Protocol$2522('Functor', { prototype: { map: Protocol$2522.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2600(f$2796, xs$2797) {
        return function map$2600(f$2798, xs$2799) {
            return xs$2799.map(unary$2594(f$2798));
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2602 = Protocol$2522('Applicative', { prototype: { ap: Protocol$2522.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2604(f$2800, xs$2801) {
        return function ap$2604(f$2802, xs$2803) {
            return f$2802.ap(xs$2803);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2606 = Protocol$2522('Monad', {
            constructor: {
                of: function (x$2805) {
                    return this.prototype.of(x$2805);
                }.curry()
            },
            prototype: {
                of: Protocol$2522.required,
                chain: Protocol$2522.required,
                map: function (self$2811, f$2812) {
                    return self$2811.chain(function (x$2813) {
                        return self$2811.of(f$2812(x$2813));
                    }.bind(this));
                }.curry(),
                ap: function (self$2814, x$2815) {
                    return self$2814.chain(map$2600(__$2516, x$2815).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2608(xs$2816, f$2817) {
        return function chain$2608(xs$2818, f$2819) {
            return xs$2818.chain(f$2819);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2610(f$2820, x$2821) {
        return function pure$2610(f$2822, x$2823) {
            return f$2822.of ? f$2822.of(x$2823) : f$2822.constructor.of(x$2823);
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Monoid                   **
        // ***************************************************************
        Monoid$2612 = Protocol$2522('Monoid', {
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
    function concat$2614(a$2826, b$2827) {
        return function concat$2614(a$2828, b$2829) {
            return a$2828.concat(b$2829);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2618 = function () {
            function Sum$2830(_0$2832) {
                if (!(this instanceof Sum$2830)) {
                    return new Sum$2830(_0$2832);
                }
                if (typeof _0$2832 === 'number' || Object.prototype.toString.call(_0$2832) === '[object Number]') {
                    this['0'] = _0$2832;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2830.prototype.length = 1;
            var derived$2831 = Base$2511.derive({
                    name: 'Sum',
                    constructor: Sum$2830,
                    prototype: Sum$2830.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2830,
                            prototype: Sum$2830.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2831.constructor;
        }();
    instance$2525(Monoid$2612, Sum$2618, {
        empty: function () {
            return Sum$2618(0);
        }.curry(),
        concat: function (a$2840, b$2841) {
            return function (a0$2842, a1$2843) {
                var r0$2844 = Sum$2618.unapply(a0$2842);
                if (r0$2844 != null && r0$2844.length === 1) {
                    var r1$2845 = Sum$2618.unapply(a1$2843);
                    if (r1$2845 != null && r1$2845.length === 1) {
                        var x$2846 = r0$2844[0];
                        var y$2847 = r1$2845[0];
                        return Sum$2618(x$2846 + y$2847);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2840, b$2841);
        }.curry()
    });
    function getSum$2627(x$2848) {
        return function getSum$2627(x$2849) {
            return function (a0$2850) {
                var r0$2851 = Sum$2618.unapply(a0$2850);
                if (r0$2851 != null && r0$2851.length === 1) {
                    var x$2852 = r0$2851[0];
                    return x$2852;
                }
                throw new TypeError('No match');
            }.call(this, x$2849);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2628 = function () {
            function Product$2853(_0$2855) {
                if (!(this instanceof Product$2853)) {
                    return new Product$2853(_0$2855);
                }
                if (typeof _0$2855 === 'number' || Object.prototype.toString.call(_0$2855) === '[object Number]') {
                    this['0'] = _0$2855;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2853.prototype.length = 1;
            var derived$2854 = Base$2511.derive({
                    name: 'Product',
                    constructor: Product$2853,
                    prototype: Product$2853.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2853,
                            prototype: Product$2853.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2854.constructor;
        }();
    instance$2525(Monoid$2612, Product$2628, {
        empty: function (self$2862) {
            return Product$2628(1);
        }.curry(),
        concat: function (a$2863, b$2864) {
            return function (a0$2865, a1$2866) {
                var r0$2867 = Product$2628.unapply(a0$2865);
                if (r0$2867 != null && r0$2867.length === 1) {
                    var r1$2868 = Product$2628.unapply(a1$2866);
                    if (r1$2868 != null && r1$2868.length === 1) {
                        var x$2869 = r0$2867[0];
                        var y$2870 = r1$2868[0];
                        return Product$2628(x$2869 * y$2870);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2863, b$2864);
        }.curry()
    });
    function getProduct$2637(x$2871) {
        return function getProduct$2637(x$2872) {
            return function (a0$2873) {
                var r0$2874 = Product$2628.unapply(a0$2873);
                if (r0$2874 != null && r0$2874.length === 1) {
                    var x$2875 = r0$2874[0];
                    return x$2875;
                }
                throw new TypeError('No match');
            }.call(this, x$2872);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2638 = function () {
            function Max$2876(_0$2878) {
                if (!(this instanceof Max$2876)) {
                    return new Max$2876(_0$2878);
                }
                if (typeof _0$2878 === 'number' || Object.prototype.toString.call(_0$2878) === '[object Number]') {
                    this['0'] = _0$2878;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2876.prototype.length = 1;
            var derived$2877 = Base$2511.derive({
                    name: 'Max',
                    constructor: Max$2876,
                    prototype: Max$2876.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2876,
                            prototype: Max$2876.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2877.constructor;
        }();
    instance$2525(Monoid$2612, Max$2638, {
        empty: function (self$2885) {
            return Max$2638(-Infinity);
        }.curry(),
        concat: function (a$2886, b$2887) {
            return function (a0$2888, a1$2889) {
                var r0$2890 = Max$2638.unapply(a0$2888);
                if (r0$2890 != null && r0$2890.length === 1) {
                    var r1$2891 = Max$2638.unapply(a1$2889);
                    if (r1$2891 != null && r1$2891.length === 1) {
                        var x$2892 = r0$2890[0];
                        var y$2893 = r1$2891[0];
                        return Max$2638(x$2892 > y$2893 ? x$2892 : y$2893);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2886, b$2887);
        }.curry()
    });
    function getMax$2647(x$2894) {
        return function getMax$2647(x$2895) {
            return function (a0$2896) {
                var r0$2897 = Max$2638.unapply(a0$2896);
                if (r0$2897 != null && r0$2897.length === 1) {
                    var x$2898 = r0$2897[0];
                    return x$2898;
                }
                throw new TypeError('No match');
            }.call(this, x$2895);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2648 = function () {
            function Min$2899(_0$2901) {
                if (!(this instanceof Min$2899)) {
                    return new Min$2899(_0$2901);
                }
                if (typeof _0$2901 === 'number' || Object.prototype.toString.call(_0$2901) === '[object Number]') {
                    this['0'] = _0$2901;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2899.prototype.length = 1;
            var derived$2900 = Base$2511.derive({
                    name: 'Min',
                    constructor: Min$2899,
                    prototype: Min$2899.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2899,
                            prototype: Min$2899.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2900.constructor;
        }();
    instance$2525(Monoid$2612, Min$2648, {
        empty: function (self$2908) {
            return Min$2648(Infinity);
        }.curry(),
        concat: function (a$2909, b$2910) {
            return function (a0$2911, a1$2912) {
                var r0$2913 = Min$2648.unapply(a0$2911);
                if (r0$2913 != null && r0$2913.length === 1) {
                    var r1$2914 = Min$2648.unapply(a1$2912);
                    if (r1$2914 != null && r1$2914.length === 1) {
                        var x$2915 = r0$2913[0];
                        var y$2916 = r1$2914[0];
                        return Min$2648(x$2915 < y$2916 ? x$2915 : y$2916);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2909, b$2910);
        }.curry()
    });
    function getMin$2657(x$2917) {
        return function getMin$2657(x$2918) {
            return function (a0$2919) {
                var r0$2920 = Min$2648.unapply(a0$2919);
                if (r0$2920 != null && r0$2920.length === 1) {
                    var x$2921 = r0$2920[0];
                    return x$2921;
                }
                throw new TypeError('No match');
            }.call(this, x$2918);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2658 = function () {
            function Option$2922() {
            }
            function Some$2923(val$2926) {
                if (!(this instanceof Some$2923)) {
                    return new Some$2923(val$2926);
                }
                this.val = val$2926;
            }
            Some$2923.prototype = new Option$2922();
            Some$2923.prototype.constructor = Some$2923;
            function None$2924() {
            }
            None$2924.prototype = new Option$2922();
            None$2924.prototype.constructor = None$2924;
            var derived$2925 = Base$2511.derive({
                    name: 'Option',
                    constructor: Option$2922,
                    prototype: Option$2922.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2923,
                            prototype: Some$2923.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2924,
                            prototype: None$2924.prototype
                        }
                    ]
                });
            Option$2922.Some = derived$2925.variants[0].constructor;
            Option$2922.None = new derived$2925.variants[1].constructor();
            return Option$2922;
        }();
    var Some$2659 = Option$2658.Some;
    var None$2660 = Option$2658.None;
    instance$2525(Monad$2606, Option$2658, {
        of: function (self$2933, x$2934) {
            return Some$2659(x$2934);
        }.curry(),
        chain: function (self$2935, f$2936) {
            return function (a0$2937, a1$2938) {
                var r0$2939 = Some$2659.unapply(a0$2937);
                if (r0$2939 != null && (r0$2939.length === 1 && (typeof a1$2938 === 'function' || Object.prototype.toString.call(a1$2938) === '[object Function]'))) {
                    var x$2940 = r0$2939[0];
                    return f$2936(x$2940);
                }
                if ((None$2660.hasInstance ? None$2660.hasInstance(a0$2937) : a0$2937 instanceof None$2660) && (typeof a1$2938 === 'function' || Object.prototype.toString.call(a1$2938) === '[object Function]')) {
                    return None$2660;
                }
                throw new TypeError('No match');
            }.call(this, self$2935, f$2936);
        }.curry()
    });
    instance$2525(Monoid$2612, Option$2658, {
        empty: function (self$2947) {
            return None$2660;
        }.curry(),
        concat: function (a$2948, b$2949) {
            return function (a0$2950, a1$2951) {
                if ((Option$2658.hasInstance ? Option$2658.hasInstance(a0$2950) : a0$2950 instanceof Option$2658) && (None$2660.hasInstance ? None$2660.hasInstance(a1$2951) : a1$2951 instanceof None$2660)) {
                    return a$2948;
                }
                if ((None$2660.hasInstance ? None$2660.hasInstance(a0$2950) : a0$2950 instanceof None$2660) && (Option$2658.hasInstance ? Option$2658.hasInstance(a1$2951) : a1$2951 instanceof Option$2658)) {
                    return b$2949;
                }
                var r0$2952 = Some$2659.unapply(a0$2950);
                if (r0$2952 != null && r0$2952.length === 1) {
                    var r1$2953 = Some$2659.unapply(a1$2951);
                    if (r1$2953 != null && r1$2953.length === 1) {
                        var v1$2954 = r0$2952[0];
                        var v2$2955 = r1$2953[0];
                        return Some$2659(v1$2954.concat(v2$2955));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2948, b$2949);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2664 = function () {
            function Either$2956() {
            }
            function Left$2957(l$2960) {
                if (!(this instanceof Left$2957)) {
                    return new Left$2957(l$2960);
                }
                this.l = l$2960;
            }
            Left$2957.prototype = new Either$2956();
            Left$2957.prototype.constructor = Left$2957;
            function Right$2958(r$2961) {
                if (!(this instanceof Right$2958)) {
                    return new Right$2958(r$2961);
                }
                this.r = r$2961;
            }
            Right$2958.prototype = new Either$2956();
            Right$2958.prototype.constructor = Right$2958;
            var derived$2959 = Base$2511.derive({
                    name: 'Either',
                    constructor: Either$2956,
                    prototype: Either$2956.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2957,
                            prototype: Left$2957.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2958,
                            prototype: Right$2958.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2956.Left = derived$2959.variants[0].constructor;
            Either$2956.Right = derived$2959.variants[1].constructor;
            return Either$2956;
        }();
    var Left$2665 = Either$2664.Left;
    var Right$2666 = Either$2664.Right;
    instance$2525(Monad$2606, Either$2664, {
        of: function (self$2968, x$2969) {
            return Right$2666(x$2969);
        }.curry(),
        chain: function (self$2970, f$2971) {
            return function (a0$2972, a1$2973) {
                var r0$2974 = Right$2666.unapply(a0$2972);
                if (r0$2974 != null && (r0$2974.length === 1 && (typeof a1$2973 === 'function' || Object.prototype.toString.call(a1$2973) === '[object Function]'))) {
                    var x$2976 = r0$2974[0];
                    return f$2971(x$2976);
                }
                var r1$2975 = Left$2665.unapply(a0$2972);
                if (r1$2975 != null && r1$2975.length === 1) {
                    var x$2976 = r1$2975[0];
                    return self$2970;
                }
                throw new TypeError('No match');
            }.call(this, self$2970, f$2971);
        }.curry()
    });
    instance$2525(Monoid$2612, Either$2664, {
        empty: function (self$2983) {
            return Left$2665();
        }.curry(),
        concat: function (a$2984, b$2985) {
            return function (a0$2986, a1$2987) {
                if (Either$2664.hasInstance ? Either$2664.hasInstance(a0$2986) : a0$2986 instanceof Either$2664) {
                    var r0$2990 = Left$2665.unapply(a1$2987);
                    if (r0$2990 != null && r0$2990.length === 1) {
                        var x$2991 = r0$2990[0];
                        return a$2984;
                    }
                }
                var r1$2988 = Left$2665.unapply(a0$2986);
                if (r1$2988 != null && (r1$2988.length === 1 && (Either$2664.hasInstance ? Either$2664.hasInstance(a1$2987) : a1$2987 instanceof Either$2664))) {
                    var x$2991 = r1$2988[0];
                    return b$2985;
                }
                var r2$2989 = Right$2666.unapply(a0$2986);
                if (r2$2989 != null && r2$2989.length === 1) {
                    var r3$2992 = Right$2666.unapply(a1$2987);
                    if (r3$2992 != null && r3$2992.length === 1) {
                        var r1$2993 = r2$2989[0];
                        var r2$2994 = r3$2992[0];
                        return Right$2666(r1$2993.concat(r2$2994));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2984, b$2985);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2668(f$2995, acc$2996, xs$2997) {
        return function foldl$2668(f$2998, acc$2999, xs$3000) {
            return xs$3000.reduce(binary$2595(f$2998), acc$2999);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2670(f$3001, xs$3002) {
        return function foldl1$2670(f$3003, xs$3004) {
            return xs$3004.reduce(binary$2595(f$3003));
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2672(f$3005, acc$3006, xs$3007) {
        return function foldr$2672(f$3008, acc$3009, xs$3010) {
            return xs$3010.reduceRight(binary$2595(f$3008), acc$3009);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2674(f$3011, xs$3012) {
        return function foldr1$2674(f$3013, xs$3014) {
            return xs$3014.reduceRight(binary$2595(f$3013));
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2677(xs$3015) {
        return function flatten$2677(xs$3016) {
            return foldl1$2670(function (xs$3017, ys$3018) {
                return xs$3017.concat(ys$3018);
            }.curry(), xs$3016);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2517(Array, 'of', function (self$3019, x$3020) {
        return [x$3020];
    }.curry());
    extendNative$2517(Array.prototype, 'ap', function (self$3021, x$3022) {
        return this.chain(map$2600(__$2516, x$3022).bind(this));
    }.curry());
    extendNative$2517(Array.prototype, 'chain', function (self$3023, f$3024) {
        return function (x$3025) {
            return flatten$2677(map$2600(f$3024)(x$3025));
        }(this);
    }.curry());
    console.log(map$2600(function (x$3026, y$3027) {
        return x$3026 * y$3027;
    }.curry(), [
        1,
        2,
        3
    ]));
    // ***************************************************************
    // **                   CurryJS.Data.Object                     **
    // ***************************************************************
    // merge :: Object -> Object -> Object
    var merge$2685 = function (a$3028, b$3029) {
        var newObj$3030 = {}, k$3031;
        for (k$3031 in b$3029) {
            if (b$3029.hasOwnProperty(k$3031))
                newObj$3030[k$3031] = b$3029[k$3031];
        }
        for (k$3031 in a$3028) {
            if (a$3028.hasOwnProperty(k$3031))
                newObj$3030[k$3031] = a$3028[k$3031];
        }
        return newObj$3030;
    };
    // set :: Object -> String -> a
    function set$2688(o$3032, k$3033, v$3034) {
        return function set$2688(o$3035, k$3036, v$3037) {
            return function () {
                var newObj$3039 = {};
                var foo$3041 = newObj$3039[k$3036] = v$3037;
                return merge$2685(o$3035, newObj$3039);
            }();
        }.curry().apply(null, arguments);
    }
    ;
    extendNative$2517(Object.prototype, 'map', function (self$3042, f$3043) {
        return foldl$2668(function (o$3044, k$3045) {
            return set$2688(o$3044, k$3045, f$3043(self$3042[k$3045]));
        }.curry(), {}, Object.keys(self$3042));
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
            not: not$2579,
            and: and$2580,
            or: or$2581,
            isObject: isObject$2582,
            isArray: isArray$2583,
            isNumber: isNumber$2584,
            isRegExp: isRegExp$2585,
            isString: isString$2586,
            isNull: isNull$2587,
            isUndef: isUndef$2588,
            exists: exists$2589
        },
        Math: {
            plus: plus$2590,
            minus: minus$2591,
            times: times$2592,
            div: div$2593
        },
        Function: {
            unary: unary$2594,
            binary: binary$2595,
            ternary: ternary$2596
        },
        Number: {
            Sum: {
                Sum: Sum$2618,
                getSum: getSum$2627
            },
            Product: {
                Product: Product$2628,
                getProduct: getProduct$2637
            },
            Max: {
                Max: Max$2638,
                getMax: getMax$2647
            },
            Min: {
                Min: Min$2648,
                getMin: getMin$2657
            }
        },
        Data: {
            Either: {
                Either: Either$2664,
                Left: Left$2665,
                Right: Right$2666
            },
            Option: {
                Option: Option$2658,
                Some: Some$2659,
                None: None$2660
            },
            Collection: {
                foldl: foldl$2668,
                foldl1: foldl1$2670,
                foldr: foldr$2672,
                foldr1: foldr1$2674,
                flatten: flatten$2677
            },
            Object: {
                merge: merge$2685,
                set: set$2688
            }
        },
        Control: {
            Functor: { map: map$2600 },
            Applicative: { ap: ap$2604 },
            Monad: {
                Monad: Monad$2606,
                chain: chain$2608
            },
            Monoid: {
                Monoid: Monoid$2612,
                concat: concat$2614
            }
        }
    };
}());
//# sourceMappingURL=curry.js.map