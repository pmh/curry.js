var C$2330 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2339 = C$2330.Core.__;
    var curry$2340 = C$2330.Core.curry;
    var compose$2341 = C$2330.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2348 = curry$2340(function (a$2355, b$2356, c$2357, d$2358) {
                    return a$2355 + b$2356 + c$2357 + d$2358;
                });
            var nums$2350 = curry$2340(function (a$2359, b$2360) {
                    return [
                        a$2359,
                        b$2360
                    ];
                });
            ;
            require('buster').assert(addMany$2348(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2348(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2348(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2350(__$2339, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2362 = curry$2340(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2362(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2365 = function (a$2367, b$2368) {
                    return a$2367 + b$2368;
                }.curry();
            ;
            require('buster').assert(add$2365(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2371 = curry$2340(function (sep$2379, s$2380) {
                    return s$2380.split(sep$2379);
                });
            var map$2373 = curry$2340(function (f$2381, xs$2382) {
                    return xs$2382.map(f$2381);
                });
            var upcase$2375 = curry$2340(function (s$2383) {
                    return s$2383.toUpperCase();
                });
            var join$2377 = curry$2340(function (sep$2384, xs$2385) {
                    return xs$2385.join(sep$2384);
                });
            ;
            require('buster').assert(compose$2341(join$2377('-'), map$2373(upcase$2375), split$2371(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2387 = C$2330.Predicates.not;
    var and$2388 = C$2330.Predicates.and;
    var or$2389 = C$2330.Predicates.or;
    var isObject$2390 = C$2330.Predicates.isObject;
    var isArray$2391 = C$2330.Predicates.isArray;
    var isNumber$2392 = C$2330.Predicates.isNumber;
    var isRegExp$2393 = C$2330.Predicates.isRegExp;
    var isString$2394 = C$2330.Predicates.isString;
    var isNull$2395 = C$2330.Predicates.isNull;
    var isUndef$2396 = C$2330.Predicates.isUndef;
    var exists$2397 = C$2330.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2387(true) === false, 'not(true)');
        require('buster').assert(not$2387(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2388([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2388([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2388([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2388([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2388([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2388([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2388([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2388([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2389([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2389([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2389([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2389([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2389([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2389([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2389([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2389([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2389([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2389([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2389([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2390({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2390([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2390(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2390(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2390('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2390(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2391([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2391({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2391(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2391(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2391('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2392(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2392([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2392({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2392(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2392('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2393(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2393(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2393([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2393({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2393('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2394('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2394(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2394(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2394([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2394({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2395(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2395('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2395(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2395(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2395([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2395({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2396(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2396('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2396(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2396(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2396([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2396({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2397(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2397(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2397('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2397(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2397(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2397([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2397({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2476 = C$2330.Control.Functor.map;
    ;
    var Option$2478 = C$2330.Data.Option.Option;
    var Some$2479 = C$2330.Data.Option.Some;
    var None$2480 = C$2330.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2488(a$2489) {
            return function inc$2488(a$2490) {
                return a$2490 + 1;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the functor laws', function () {
            function id$2498(x$2505) {
                return function id$2498(x$2506) {
                    return x$2506;
                }.curry().apply(null, arguments);
            }
            function inc$2499(x$2507) {
                return function inc$2499(x$2508) {
                    return x$2508 + 1;
                }.curry().apply(null, arguments);
            }
            function square$2500(x$2509) {
                return function square$2500(x$2510) {
                    return x$2510 * x$2510;
                }.curry().apply(null, arguments);
            }
            ;
            require('buster').assert.equals(map$2476(id$2498, Some$2479(2)), Some$2479(2), 'identity');
            require('buster').assert.equals(map$2476(id$2498, None$2480), id$2498(None$2480), 'identity');
            require('buster').assert.equals(map$2476(function (x$2511) {
                return inc$2499(square$2500(x$2511));
            }, Some$2479(2)), function (x$2512) {
                return map$2476(inc$2499)(map$2476(square$2500)(x$2512));
            }(Some$2479(2)), 'composition');
        });
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2526(f$2530) {
            return function comp$2526(f$2531) {
                return function (g$2532) {
                    return function (x$2533) {
                        return f$2531(g$2532(x$2533));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2527(x$2534) {
            return function id$2527(x$2535) {
                return x$2535;
            }.curry().apply(null, arguments);
        }
        function add$2528(a$2536, b$2537) {
            return function add$2528(a$2538, b$2539) {
                return a$2538 + b$2539;
            }.curry().apply(null, arguments);
        }
        function prod$2529(a$2540) {
            return function prod$2529(a$2541) {
                return a$2541 * a$2541;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Option$2478.of(id$2527).ap(Some$2479(2)), Some$2479(2), 'identity');
            require('buster').assert.equals(Some$2479(add$2528(2)).map(comp$2526).ap(Some$2479(prod$2529)).ap(Some$2479(2)), Some$2479(add$2528(2)).ap(Some$2479(prod$2529).ap(Some$2479(2))), 'composition');
            require('buster').assert.equals(Option$2478.of(prod$2529).ap(Some$2479(2)), Option$2478.of(prod$2529(2)), 'homomorphism');
            require('buster').assert.equals(Some$2479(prod$2529).ap(Some$2479(2)), Some$2479(function (f$2557) {
                return f$2557(2);
            }.curry()).ap(Some$2479(prod$2529)), 'interchange');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Some$2479([1]).concat(Some$2479([2])).concat(Some$2479([3])), Some$2479([1]).concat(Some$2479([2]).concat(Some$2479([3]))), 'associativity');
            require('buster').assert.equals(Some$2479([1]).concat(Some$2479([1]).empty()), Some$2479([1]), 'right identity');
            require('buster').assert.equals(Some$2479([1]).empty().concat(Some$2479([1])), Some$2479([1]), 'left identity');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2569(x$2571) {
            return function m_prod$2569(x$2572) {
                return Some$2479(x$2572 * x$2572);
            }.curry().apply(null, arguments);
        }
        function m_inc$2570(x$2573) {
            return function m_inc$2570(x$2574) {
                return Some$2479(x$2574 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2479(2).chain(m_prod$2569).chain(m_inc$2570), Some$2479(2).chain(function (x$2575) {
            return m_prod$2569(x$2575).chain(m_inc$2570);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2577 = C$2330.Data.Collection.foldl;
    var foldl1$2578 = C$2330.Data.Collection.foldl1;
    var foldr$2579 = C$2330.Data.Collection.foldr;
    var foldr1$2580 = C$2330.Data.Collection.foldr1;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2577(function (acc$2589, x$2590) {
                return acc$2589.concat(x$2590);
            }.curry(), [], [
                6,
                4,
                2
            ]), [
                6,
                4,
                2
            ], 'concat');
        });
    });
    require('buster').spec.describe('foldl1 :: (a -> a -> a) -> [a] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left using the first element as accumulator', function () {
            ;
            require('buster').assert.equals(foldl1$2578(function (acc$2595, x$2596) {
                return acc$2595.concat([x$2596]);
            }.curry(), [
                [],
                [6],
                [4],
                [2]
            ]), [
                [6],
                [4],
                [2]
            ], 'concat');
        });
    });
    require('buster').spec.describe('foldr :: (a -> b -> b) -> b -> [a] -> b', function () {
        ;
        require('buster').spec.it('should fold a list from the right', function () {
            ;
            require('buster').assert.equals(foldr$2579(function (acc$2601, x$2602) {
                return acc$2601.concat(x$2602);
            }.curry(), [], [
                6,
                4,
                2
            ]), [
                2,
                4,
                6
            ], 'concat');
        });
    });
    require('buster').spec.describe('foldr1 :: (a -> a -> a) -> [a] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left using the last element as accumulator', function () {
            ;
            require('buster').assert.equals(foldr1$2580(function (acc$2607, x$2608) {
                return acc$2607.concat([x$2608]);
            }.curry(), [
                [6],
                [4],
                [2],
                []
            ]), [
                [2],
                [4],
                [6]
            ], 'concat');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2610 = C$2330.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2621 = {
                    map: function (f$2624) {
                        return f$2624(1);
                    }.curry()
                };
            require('buster').assert(map$2610(function (x$2625) {
                return x$2625 + 2;
            }.curry(), obj$2621) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2627 = C$2330.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2631 = {
                    ap: function (fb$2639) {
                        return this.val(fb$2639.val);
                    }.curry(),
                    val: function (x$2640) {
                        return x$2640 + 1;
                    }.curry()
                };
            var fb$2634 = { val: 2 };
            require('buster').assert(ap$2627(fa$2631, fb$2634) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2642 = C$2330.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2653 = {
                    chain: function (f$2656) {
                        return f$2656(1);
                    }.curry()
                };
            require('buster').assert(chain$2642(obj$2653, function (x$2657) {
                return x$2657 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});