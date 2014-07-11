var C$2355 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2366 = C$2355.Core.__;
    var curry$2367 = C$2355.Core.curry;
    var compose$2368 = C$2355.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2375 = curry$2367(function (a$2382, b$2383, c$2384, d$2385) {
                    return a$2382 + b$2383 + c$2384 + d$2385;
                });
            var nums$2377 = curry$2367(function (a$2386, b$2387) {
                    return [
                        a$2386,
                        b$2387
                    ];
                });
            ;
            require('buster').assert(addMany$2375(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2375(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2375(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2377(__$2366, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2389 = curry$2367(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2389(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2392 = function (a$2394, b$2395) {
                    return a$2394 + b$2395;
                }.curry();
            ;
            require('buster').assert(add$2392(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2398 = curry$2367(function (sep$2406, s$2407) {
                    return s$2407.split(sep$2406);
                });
            var map$2400 = curry$2367(function (f$2408, xs$2409) {
                    return xs$2409.map(f$2408);
                });
            var upcase$2402 = curry$2367(function (s$2410) {
                    return s$2410.toUpperCase();
                });
            var join$2404 = curry$2367(function (sep$2411, xs$2412) {
                    return xs$2412.join(sep$2411);
                });
            ;
            require('buster').assert(compose$2368(join$2404('-'), map$2400(upcase$2402), split$2398(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2414 = C$2355.Predicates.not;
    var and$2415 = C$2355.Predicates.and;
    var or$2416 = C$2355.Predicates.or;
    var isObject$2417 = C$2355.Predicates.isObject;
    var isArray$2418 = C$2355.Predicates.isArray;
    var isNumber$2419 = C$2355.Predicates.isNumber;
    var isRegExp$2420 = C$2355.Predicates.isRegExp;
    var isString$2421 = C$2355.Predicates.isString;
    var isNull$2422 = C$2355.Predicates.isNull;
    var isUndef$2423 = C$2355.Predicates.isUndef;
    var exists$2424 = C$2355.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2414(true) === false, 'not(true)');
        require('buster').assert(not$2414(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2415([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2415([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2415([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2415([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2415([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2415([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2415([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2415([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2416([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2416([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2416([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2416([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2416([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2416([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2416([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2416([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2416([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2416([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2416([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2417({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2417([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2417(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2417(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2417('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2417(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2418([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2418({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2418(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2418(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2418('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2419(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2419([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2419({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2419(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2419('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2420(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2420(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2420([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2420({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2420('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2421('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2421(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2421(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2421([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2421({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2422(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2422('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2422(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2422(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2422([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2422({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2423(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2423('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2423(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2423(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2423([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2423({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2424(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2424(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2424('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2424(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2424(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2424([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2424({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2503 = C$2355.Control.Functor.map;
    ;
    var Option$2505 = C$2355.Data.Option.Option;
    var Some$2506 = C$2355.Data.Option.Some;
    var None$2507 = C$2355.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2517(x$2524) {
            return function inc$2517(x$2525) {
                return x$2525 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2518(x$2526) {
            return function id$2518(x$2527) {
                return x$2527;
            }.curry().apply(null, arguments);
        }
        function inc$2517(x$2528) {
            return function inc$2517(x$2529) {
                return x$2529 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2519(x$2530) {
            return function square$2519(x$2531) {
                return x$2531 * x$2531;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2503(id$2518, Some$2506(2)), Some$2506(2), 'identity');
        require('buster').assert.equals(map$2503(id$2518, None$2507), id$2518(None$2507), 'identity');
        require('buster').assert.equals(map$2503(function (x$2532) {
            return inc$2517(square$2519(x$2532));
        }, Some$2506(2)), function (x$2533) {
            return map$2503(inc$2517)(map$2503(square$2519)(x$2533));
        }(Some$2506(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2542(f$2558) {
            return function comp$2542(f$2559) {
                return function (g$2560) {
                    return function (x$2561) {
                        return f$2559(g$2560(x$2561));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2543(x$2562) {
            return function id$2543(x$2563) {
                return x$2563;
            }.curry().apply(null, arguments);
        }
        function add$2544(a$2564, b$2565) {
            return function add$2544(a$2566, b$2567) {
                return a$2566 + b$2567;
            }.curry().apply(null, arguments);
        }
        function prod$2545(a$2568) {
            return function prod$2545(a$2569) {
                return a$2569 * a$2569;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2505.of(id$2543).ap(Some$2506(2)), Some$2506(2), 'identity');
        require('buster').assert.equals(Some$2506(add$2544(2)).map(comp$2542).ap(Some$2506(prod$2545)).ap(Some$2506(2)), Some$2506(add$2544(2)).ap(Some$2506(prod$2545).ap(Some$2506(2))), 'composition');
        require('buster').assert.equals(Option$2505.of(prod$2545).ap(Some$2506(2)), Option$2505.of(prod$2545(2)), 'homomorphism');
        require('buster').assert.equals(Some$2506(prod$2545).ap(Some$2506(2)), Some$2506(function (f$2570) {
            return f$2570(2);
        }.curry()).ap(Some$2506(prod$2545)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2506([1]).concat(Some$2506([2])).concat(Some$2506([3])), Some$2506([1]).concat(Some$2506([2]).concat(Some$2506([3]))), 'associativity');
        require('buster').assert.equals(Some$2506([1]).concat(Some$2506([1]).empty()), Some$2506([1]), 'right identity');
        require('buster').assert.equals(Some$2506([1]).empty().concat(Some$2506([1])), Some$2506([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2578(x$2580) {
            return function m_prod$2578(x$2581) {
                return Some$2506(x$2581 * x$2581);
            }.curry().apply(null, arguments);
        }
        function m_inc$2579(x$2582) {
            return function m_inc$2579(x$2583) {
                return Some$2506(x$2583 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2506(2).chain(m_prod$2578).chain(m_inc$2579), Some$2506(2).chain(function (x$2584) {
            return m_prod$2578(x$2584).chain(m_inc$2579);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2586 = C$2355.Control.Functor.map;
    ;
    var Either$2588 = C$2355.Data.Either.Either;
    var Left$2589 = C$2355.Data.Either.Left;
    var Right$2590 = C$2355.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2600(x$2607) {
            return function inc$2600(x$2608) {
                return x$2608 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2601(x$2609) {
            return function id$2601(x$2610) {
                return x$2610;
            }.curry().apply(null, arguments);
        }
        function inc$2600(x$2611) {
            return function inc$2600(x$2612) {
                return x$2612 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2602(x$2613) {
            return function square$2602(x$2614) {
                return x$2614 * x$2614;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2586(id$2601, Right$2590(2)), Right$2590(2), 'map identity');
        require('buster').assert.equals(map$2586(id$2601, Left$2589(2)), id$2601(Left$2589(2)), 'map identity');
        require('buster').assert.equals(map$2586(function (x$2615) {
            return inc$2600(square$2602(x$2615));
        }, Right$2590(2)), function (x$2616) {
            return map$2586(inc$2600)(map$2586(square$2602)(x$2616));
        }(Right$2590(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2625(f$2641) {
            return function comp$2625(f$2642) {
                return function (g$2643) {
                    return function (x$2644) {
                        return f$2642(g$2643(x$2644));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2626(x$2645) {
            return function id$2626(x$2646) {
                return x$2646;
            }.curry().apply(null, arguments);
        }
        function add$2627(a$2647, b$2648) {
            return function add$2627(a$2649, b$2650) {
                return a$2649 + b$2650;
            }.curry().apply(null, arguments);
        }
        function prod$2628(a$2651) {
            return function prod$2628(a$2652) {
                return a$2652 * a$2652;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2588.of(id$2626).ap(Right$2590(2)), Right$2590(2), 'identity');
        require('buster').assert.equals(Right$2590(add$2627(2)).map(comp$2625).ap(Right$2590(prod$2628)).ap(Right$2590(2)), Right$2590(add$2627(2)).ap(Right$2590(prod$2628).ap(Right$2590(2))), 'composition');
        require('buster').assert.equals(Either$2588.of(prod$2628).ap(Right$2590(2)), Either$2588.of(prod$2628(2)), 'homomorphism');
        require('buster').assert.equals(Right$2590(prod$2628).ap(Right$2590(2)), Right$2590(function (f$2653) {
            return f$2653(2);
        }.curry()).ap(Right$2590(prod$2628)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2590([1]).concat(Right$2590([2])).concat(Right$2590([3])), Right$2590([1]).concat(Right$2590([2]).concat(Right$2590([3]))), 'associativity');
        require('buster').assert.equals(Right$2590([1]).concat(Right$2590([1]).empty()), Right$2590([1]), 'right identity');
        require('buster').assert.equals(Right$2590([1]).empty().concat(Right$2590([1])), Right$2590([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2661(x$2663) {
            return function m_prod$2661(x$2664) {
                return Right$2590(x$2664 * x$2664);
            }.curry().apply(null, arguments);
        }
        function m_inc$2662(x$2665) {
            return function m_inc$2662(x$2666) {
                return Right$2590(x$2666 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2590(2).chain(m_prod$2661).chain(m_inc$2662), Right$2590(2).chain(function (x$2667) {
            return m_prod$2661(x$2667).chain(m_inc$2662);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2669 = C$2355.Data.Collection.foldl;
    var foldl1$2670 = C$2355.Data.Collection.foldl1;
    var foldr$2671 = C$2355.Data.Collection.foldr;
    var foldr1$2672 = C$2355.Data.Collection.foldr1;
    var flatten$2673 = C$2355.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2669(function (acc$2682, x$2683) {
                return acc$2682.concat(x$2683);
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
            require('buster').assert.equals(foldl1$2670(function (acc$2687, x$2688) {
                return acc$2687.concat([x$2688]);
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
            require('buster').assert.equals(foldr$2671(function (acc$2692, x$2693) {
                return acc$2692.concat(x$2693);
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
            require('buster').assert.equals(foldr1$2672(function (acc$2697, x$2698) {
                return acc$2697.concat([x$2698]);
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
    require('buster').spec.describe('flatten :: Monoid a => [a] -> a', function () {
        var Some$2699 = C$2355.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2673([
                [
                    1,
                    2,
                    3
                ],
                [
                    4,
                    5,
                    6
                ]
            ]), [
                1,
                2,
                3,
                4,
                5,
                6
            ], 'list of lists');
            require('buster').assert.equals(flatten$2673([
                Some$2699([1]),
                Some$2699([2])
            ]), Some$2699([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2712(f$2716) {
            return function comp$2712(f$2717) {
                return function (g$2718) {
                    return function (x$2719) {
                        return f$2717(g$2718(x$2719));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2713(x$2720) {
            return function id$2713(x$2721) {
                return x$2721;
            }.curry().apply(null, arguments);
        }
        function add$2714(a$2722, b$2723) {
            return function add$2714(a$2724, b$2725) {
                return a$2724 + b$2725;
            }.curry().apply(null, arguments);
        }
        function prod$2715(a$2726) {
            return function prod$2715(a$2727) {
                return a$2727 * a$2727;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2713).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2714(2)].map(comp$2712).ap([prod$2715]).ap([2]), [add$2714(2)].ap([prod$2715].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2715).ap([2]), Array.of(prod$2715(2)), 'homomorphism');
            require('buster').assert.equals([prod$2715].ap([2]), [function (f$2742) {
                    return f$2742(2);
                }.curry()].ap([prod$2715]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2747(x$2749) {
            return function m_prod$2747(x$2750) {
                return [x$2750 * x$2750];
            }.curry().apply(null, arguments);
        }
        function m_inc$2748(x$2751) {
            return function m_inc$2748(x$2752) {
                return [x$2752 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$2747).chain(m_inc$2748), [
            1,
            2,
            3
        ].chain(function (x$2753) {
            return m_prod$2747(x$2753).chain(m_inc$2748);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2755 = C$2355.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2763 = {
                    map: function (f$2765) {
                        return f$2765(1);
                    }.curry()
                };
            require('buster').assert(map$2755(function (x$2766) {
                return x$2766 + 2;
            }.curry(), obj$2763) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2768 = C$2355.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2772 = {
                    ap: function (fb$2778) {
                        return this.val(fb$2778.val);
                    }.curry(),
                    val: function (x$2779) {
                        return x$2779 + 1;
                    }.curry()
                };
            var fb$2775 = { val: 2 };
            require('buster').assert(ap$2768(fa$2772, fb$2775) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2781 = C$2355.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2789 = {
                    chain: function (f$2791) {
                        return f$2791(1);
                    }.curry()
                };
            require('buster').assert(chain$2781(obj$2789, function (x$2792) {
                return x$2792 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});