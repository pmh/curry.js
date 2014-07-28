(function () {
    'use strict';
    var __slice$2511 = [].slice;
    var __toString$2513 = {}.toString;
    // __ :: () -> ()
    var __$2514 = function noop() {
    };
    var extendNative$2515 = function (native$2524, prop$2525, f$2526) {
        return Object.defineProperty(native$2524, prop$2525, {
            value: function () {
                return f$2526.apply(this, [this].concat(__slice$2511.call(arguments)));
            },
            configurable: true,
            writable: true
        });
    };
    var withMeta$2516 = function (f$2527, meta$2528) {
        var keys$2529 = Object.keys(meta$2528);
        keys$2529.forEach(function (name$2530) {
            Object.defineProperty(f$2527, '__' + name$2530, { value: meta$2528[name$2530] });
        });
        return f$2527;
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
    var curry$2517 = function (f$2531, n$2532) {
        var arity$2533 = typeof n$2532 !== 'undefined' ? n$2532 : typeof f$2531.__arity !== 'undefined' ? f$2531.__arity : f$2531.length, name$2534 = f$2531.name || f$2531.__name;
        if (arity$2533 < 2)
            return f$2531;
        var curriedFn$2535 = withMeta$2516(function () {
                var args$2536 = [].slice.call(arguments, 0, arity$2533), realArity$2537 = args$2536.filter(function (x$2539) {
                        return x$2539 !== __$2514;
                    }).length, self$2538 = this;
                if (realArity$2537 >= arity$2533)
                    return f$2531.apply(self$2538, arguments);
                else {
                    var g$2540 = withMeta$2516(function () {
                            var partialArgs$2541 = [].slice.call(arguments), newArgs$2542 = [];
                            for (var i$2543 = 0; i$2543 < args$2536.length; i$2543++)
                                newArgs$2542[i$2543] = args$2536[i$2543] === __$2514 ? partialArgs$2541.length === 0 ? undefined : partialArgs$2541.shift() : args$2536[i$2543];
                            return curriedFn$2535.apply(self$2538, newArgs$2542.concat(partialArgs$2541));
                        }, {
                            name: name$2534,
                            arity: arity$2533 - realArity$2537,
                            curried: true
                        });
                    g$2540.toString = curriedFn$2535.toString.bind(curriedFn$2535);
                    return g$2540;
                }
            }, {
                name: name$2534,
                arity: arity$2533,
                curried: true
            });
        curriedFn$2535.toString = f$2531.toString.bind(f$2531);
        return curriedFn$2535;
    };
    extendNative$2515(Function.prototype, 'curry', function (self$2544, n$2545) {
        return curry$2517(self$2544, n$2545);
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
    var compose$2518 = function () {
        var fns$2546 = __slice$2511.call(arguments), self$2547 = this;
        return fns$2546.reduce(function (f$2548, g$2549) {
            return function () {
                return f$2548.call(self$2547, g$2549.apply(self$2547, arguments));
            };
        });
    };
    var // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
    Protocol$2520 = function (name$2550, spec$2551) {
        return {
            name: name$2550,
            spec: spec$2551,
            instance: function (type$2552, impl$2553) {
                var name$2554 = this.name, spec$2555 = this.spec, constructor$2556 = spec$2555.constructor, proto$2557 = spec$2555.prototype, k$2558;
                Object.keys(constructor$2556 || {}).map(function (field$2559) {
                    if (constructor$2556[field$2559] === Protocol$2520.required && !impl$2553.hasOwnProperty(field$2559) && !type$2552.hasOwnProperty(field$2559))
                        throw Protocol$2520.required(name$2554, field$2559);
                    else if (!type$2552.hasOwnProperty(field$2559) && !impl$2553.hasOwnProperty(field$2559))
                        type$2552[field$2559] = function () {
                            return constructor$2556[field$2559].curry().apply(this, [this].concat(__slice$2511.call(arguments)));
                        };
                    else if (impl$2553.hasOwnProperty(field$2559))
                        type$2552[field$2559] = function () {
                            return impl$2553[field$2559].curry().apply(this, [this].concat(__slice$2511.call(arguments)));
                        };
                });
                Object.keys(proto$2557 || {}).map(function (field$2560) {
                    if (proto$2557[field$2560] === Protocol$2520.required && !impl$2553.hasOwnProperty(field$2560) && !type$2552.prototype.hasOwnProperty(field$2560))
                        throw Protocol$2520.required(name$2554, field$2560);
                    else if (!type$2552.prototype.hasOwnProperty(field$2560) && !impl$2553.hasOwnProperty(field$2560))
                        type$2552.prototype[field$2560] = function () {
                            return proto$2557[field$2560].curry().apply(this, [this].concat(__slice$2511.call(arguments)));
                        };
                    else if (impl$2553.hasOwnProperty(field$2560))
                        type$2552.prototype[field$2560] = function () {
                            return impl$2553[field$2560].curry().apply(this, [this].concat(__slice$2511.call(arguments)));
                        };
                });
            }
        };
    };
    Protocol$2520.required = function (name$2561, field$2562) {
        return new Error(name$2561 + ' expected required field: \'' + field$2562 + '\' to be defined!');
    }.curry();
    // instance :: Protocol -> ADT -> Object -> undefined
    function instance$2523(protocol$2563, type$2564, impl$2565) {
        return function instance$2523(protocol$2566, type$2567, impl$2568) {
            return protocol$2566.instance(type$2567, impl$2568);
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        __: __$2514,
        extendNative: extendNative$2515,
        curry: curry$2517,
        compose: compose$2518,
        Protocol: Protocol$2520,
        instance: instance$2523
    };
}());
//# sourceMappingURL=index.js.map