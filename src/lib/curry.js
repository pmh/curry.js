(function () {
    'use strict';
    var Base$2222 = require('./adt-derivers').Base;
    var __slice$2224 = [].slice;
    var __toString$2226 = {}.toString;
    // ***************************************************************
    // **                       CurryJS.Core                        **
    // ***************************************************************
    // __ :: () -> ()
    var __$2227 = function noop() {
    };
    var extendNative$2228 = function (native$2315, prop$2316, f$2317) {
        return Object.defineProperty(native$2315, prop$2316, { value: f$2317 });
    };
    var withMeta$2229 = function (f$2318, meta$2319) {
        var keys$2320 = Object.keys(meta$2319);
        keys$2320.forEach(function (name$2321) {
            Object.defineProperty(f$2318, '__' + name$2321, { value: meta$2319[name$2321] });
        });
        return f$2318;
    };
    /*
  * curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))
  *
  * Given any fixed arity function it returns a new function that can be partially applied.
  *
  * Usage:
  *
  *   times    := curry(fun (a, b) a * b);
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
    var curry$2230 = function (f$2322, n$2323) {
        var arity$2324 = typeof n$2323 !== 'undefined' ? n$2323 : typeof f$2322.__arity !== 'undefined' ? f$2322.__arity : f$2322.length, name$2325 = f$2322.name || f$2322.__name;
        if (arity$2324 < 2)
            return f$2322;
        var curriedFn$2326 = withMeta$2229(function () {
                var args$2327 = [].slice.call(arguments, 0, arity$2324), realArity$2328 = args$2327.filter(function (x$2330) {
                        return x$2330 !== __$2227;
                    }).length, self$2329 = this;
                if (realArity$2328 >= arity$2324)
                    return f$2322.apply(self$2329, arguments);
                else {
                    var g$2331 = withMeta$2229(function () {
                            var partialArgs$2332 = [].slice.call(arguments), newArgs$2333 = [];
                            for (var i$2334 = 0; i$2334 < args$2327.length; i$2334++)
                                newArgs$2333[i$2334] = args$2327[i$2334] === __$2227 ? partialArgs$2332.length === 0 ? undefined : partialArgs$2332.shift() : args$2327[i$2334];
                            return curriedFn$2326.apply(self$2329, newArgs$2333.concat(partialArgs$2332));
                        }, {
                            name: name$2325,
                            arity: arity$2324 - realArity$2328,
                            curried: true
                        });
                    g$2331.toString = curriedFn$2326.toString.bind(curriedFn$2326);
                    return g$2331;
                }
            }, {
                name: name$2325,
                arity: arity$2324,
                curried: true
            });
        curriedFn$2326.toString = f$2322.toString.bind(f$2322);
        return curriedFn$2326;
    };
    extendNative$2228(Function.prototype, 'curry', function (n$2335) {
        return curry$2230(this, n$2335);
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
    var compose$2231 = function () {
        var fns$2336 = __slice$2224.call(arguments), self$2337 = this;
        return fns$2336.reduce(function (f$2338, g$2339) {
            return function () {
                return f$2338.call(self$2337, g$2339.apply(self$2337, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2269(x$2340) {
        return function not$2269(x$2341) {
            return !x$2341;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2270(xs$2342) {
        return function and$2270(xs$2343) {
            return xs$2343.every(function (x$2344) {
                return !!x$2344;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2271(xs$2345) {
        return function or$2271(xs$2346) {
            return xs$2346.some(function (x$2347) {
                return !!x$2347;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2272(x$2348) {
        return function isObject$2272(x$2349) {
            return function (a0$2350) {
                if (Object.prototype.toString.call(a0$2350) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2349);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2273(x$2351) {
        return function isArray$2273(x$2352) {
            return function (a0$2353) {
                if (Array.isArray ? Array.isArray(a0$2353) : Object.prototype.toString.call(a0$2353) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2352);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2274(x$2354) {
        return function isNumber$2274(x$2355) {
            return function (a0$2356) {
                if (typeof a0$2356 === 'number' || Object.prototype.toString.call(a0$2356) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2355);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2275(x$2357) {
        return function isRegExp$2275(x$2358) {
            return function (a0$2359) {
                if (Object.prototype.toString.call(a0$2359) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2358);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2276(x$2360) {
        return function isString$2276(x$2361) {
            return function (a0$2362) {
                if (typeof a0$2362 === 'string' || Object.prototype.toString.call(a0$2362) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2361);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2277(x$2363) {
        return function isNull$2277(x$2364) {
            return function (a0$2365) {
                if (a0$2365 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2364);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2278(x$2366) {
        return function isUndef$2278(x$2367) {
            return function (a0$2368) {
                if (a0$2368 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2367);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2279(x$2369) {
        return function exists$2279(x$2370) {
            return function (x$2371) {
                return not$2269(or$2271(x$2371));
            }([
                isNull$2277(x$2370),
                isUndef$2278(x$2370)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2280(f$2372, xs$2373) {
        return function map$2280(f$2374, xs$2375) {
            return xs$2375.map(f$2374);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2282(f$2376, xs$2377) {
        return function ap$2282(f$2378, xs$2379) {
            return f$2378.ap(xs$2379);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2284(xs$2380, f$2381) {
        return function chain$2284(xs$2382, f$2383) {
            return xs$2382.chain(f$2383);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2289(f$2384, x$2385) {
        return function pure$2289(f$2386, x$2387) {
            return f$2386.of ? f$2386.of(x$2387) : f$2386.constructor.of(x$2387);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2290 = function () {
            function Option$2388() {
            }
            function Some$2389(val$2392) {
                if (!(this instanceof Some$2389)) {
                    return new Some$2389(val$2392);
                }
                this.val = val$2392;
            }
            Some$2389.prototype = new Option$2388();
            Some$2389.prototype.constructor = Some$2389;
            function None$2390() {
            }
            None$2390.prototype = new Option$2388();
            None$2390.prototype.constructor = None$2390;
            var derived$2391 = Base$2222.derive({
                    name: 'Option',
                    constructor: Option$2388,
                    prototype: Option$2388.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2389,
                            prototype: Some$2389.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2390,
                            prototype: None$2390.prototype
                        }
                    ]
                });
            Option$2388.Some = derived$2391.variants[0].constructor;
            Option$2388.None = new derived$2391.variants[1].constructor();
            return Option$2388;
        }();
    var Some$2291 = Option$2290.Some;
    var None$2292 = Option$2290.None;
    Option$2290.of = Some$2291;
    Option$2290.prototype.map = function (f$2393) {
        return this.chain(function (x$2394) {
            return pure$2289(this)(f$2393(x$2394));
        }.bind(this));
    }.curry();
    Option$2290.prototype.ap = function (x$2395) {
        return this.chain(map$2280(__$2227, x$2395).bind(this));
    }.curry();
    Option$2290.prototype.chain = function (f$2396) {
        return function (a0$2397) {
            var r0$2398 = Some$2291.unapply(a0$2397);
            if (r0$2398 != null && r0$2398.length === 1) {
                var x$2399 = r0$2398[0];
                return f$2396(x$2399);
            }
            if (None$2292.hasInstance ? None$2292.hasInstance(a0$2397) : a0$2397 instanceof None$2292) {
                return None$2292;
            }
            throw new TypeError('No match');
        }.call(this, this);
    }.curry();
    Option$2290.prototype.empty = function () {
        return None$2292;
    }.curry();
    Option$2290.prototype.concat = function (other$2400) {
        return function (a0$2401, a1$2402) {
            if (None$2292.hasInstance ? None$2292.hasInstance(a0$2401) : a0$2401 instanceof None$2292) {
                return other$2400;
            }
            if (None$2292.hasInstance ? None$2292.hasInstance(a1$2402) : a1$2402 instanceof None$2292) {
                return this;
            }
            var r0$2403 = Some$2291.unapply(a1$2402);
            if (r0$2403 != null && r0$2403.length === 1) {
                var r1$2404 = Some$2291.unapply(a0$2401);
                if (r1$2404 != null && r1$2404.length === 1) {
                    var v1$2405 = r1$2404[0];
                    var v2$2406 = r0$2403[0];
                    return Some$2291(v1$2405.concat(v2$2406));
                }
            }
            throw new TypeError('No match');
        }.call(this, this, other$2400);
    }.curry();
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2308(f$2407, acc$2408, xs$2409) {
        return function foldl$2308(f$2410, acc$2411, xs$2412) {
            return xs$2412.reduce(f$2410, acc$2411);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2310(f$2413, xs$2414) {
        return function foldl1$2310(f$2415, xs$2416) {
            return xs$2416.reduce(f$2415);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2312(f$2417, acc$2418, xs$2419) {
        return function foldr$2312(f$2420, acc$2421, xs$2422) {
            return xs$2422.reduceRight(f$2420, acc$2421);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2314(f$2423, xs$2424) {
        return function foldr1$2314(f$2425, xs$2426) {
            return xs$2426.reduceRight(f$2425);
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        Core: {
            __: __$2227,
            curry: curry$2230,
            compose: compose$2231
        },
        Predicates: {
            not: not$2269,
            and: and$2270,
            or: or$2271,
            isObject: isObject$2272,
            isArray: isArray$2273,
            isNumber: isNumber$2274,
            isRegExp: isRegExp$2275,
            isString: isString$2276,
            isNull: isNull$2277,
            isUndef: isUndef$2278,
            exists: exists$2279
        },
        Data: {
            Option: {
                Option: Option$2290,
                Some: Some$2291,
                None: None$2292
            },
            Collection: {
                foldl: foldl$2308,
                foldl1: foldl1$2310,
                foldr: foldr$2312,
                foldr1: foldr1$2314
            }
        },
        Control: {
            Functor: { map: map$2280 },
            Applicative: { ap: ap$2282 },
            Monad: { chain: chain$2284 }
        }
    };
}());
//# sourceMappingURL=curry.js.map