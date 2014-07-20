(function () {
    'use strict';
    var Base$2482 = require('./adt-derivers').Base;
    var __slice$2484 = [].slice;
    var __toString$2486 = {}.toString;
    // ***************************************************************
    // **                       CurryJS.Core                        **
    // ***************************************************************
    // __ :: () -> ()
    var __$2487 = function noop() {
    };
    var extendNative$2488 = function (native$2646, prop$2647, f$2648) {
        return Object.defineProperty(native$2646, prop$2647, { value: f$2648 });
    };
    var withMeta$2489 = function (f$2649, meta$2650) {
        var keys$2651 = Object.keys(meta$2650);
        keys$2651.forEach(function (name$2652) {
            Object.defineProperty(f$2649, '__' + name$2652, { value: meta$2650[name$2652] });
        });
        return f$2649;
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
    var curry$2490 = function (f$2653, n$2654) {
        var arity$2655 = typeof n$2654 !== 'undefined' ? n$2654 : typeof f$2653.__arity !== 'undefined' ? f$2653.__arity : f$2653.length, name$2656 = f$2653.name || f$2653.__name;
        if (arity$2655 < 2)
            return f$2653;
        var curriedFn$2657 = withMeta$2489(function () {
                var args$2658 = [].slice.call(arguments, 0, arity$2655), realArity$2659 = args$2658.filter(function (x$2661) {
                        return x$2661 !== __$2487;
                    }).length, self$2660 = this;
                if (realArity$2659 >= arity$2655)
                    return f$2653.apply(self$2660, arguments);
                else {
                    var g$2662 = withMeta$2489(function () {
                            var partialArgs$2663 = [].slice.call(arguments), newArgs$2664 = [];
                            for (var i$2665 = 0; i$2665 < args$2658.length; i$2665++)
                                newArgs$2664[i$2665] = args$2658[i$2665] === __$2487 ? partialArgs$2663.length === 0 ? undefined : partialArgs$2663.shift() : args$2658[i$2665];
                            return curriedFn$2657.apply(self$2660, newArgs$2664.concat(partialArgs$2663));
                        }, {
                            name: name$2656,
                            arity: arity$2655 - realArity$2659,
                            curried: true
                        });
                    g$2662.toString = curriedFn$2657.toString.bind(curriedFn$2657);
                    return g$2662;
                }
            }, {
                name: name$2656,
                arity: arity$2655,
                curried: true
            });
        curriedFn$2657.toString = f$2653.toString.bind(f$2653);
        return curriedFn$2657;
    };
    extendNative$2488(Function.prototype, 'curry', function (n$2666) {
        return curry$2490(this, n$2666);
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
    var compose$2491 = function () {
        var fns$2667 = __slice$2484.call(arguments), self$2668 = this;
        return fns$2667.reduce(function (f$2669, g$2670) {
            return function () {
                return f$2669.call(self$2668, g$2670.apply(self$2668, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2493 = function (name$2671, spec$2672) {
        return {
            name: name$2671,
            spec: spec$2672,
            instance: function (type$2673, impl$2674) {
                var name$2675 = this.name, spec$2676 = this.spec, constructor$2677 = spec$2676.constructor, proto$2678 = spec$2676.prototype, k$2679;
                Object.keys(constructor$2677 || {}).map(function (field$2680) {
                    if (constructor$2677[field$2680] === Protocol$2493.required && !impl$2674.hasOwnProperty(field$2680) && !type$2673.hasOwnProperty(field$2680))
                        throw Protocol$2493.required(name$2675, field$2680);
                    else if (!type$2673.hasOwnProperty(field$2680) && !impl$2674.hasOwnProperty(field$2680))
                        type$2673[field$2680] = function () {
                            return constructor$2677[field$2680].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                    else if (impl$2674.hasOwnProperty(field$2680))
                        type$2673[field$2680] = function () {
                            return impl$2674[field$2680].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                });
                Object.keys(proto$2678 || {}).map(function (field$2681) {
                    if (proto$2678[field$2681] === Protocol$2493.required && !impl$2674.hasOwnProperty(field$2681) && !type$2673.prototype.hasOwnProperty(field$2681))
                        throw Protocol$2493.required(name$2675, field$2681);
                    else if (!type$2673.prototype.hasOwnProperty(field$2681) && !impl$2674.hasOwnProperty(field$2681))
                        type$2673.prototype[field$2681] = function () {
                            return proto$2678[field$2681].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                    else if (impl$2674.hasOwnProperty(field$2681))
                        type$2673.prototype[field$2681] = function () {
                            return impl$2674[field$2681].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2493.required = function (name$2682, field$2683) {
        return new Error(name$2682 + ' expected required field: \'' + field$2683 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2496(protocol$2684, type$2685, impl$2686) {
        return function instance$2496(protocol$2687, type$2688, impl$2689) {
            return protocol$2687.instance(type$2688, impl$2689);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2544(x$2690) {
        return function not$2544(x$2691) {
            return !x$2691;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2545(xs$2692) {
        return function and$2545(xs$2693) {
            return xs$2693.every(function (x$2694) {
                return !!x$2694;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2546(xs$2695) {
        return function or$2546(xs$2696) {
            return xs$2696.some(function (x$2697) {
                return !!x$2697;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2547(x$2698) {
        return function isObject$2547(x$2699) {
            return function (a0$2700) {
                if (Object.prototype.toString.call(a0$2700) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2699);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2548(x$2701) {
        return function isArray$2548(x$2702) {
            return function (a0$2703) {
                if (Array.isArray ? Array.isArray(a0$2703) : Object.prototype.toString.call(a0$2703) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2702);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2549(x$2704) {
        return function isNumber$2549(x$2705) {
            return function (a0$2706) {
                if (typeof a0$2706 === 'number' || Object.prototype.toString.call(a0$2706) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2705);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2550(x$2707) {
        return function isRegExp$2550(x$2708) {
            return function (a0$2709) {
                if (Object.prototype.toString.call(a0$2709) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2708);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2551(x$2710) {
        return function isString$2551(x$2711) {
            return function (a0$2712) {
                if (typeof a0$2712 === 'string' || Object.prototype.toString.call(a0$2712) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2711);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2552(x$2713) {
        return function isNull$2552(x$2714) {
            return function (a0$2715) {
                if (a0$2715 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2714);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2553(x$2716) {
        return function isUndef$2553(x$2717) {
            return function (a0$2718) {
                if (a0$2718 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2717);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2554(x$2719) {
        return function exists$2554(x$2720) {
            return function (x$2721) {
                return not$2544(or$2546(x$2721));
            }([
                isNull$2552(x$2720),
                isUndef$2553(x$2720)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2555(a$2722, b$2723) {
        return function plus$2555(a$2724, b$2725) {
            return a$2724 + b$2725;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2556(a$2726, b$2727) {
        return function minus$2556(a$2728, b$2729) {
            return a$2728 - b$2729;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2557(a$2730, b$2731) {
        return function times$2557(a$2732, b$2733) {
            return a$2732 * b$2733;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2558(a$2734, b$2735) {
        return function div$2558(a$2736, b$2737) {
            return a$2736 / b$2737;
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2560 = Protocol$2493('Functor', { prototype: { map: Protocol$2493.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2562(f$2738, xs$2739) {
        return function map$2562(f$2740, xs$2741) {
            return xs$2741.map(f$2740);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2564 = Protocol$2493('Applicative', { prototype: { ap: Protocol$2493.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2566(f$2742, xs$2743) {
        return function ap$2566(f$2744, xs$2745) {
            return f$2744.ap(xs$2745);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2568 = Protocol$2493('Monad', {
            constructor: {
                of: function (x$2746) {
                    return this.prototype.of(x$2746);
                }
            },
            prototype: {
                of: Protocol$2493.required,
                chain: Protocol$2493.required,
                map: function (self$2751, f$2752) {
                    return self$2751.chain(compose$2491(self$2751.of, f$2752).bind(this));
                }.curry(),
                ap: function (self$2753, x$2754) {
                    return self$2753.chain(map$2562(__$2487, x$2754).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2570(xs$2755, f$2756) {
        return function chain$2570(xs$2757, f$2758) {
            return xs$2757.chain(f$2758);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2572(f$2759, x$2760) {
        return function pure$2572(f$2761, x$2762) {
            return f$2761.of ? f$2761.of(x$2762) : f$2761.constructor.of(x$2762);
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Monoid                   **
        // ***************************************************************
        Monoid$2574 = Protocol$2493('Monoid', {
            constructor: {
                empty: function () {
                    return this.prototype.empty();
                }
            },
            prototype: {
                empty: Protocol$2493.required,
                concat: Protocol$2493.required
            }
        });
    // concat :: (Monoid a) => a -> a -> a
    function concat$2576(a$2763, b$2764) {
        return function concat$2576(a$2765, b$2766) {
            return a$2765.concat(b$2766);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2580 = function () {
            function Sum$2767(_0$2769) {
                if (!(this instanceof Sum$2767)) {
                    return new Sum$2767(_0$2769);
                }
                if (typeof _0$2769 === 'number' || Object.prototype.toString.call(_0$2769) === '[object Number]') {
                    this['0'] = _0$2769;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2767.prototype.length = 1;
            var derived$2768 = Base$2482.derive({
                    name: 'Sum',
                    constructor: Sum$2767,
                    prototype: Sum$2767.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2767,
                            prototype: Sum$2767.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2768.constructor;
        }();
    instance$2496(Monoid$2574, Sum$2580, {
        empty: function () {
            return Sum$2580(0);
        }.curry(),
        concat: function (a$2777, b$2778) {
            return function (a0$2779, a1$2780) {
                var r0$2781 = Sum$2580.unapply(a0$2779);
                if (r0$2781 != null && r0$2781.length === 1) {
                    var r1$2782 = Sum$2580.unapply(a1$2780);
                    if (r1$2782 != null && r1$2782.length === 1) {
                        var x$2783 = r0$2781[0];
                        var y$2784 = r1$2782[0];
                        return Sum$2580(x$2783 + y$2784);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2777, b$2778);
        }.curry()
    });
    function getSum$2589(x$2785) {
        return function getSum$2589(x$2786) {
            return function (a0$2787) {
                var r0$2788 = Sum$2580.unapply(a0$2787);
                if (r0$2788 != null && r0$2788.length === 1) {
                    var x$2789 = r0$2788[0];
                    return x$2789;
                }
                throw new TypeError('No match');
            }.call(this, x$2786);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2590 = function () {
            function Product$2790(_0$2792) {
                if (!(this instanceof Product$2790)) {
                    return new Product$2790(_0$2792);
                }
                if (typeof _0$2792 === 'number' || Object.prototype.toString.call(_0$2792) === '[object Number]') {
                    this['0'] = _0$2792;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2790.prototype.length = 1;
            var derived$2791 = Base$2482.derive({
                    name: 'Product',
                    constructor: Product$2790,
                    prototype: Product$2790.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2790,
                            prototype: Product$2790.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2791.constructor;
        }();
    instance$2496(Monoid$2574, Product$2590, {
        empty: function (self$2799) {
            return Product$2590(1);
        }.curry(),
        concat: function (a$2800, b$2801) {
            return function (a0$2802, a1$2803) {
                var r0$2804 = Product$2590.unapply(a0$2802);
                if (r0$2804 != null && r0$2804.length === 1) {
                    var r1$2805 = Product$2590.unapply(a1$2803);
                    if (r1$2805 != null && r1$2805.length === 1) {
                        var x$2806 = r0$2804[0];
                        var y$2807 = r1$2805[0];
                        return Product$2590(x$2806 * y$2807);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2800, b$2801);
        }.curry()
    });
    function getProduct$2599(x$2808) {
        return function getProduct$2599(x$2809) {
            return function (a0$2810) {
                var r0$2811 = Product$2590.unapply(a0$2810);
                if (r0$2811 != null && r0$2811.length === 1) {
                    var x$2812 = r0$2811[0];
                    return x$2812;
                }
                throw new TypeError('No match');
            }.call(this, x$2809);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2600 = function () {
            function Max$2813(_0$2815) {
                if (!(this instanceof Max$2813)) {
                    return new Max$2813(_0$2815);
                }
                if (typeof _0$2815 === 'number' || Object.prototype.toString.call(_0$2815) === '[object Number]') {
                    this['0'] = _0$2815;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2813.prototype.length = 1;
            var derived$2814 = Base$2482.derive({
                    name: 'Max',
                    constructor: Max$2813,
                    prototype: Max$2813.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2813,
                            prototype: Max$2813.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2814.constructor;
        }();
    instance$2496(Monoid$2574, Max$2600, {
        empty: function (self$2822) {
            return Max$2600(-Infinity);
        }.curry(),
        concat: function (a$2823, b$2824) {
            return function (a0$2825, a1$2826) {
                var r0$2827 = Max$2600.unapply(a0$2825);
                if (r0$2827 != null && r0$2827.length === 1) {
                    var r1$2828 = Max$2600.unapply(a1$2826);
                    if (r1$2828 != null && r1$2828.length === 1) {
                        var x$2829 = r0$2827[0];
                        var y$2830 = r1$2828[0];
                        return Max$2600(x$2829 > y$2830 ? x$2829 : y$2830);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2823, b$2824);
        }.curry()
    });
    function getMax$2609(x$2831) {
        return function getMax$2609(x$2832) {
            return function (a0$2833) {
                var r0$2834 = Max$2600.unapply(a0$2833);
                if (r0$2834 != null && r0$2834.length === 1) {
                    var x$2835 = r0$2834[0];
                    return x$2835;
                }
                throw new TypeError('No match');
            }.call(this, x$2832);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2610 = function () {
            function Min$2836(_0$2838) {
                if (!(this instanceof Min$2836)) {
                    return new Min$2836(_0$2838);
                }
                if (typeof _0$2838 === 'number' || Object.prototype.toString.call(_0$2838) === '[object Number]') {
                    this['0'] = _0$2838;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2836.prototype.length = 1;
            var derived$2837 = Base$2482.derive({
                    name: 'Min',
                    constructor: Min$2836,
                    prototype: Min$2836.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2836,
                            prototype: Min$2836.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2837.constructor;
        }();
    instance$2496(Monoid$2574, Min$2610, {
        empty: function (self$2845) {
            return Min$2610(Infinity);
        }.curry(),
        concat: function (a$2846, b$2847) {
            return function (a0$2848, a1$2849) {
                var r0$2850 = Min$2610.unapply(a0$2848);
                if (r0$2850 != null && r0$2850.length === 1) {
                    var r1$2851 = Min$2610.unapply(a1$2849);
                    if (r1$2851 != null && r1$2851.length === 1) {
                        var x$2852 = r0$2850[0];
                        var y$2853 = r1$2851[0];
                        return Min$2610(x$2852 < y$2853 ? x$2852 : y$2853);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2846, b$2847);
        }.curry()
    });
    function getMin$2619(x$2854) {
        return function getMin$2619(x$2855) {
            return function (a0$2856) {
                var r0$2857 = Min$2610.unapply(a0$2856);
                if (r0$2857 != null && r0$2857.length === 1) {
                    var x$2858 = r0$2857[0];
                    return x$2858;
                }
                throw new TypeError('No match');
            }.call(this, x$2855);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2620 = function () {
            function Option$2859() {
            }
            function Some$2860(val$2863) {
                if (!(this instanceof Some$2860)) {
                    return new Some$2860(val$2863);
                }
                this.val = val$2863;
            }
            Some$2860.prototype = new Option$2859();
            Some$2860.prototype.constructor = Some$2860;
            function None$2861() {
            }
            None$2861.prototype = new Option$2859();
            None$2861.prototype.constructor = None$2861;
            var derived$2862 = Base$2482.derive({
                    name: 'Option',
                    constructor: Option$2859,
                    prototype: Option$2859.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2860,
                            prototype: Some$2860.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2861,
                            prototype: None$2861.prototype
                        }
                    ]
                });
            Option$2859.Some = derived$2862.variants[0].constructor;
            Option$2859.None = new derived$2862.variants[1].constructor();
            return Option$2859;
        }();
    var Some$2621 = Option$2620.Some;
    var None$2622 = Option$2620.None;
    instance$2496(Monad$2568, Option$2620, {
        of: function (self$2870, x$2871) {
            return Some$2621(x$2871);
        }.curry(),
        chain: function (self$2872, f$2873) {
            return function (a0$2874, a1$2875) {
                var r0$2876 = Some$2621.unapply(a0$2874);
                if (r0$2876 != null && (r0$2876.length === 1 && (typeof a1$2875 === 'function' || Object.prototype.toString.call(a1$2875) === '[object Function]'))) {
                    var x$2877 = r0$2876[0];
                    return f$2873(x$2877);
                }
                if ((None$2622.hasInstance ? None$2622.hasInstance(a0$2874) : a0$2874 instanceof None$2622) && (typeof a1$2875 === 'function' || Object.prototype.toString.call(a1$2875) === '[object Function]')) {
                    return None$2622;
                }
                throw new TypeError('No match');
            }.call(this, self$2872, f$2873);
        }.curry()
    });
    instance$2496(Monoid$2574, Option$2620, {
        empty: function (self$2884) {
            return None$2622;
        }.curry(),
        concat: function (a$2885, b$2886) {
            return function (a0$2887, a1$2888) {
                if ((Option$2620.hasInstance ? Option$2620.hasInstance(a0$2887) : a0$2887 instanceof Option$2620) && (None$2622.hasInstance ? None$2622.hasInstance(a1$2888) : a1$2888 instanceof None$2622)) {
                    return a$2885;
                }
                if ((None$2622.hasInstance ? None$2622.hasInstance(a0$2887) : a0$2887 instanceof None$2622) && (Option$2620.hasInstance ? Option$2620.hasInstance(a1$2888) : a1$2888 instanceof Option$2620)) {
                    return b$2886;
                }
                var r0$2889 = Some$2621.unapply(a0$2887);
                if (r0$2889 != null && r0$2889.length === 1) {
                    var r1$2890 = Some$2621.unapply(a1$2888);
                    if (r1$2890 != null && r1$2890.length === 1) {
                        var v1$2891 = r0$2889[0];
                        var v2$2892 = r1$2890[0];
                        return Some$2621(v1$2891.concat(v2$2892));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2885, b$2886);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2626 = function () {
            function Either$2893() {
            }
            function Left$2894(l$2897) {
                if (!(this instanceof Left$2894)) {
                    return new Left$2894(l$2897);
                }
                this.l = l$2897;
            }
            Left$2894.prototype = new Either$2893();
            Left$2894.prototype.constructor = Left$2894;
            function Right$2895(r$2898) {
                if (!(this instanceof Right$2895)) {
                    return new Right$2895(r$2898);
                }
                this.r = r$2898;
            }
            Right$2895.prototype = new Either$2893();
            Right$2895.prototype.constructor = Right$2895;
            var derived$2896 = Base$2482.derive({
                    name: 'Either',
                    constructor: Either$2893,
                    prototype: Either$2893.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2894,
                            prototype: Left$2894.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2895,
                            prototype: Right$2895.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2893.Left = derived$2896.variants[0].constructor;
            Either$2893.Right = derived$2896.variants[1].constructor;
            return Either$2893;
        }();
    var Left$2627 = Either$2626.Left;
    var Right$2628 = Either$2626.Right;
    instance$2496(Monad$2568, Either$2626, {
        of: function (self$2905, x$2906) {
            return Right$2628(x$2906);
        }.curry(),
        chain: function (self$2907, f$2908) {
            return function (a0$2909, a1$2910) {
                var r0$2911 = Right$2628.unapply(a0$2909);
                if (r0$2911 != null && (r0$2911.length === 1 && (typeof a1$2910 === 'function' || Object.prototype.toString.call(a1$2910) === '[object Function]'))) {
                    var x$2913 = r0$2911[0];
                    return f$2908(x$2913);
                }
                var r1$2912 = Left$2627.unapply(a0$2909);
                if (r1$2912 != null && r1$2912.length === 1) {
                    var x$2913 = r1$2912[0];
                    return self$2907;
                }
                throw new TypeError('No match');
            }.call(this, self$2907, f$2908);
        }.curry()
    });
    instance$2496(Monoid$2574, Either$2626, {
        empty: function (self$2920) {
            return Left$2627();
        }.curry(),
        concat: function (a$2921, b$2922) {
            return function (a0$2923, a1$2924) {
                if (Either$2626.hasInstance ? Either$2626.hasInstance(a0$2923) : a0$2923 instanceof Either$2626) {
                    var r0$2927 = Left$2627.unapply(a1$2924);
                    if (r0$2927 != null && r0$2927.length === 1) {
                        var x$2928 = r0$2927[0];
                        return a$2921;
                    }
                }
                var r1$2925 = Left$2627.unapply(a0$2923);
                if (r1$2925 != null && (r1$2925.length === 1 && (Either$2626.hasInstance ? Either$2626.hasInstance(a1$2924) : a1$2924 instanceof Either$2626))) {
                    var x$2928 = r1$2925[0];
                    return b$2922;
                }
                var r2$2926 = Right$2628.unapply(a0$2923);
                if (r2$2926 != null && r2$2926.length === 1) {
                    var r3$2929 = Right$2628.unapply(a1$2924);
                    if (r3$2929 != null && r3$2929.length === 1) {
                        var r1$2930 = r2$2926[0];
                        var r2$2931 = r3$2929[0];
                        return Right$2628(r1$2930.concat(r2$2931));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2921, b$2922);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2630(f$2932, acc$2933, xs$2934) {
        return function foldl$2630(f$2935, acc$2936, xs$2937) {
            return xs$2937.reduce(f$2935, acc$2936);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2632(f$2938, xs$2939) {
        return function foldl1$2632(f$2940, xs$2941) {
            return xs$2941.reduce(f$2940);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2634(f$2942, acc$2943, xs$2944) {
        return function foldr$2634(f$2945, acc$2946, xs$2947) {
            return xs$2947.reduceRight(f$2945, acc$2946);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2636(f$2948, xs$2949) {
        return function foldr1$2636(f$2950, xs$2951) {
            return xs$2951.reduceRight(f$2950);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2639(xs$2952) {
        return function flatten$2639(xs$2953) {
            return foldl1$2632(function (xs$2954, ys$2955) {
                return xs$2954.concat(ys$2955);
            }.curry(), xs$2953);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2488(Array, 'of', function (x$2956) {
        return [x$2956];
    }.curry());
    extendNative$2488(Array.prototype, 'ap', function (x$2957) {
        return this.chain(map$2562(__$2487, x$2957).bind(this));
    }.curry());
    extendNative$2488(Array.prototype, 'chain', function (f$2958) {
        return function (x$2959) {
            return flatten$2639(map$2562(f$2958)(x$2959));
        }(this);
    }.curry());
    module.exports = {
        Core: {
            __: __$2487,
            curry: curry$2490,
            compose: compose$2491,
            Protocol: Protocol$2493,
            instance: instance$2496
        },
        Predicates: {
            not: not$2544,
            and: and$2545,
            or: or$2546,
            isObject: isObject$2547,
            isArray: isArray$2548,
            isNumber: isNumber$2549,
            isRegExp: isRegExp$2550,
            isString: isString$2551,
            isNull: isNull$2552,
            isUndef: isUndef$2553,
            exists: exists$2554
        },
        Math: {
            plus: plus$2555,
            minus: minus$2556,
            times: times$2557,
            div: div$2558
        },
        Number: {
            Sum: {
                Sum: Sum$2580,
                getSum: getSum$2589
            },
            Product: {
                Product: Product$2590,
                getProduct: getProduct$2599
            },
            Max: {
                Max: Max$2600,
                getMax: getMax$2609
            },
            Min: {
                Min: Min$2610,
                getMin: getMin$2619
            }
        },
        Data: {
            Either: {
                Either: Either$2626,
                Left: Left$2627,
                Right: Right$2628
            },
            Option: {
                Option: Option$2620,
                Some: Some$2621,
                None: None$2622
            },
            Collection: {
                foldl: foldl$2630,
                foldl1: foldl1$2632,
                foldr: foldr$2634,
                foldr1: foldr1$2636,
                flatten: flatten$2639
            }
        },
        Control: {
            Functor: { map: map$2562 },
            Applicative: { ap: ap$2566 },
            Monad: {
                Monad: Monad$2568,
                chain: chain$2570
            },
            Monoid: {
                Monoid: Monoid$2574,
                concat: concat$2576
            }
        }
    };
}());
//# sourceMappingURL=curry.js.map