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
    var extendNative$2517 = function (native$2679, prop$2680, f$2681) {
        return Object.defineProperty(native$2679, prop$2680, {
            value: function () {
                return f$2681.apply(this, [this].concat(__slice$2513.call(arguments)));
            }
        });
    };
    var withMeta$2518 = function (f$2682, meta$2683) {
        var keys$2684 = Object.keys(meta$2683);
        keys$2684.forEach(function (name$2685) {
            Object.defineProperty(f$2682, '__' + name$2685, { value: meta$2683[name$2685] });
        });
        return f$2682;
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
    var curry$2519 = function (f$2686, n$2687) {
        var arity$2688 = typeof n$2687 !== 'undefined' ? n$2687 : typeof f$2686.__arity !== 'undefined' ? f$2686.__arity : f$2686.length, name$2689 = f$2686.name || f$2686.__name;
        if (arity$2688 < 2)
            return f$2686;
        var curriedFn$2690 = withMeta$2518(function () {
                var args$2691 = [].slice.call(arguments, 0, arity$2688), realArity$2692 = args$2691.filter(function (x$2694) {
                        return x$2694 !== __$2516;
                    }).length, self$2693 = this;
                if (realArity$2692 >= arity$2688)
                    return f$2686.apply(self$2693, arguments);
                else {
                    var g$2695 = withMeta$2518(function () {
                            var partialArgs$2696 = [].slice.call(arguments), newArgs$2697 = [];
                            for (var i$2698 = 0; i$2698 < args$2691.length; i$2698++)
                                newArgs$2697[i$2698] = args$2691[i$2698] === __$2516 ? partialArgs$2696.length === 0 ? undefined : partialArgs$2696.shift() : args$2691[i$2698];
                            return curriedFn$2690.apply(self$2693, newArgs$2697.concat(partialArgs$2696));
                        }, {
                            name: name$2689,
                            arity: arity$2688 - realArity$2692,
                            curried: true
                        });
                    g$2695.toString = curriedFn$2690.toString.bind(curriedFn$2690);
                    return g$2695;
                }
            }, {
                name: name$2689,
                arity: arity$2688,
                curried: true
            });
        curriedFn$2690.toString = f$2686.toString.bind(f$2686);
        return curriedFn$2690;
    };
    extendNative$2517(Function.prototype, 'curry', function (self$2699, n$2700) {
        return curry$2519(self$2699, n$2700);
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
        var fns$2701 = __slice$2513.call(arguments), self$2702 = this;
        return fns$2701.reduce(function (f$2703, g$2704) {
            return function () {
                return f$2703.call(self$2702, g$2704.apply(self$2702, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2522 = function (name$2705, spec$2706) {
        return {
            name: name$2705,
            spec: spec$2706,
            instance: function (type$2707, impl$2708) {
                var name$2709 = this.name, spec$2710 = this.spec, constructor$2711 = spec$2710.constructor, proto$2712 = spec$2710.prototype, k$2713;
                Object.keys(constructor$2711 || {}).map(function (field$2714) {
                    if (constructor$2711[field$2714] === Protocol$2522.required && !impl$2708.hasOwnProperty(field$2714) && !type$2707.hasOwnProperty(field$2714))
                        throw Protocol$2522.required(name$2709, field$2714);
                    else if (!type$2707.hasOwnProperty(field$2714) && !impl$2708.hasOwnProperty(field$2714))
                        type$2707[field$2714] = function () {
                            return constructor$2711[field$2714].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2708.hasOwnProperty(field$2714))
                        type$2707[field$2714] = function () {
                            return impl$2708[field$2714].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
                Object.keys(proto$2712 || {}).map(function (field$2715) {
                    if (proto$2712[field$2715] === Protocol$2522.required && !impl$2708.hasOwnProperty(field$2715) && !type$2707.prototype.hasOwnProperty(field$2715))
                        throw Protocol$2522.required(name$2709, field$2715);
                    else if (!type$2707.prototype.hasOwnProperty(field$2715) && !impl$2708.hasOwnProperty(field$2715))
                        type$2707.prototype[field$2715] = function () {
                            return proto$2712[field$2715].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                    else if (impl$2708.hasOwnProperty(field$2715))
                        type$2707.prototype[field$2715] = function () {
                            return impl$2708[field$2715].curry().apply(this, [this].concat(__slice$2513.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2522.required = function (name$2716, field$2717) {
        return new Error(name$2716 + ' expected required field: \'' + field$2717 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2525(protocol$2718, type$2719, impl$2720) {
        return function instance$2525(protocol$2721, type$2722, impl$2723) {
            return protocol$2721.instance(type$2722, impl$2723);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2573(x$2724) {
        return function not$2573(x$2725) {
            return !x$2725;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2574(xs$2726) {
        return function and$2574(xs$2727) {
            return xs$2727.every(function (x$2728) {
                return !!x$2728;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2575(xs$2729) {
        return function or$2575(xs$2730) {
            return xs$2730.some(function (x$2731) {
                return !!x$2731;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2576(x$2732) {
        return function isObject$2576(x$2733) {
            return function (a0$2734) {
                if (Object.prototype.toString.call(a0$2734) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2733);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2577(x$2735) {
        return function isArray$2577(x$2736) {
            return function (a0$2737) {
                if (Array.isArray ? Array.isArray(a0$2737) : Object.prototype.toString.call(a0$2737) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2736);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2578(x$2738) {
        return function isNumber$2578(x$2739) {
            return function (a0$2740) {
                if (typeof a0$2740 === 'number' || Object.prototype.toString.call(a0$2740) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2739);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2579(x$2741) {
        return function isRegExp$2579(x$2742) {
            return function (a0$2743) {
                if (Object.prototype.toString.call(a0$2743) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2742);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2580(x$2744) {
        return function isString$2580(x$2745) {
            return function (a0$2746) {
                if (typeof a0$2746 === 'string' || Object.prototype.toString.call(a0$2746) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2745);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2581(x$2747) {
        return function isNull$2581(x$2748) {
            return function (a0$2749) {
                if (a0$2749 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2748);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2582(x$2750) {
        return function isUndef$2582(x$2751) {
            return function (a0$2752) {
                if (a0$2752 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2751);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2583(x$2753) {
        return function exists$2583(x$2754) {
            return function (x$2755) {
                return not$2573(or$2575(x$2755));
            }([
                isNull$2581(x$2754),
                isUndef$2582(x$2754)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2584(a$2756, b$2757) {
        return function plus$2584(a$2758, b$2759) {
            return a$2758 + b$2759;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2585(a$2760, b$2761) {
        return function minus$2585(a$2762, b$2763) {
            return a$2762 - b$2763;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2586(a$2764, b$2765) {
        return function times$2586(a$2766, b$2767) {
            return a$2766 * b$2767;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2587(a$2768, b$2769) {
        return function div$2587(a$2770, b$2771) {
            return a$2770 / b$2771;
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2589 = Protocol$2522('Functor', { prototype: { map: Protocol$2522.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2591(f$2772, xs$2773) {
        return function map$2591(f$2774, xs$2775) {
            return xs$2775.map(f$2774);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2593 = Protocol$2522('Applicative', { prototype: { ap: Protocol$2522.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2595(f$2776, xs$2777) {
        return function ap$2595(f$2778, xs$2779) {
            return f$2778.ap(xs$2779);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2597 = Protocol$2522('Monad', {
            constructor: {
                of: function (x$2781) {
                    return this.prototype.of(x$2781);
                }.curry()
            },
            prototype: {
                of: Protocol$2522.required,
                chain: Protocol$2522.required,
                map: function (self$2787, f$2788) {
                    return self$2787.chain(function (x$2789) {
                        return self$2787.of(f$2788(x$2789));
                    }.bind(this));
                }.curry(),
                ap: function (self$2790, x$2791) {
                    return self$2790.chain(map$2591(__$2516, x$2791).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2599(xs$2792, f$2793) {
        return function chain$2599(xs$2794, f$2795) {
            return xs$2794.chain(f$2795);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2601(f$2796, x$2797) {
        return function pure$2601(f$2798, x$2799) {
            return f$2798.of ? f$2798.of(x$2799) : f$2798.constructor.of(x$2799);
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Monoid                   **
        // ***************************************************************
        Monoid$2603 = Protocol$2522('Monoid', {
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
    function concat$2605(a$2802, b$2803) {
        return function concat$2605(a$2804, b$2805) {
            return a$2804.concat(b$2805);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2609 = function () {
            function Sum$2806(_0$2808) {
                if (!(this instanceof Sum$2806)) {
                    return new Sum$2806(_0$2808);
                }
                if (typeof _0$2808 === 'number' || Object.prototype.toString.call(_0$2808) === '[object Number]') {
                    this['0'] = _0$2808;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2806.prototype.length = 1;
            var derived$2807 = Base$2511.derive({
                    name: 'Sum',
                    constructor: Sum$2806,
                    prototype: Sum$2806.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2806,
                            prototype: Sum$2806.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2807.constructor;
        }();
    instance$2525(Monoid$2603, Sum$2609, {
        empty: function () {
            return Sum$2609(0);
        }.curry(),
        concat: function (a$2816, b$2817) {
            return function (a0$2818, a1$2819) {
                var r0$2820 = Sum$2609.unapply(a0$2818);
                if (r0$2820 != null && r0$2820.length === 1) {
                    var r1$2821 = Sum$2609.unapply(a1$2819);
                    if (r1$2821 != null && r1$2821.length === 1) {
                        var x$2822 = r0$2820[0];
                        var y$2823 = r1$2821[0];
                        return Sum$2609(x$2822 + y$2823);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2816, b$2817);
        }.curry()
    });
    function getSum$2618(x$2824) {
        return function getSum$2618(x$2825) {
            return function (a0$2826) {
                var r0$2827 = Sum$2609.unapply(a0$2826);
                if (r0$2827 != null && r0$2827.length === 1) {
                    var x$2828 = r0$2827[0];
                    return x$2828;
                }
                throw new TypeError('No match');
            }.call(this, x$2825);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2619 = function () {
            function Product$2829(_0$2831) {
                if (!(this instanceof Product$2829)) {
                    return new Product$2829(_0$2831);
                }
                if (typeof _0$2831 === 'number' || Object.prototype.toString.call(_0$2831) === '[object Number]') {
                    this['0'] = _0$2831;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2829.prototype.length = 1;
            var derived$2830 = Base$2511.derive({
                    name: 'Product',
                    constructor: Product$2829,
                    prototype: Product$2829.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2829,
                            prototype: Product$2829.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2830.constructor;
        }();
    instance$2525(Monoid$2603, Product$2619, {
        empty: function (self$2838) {
            return Product$2619(1);
        }.curry(),
        concat: function (a$2839, b$2840) {
            return function (a0$2841, a1$2842) {
                var r0$2843 = Product$2619.unapply(a0$2841);
                if (r0$2843 != null && r0$2843.length === 1) {
                    var r1$2844 = Product$2619.unapply(a1$2842);
                    if (r1$2844 != null && r1$2844.length === 1) {
                        var x$2845 = r0$2843[0];
                        var y$2846 = r1$2844[0];
                        return Product$2619(x$2845 * y$2846);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2839, b$2840);
        }.curry()
    });
    function getProduct$2628(x$2847) {
        return function getProduct$2628(x$2848) {
            return function (a0$2849) {
                var r0$2850 = Product$2619.unapply(a0$2849);
                if (r0$2850 != null && r0$2850.length === 1) {
                    var x$2851 = r0$2850[0];
                    return x$2851;
                }
                throw new TypeError('No match');
            }.call(this, x$2848);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2629 = function () {
            function Max$2852(_0$2854) {
                if (!(this instanceof Max$2852)) {
                    return new Max$2852(_0$2854);
                }
                if (typeof _0$2854 === 'number' || Object.prototype.toString.call(_0$2854) === '[object Number]') {
                    this['0'] = _0$2854;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2852.prototype.length = 1;
            var derived$2853 = Base$2511.derive({
                    name: 'Max',
                    constructor: Max$2852,
                    prototype: Max$2852.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2852,
                            prototype: Max$2852.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2853.constructor;
        }();
    instance$2525(Monoid$2603, Max$2629, {
        empty: function (self$2861) {
            return Max$2629(-Infinity);
        }.curry(),
        concat: function (a$2862, b$2863) {
            return function (a0$2864, a1$2865) {
                var r0$2866 = Max$2629.unapply(a0$2864);
                if (r0$2866 != null && r0$2866.length === 1) {
                    var r1$2867 = Max$2629.unapply(a1$2865);
                    if (r1$2867 != null && r1$2867.length === 1) {
                        var x$2868 = r0$2866[0];
                        var y$2869 = r1$2867[0];
                        return Max$2629(x$2868 > y$2869 ? x$2868 : y$2869);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2862, b$2863);
        }.curry()
    });
    function getMax$2638(x$2870) {
        return function getMax$2638(x$2871) {
            return function (a0$2872) {
                var r0$2873 = Max$2629.unapply(a0$2872);
                if (r0$2873 != null && r0$2873.length === 1) {
                    var x$2874 = r0$2873[0];
                    return x$2874;
                }
                throw new TypeError('No match');
            }.call(this, x$2871);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2639 = function () {
            function Min$2875(_0$2877) {
                if (!(this instanceof Min$2875)) {
                    return new Min$2875(_0$2877);
                }
                if (typeof _0$2877 === 'number' || Object.prototype.toString.call(_0$2877) === '[object Number]') {
                    this['0'] = _0$2877;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2875.prototype.length = 1;
            var derived$2876 = Base$2511.derive({
                    name: 'Min',
                    constructor: Min$2875,
                    prototype: Min$2875.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2875,
                            prototype: Min$2875.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2876.constructor;
        }();
    instance$2525(Monoid$2603, Min$2639, {
        empty: function (self$2884) {
            return Min$2639(Infinity);
        }.curry(),
        concat: function (a$2885, b$2886) {
            return function (a0$2887, a1$2888) {
                var r0$2889 = Min$2639.unapply(a0$2887);
                if (r0$2889 != null && r0$2889.length === 1) {
                    var r1$2890 = Min$2639.unapply(a1$2888);
                    if (r1$2890 != null && r1$2890.length === 1) {
                        var x$2891 = r0$2889[0];
                        var y$2892 = r1$2890[0];
                        return Min$2639(x$2891 < y$2892 ? x$2891 : y$2892);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2885, b$2886);
        }.curry()
    });
    function getMin$2648(x$2893) {
        return function getMin$2648(x$2894) {
            return function (a0$2895) {
                var r0$2896 = Min$2639.unapply(a0$2895);
                if (r0$2896 != null && r0$2896.length === 1) {
                    var x$2897 = r0$2896[0];
                    return x$2897;
                }
                throw new TypeError('No match');
            }.call(this, x$2894);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2649 = function () {
            function Option$2898() {
            }
            function Some$2899(val$2902) {
                if (!(this instanceof Some$2899)) {
                    return new Some$2899(val$2902);
                }
                this.val = val$2902;
            }
            Some$2899.prototype = new Option$2898();
            Some$2899.prototype.constructor = Some$2899;
            function None$2900() {
            }
            None$2900.prototype = new Option$2898();
            None$2900.prototype.constructor = None$2900;
            var derived$2901 = Base$2511.derive({
                    name: 'Option',
                    constructor: Option$2898,
                    prototype: Option$2898.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2899,
                            prototype: Some$2899.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2900,
                            prototype: None$2900.prototype
                        }
                    ]
                });
            Option$2898.Some = derived$2901.variants[0].constructor;
            Option$2898.None = new derived$2901.variants[1].constructor();
            return Option$2898;
        }();
    var Some$2650 = Option$2649.Some;
    var None$2651 = Option$2649.None;
    instance$2525(Monad$2597, Option$2649, {
        of: function (self$2909, x$2910) {
            return Some$2650(x$2910);
        }.curry(),
        chain: function (self$2911, f$2912) {
            return function (a0$2913, a1$2914) {
                var r0$2915 = Some$2650.unapply(a0$2913);
                if (r0$2915 != null && (r0$2915.length === 1 && (typeof a1$2914 === 'function' || Object.prototype.toString.call(a1$2914) === '[object Function]'))) {
                    var x$2916 = r0$2915[0];
                    return f$2912(x$2916);
                }
                if ((None$2651.hasInstance ? None$2651.hasInstance(a0$2913) : a0$2913 instanceof None$2651) && (typeof a1$2914 === 'function' || Object.prototype.toString.call(a1$2914) === '[object Function]')) {
                    return None$2651;
                }
                throw new TypeError('No match');
            }.call(this, self$2911, f$2912);
        }.curry()
    });
    instance$2525(Monoid$2603, Option$2649, {
        empty: function (self$2923) {
            return None$2651;
        }.curry(),
        concat: function (a$2924, b$2925) {
            return function (a0$2926, a1$2927) {
                if ((Option$2649.hasInstance ? Option$2649.hasInstance(a0$2926) : a0$2926 instanceof Option$2649) && (None$2651.hasInstance ? None$2651.hasInstance(a1$2927) : a1$2927 instanceof None$2651)) {
                    return a$2924;
                }
                if ((None$2651.hasInstance ? None$2651.hasInstance(a0$2926) : a0$2926 instanceof None$2651) && (Option$2649.hasInstance ? Option$2649.hasInstance(a1$2927) : a1$2927 instanceof Option$2649)) {
                    return b$2925;
                }
                var r0$2928 = Some$2650.unapply(a0$2926);
                if (r0$2928 != null && r0$2928.length === 1) {
                    var r1$2929 = Some$2650.unapply(a1$2927);
                    if (r1$2929 != null && r1$2929.length === 1) {
                        var v1$2930 = r0$2928[0];
                        var v2$2931 = r1$2929[0];
                        return Some$2650(v1$2930.concat(v2$2931));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2924, b$2925);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2655 = function () {
            function Either$2932() {
            }
            function Left$2933(l$2936) {
                if (!(this instanceof Left$2933)) {
                    return new Left$2933(l$2936);
                }
                this.l = l$2936;
            }
            Left$2933.prototype = new Either$2932();
            Left$2933.prototype.constructor = Left$2933;
            function Right$2934(r$2937) {
                if (!(this instanceof Right$2934)) {
                    return new Right$2934(r$2937);
                }
                this.r = r$2937;
            }
            Right$2934.prototype = new Either$2932();
            Right$2934.prototype.constructor = Right$2934;
            var derived$2935 = Base$2511.derive({
                    name: 'Either',
                    constructor: Either$2932,
                    prototype: Either$2932.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2933,
                            prototype: Left$2933.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2934,
                            prototype: Right$2934.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2932.Left = derived$2935.variants[0].constructor;
            Either$2932.Right = derived$2935.variants[1].constructor;
            return Either$2932;
        }();
    var Left$2656 = Either$2655.Left;
    var Right$2657 = Either$2655.Right;
    instance$2525(Monad$2597, Either$2655, {
        of: function (self$2944, x$2945) {
            return Right$2657(x$2945);
        }.curry(),
        chain: function (self$2946, f$2947) {
            return function (a0$2948, a1$2949) {
                var r0$2950 = Right$2657.unapply(a0$2948);
                if (r0$2950 != null && (r0$2950.length === 1 && (typeof a1$2949 === 'function' || Object.prototype.toString.call(a1$2949) === '[object Function]'))) {
                    var x$2952 = r0$2950[0];
                    return f$2947(x$2952);
                }
                var r1$2951 = Left$2656.unapply(a0$2948);
                if (r1$2951 != null && r1$2951.length === 1) {
                    var x$2952 = r1$2951[0];
                    return self$2946;
                }
                throw new TypeError('No match');
            }.call(this, self$2946, f$2947);
        }.curry()
    });
    instance$2525(Monoid$2603, Either$2655, {
        empty: function (self$2959) {
            return Left$2656();
        }.curry(),
        concat: function (a$2960, b$2961) {
            return function (a0$2962, a1$2963) {
                if (Either$2655.hasInstance ? Either$2655.hasInstance(a0$2962) : a0$2962 instanceof Either$2655) {
                    var r0$2966 = Left$2656.unapply(a1$2963);
                    if (r0$2966 != null && r0$2966.length === 1) {
                        var x$2967 = r0$2966[0];
                        return a$2960;
                    }
                }
                var r1$2964 = Left$2656.unapply(a0$2962);
                if (r1$2964 != null && (r1$2964.length === 1 && (Either$2655.hasInstance ? Either$2655.hasInstance(a1$2963) : a1$2963 instanceof Either$2655))) {
                    var x$2967 = r1$2964[0];
                    return b$2961;
                }
                var r2$2965 = Right$2657.unapply(a0$2962);
                if (r2$2965 != null && r2$2965.length === 1) {
                    var r3$2968 = Right$2657.unapply(a1$2963);
                    if (r3$2968 != null && r3$2968.length === 1) {
                        var r1$2969 = r2$2965[0];
                        var r2$2970 = r3$2968[0];
                        return Right$2657(r1$2969.concat(r2$2970));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2960, b$2961);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2659(f$2971, acc$2972, xs$2973) {
        return function foldl$2659(f$2974, acc$2975, xs$2976) {
            return xs$2976.reduce(f$2974, acc$2975);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2661(f$2977, xs$2978) {
        return function foldl1$2661(f$2979, xs$2980) {
            return xs$2980.reduce(f$2979);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2663(f$2981, acc$2982, xs$2983) {
        return function foldr$2663(f$2984, acc$2985, xs$2986) {
            return xs$2986.reduceRight(f$2984, acc$2985);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2665(f$2987, xs$2988) {
        return function foldr1$2665(f$2989, xs$2990) {
            return xs$2990.reduceRight(f$2989);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2668(xs$2991) {
        return function flatten$2668(xs$2992) {
            return foldl1$2661(function (xs$2993, ys$2994) {
                return xs$2993.concat(ys$2994);
            }.curry(), xs$2992);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2517(Array, 'of', function (self$2995, x$2996) {
        return [x$2996];
    }.curry());
    extendNative$2517(Array.prototype, 'ap', function (self$2997, x$2998) {
        return this.chain(map$2591(__$2516, x$2998).bind(this));
    }.curry());
    extendNative$2517(Array.prototype, 'chain', function (self$2999, f$3000) {
        return function (x$3001) {
            return flatten$2668(map$2591(f$3000)(x$3001));
        }(this);
    }.curry());
    // ***************************************************************
    // **                   CurryJS.Data.Object                     **
    // ***************************************************************
    // merge :: Object -> Object -> Object
    var merge$2675 = function (a$3002, b$3003) {
        var newObj$3004 = {}, k$3005;
        for (k$3005 in b$3003) {
            if (b$3003.hasOwnProperty(k$3005))
                newObj$3004[k$3005] = b$3003[k$3005];
        }
        for (k$3005 in a$3002) {
            if (a$3002.hasOwnProperty(k$3005))
                newObj$3004[k$3005] = a$3002[k$3005];
        }
        return newObj$3004;
    };
    // set :: Object -> String -> a
    function set$2678(o$3006, k$3007, v$3008) {
        return function set$2678(o$3009, k$3010, v$3011) {
            return function () {
                var newObj$3013 = {};
                var foo$3015 = newObj$3013[k$3010] = v$3011;
                return merge$2675(o$3009, newObj$3013);
            }();
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        Core: {
            __: __$2516,
            curry: curry$2519,
            compose: compose$2520,
            Protocol: Protocol$2522,
            instance: instance$2525
        },
        Predicates: {
            not: not$2573,
            and: and$2574,
            or: or$2575,
            isObject: isObject$2576,
            isArray: isArray$2577,
            isNumber: isNumber$2578,
            isRegExp: isRegExp$2579,
            isString: isString$2580,
            isNull: isNull$2581,
            isUndef: isUndef$2582,
            exists: exists$2583
        },
        Math: {
            plus: plus$2584,
            minus: minus$2585,
            times: times$2586,
            div: div$2587
        },
        Number: {
            Sum: {
                Sum: Sum$2609,
                getSum: getSum$2618
            },
            Product: {
                Product: Product$2619,
                getProduct: getProduct$2628
            },
            Max: {
                Max: Max$2629,
                getMax: getMax$2638
            },
            Min: {
                Min: Min$2639,
                getMin: getMin$2648
            }
        },
        Data: {
            Either: {
                Either: Either$2655,
                Left: Left$2656,
                Right: Right$2657
            },
            Option: {
                Option: Option$2649,
                Some: Some$2650,
                None: None$2651
            },
            Collection: {
                foldl: foldl$2659,
                foldl1: foldl1$2661,
                foldr: foldr$2663,
                foldr1: foldr1$2665,
                flatten: flatten$2668
            },
            Object: {
                merge: merge$2675,
                set: set$2678
            }
        },
        Control: {
            Functor: { map: map$2591 },
            Applicative: { ap: ap$2595 },
            Monad: {
                Monad: Monad$2597,
                chain: chain$2599
            },
            Monoid: {
                Monoid: Monoid$2603,
                concat: concat$2605
            }
        }
    };
}());
//# sourceMappingURL=curry.js.map