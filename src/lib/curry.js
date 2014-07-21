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
    var extendNative$2488 = function (native$2647, prop$2648, f$2649) {
        return Object.defineProperty(native$2647, prop$2648, {
            value: function () {
                return f$2649.apply(this, [this].concat(__slice$2484.call(arguments)));
            }
        });
    };
    var withMeta$2489 = function (f$2650, meta$2651) {
        var keys$2652 = Object.keys(meta$2651);
        keys$2652.forEach(function (name$2653) {
            Object.defineProperty(f$2650, '__' + name$2653, { value: meta$2651[name$2653] });
        });
        return f$2650;
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
    var curry$2490 = function (f$2654, n$2655) {
        var arity$2656 = typeof n$2655 !== 'undefined' ? n$2655 : typeof f$2654.__arity !== 'undefined' ? f$2654.__arity : f$2654.length, name$2657 = f$2654.name || f$2654.__name;
        if (arity$2656 < 2)
            return f$2654;
        var curriedFn$2658 = withMeta$2489(function () {
                var args$2659 = [].slice.call(arguments, 0, arity$2656), realArity$2660 = args$2659.filter(function (x$2662) {
                        return x$2662 !== __$2487;
                    }).length, self$2661 = this;
                if (realArity$2660 >= arity$2656)
                    return f$2654.apply(self$2661, arguments);
                else {
                    var g$2663 = withMeta$2489(function () {
                            var partialArgs$2664 = [].slice.call(arguments), newArgs$2665 = [];
                            for (var i$2666 = 0; i$2666 < args$2659.length; i$2666++)
                                newArgs$2665[i$2666] = args$2659[i$2666] === __$2487 ? partialArgs$2664.length === 0 ? undefined : partialArgs$2664.shift() : args$2659[i$2666];
                            return curriedFn$2658.apply(self$2661, newArgs$2665.concat(partialArgs$2664));
                        }, {
                            name: name$2657,
                            arity: arity$2656 - realArity$2660,
                            curried: true
                        });
                    g$2663.toString = curriedFn$2658.toString.bind(curriedFn$2658);
                    return g$2663;
                }
            }, {
                name: name$2657,
                arity: arity$2656,
                curried: true
            });
        curriedFn$2658.toString = f$2654.toString.bind(f$2654);
        return curriedFn$2658;
    };
    extendNative$2488(Function.prototype, 'curry', function (self$2667, n$2668) {
        return curry$2490(self$2667, n$2668);
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
        var fns$2669 = __slice$2484.call(arguments), self$2670 = this;
        return fns$2669.reduce(function (f$2671, g$2672) {
            return function () {
                return f$2671.call(self$2670, g$2672.apply(self$2670, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2493 = function (name$2673, spec$2674) {
        return {
            name: name$2673,
            spec: spec$2674,
            instance: function (type$2675, impl$2676) {
                var name$2677 = this.name, spec$2678 = this.spec, constructor$2679 = spec$2678.constructor, proto$2680 = spec$2678.prototype, k$2681;
                Object.keys(constructor$2679 || {}).map(function (field$2682) {
                    if (constructor$2679[field$2682] === Protocol$2493.required && !impl$2676.hasOwnProperty(field$2682) && !type$2675.hasOwnProperty(field$2682))
                        throw Protocol$2493.required(name$2677, field$2682);
                    else if (!type$2675.hasOwnProperty(field$2682) && !impl$2676.hasOwnProperty(field$2682))
                        type$2675[field$2682] = function () {
                            return constructor$2679[field$2682].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                    else if (impl$2676.hasOwnProperty(field$2682))
                        type$2675[field$2682] = function () {
                            return impl$2676[field$2682].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                });
                Object.keys(proto$2680 || {}).map(function (field$2683) {
                    if (proto$2680[field$2683] === Protocol$2493.required && !impl$2676.hasOwnProperty(field$2683) && !type$2675.prototype.hasOwnProperty(field$2683))
                        throw Protocol$2493.required(name$2677, field$2683);
                    else if (!type$2675.prototype.hasOwnProperty(field$2683) && !impl$2676.hasOwnProperty(field$2683))
                        type$2675.prototype[field$2683] = function () {
                            return proto$2680[field$2683].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                    else if (impl$2676.hasOwnProperty(field$2683))
                        type$2675.prototype[field$2683] = function () {
                            return impl$2676[field$2683].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2493.required = function (name$2684, field$2685) {
        return new Error(name$2684 + ' expected required field: \'' + field$2685 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2496(protocol$2686, type$2687, impl$2688) {
        return function instance$2496(protocol$2689, type$2690, impl$2691) {
            return protocol$2689.instance(type$2690, impl$2691);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2544(x$2692) {
        return function not$2544(x$2693) {
            return !x$2693;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2545(xs$2694) {
        return function and$2545(xs$2695) {
            return xs$2695.every(function (x$2696) {
                return !!x$2696;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2546(xs$2697) {
        return function or$2546(xs$2698) {
            return xs$2698.some(function (x$2699) {
                return !!x$2699;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2547(x$2700) {
        return function isObject$2547(x$2701) {
            return function (a0$2702) {
                if (Object.prototype.toString.call(a0$2702) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2701);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2548(x$2703) {
        return function isArray$2548(x$2704) {
            return function (a0$2705) {
                if (Array.isArray ? Array.isArray(a0$2705) : Object.prototype.toString.call(a0$2705) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2704);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2549(x$2706) {
        return function isNumber$2549(x$2707) {
            return function (a0$2708) {
                if (typeof a0$2708 === 'number' || Object.prototype.toString.call(a0$2708) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2707);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2550(x$2709) {
        return function isRegExp$2550(x$2710) {
            return function (a0$2711) {
                if (Object.prototype.toString.call(a0$2711) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2710);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2551(x$2712) {
        return function isString$2551(x$2713) {
            return function (a0$2714) {
                if (typeof a0$2714 === 'string' || Object.prototype.toString.call(a0$2714) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2713);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2552(x$2715) {
        return function isNull$2552(x$2716) {
            return function (a0$2717) {
                if (a0$2717 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2716);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2553(x$2718) {
        return function isUndef$2553(x$2719) {
            return function (a0$2720) {
                if (a0$2720 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2719);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2554(x$2721) {
        return function exists$2554(x$2722) {
            return function (x$2723) {
                return not$2544(or$2546(x$2723));
            }([
                isNull$2552(x$2722),
                isUndef$2553(x$2722)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2555(a$2724, b$2725) {
        return function plus$2555(a$2726, b$2727) {
            return a$2726 + b$2727;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2556(a$2728, b$2729) {
        return function minus$2556(a$2730, b$2731) {
            return a$2730 - b$2731;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2557(a$2732, b$2733) {
        return function times$2557(a$2734, b$2735) {
            return a$2734 * b$2735;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2558(a$2736, b$2737) {
        return function div$2558(a$2738, b$2739) {
            return a$2738 / b$2739;
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2560 = Protocol$2493('Functor', { prototype: { map: Protocol$2493.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2562(f$2740, xs$2741) {
        return function map$2562(f$2742, xs$2743) {
            return xs$2743.map(f$2742);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2564 = Protocol$2493('Applicative', { prototype: { ap: Protocol$2493.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2566(f$2744, xs$2745) {
        return function ap$2566(f$2746, xs$2747) {
            return f$2746.ap(xs$2747);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2568 = Protocol$2493('Monad', {
            constructor: {
                of: function (x$2749) {
                    return this.prototype.of(x$2749);
                }.curry()
            },
            prototype: {
                of: Protocol$2493.required,
                chain: Protocol$2493.required,
                map: function (self$2755, f$2756) {
                    return self$2755.chain(function (x$2757) {
                        return self$2755.of(f$2756(x$2757));
                    }.bind(this));
                }.curry(),
                ap: function (self$2758, x$2759) {
                    return self$2758.chain(map$2562(__$2487, x$2759).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2570(xs$2760, f$2761) {
        return function chain$2570(xs$2762, f$2763) {
            return xs$2762.chain(f$2763);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2572(f$2764, x$2765) {
        return function pure$2572(f$2766, x$2767) {
            return f$2766.of ? f$2766.of(x$2767) : f$2766.constructor.of(x$2767);
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
    function concat$2576(a$2770, b$2771) {
        return function concat$2576(a$2772, b$2773) {
            return a$2772.concat(b$2773);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2580 = function () {
            function Sum$2774(_0$2776) {
                if (!(this instanceof Sum$2774)) {
                    return new Sum$2774(_0$2776);
                }
                if (typeof _0$2776 === 'number' || Object.prototype.toString.call(_0$2776) === '[object Number]') {
                    this['0'] = _0$2776;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2774.prototype.length = 1;
            var derived$2775 = Base$2482.derive({
                    name: 'Sum',
                    constructor: Sum$2774,
                    prototype: Sum$2774.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2774,
                            prototype: Sum$2774.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2775.constructor;
        }();
    instance$2496(Monoid$2574, Sum$2580, {
        empty: function () {
            return Sum$2580(0);
        }.curry(),
        concat: function (a$2784, b$2785) {
            return function (a0$2786, a1$2787) {
                var r0$2788 = Sum$2580.unapply(a0$2786);
                if (r0$2788 != null && r0$2788.length === 1) {
                    var r1$2789 = Sum$2580.unapply(a1$2787);
                    if (r1$2789 != null && r1$2789.length === 1) {
                        var x$2790 = r0$2788[0];
                        var y$2791 = r1$2789[0];
                        return Sum$2580(x$2790 + y$2791);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2784, b$2785);
        }.curry()
    });
    function getSum$2589(x$2792) {
        return function getSum$2589(x$2793) {
            return function (a0$2794) {
                var r0$2795 = Sum$2580.unapply(a0$2794);
                if (r0$2795 != null && r0$2795.length === 1) {
                    var x$2796 = r0$2795[0];
                    return x$2796;
                }
                throw new TypeError('No match');
            }.call(this, x$2793);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2590 = function () {
            function Product$2797(_0$2799) {
                if (!(this instanceof Product$2797)) {
                    return new Product$2797(_0$2799);
                }
                if (typeof _0$2799 === 'number' || Object.prototype.toString.call(_0$2799) === '[object Number]') {
                    this['0'] = _0$2799;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2797.prototype.length = 1;
            var derived$2798 = Base$2482.derive({
                    name: 'Product',
                    constructor: Product$2797,
                    prototype: Product$2797.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2797,
                            prototype: Product$2797.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2798.constructor;
        }();
    instance$2496(Monoid$2574, Product$2590, {
        empty: function (self$2806) {
            return Product$2590(1);
        }.curry(),
        concat: function (a$2807, b$2808) {
            return function (a0$2809, a1$2810) {
                var r0$2811 = Product$2590.unapply(a0$2809);
                if (r0$2811 != null && r0$2811.length === 1) {
                    var r1$2812 = Product$2590.unapply(a1$2810);
                    if (r1$2812 != null && r1$2812.length === 1) {
                        var x$2813 = r0$2811[0];
                        var y$2814 = r1$2812[0];
                        return Product$2590(x$2813 * y$2814);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2807, b$2808);
        }.curry()
    });
    function getProduct$2599(x$2815) {
        return function getProduct$2599(x$2816) {
            return function (a0$2817) {
                var r0$2818 = Product$2590.unapply(a0$2817);
                if (r0$2818 != null && r0$2818.length === 1) {
                    var x$2819 = r0$2818[0];
                    return x$2819;
                }
                throw new TypeError('No match');
            }.call(this, x$2816);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2600 = function () {
            function Max$2820(_0$2822) {
                if (!(this instanceof Max$2820)) {
                    return new Max$2820(_0$2822);
                }
                if (typeof _0$2822 === 'number' || Object.prototype.toString.call(_0$2822) === '[object Number]') {
                    this['0'] = _0$2822;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2820.prototype.length = 1;
            var derived$2821 = Base$2482.derive({
                    name: 'Max',
                    constructor: Max$2820,
                    prototype: Max$2820.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2820,
                            prototype: Max$2820.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2821.constructor;
        }();
    instance$2496(Monoid$2574, Max$2600, {
        empty: function (self$2829) {
            return Max$2600(-Infinity);
        }.curry(),
        concat: function (a$2830, b$2831) {
            return function (a0$2832, a1$2833) {
                var r0$2834 = Max$2600.unapply(a0$2832);
                if (r0$2834 != null && r0$2834.length === 1) {
                    var r1$2835 = Max$2600.unapply(a1$2833);
                    if (r1$2835 != null && r1$2835.length === 1) {
                        var x$2836 = r0$2834[0];
                        var y$2837 = r1$2835[0];
                        return Max$2600(x$2836 > y$2837 ? x$2836 : y$2837);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2830, b$2831);
        }.curry()
    });
    function getMax$2609(x$2838) {
        return function getMax$2609(x$2839) {
            return function (a0$2840) {
                var r0$2841 = Max$2600.unapply(a0$2840);
                if (r0$2841 != null && r0$2841.length === 1) {
                    var x$2842 = r0$2841[0];
                    return x$2842;
                }
                throw new TypeError('No match');
            }.call(this, x$2839);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2610 = function () {
            function Min$2843(_0$2845) {
                if (!(this instanceof Min$2843)) {
                    return new Min$2843(_0$2845);
                }
                if (typeof _0$2845 === 'number' || Object.prototype.toString.call(_0$2845) === '[object Number]') {
                    this['0'] = _0$2845;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2843.prototype.length = 1;
            var derived$2844 = Base$2482.derive({
                    name: 'Min',
                    constructor: Min$2843,
                    prototype: Min$2843.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2843,
                            prototype: Min$2843.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2844.constructor;
        }();
    instance$2496(Monoid$2574, Min$2610, {
        empty: function (self$2852) {
            return Min$2610(Infinity);
        }.curry(),
        concat: function (a$2853, b$2854) {
            return function (a0$2855, a1$2856) {
                var r0$2857 = Min$2610.unapply(a0$2855);
                if (r0$2857 != null && r0$2857.length === 1) {
                    var r1$2858 = Min$2610.unapply(a1$2856);
                    if (r1$2858 != null && r1$2858.length === 1) {
                        var x$2859 = r0$2857[0];
                        var y$2860 = r1$2858[0];
                        return Min$2610(x$2859 < y$2860 ? x$2859 : y$2860);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2853, b$2854);
        }.curry()
    });
    function getMin$2619(x$2861) {
        return function getMin$2619(x$2862) {
            return function (a0$2863) {
                var r0$2864 = Min$2610.unapply(a0$2863);
                if (r0$2864 != null && r0$2864.length === 1) {
                    var x$2865 = r0$2864[0];
                    return x$2865;
                }
                throw new TypeError('No match');
            }.call(this, x$2862);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2620 = function () {
            function Option$2866() {
            }
            function Some$2867(val$2870) {
                if (!(this instanceof Some$2867)) {
                    return new Some$2867(val$2870);
                }
                this.val = val$2870;
            }
            Some$2867.prototype = new Option$2866();
            Some$2867.prototype.constructor = Some$2867;
            function None$2868() {
            }
            None$2868.prototype = new Option$2866();
            None$2868.prototype.constructor = None$2868;
            var derived$2869 = Base$2482.derive({
                    name: 'Option',
                    constructor: Option$2866,
                    prototype: Option$2866.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2867,
                            prototype: Some$2867.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2868,
                            prototype: None$2868.prototype
                        }
                    ]
                });
            Option$2866.Some = derived$2869.variants[0].constructor;
            Option$2866.None = new derived$2869.variants[1].constructor();
            return Option$2866;
        }();
    var Some$2621 = Option$2620.Some;
    var None$2622 = Option$2620.None;
    instance$2496(Monad$2568, Option$2620, {
        of: function (self$2877, x$2878) {
            return Some$2621(x$2878);
        }.curry(),
        chain: function (self$2879, f$2880) {
            return function (a0$2881, a1$2882) {
                var r0$2883 = Some$2621.unapply(a0$2881);
                if (r0$2883 != null && (r0$2883.length === 1 && (typeof a1$2882 === 'function' || Object.prototype.toString.call(a1$2882) === '[object Function]'))) {
                    var x$2884 = r0$2883[0];
                    return f$2880(x$2884);
                }
                if ((None$2622.hasInstance ? None$2622.hasInstance(a0$2881) : a0$2881 instanceof None$2622) && (typeof a1$2882 === 'function' || Object.prototype.toString.call(a1$2882) === '[object Function]')) {
                    return None$2622;
                }
                throw new TypeError('No match');
            }.call(this, self$2879, f$2880);
        }.curry()
    });
    instance$2496(Monoid$2574, Option$2620, {
        empty: function (self$2891) {
            return None$2622;
        }.curry(),
        concat: function (a$2892, b$2893) {
            return function (a0$2894, a1$2895) {
                if ((Option$2620.hasInstance ? Option$2620.hasInstance(a0$2894) : a0$2894 instanceof Option$2620) && (None$2622.hasInstance ? None$2622.hasInstance(a1$2895) : a1$2895 instanceof None$2622)) {
                    return a$2892;
                }
                if ((None$2622.hasInstance ? None$2622.hasInstance(a0$2894) : a0$2894 instanceof None$2622) && (Option$2620.hasInstance ? Option$2620.hasInstance(a1$2895) : a1$2895 instanceof Option$2620)) {
                    return b$2893;
                }
                var r0$2896 = Some$2621.unapply(a0$2894);
                if (r0$2896 != null && r0$2896.length === 1) {
                    var r1$2897 = Some$2621.unapply(a1$2895);
                    if (r1$2897 != null && r1$2897.length === 1) {
                        var v1$2898 = r0$2896[0];
                        var v2$2899 = r1$2897[0];
                        return Some$2621(v1$2898.concat(v2$2899));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2892, b$2893);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2626 = function () {
            function Either$2900() {
            }
            function Left$2901(l$2904) {
                if (!(this instanceof Left$2901)) {
                    return new Left$2901(l$2904);
                }
                this.l = l$2904;
            }
            Left$2901.prototype = new Either$2900();
            Left$2901.prototype.constructor = Left$2901;
            function Right$2902(r$2905) {
                if (!(this instanceof Right$2902)) {
                    return new Right$2902(r$2905);
                }
                this.r = r$2905;
            }
            Right$2902.prototype = new Either$2900();
            Right$2902.prototype.constructor = Right$2902;
            var derived$2903 = Base$2482.derive({
                    name: 'Either',
                    constructor: Either$2900,
                    prototype: Either$2900.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2901,
                            prototype: Left$2901.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2902,
                            prototype: Right$2902.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2900.Left = derived$2903.variants[0].constructor;
            Either$2900.Right = derived$2903.variants[1].constructor;
            return Either$2900;
        }();
    var Left$2627 = Either$2626.Left;
    var Right$2628 = Either$2626.Right;
    instance$2496(Monad$2568, Either$2626, {
        of: function (self$2912, x$2913) {
            return Right$2628(x$2913);
        }.curry(),
        chain: function (self$2914, f$2915) {
            return function (a0$2916, a1$2917) {
                var r0$2918 = Right$2628.unapply(a0$2916);
                if (r0$2918 != null && (r0$2918.length === 1 && (typeof a1$2917 === 'function' || Object.prototype.toString.call(a1$2917) === '[object Function]'))) {
                    var x$2920 = r0$2918[0];
                    return f$2915(x$2920);
                }
                var r1$2919 = Left$2627.unapply(a0$2916);
                if (r1$2919 != null && r1$2919.length === 1) {
                    var x$2920 = r1$2919[0];
                    return self$2914;
                }
                throw new TypeError('No match');
            }.call(this, self$2914, f$2915);
        }.curry()
    });
    instance$2496(Monoid$2574, Either$2626, {
        empty: function (self$2927) {
            return Left$2627();
        }.curry(),
        concat: function (a$2928, b$2929) {
            return function (a0$2930, a1$2931) {
                if (Either$2626.hasInstance ? Either$2626.hasInstance(a0$2930) : a0$2930 instanceof Either$2626) {
                    var r0$2934 = Left$2627.unapply(a1$2931);
                    if (r0$2934 != null && r0$2934.length === 1) {
                        var x$2935 = r0$2934[0];
                        return a$2928;
                    }
                }
                var r1$2932 = Left$2627.unapply(a0$2930);
                if (r1$2932 != null && (r1$2932.length === 1 && (Either$2626.hasInstance ? Either$2626.hasInstance(a1$2931) : a1$2931 instanceof Either$2626))) {
                    var x$2935 = r1$2932[0];
                    return b$2929;
                }
                var r2$2933 = Right$2628.unapply(a0$2930);
                if (r2$2933 != null && r2$2933.length === 1) {
                    var r3$2936 = Right$2628.unapply(a1$2931);
                    if (r3$2936 != null && r3$2936.length === 1) {
                        var r1$2937 = r2$2933[0];
                        var r2$2938 = r3$2936[0];
                        return Right$2628(r1$2937.concat(r2$2938));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2928, b$2929);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2630(f$2939, acc$2940, xs$2941) {
        return function foldl$2630(f$2942, acc$2943, xs$2944) {
            return xs$2944.reduce(f$2942, acc$2943);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2632(f$2945, xs$2946) {
        return function foldl1$2632(f$2947, xs$2948) {
            return xs$2948.reduce(f$2947);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2634(f$2949, acc$2950, xs$2951) {
        return function foldr$2634(f$2952, acc$2953, xs$2954) {
            return xs$2954.reduceRight(f$2952, acc$2953);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2636(f$2955, xs$2956) {
        return function foldr1$2636(f$2957, xs$2958) {
            return xs$2958.reduceRight(f$2957);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2639(xs$2959) {
        return function flatten$2639(xs$2960) {
            return foldl1$2632(function (xs$2961, ys$2962) {
                return xs$2961.concat(ys$2962);
            }.curry(), xs$2960);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2488(Array, 'of', function (self$2963, x$2964) {
        return [x$2964];
    }.curry());
    extendNative$2488(Array.prototype, 'ap', function (self$2965, x$2966) {
        return this.chain(map$2562(__$2487, x$2966).bind(this));
    }.curry());
    extendNative$2488(Array.prototype, 'chain', function (self$2967, f$2968) {
        return function (x$2969) {
            return flatten$2639(map$2562(f$2968)(x$2969));
        }(this);
    }.curry());
    // ***************************************************************
    // **                   CurryJS.Data.Object                     **
    // ***************************************************************
    var merge$2646 = function (a$2970, b$2971) {
        var newObj$2972 = {}, k$2973;
        for (k$2973 in b$2971) {
            if (b$2971.hasOwnProperty(k$2973))
                newObj$2972[k$2973] = b$2971[k$2973];
        }
        for (k$2973 in a$2970) {
            if (a$2970.hasOwnProperty(k$2973))
                newObj$2972[k$2973] = a$2970[k$2973];
        }
        return newObj$2972;
    };
    // extendNative(Object.prototype, "map", fun (self, f) -> 
    //     foldl(fun (obj, k) -> merge(obj, k, f(self[k])), {}, Object.keys(self))
    // )
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
            },
            Object: { merge: merge$2646 }
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