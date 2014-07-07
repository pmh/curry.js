(function () {
    'use strict';
    var Base$2227 = require('./adt-derivers').Base;
    var __slice$2229 = [].slice;
    var __toString$2231 = {}.toString;
    // ***************************************************************
    // **                       CurryJS.Core                        **
    // ***************************************************************
    // __ :: () -> ()
    var __$2232 = function noop() {
    };
    var extendNative$2233 = function (native$2319, prop$2320, f$2321) {
        return Object.defineProperty(native$2319, prop$2320, { value: f$2321 });
    };
    var withMeta$2234 = function (f$2322, meta$2323) {
        var keys$2324 = Object.keys(meta$2323);
        keys$2324.forEach(function (name$2325) {
            Object.defineProperty(f$2322, '__' + name$2325, { value: meta$2323[name$2325] });
        });
        return f$2322;
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
    var curry$2235 = function (f$2326, n$2327) {
        var arity$2328 = typeof n$2327 !== 'undefined' ? n$2327 : typeof f$2326.__arity !== 'undefined' ? f$2326.__arity : f$2326.length, name$2329 = f$2326.name || f$2326.__name;
        if (arity$2328 < 2)
            return f$2326;
        var curriedFn$2330 = withMeta$2234(function () {
                var args$2331 = [].slice.call(arguments, 0, arity$2328), realArity$2332 = args$2331.filter(function (x$2334) {
                        return x$2334 !== __$2232;
                    }).length, self$2333 = this;
                if (realArity$2332 >= arity$2328)
                    return f$2326.apply(self$2333, arguments);
                else {
                    var g$2335 = withMeta$2234(function () {
                            var partialArgs$2336 = [].slice.call(arguments), newArgs$2337 = [];
                            for (var i$2338 = 0; i$2338 < args$2331.length; i$2338++)
                                newArgs$2337[i$2338] = args$2331[i$2338] === __$2232 ? partialArgs$2336.length === 0 ? undefined : partialArgs$2336.shift() : args$2331[i$2338];
                            return curriedFn$2330.apply(self$2333, newArgs$2337.concat(partialArgs$2336));
                        }, {
                            name: name$2329,
                            arity: arity$2328 - realArity$2332,
                            curried: true
                        });
                    g$2335.toString = curriedFn$2330.toString.bind(curriedFn$2330);
                    return g$2335;
                }
            }, {
                name: name$2329,
                arity: arity$2328,
                curried: true
            });
        curriedFn$2330.toString = f$2326.toString.bind(f$2326);
        return curriedFn$2330;
    };
    extendNative$2233(Function.prototype, 'curry', function (n$2339) {
        return curry$2235(this, n$2339);
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
    var compose$2236 = function () {
        var fns$2340 = __slice$2229.call(arguments), self$2341 = this;
        return fns$2340.reduce(function (f$2342, g$2343) {
            return function () {
                return f$2342.call(self$2341, g$2343.apply(self$2341, arguments));
            };
        });
    };
    // ***************************************************************
    // **                    CurryJS.Predicates                     **
    // ***************************************************************
    // not :: Truthy -> Bool
    function not$2249(x$2344) {
        return function not$2249(x$2345) {
            return !x$2345;
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function and$2250(xs$2346) {
        return function and$2250(xs$2347) {
            return xs$2347.every(function (x$2348) {
                return !!x$2348;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // and :: [Truthy] -> Bool
    function or$2251(xs$2349) {
        return function or$2251(xs$2350) {
            return xs$2350.some(function (x$2351) {
                return !!x$2351;
            }.curry());
        }.curry().apply(null, arguments);
    }
    // isObject :: a -> Bool
    function isObject$2254(x$2352) {
        return function isObject$2254(x$2353) {
            return function (a0$2356) {
                if (Object.prototype.toString.call(a0$2356) === '[object Object]') {
                    return true;
                }
                return false;
            }.call(this, x$2353);
        }.curry().apply(null, arguments);
    }
    // isArray :: a -> Bool
    function isArray$2257(x$2357) {
        return function isArray$2257(x$2358) {
            return function (a0$2361) {
                if (Array.isArray ? Array.isArray(a0$2361) : Object.prototype.toString.call(a0$2361) === '[object Array]') {
                    return true;
                }
                return false;
            }.call(this, x$2358);
        }.curry().apply(null, arguments);
    }
    // isNumber :: a -> Bool
    function isNumber$2260(x$2362) {
        return function isNumber$2260(x$2363) {
            return function (a0$2366) {
                if (typeof a0$2366 === 'number' || Object.prototype.toString.call(a0$2366) === '[object Number]') {
                    return true;
                }
                return false;
            }.call(this, x$2363);
        }.curry().apply(null, arguments);
    }
    // isRegExp :: a -> Bool
    function isRegExp$2263(x$2367) {
        return function isRegExp$2263(x$2368) {
            return function (a0$2371) {
                if (Object.prototype.toString.call(a0$2371) === '[object RegExp]') {
                    return true;
                }
                return false;
            }.call(this, x$2368);
        }.curry().apply(null, arguments);
    }
    // isString :: a -> Bool
    function isString$2266(x$2372) {
        return function isString$2266(x$2373) {
            return function (a0$2376) {
                if (typeof a0$2376 === 'string' || Object.prototype.toString.call(a0$2376) === '[object String]') {
                    return true;
                }
                return false;
            }.call(this, x$2373);
        }.curry().apply(null, arguments);
    }
    // isNull :: a -> Bool
    function isNull$2269(x$2377) {
        return function isNull$2269(x$2378) {
            return function (a0$2381) {
                if (a0$2381 === null) {
                    return true;
                }
                return false;
            }.call(this, x$2378);
        }.curry().apply(null, arguments);
    }
    // isUndef :: a -> Bool
    function isUndef$2276(x$2382) {
        return function isUndef$2276(x$2383) {
            return function (a0$2386) {
                if (a0$2386 === void 0) {
                    return true;
                }
                return false;
            }.call(this, x$2383);
        }.curry().apply(null, arguments);
    }
    // exists :: a -> Bool
    function exists$2277(x$2387) {
        return function exists$2277(x$2388) {
            return function (x$2389) {
                return not$2249(or$2251(x$2389));
            }([
                isNull$2269(x$2388),
                isUndef$2276(x$2388)
            ]);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                  CurryJS.Control.Functor                  **
    // ***************************************************************
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2278(f$2390, xs$2391) {
        return function map$2278(f$2392, xs$2393) {
            return xs$2393.map(f$2392);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                CurryJS.Control.Applicative                **
    // ***************************************************************
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2281(f$2394, xs$2395) {
        return function ap$2281(f$2396, xs$2397) {
            return f$2396.ap(xs$2397);
        }.curry().apply(null, arguments);
    }
    ;
    // ***************************************************************
    // **                   CurryJS.Control.Monad                   **
    // ***************************************************************
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2284(xs$2398, f$2399) {
        return function chain$2284(xs$2400, f$2401) {
            return xs$2400.chain(f$2401);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2290(f$2402, x$2403) {
        return function pure$2290(f$2404, x$2405) {
            return f$2404.of ? f$2404.of(x$2405) : f$2404.constructor.of(x$2405);
        }.curry().apply(null, arguments);
    }
    // ***************************************************************
    // **                    CurryJS.Data.Option                    **
    // ***************************************************************
    var Option$2291 = function () {
            function Option$2406() {
            }
            function Some$2407(val$2410) {
                if (!(this instanceof Some$2407)) {
                    return new Some$2407(val$2410);
                }
                this.val = val$2410;
            }
            Some$2407.prototype = new Option$2406();
            Some$2407.prototype.constructor = Some$2407;
            function None$2408() {
            }
            None$2408.prototype = new Option$2406();
            None$2408.prototype.constructor = None$2408;
            var derived$2409 = Base$2227.derive({
                    name: 'Option',
                    constructor: Option$2406,
                    prototype: Option$2406.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2407,
                            prototype: Some$2407.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2408,
                            prototype: None$2408.prototype
                        }
                    ]
                });
            Option$2406.Some = derived$2409.variants[0].constructor;
            Option$2406.None = new derived$2409.variants[1].constructor();
            return Option$2406;
        }();
    var Some$2292 = Option$2291.Some;
    var None$2293 = Option$2291.None;
    Option$2291.of = Some$2292;
    Option$2291.prototype.map = function (f$2411) {
        return this.chain(function (x$2412) {
            return pure$2290(this)(f$2411(x$2412));
        }.bind(this));
    }.curry();
    Option$2291.prototype.ap = function (x$2413) {
        return this.chain(map$2278(__$2232, x$2413).bind(this));
    }.curry();
    Option$2291.prototype.chain = function (f$2414) {
        return function (a0$2417) {
            var r0$2418 = Some$2292.unapply(a0$2417);
            if (r0$2418 != null && r0$2418.length === 1) {
                var x$2419 = r0$2418[0];
                return f$2414(x$2419);
            }
            if (None$2293.hasInstance ? None$2293.hasInstance(a0$2417) : a0$2417 instanceof None$2293) {
                return None$2293;
            }
            throw new TypeError('No match');
        }.call(this, this);
    }.curry();
    Option$2291.prototype.empty = function () {
        return None$2293;
    }.curry();
    Option$2291.prototype.concat = function (other$2420) {
        return function (a0$2423, a1$2424) {
            if (None$2293.hasInstance ? None$2293.hasInstance(a0$2423) : a0$2423 instanceof None$2293) {
                return other$2420;
            }
            if (None$2293.hasInstance ? None$2293.hasInstance(a1$2424) : a1$2424 instanceof None$2293) {
                return this;
            }
            var r0$2425 = Some$2292.unapply(a1$2424);
            if (r0$2425 != null && r0$2425.length === 1) {
                var r1$2426 = Some$2292.unapply(a0$2423);
                if (r1$2426 != null && r1$2426.length === 1) {
                    var v1$2427 = r1$2426[0];
                    var v2$2428 = r0$2425[0];
                    return Some$2292(v1$2427.concat(v2$2428));
                }
            }
            throw new TypeError('No match');
        }.call(this, this, other$2420);
    }.curry();
    // ***************************************************************
    // **                  CurryJS.Data.Collection                  **
    // ***************************************************************
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2309(f$2429, acc$2430, xs$2431) {
        return function foldl$2309(f$2432, acc$2433, xs$2434) {
            return xs$2434.reduce(f$2432, acc$2433);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2312(f$2435, xs$2436) {
        return function foldl1$2312(f$2437, xs$2438) {
            return xs$2438.reduce(f$2437);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2315(f$2439, acc$2440, xs$2441) {
        return function foldr$2315(f$2442, acc$2443, xs$2444) {
            return xs$2444.reduceRight(f$2442, acc$2443);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2318(f$2445, xs$2446) {
        return function foldr1$2318(f$2447, xs$2448) {
            return xs$2448.reduceRight(f$2447);
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        Core: {
            __: __$2232,
            curry: curry$2235,
            compose: compose$2236
        },
        Predicates: {
            not: not$2249,
            and: and$2250,
            or: or$2251,
            isObject: isObject$2254,
            isArray: isArray$2257,
            isNumber: isNumber$2260,
            isRegExp: isRegExp$2263,
            isString: isString$2266,
            isNull: isNull$2269,
            isUndef: isUndef$2276,
            exists: exists$2277
        },
        Data: {
            Option: {
                Option: Option$2291,
                Some: Some$2292,
                None: None$2293
            },
            Collection: {
                foldl: foldl$2309,
                foldl1: foldl1$2312,
                foldr: foldr$2315,
                foldr1: foldr1$2318
            }
        },
        Control: {
            Functor: { map: map$2278 },
            Applicative: { ap: ap$2281 },
            Monad: { chain: chain$2284 }
        }
    };
}());
//# sourceMappingURL=curry.js.map