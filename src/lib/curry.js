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
                of: function (x$2747) {
                    return this.prototype.of(x$2747);
                }.curry()
            },
            prototype: {
                of: Protocol$2493.required,
                chain: Protocol$2493.required,
                map: function (self$2753, f$2754) {
                    return self$2753.chain(function (x$2755) {
                        return self$2753.of(f$2754(x$2755));
                    }.bind(this));
                }.curry(),
                ap: function (self$2756, x$2757) {
                    return self$2756.chain(map$2562(__$2487, x$2757).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2570(xs$2758, f$2759) {
        return function chain$2570(xs$2760, f$2761) {
            return xs$2760.chain(f$2761);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2572(f$2762, x$2763) {
        return function pure$2572(f$2764, x$2765) {
            return f$2764.of ? f$2764.of(x$2765) : f$2764.constructor.of(x$2765);
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
                }.curry()
            },
            prototype: {
                empty: Protocol$2493.required,
                concat: Protocol$2493.required
            }
        });
    // concat :: (Monoid a) => a -> a -> a
    function concat$2576(a$2768, b$2769) {
        return function concat$2576(a$2770, b$2771) {
            return a$2770.concat(b$2771);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2580 = function () {
            function Sum$2772(_0$2774) {
                if (!(this instanceof Sum$2772)) {
                    return new Sum$2772(_0$2774);
                }
                if (typeof _0$2774 === 'number' || Object.prototype.toString.call(_0$2774) === '[object Number]') {
                    this['0'] = _0$2774;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2772.prototype.length = 1;
            var derived$2773 = Base$2482.derive({
                    name: 'Sum',
                    constructor: Sum$2772,
                    prototype: Sum$2772.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2772,
                            prototype: Sum$2772.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2773.constructor;
        }();
    instance$2496(Monoid$2574, Sum$2580, {
        empty: function () {
            return Sum$2580(0);
        }.curry(),
        concat: function (a$2782, b$2783) {
            return function (a0$2784, a1$2785) {
                var r0$2786 = Sum$2580.unapply(a0$2784);
                if (r0$2786 != null && r0$2786.length === 1) {
                    var r1$2787 = Sum$2580.unapply(a1$2785);
                    if (r1$2787 != null && r1$2787.length === 1) {
                        var x$2788 = r0$2786[0];
                        var y$2789 = r1$2787[0];
                        return Sum$2580(x$2788 + y$2789);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2782, b$2783);
        }.curry()
    });
    function getSum$2589(x$2790) {
        return function getSum$2589(x$2791) {
            return function (a0$2792) {
                var r0$2793 = Sum$2580.unapply(a0$2792);
                if (r0$2793 != null && r0$2793.length === 1) {
                    var x$2794 = r0$2793[0];
                    return x$2794;
                }
                throw new TypeError('No match');
            }.call(this, x$2791);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2590 = function () {
            function Product$2795(_0$2797) {
                if (!(this instanceof Product$2795)) {
                    return new Product$2795(_0$2797);
                }
                if (typeof _0$2797 === 'number' || Object.prototype.toString.call(_0$2797) === '[object Number]') {
                    this['0'] = _0$2797;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2795.prototype.length = 1;
            var derived$2796 = Base$2482.derive({
                    name: 'Product',
                    constructor: Product$2795,
                    prototype: Product$2795.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2795,
                            prototype: Product$2795.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2796.constructor;
        }();
    instance$2496(Monoid$2574, Product$2590, {
        empty: function (self$2804) {
            return Product$2590(1);
        }.curry(),
        concat: function (a$2805, b$2806) {
            return function (a0$2807, a1$2808) {
                var r0$2809 = Product$2590.unapply(a0$2807);
                if (r0$2809 != null && r0$2809.length === 1) {
                    var r1$2810 = Product$2590.unapply(a1$2808);
                    if (r1$2810 != null && r1$2810.length === 1) {
                        var x$2811 = r0$2809[0];
                        var y$2812 = r1$2810[0];
                        return Product$2590(x$2811 * y$2812);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2805, b$2806);
        }.curry()
    });
    function getProduct$2599(x$2813) {
        return function getProduct$2599(x$2814) {
            return function (a0$2815) {
                var r0$2816 = Product$2590.unapply(a0$2815);
                if (r0$2816 != null && r0$2816.length === 1) {
                    var x$2817 = r0$2816[0];
                    return x$2817;
                }
                throw new TypeError('No match');
            }.call(this, x$2814);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2600 = function () {
            function Max$2818(_0$2820) {
                if (!(this instanceof Max$2818)) {
                    return new Max$2818(_0$2820);
                }
                if (typeof _0$2820 === 'number' || Object.prototype.toString.call(_0$2820) === '[object Number]') {
                    this['0'] = _0$2820;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2818.prototype.length = 1;
            var derived$2819 = Base$2482.derive({
                    name: 'Max',
                    constructor: Max$2818,
                    prototype: Max$2818.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2818,
                            prototype: Max$2818.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2819.constructor;
        }();
    instance$2496(Monoid$2574, Max$2600, {
        empty: function (self$2827) {
            return Max$2600(-Infinity);
        }.curry(),
        concat: function (a$2828, b$2829) {
            return function (a0$2830, a1$2831) {
                var r0$2832 = Max$2600.unapply(a0$2830);
                if (r0$2832 != null && r0$2832.length === 1) {
                    var r1$2833 = Max$2600.unapply(a1$2831);
                    if (r1$2833 != null && r1$2833.length === 1) {
                        var x$2834 = r0$2832[0];
                        var y$2835 = r1$2833[0];
                        return Max$2600(x$2834 > y$2835 ? x$2834 : y$2835);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2828, b$2829);
        }.curry()
    });
    function getMax$2609(x$2836) {
        return function getMax$2609(x$2837) {
            return function (a0$2838) {
                var r0$2839 = Max$2600.unapply(a0$2838);
                if (r0$2839 != null && r0$2839.length === 1) {
                    var x$2840 = r0$2839[0];
                    return x$2840;
                }
                throw new TypeError('No match');
            }.call(this, x$2837);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2610 = function () {
            function Min$2841(_0$2843) {
                if (!(this instanceof Min$2841)) {
                    return new Min$2841(_0$2843);
                }
                if (typeof _0$2843 === 'number' || Object.prototype.toString.call(_0$2843) === '[object Number]') {
                    this['0'] = _0$2843;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2841.prototype.length = 1;
            var derived$2842 = Base$2482.derive({
                    name: 'Min',
                    constructor: Min$2841,
                    prototype: Min$2841.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2841,
                            prototype: Min$2841.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2842.constructor;
        }();
    instance$2496(Monoid$2574, Min$2610, {
        empty: function (self$2850) {
            return Min$2610(Infinity);
        }.curry(),
        concat: function (a$2851, b$2852) {
            return function (a0$2853, a1$2854) {
                var r0$2855 = Min$2610.unapply(a0$2853);
                if (r0$2855 != null && r0$2855.length === 1) {
                    var r1$2856 = Min$2610.unapply(a1$2854);
                    if (r1$2856 != null && r1$2856.length === 1) {
                        var x$2857 = r0$2855[0];
                        var y$2858 = r1$2856[0];
                        return Min$2610(x$2857 < y$2858 ? x$2857 : y$2858);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2851, b$2852);
        }.curry()
    });
    function getMin$2619(x$2859) {
        return function getMin$2619(x$2860) {
            return function (a0$2861) {
                var r0$2862 = Min$2610.unapply(a0$2861);
                if (r0$2862 != null && r0$2862.length === 1) {
                    var x$2863 = r0$2862[0];
                    return x$2863;
                }
                throw new TypeError('No match');
            }.call(this, x$2860);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2620 = function () {
            function Option$2864() {
            }
            function Some$2865(val$2868) {
                if (!(this instanceof Some$2865)) {
                    return new Some$2865(val$2868);
                }
                this.val = val$2868;
            }
            Some$2865.prototype = new Option$2864();
            Some$2865.prototype.constructor = Some$2865;
            function None$2866() {
            }
            None$2866.prototype = new Option$2864();
            None$2866.prototype.constructor = None$2866;
            var derived$2867 = Base$2482.derive({
                    name: 'Option',
                    constructor: Option$2864,
                    prototype: Option$2864.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2865,
                            prototype: Some$2865.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2866,
                            prototype: None$2866.prototype
                        }
                    ]
                });
            Option$2864.Some = derived$2867.variants[0].constructor;
            Option$2864.None = new derived$2867.variants[1].constructor();
            return Option$2864;
        }();
    var Some$2621 = Option$2620.Some;
    var None$2622 = Option$2620.None;
    instance$2496(Monad$2568, Option$2620, {
        of: function (self$2875, x$2876) {
            return Some$2621(x$2876);
        }.curry(),
        chain: function (self$2877, f$2878) {
            return function (a0$2879, a1$2880) {
                var r0$2881 = Some$2621.unapply(a0$2879);
                if (r0$2881 != null && (r0$2881.length === 1 && (typeof a1$2880 === 'function' || Object.prototype.toString.call(a1$2880) === '[object Function]'))) {
                    var x$2882 = r0$2881[0];
                    return f$2878(x$2882);
                }
                if ((None$2622.hasInstance ? None$2622.hasInstance(a0$2879) : a0$2879 instanceof None$2622) && (typeof a1$2880 === 'function' || Object.prototype.toString.call(a1$2880) === '[object Function]')) {
                    return None$2622;
                }
                throw new TypeError('No match');
            }.call(this, self$2877, f$2878);
        }.curry()
    });
    instance$2496(Monoid$2574, Option$2620, {
        empty: function (self$2889) {
            return None$2622;
        }.curry(),
        concat: function (a$2890, b$2891) {
            return function (a0$2892, a1$2893) {
                if ((Option$2620.hasInstance ? Option$2620.hasInstance(a0$2892) : a0$2892 instanceof Option$2620) && (None$2622.hasInstance ? None$2622.hasInstance(a1$2893) : a1$2893 instanceof None$2622)) {
                    return a$2890;
                }
                if ((None$2622.hasInstance ? None$2622.hasInstance(a0$2892) : a0$2892 instanceof None$2622) && (Option$2620.hasInstance ? Option$2620.hasInstance(a1$2893) : a1$2893 instanceof Option$2620)) {
                    return b$2891;
                }
                var r0$2894 = Some$2621.unapply(a0$2892);
                if (r0$2894 != null && r0$2894.length === 1) {
                    var r1$2895 = Some$2621.unapply(a1$2893);
                    if (r1$2895 != null && r1$2895.length === 1) {
                        var v1$2896 = r0$2894[0];
                        var v2$2897 = r1$2895[0];
                        return Some$2621(v1$2896.concat(v2$2897));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2890, b$2891);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2626 = function () {
            function Either$2898() {
            }
            function Left$2899(l$2902) {
                if (!(this instanceof Left$2899)) {
                    return new Left$2899(l$2902);
                }
                this.l = l$2902;
            }
            Left$2899.prototype = new Either$2898();
            Left$2899.prototype.constructor = Left$2899;
            function Right$2900(r$2903) {
                if (!(this instanceof Right$2900)) {
                    return new Right$2900(r$2903);
                }
                this.r = r$2903;
            }
            Right$2900.prototype = new Either$2898();
            Right$2900.prototype.constructor = Right$2900;
            var derived$2901 = Base$2482.derive({
                    name: 'Either',
                    constructor: Either$2898,
                    prototype: Either$2898.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2899,
                            prototype: Left$2899.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2900,
                            prototype: Right$2900.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2898.Left = derived$2901.variants[0].constructor;
            Either$2898.Right = derived$2901.variants[1].constructor;
            return Either$2898;
        }();
    var Left$2627 = Either$2626.Left;
    var Right$2628 = Either$2626.Right;
    instance$2496(Monad$2568, Either$2626, {
        of: function (self$2910, x$2911) {
            return Right$2628(x$2911);
        }.curry(),
        chain: function (self$2912, f$2913) {
            return function (a0$2914, a1$2915) {
                var r0$2916 = Right$2628.unapply(a0$2914);
                if (r0$2916 != null && (r0$2916.length === 1 && (typeof a1$2915 === 'function' || Object.prototype.toString.call(a1$2915) === '[object Function]'))) {
                    var x$2918 = r0$2916[0];
                    return f$2913(x$2918);
                }
                var r1$2917 = Left$2627.unapply(a0$2914);
                if (r1$2917 != null && r1$2917.length === 1) {
                    var x$2918 = r1$2917[0];
                    return self$2912;
                }
                throw new TypeError('No match');
            }.call(this, self$2912, f$2913);
        }.curry()
    });
    instance$2496(Monoid$2574, Either$2626, {
        empty: function (self$2925) {
            return Left$2627();
        }.curry(),
        concat: function (a$2926, b$2927) {
            return function (a0$2928, a1$2929) {
                if (Either$2626.hasInstance ? Either$2626.hasInstance(a0$2928) : a0$2928 instanceof Either$2626) {
                    var r0$2932 = Left$2627.unapply(a1$2929);
                    if (r0$2932 != null && r0$2932.length === 1) {
                        var x$2933 = r0$2932[0];
                        return a$2926;
                    }
                }
                var r1$2930 = Left$2627.unapply(a0$2928);
                if (r1$2930 != null && (r1$2930.length === 1 && (Either$2626.hasInstance ? Either$2626.hasInstance(a1$2929) : a1$2929 instanceof Either$2626))) {
                    var x$2933 = r1$2930[0];
                    return b$2927;
                }
                var r2$2931 = Right$2628.unapply(a0$2928);
                if (r2$2931 != null && r2$2931.length === 1) {
                    var r3$2934 = Right$2628.unapply(a1$2929);
                    if (r3$2934 != null && r3$2934.length === 1) {
                        var r1$2935 = r2$2931[0];
                        var r2$2936 = r3$2934[0];
                        return Right$2628(r1$2935.concat(r2$2936));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2926, b$2927);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2630(f$2937, acc$2938, xs$2939) {
        return function foldl$2630(f$2940, acc$2941, xs$2942) {
            return xs$2942.reduce(f$2940, acc$2941);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2632(f$2943, xs$2944) {
        return function foldl1$2632(f$2945, xs$2946) {
            return xs$2946.reduce(f$2945);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2634(f$2947, acc$2948, xs$2949) {
        return function foldr$2634(f$2950, acc$2951, xs$2952) {
            return xs$2952.reduceRight(f$2950, acc$2951);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2636(f$2953, xs$2954) {
        return function foldr1$2636(f$2955, xs$2956) {
            return xs$2956.reduceRight(f$2955);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2639(xs$2957) {
        return function flatten$2639(xs$2958) {
            return foldl1$2632(function (xs$2959, ys$2960) {
                return xs$2959.concat(ys$2960);
            }.curry(), xs$2958);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2488(Array, 'of', function (x$2961) {
        return [x$2961];
    }.curry());
    extendNative$2488(Array.prototype, 'ap', function (x$2962) {
        return this.chain(map$2562(__$2487, x$2962).bind(this));
    }.curry());
    extendNative$2488(Array.prototype, 'chain', function (f$2963) {
        return function (x$2964) {
            return flatten$2639(map$2562(f$2963)(x$2964));
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