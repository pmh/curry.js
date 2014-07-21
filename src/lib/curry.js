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
        return Object.defineProperty(native$2646, prop$2647, {
            value: function () {
                return f$2648.apply(this, [this].concat(__slice$2484.call(arguments)));
            }
        });
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
    extendNative$2488(Function.prototype, 'curry', function (self$2666, n$2667) {
        return curry$2490(self$2666, n$2667);
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
        var fns$2668 = __slice$2484.call(arguments), self$2669 = this;
        return fns$2668.reduce(function (f$2670, g$2671) {
            return function () {
                return f$2670.call(self$2669, g$2671.apply(self$2669, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2493 = function (name$2672, spec$2673) {
        return {
            name: name$2672,
            spec: spec$2673,
            instance: function (type$2674, impl$2675) {
                var name$2676 = this.name, spec$2677 = this.spec, constructor$2678 = spec$2677.constructor, proto$2679 = spec$2677.prototype, k$2680;
                Object.keys(constructor$2678 || {}).map(function (field$2681) {
                    if (constructor$2678[field$2681] === Protocol$2493.required && !impl$2675.hasOwnProperty(field$2681) && !type$2674.hasOwnProperty(field$2681))
                        throw Protocol$2493.required(name$2676, field$2681);
                    else if (!type$2674.hasOwnProperty(field$2681) && !impl$2675.hasOwnProperty(field$2681))
                        type$2674[field$2681] = function () {
                            return constructor$2678[field$2681].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                    else if (impl$2675.hasOwnProperty(field$2681))
                        type$2674[field$2681] = function () {
                            return impl$2675[field$2681].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                });
                Object.keys(proto$2679 || {}).map(function (field$2682) {
                    if (proto$2679[field$2682] === Protocol$2493.required && !impl$2675.hasOwnProperty(field$2682) && !type$2674.prototype.hasOwnProperty(field$2682))
                        throw Protocol$2493.required(name$2676, field$2682);
                    else if (!type$2674.prototype.hasOwnProperty(field$2682) && !impl$2675.hasOwnProperty(field$2682))
                        type$2674.prototype[field$2682] = function () {
                            return proto$2679[field$2682].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                    else if (impl$2675.hasOwnProperty(field$2682))
                        type$2674.prototype[field$2682] = function () {
                            return impl$2675[field$2682].curry().apply(this, [this].concat(__slice$2484.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2493.required = function (name$2683, field$2684) {
        return new Error(name$2683 + ' expected required field: \'' + field$2684 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2496(protocol$2685, type$2686, impl$2687) {
        return function instance$2496(protocol$2688, type$2689, impl$2690) {
            return protocol$2688.instance(type$2689, impl$2690);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2544(x$2691) {
        return function not$2544(x$2692) {
            return !x$2692;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2545(xs$2693) {
        return function and$2545(xs$2694) {
            return xs$2694.every(function (x$2695) {
                return !!x$2695;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2546(xs$2696) {
        return function or$2546(xs$2697) {
            return xs$2697.some(function (x$2698) {
                return !!x$2698;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2547(x$2699) {
        return function isObject$2547(x$2700) {
            return function (a0$2701) {
                if (Object.prototype.toString.call(a0$2701) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2700);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2548(x$2702) {
        return function isArray$2548(x$2703) {
            return function (a0$2704) {
                if (Array.isArray ? Array.isArray(a0$2704) : Object.prototype.toString.call(a0$2704) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2703);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2549(x$2705) {
        return function isNumber$2549(x$2706) {
            return function (a0$2707) {
                if (typeof a0$2707 === 'number' || Object.prototype.toString.call(a0$2707) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2706);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2550(x$2708) {
        return function isRegExp$2550(x$2709) {
            return function (a0$2710) {
                if (Object.prototype.toString.call(a0$2710) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2709);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2551(x$2711) {
        return function isString$2551(x$2712) {
            return function (a0$2713) {
                if (typeof a0$2713 === 'string' || Object.prototype.toString.call(a0$2713) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2712);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2552(x$2714) {
        return function isNull$2552(x$2715) {
            return function (a0$2716) {
                if (a0$2716 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2715);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2553(x$2717) {
        return function isUndef$2553(x$2718) {
            return function (a0$2719) {
                if (a0$2719 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2718);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2554(x$2720) {
        return function exists$2554(x$2721) {
            return function (x$2722) {
                return not$2544(or$2546(x$2722));
            }([
                isNull$2552(x$2721),
                isUndef$2553(x$2721)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                        CurryJS.Math                       **
    // ***************************************************************  
    // plus :: Number a => a -> a -> a
    function plus$2555(a$2723, b$2724) {
        return function plus$2555(a$2725, b$2726) {
            return a$2725 + b$2726;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2556(a$2727, b$2728) {
        return function minus$2556(a$2729, b$2730) {
            return a$2729 - b$2730;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2557(a$2731, b$2732) {
        return function times$2557(a$2733, b$2734) {
            return a$2733 * b$2734;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2558(a$2735, b$2736) {
        return function div$2558(a$2737, b$2738) {
            return a$2737 / b$2738;
        }.curry().apply(null, arguments);
    }
    var
        // ***************************************************************
        // **                  CurryJS.Control.Functor                  **
        // ***************************************************************
        Functor$2560 = Protocol$2493('Functor', { prototype: { map: Protocol$2493.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2562(f$2739, xs$2740) {
        return function map$2562(f$2741, xs$2742) {
            return xs$2742.map(f$2741);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                CurryJS.Control.Applicative                **
        // ***************************************************************
        Applicative$2564 = Protocol$2493('Applicative', { prototype: { ap: Protocol$2493.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2566(f$2743, xs$2744) {
        return function ap$2566(f$2745, xs$2746) {
            return f$2745.ap(xs$2746);
        }.curry().apply(null, arguments);
    }
    ;
    var
        // ***************************************************************
        // **                   CurryJS.Control.Monad                   **
        // ***************************************************************
        Monad$2568 = Protocol$2493('Monad', {
            constructor: {
                of: function (x$2748) {
                    return this.prototype.of(x$2748);
                }.curry()
            },
            prototype: {
                of: Protocol$2493.required,
                chain: Protocol$2493.required,
                map: function (self$2754, f$2755) {
                    return self$2754.chain(function (x$2756) {
                        return self$2754.of(f$2755(x$2756));
                    }.bind(this));
                }.curry(),
                ap: function (self$2757, x$2758) {
                    return self$2757.chain(map$2562(__$2487, x$2758).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2570(xs$2759, f$2760) {
        return function chain$2570(xs$2761, f$2762) {
            return xs$2761.chain(f$2762);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2572(f$2763, x$2764) {
        return function pure$2572(f$2765, x$2766) {
            return f$2765.of ? f$2765.of(x$2766) : f$2765.constructor.of(x$2766);
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
    function concat$2576(a$2769, b$2770) {
        return function concat$2576(a$2771, b$2772) {
            return a$2771.concat(b$2772);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Number.Sum                     **
    // *************************************************************** 
    var Sum$2580 = function () {
            function Sum$2773(_0$2775) {
                if (!(this instanceof Sum$2773)) {
                    return new Sum$2773(_0$2775);
                }
                if (typeof _0$2775 === 'number' || Object.prototype.toString.call(_0$2775) === '[object Number]') {
                    this['0'] = _0$2775;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2773.prototype.length = 1;
            var derived$2774 = Base$2482.derive({
                    name: 'Sum',
                    constructor: Sum$2773,
                    prototype: Sum$2773.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2773,
                            prototype: Sum$2773.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2774.constructor;
        }();
    instance$2496(Monoid$2574, Sum$2580, {
        empty: function () {
            return Sum$2580(0);
        }.curry(),
        concat: function (a$2783, b$2784) {
            return function (a0$2785, a1$2786) {
                var r0$2787 = Sum$2580.unapply(a0$2785);
                if (r0$2787 != null && r0$2787.length === 1) {
                    var r1$2788 = Sum$2580.unapply(a1$2786);
                    if (r1$2788 != null && r1$2788.length === 1) {
                        var x$2789 = r0$2787[0];
                        var y$2790 = r1$2788[0];
                        return Sum$2580(x$2789 + y$2790);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2783, b$2784);
        }.curry()
    });
    function getSum$2589(x$2791) {
        return function getSum$2589(x$2792) {
            return function (a0$2793) {
                var r0$2794 = Sum$2580.unapply(a0$2793);
                if (r0$2794 != null && r0$2794.length === 1) {
                    var x$2795 = r0$2794[0];
                    return x$2795;
                }
                throw new TypeError('No match');
            }.call(this, x$2792);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Number.Product                   **
    // *************************************************************** 
    var Product$2590 = function () {
            function Product$2796(_0$2798) {
                if (!(this instanceof Product$2796)) {
                    return new Product$2796(_0$2798);
                }
                if (typeof _0$2798 === 'number' || Object.prototype.toString.call(_0$2798) === '[object Number]') {
                    this['0'] = _0$2798;
                } else {
                    throw new TypeError('Unexpected type for field: Product.0');
                }
            }
            Product$2796.prototype.length = 1;
            var derived$2797 = Base$2482.derive({
                    name: 'Product',
                    constructor: Product$2796,
                    prototype: Product$2796.prototype,
                    variants: [{
                            name: 'Product',
                            constructor: Product$2796,
                            prototype: Product$2796.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2797.constructor;
        }();
    instance$2496(Monoid$2574, Product$2590, {
        empty: function (self$2805) {
            return Product$2590(1);
        }.curry(),
        concat: function (a$2806, b$2807) {
            return function (a0$2808, a1$2809) {
                var r0$2810 = Product$2590.unapply(a0$2808);
                if (r0$2810 != null && r0$2810.length === 1) {
                    var r1$2811 = Product$2590.unapply(a1$2809);
                    if (r1$2811 != null && r1$2811.length === 1) {
                        var x$2812 = r0$2810[0];
                        var y$2813 = r1$2811[0];
                        return Product$2590(x$2812 * y$2813);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2806, b$2807);
        }.curry()
    });
    function getProduct$2599(x$2814) {
        return function getProduct$2599(x$2815) {
            return function (a0$2816) {
                var r0$2817 = Product$2590.unapply(a0$2816);
                if (r0$2817 != null && r0$2817.length === 1) {
                    var x$2818 = r0$2817[0];
                    return x$2818;
                }
                throw new TypeError('No match');
            }.call(this, x$2815);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Max                     **
    // *************************************************************** 
    var Max$2600 = function () {
            function Max$2819(_0$2821) {
                if (!(this instanceof Max$2819)) {
                    return new Max$2819(_0$2821);
                }
                if (typeof _0$2821 === 'number' || Object.prototype.toString.call(_0$2821) === '[object Number]') {
                    this['0'] = _0$2821;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2819.prototype.length = 1;
            var derived$2820 = Base$2482.derive({
                    name: 'Max',
                    constructor: Max$2819,
                    prototype: Max$2819.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2819,
                            prototype: Max$2819.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2820.constructor;
        }();
    instance$2496(Monoid$2574, Max$2600, {
        empty: function (self$2828) {
            return Max$2600(-Infinity);
        }.curry(),
        concat: function (a$2829, b$2830) {
            return function (a0$2831, a1$2832) {
                var r0$2833 = Max$2600.unapply(a0$2831);
                if (r0$2833 != null && r0$2833.length === 1) {
                    var r1$2834 = Max$2600.unapply(a1$2832);
                    if (r1$2834 != null && r1$2834.length === 1) {
                        var x$2835 = r0$2833[0];
                        var y$2836 = r1$2834[0];
                        return Max$2600(x$2835 > y$2836 ? x$2835 : y$2836);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2829, b$2830);
        }.curry()
    });
    function getMax$2609(x$2837) {
        return function getMax$2609(x$2838) {
            return function (a0$2839) {
                var r0$2840 = Max$2600.unapply(a0$2839);
                if (r0$2840 != null && r0$2840.length === 1) {
                    var x$2841 = r0$2840[0];
                    return x$2841;
                }
                throw new TypeError('No match');
            }.call(this, x$2838);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Number.Min                     **
    // *************************************************************** 
    var Min$2610 = function () {
            function Min$2842(_0$2844) {
                if (!(this instanceof Min$2842)) {
                    return new Min$2842(_0$2844);
                }
                if (typeof _0$2844 === 'number' || Object.prototype.toString.call(_0$2844) === '[object Number]') {
                    this['0'] = _0$2844;
                } else {
                    throw new TypeError('Unexpected type for field: Min.0');
                }
            }
            Min$2842.prototype.length = 1;
            var derived$2843 = Base$2482.derive({
                    name: 'Min',
                    constructor: Min$2842,
                    prototype: Min$2842.prototype,
                    variants: [{
                            name: 'Min',
                            constructor: Min$2842,
                            prototype: Min$2842.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2843.constructor;
        }();
    instance$2496(Monoid$2574, Min$2610, {
        empty: function (self$2851) {
            return Min$2610(Infinity);
        }.curry(),
        concat: function (a$2852, b$2853) {
            return function (a0$2854, a1$2855) {
                var r0$2856 = Min$2610.unapply(a0$2854);
                if (r0$2856 != null && r0$2856.length === 1) {
                    var r1$2857 = Min$2610.unapply(a1$2855);
                    if (r1$2857 != null && r1$2857.length === 1) {
                        var x$2858 = r0$2856[0];
                        var y$2859 = r1$2857[0];
                        return Min$2610(x$2858 < y$2859 ? x$2858 : y$2859);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2852, b$2853);
        }.curry()
    });
    function getMin$2619(x$2860) {
        return function getMin$2619(x$2861) {
            return function (a0$2862) {
                var r0$2863 = Min$2610.unapply(a0$2862);
                if (r0$2863 != null && r0$2863.length === 1) {
                    var x$2864 = r0$2863[0];
                    return x$2864;
                }
                throw new TypeError('No match');
            }.call(this, x$2861);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2620 = function () {
            function Option$2865() {
            }
            function Some$2866(val$2869) {
                if (!(this instanceof Some$2866)) {
                    return new Some$2866(val$2869);
                }
                this.val = val$2869;
            }
            Some$2866.prototype = new Option$2865();
            Some$2866.prototype.constructor = Some$2866;
            function None$2867() {
            }
            None$2867.prototype = new Option$2865();
            None$2867.prototype.constructor = None$2867;
            var derived$2868 = Base$2482.derive({
                    name: 'Option',
                    constructor: Option$2865,
                    prototype: Option$2865.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2866,
                            prototype: Some$2866.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2867,
                            prototype: None$2867.prototype
                        }
                    ]
                });
            Option$2865.Some = derived$2868.variants[0].constructor;
            Option$2865.None = new derived$2868.variants[1].constructor();
            return Option$2865;
        }();
    var Some$2621 = Option$2620.Some;
    var None$2622 = Option$2620.None;
    instance$2496(Monad$2568, Option$2620, {
        of: function (self$2876, x$2877) {
            return Some$2621(x$2877);
        }.curry(),
        chain: function (self$2878, f$2879) {
            return function (a0$2880, a1$2881) {
                var r0$2882 = Some$2621.unapply(a0$2880);
                if (r0$2882 != null && (r0$2882.length === 1 && (typeof a1$2881 === 'function' || Object.prototype.toString.call(a1$2881) === '[object Function]'))) {
                    var x$2883 = r0$2882[0];
                    return f$2879(x$2883);
                }
                if ((None$2622.hasInstance ? None$2622.hasInstance(a0$2880) : a0$2880 instanceof None$2622) && (typeof a1$2881 === 'function' || Object.prototype.toString.call(a1$2881) === '[object Function]')) {
                    return None$2622;
                }
                throw new TypeError('No match');
            }.call(this, self$2878, f$2879);
        }.curry()
    });
    instance$2496(Monoid$2574, Option$2620, {
        empty: function (self$2890) {
            return None$2622;
        }.curry(),
        concat: function (a$2891, b$2892) {
            return function (a0$2893, a1$2894) {
                if ((Option$2620.hasInstance ? Option$2620.hasInstance(a0$2893) : a0$2893 instanceof Option$2620) && (None$2622.hasInstance ? None$2622.hasInstance(a1$2894) : a1$2894 instanceof None$2622)) {
                    return a$2891;
                }
                if ((None$2622.hasInstance ? None$2622.hasInstance(a0$2893) : a0$2893 instanceof None$2622) && (Option$2620.hasInstance ? Option$2620.hasInstance(a1$2894) : a1$2894 instanceof Option$2620)) {
                    return b$2892;
                }
                var r0$2895 = Some$2621.unapply(a0$2893);
                if (r0$2895 != null && r0$2895.length === 1) {
                    var r1$2896 = Some$2621.unapply(a1$2894);
                    if (r1$2896 != null && r1$2896.length === 1) {
                        var v1$2897 = r0$2895[0];
                        var v2$2898 = r1$2896[0];
                        return Some$2621(v1$2897.concat(v2$2898));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2891, b$2892);
        }.curry()
    });
    // ***************************************************************
    // **                    CurryJS.Data.Either                    **
    // ***************************************************************
    var Either$2626 = function () {
            function Either$2899() {
            }
            function Left$2900(l$2903) {
                if (!(this instanceof Left$2900)) {
                    return new Left$2900(l$2903);
                }
                this.l = l$2903;
            }
            Left$2900.prototype = new Either$2899();
            Left$2900.prototype.constructor = Left$2900;
            function Right$2901(r$2904) {
                if (!(this instanceof Right$2901)) {
                    return new Right$2901(r$2904);
                }
                this.r = r$2904;
            }
            Right$2901.prototype = new Either$2899();
            Right$2901.prototype.constructor = Right$2901;
            var derived$2902 = Base$2482.derive({
                    name: 'Either',
                    constructor: Either$2899,
                    prototype: Either$2899.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2900,
                            prototype: Left$2900.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2901,
                            prototype: Right$2901.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2899.Left = derived$2902.variants[0].constructor;
            Either$2899.Right = derived$2902.variants[1].constructor;
            return Either$2899;
        }();
    var Left$2627 = Either$2626.Left;
    var Right$2628 = Either$2626.Right;
    instance$2496(Monad$2568, Either$2626, {
        of: function (self$2911, x$2912) {
            return Right$2628(x$2912);
        }.curry(),
        chain: function (self$2913, f$2914) {
            return function (a0$2915, a1$2916) {
                var r0$2917 = Right$2628.unapply(a0$2915);
                if (r0$2917 != null && (r0$2917.length === 1 && (typeof a1$2916 === 'function' || Object.prototype.toString.call(a1$2916) === '[object Function]'))) {
                    var x$2919 = r0$2917[0];
                    return f$2914(x$2919);
                }
                var r1$2918 = Left$2627.unapply(a0$2915);
                if (r1$2918 != null && r1$2918.length === 1) {
                    var x$2919 = r1$2918[0];
                    return self$2913;
                }
                throw new TypeError('No match');
            }.call(this, self$2913, f$2914);
        }.curry()
    });
    instance$2496(Monoid$2574, Either$2626, {
        empty: function (self$2926) {
            return Left$2627();
        }.curry(),
        concat: function (a$2927, b$2928) {
            return function (a0$2929, a1$2930) {
                if (Either$2626.hasInstance ? Either$2626.hasInstance(a0$2929) : a0$2929 instanceof Either$2626) {
                    var r0$2933 = Left$2627.unapply(a1$2930);
                    if (r0$2933 != null && r0$2933.length === 1) {
                        var x$2934 = r0$2933[0];
                        return a$2927;
                    }
                }
                var r1$2931 = Left$2627.unapply(a0$2929);
                if (r1$2931 != null && (r1$2931.length === 1 && (Either$2626.hasInstance ? Either$2626.hasInstance(a1$2930) : a1$2930 instanceof Either$2626))) {
                    var x$2934 = r1$2931[0];
                    return b$2928;
                }
                var r2$2932 = Right$2628.unapply(a0$2929);
                if (r2$2932 != null && r2$2932.length === 1) {
                    var r3$2935 = Right$2628.unapply(a1$2930);
                    if (r3$2935 != null && r3$2935.length === 1) {
                        var r1$2936 = r2$2932[0];
                        var r2$2937 = r3$2935[0];
                        return Right$2628(r1$2936.concat(r2$2937));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2927, b$2928);
        }.curry()
    });
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2630(f$2938, acc$2939, xs$2940) {
        return function foldl$2630(f$2941, acc$2942, xs$2943) {
            return xs$2943.reduce(f$2941, acc$2942);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2632(f$2944, xs$2945) {
        return function foldl1$2632(f$2946, xs$2947) {
            return xs$2947.reduce(f$2946);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2634(f$2948, acc$2949, xs$2950) {
        return function foldr$2634(f$2951, acc$2952, xs$2953) {
            return xs$2953.reduceRight(f$2951, acc$2952);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2636(f$2954, xs$2955) {
        return function foldr1$2636(f$2956, xs$2957) {
            return xs$2957.reduceRight(f$2956);
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2639(xs$2958) {
        return function flatten$2639(xs$2959) {
            return foldl1$2632(function (xs$2960, ys$2961) {
                return xs$2960.concat(ys$2961);
            }.curry(), xs$2959);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                    CurryJS.Data.Array                     **
    // ***************************************************************
    extendNative$2488(Array, 'of', function (self$2962, x$2963) {
        return [x$2963];
    }.curry());
    extendNative$2488(Array.prototype, 'ap', function (self$2964, x$2965) {
        return this.chain(map$2562(__$2487, x$2965).bind(this));
    }.curry());
    extendNative$2488(Array.prototype, 'chain', function (self$2966, f$2967) {
        return function (x$2968) {
            return flatten$2639(map$2562(f$2967)(x$2968));
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