var C$2355 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2365 = C$2355.Core.__;
    var curry$2366 = C$2355.Core.curry;
    var compose$2367 = C$2355.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2374 = curry$2366(function (a$2381, b$2382, c$2383, d$2384) {
                    return a$2381 + b$2382 + c$2383 + d$2384;
                });
            var nums$2376 = curry$2366(function (a$2385, b$2386) {
                    return [
                        a$2385,
                        b$2386
                    ];
                });
            ;
            require('buster').assert(addMany$2374(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2374(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2374(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2376(__$2365, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2388 = curry$2366(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2388(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2391 = function (a$2393, b$2394) {
                    return a$2393 + b$2394;
                }.curry();
            ;
            require('buster').assert(add$2391(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2397 = curry$2366(function (sep$2405, s$2406) {
                    return s$2406.split(sep$2405);
                });
            var map$2399 = curry$2366(function (f$2407, xs$2408) {
                    return xs$2408.map(f$2407);
                });
            var upcase$2401 = curry$2366(function (s$2409) {
                    return s$2409.toUpperCase();
                });
            var join$2403 = curry$2366(function (sep$2410, xs$2411) {
                    return xs$2411.join(sep$2410);
                });
            ;
            require('buster').assert(compose$2367(join$2403('-'), map$2399(upcase$2401), split$2397(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2413 = C$2355.Predicates.not;
    var and$2414 = C$2355.Predicates.and;
    var or$2415 = C$2355.Predicates.or;
    var isObject$2416 = C$2355.Predicates.isObject;
    var isArray$2417 = C$2355.Predicates.isArray;
    var isNumber$2418 = C$2355.Predicates.isNumber;
    var isRegExp$2419 = C$2355.Predicates.isRegExp;
    var isString$2420 = C$2355.Predicates.isString;
    var isNull$2421 = C$2355.Predicates.isNull;
    var isUndef$2422 = C$2355.Predicates.isUndef;
    var exists$2423 = C$2355.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2413(true) === false, 'not(true)');
        require('buster').assert(not$2413(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2414([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2414([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2414([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2414([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2414([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2414([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2414([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2414([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2415([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2415([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2415([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2415([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2415([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2415([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2415([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2415([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2415([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2415([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2415([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2416({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2416([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2416(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2416(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2416('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2416(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2417([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2417({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2417(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2417(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2417('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2418(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2418([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2418({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2418(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2418('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2419(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2419(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2419([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2419({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2419('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2420('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2420(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2420(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2420([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2420({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2421(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2421('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2421(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2421(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2421([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2421({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2422(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2422('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2422(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2422(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2422([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2422({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2423(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2423(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2423('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2423(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2423(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2423([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2423({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2502 = C$2355.Control.Functor.map;
    ;
    var Option$2504 = C$2355.Data.Option.Option;
    var Some$2505 = C$2355.Data.Option.Some;
    var None$2506 = C$2355.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2516(x$2523) {
            return function inc$2516(x$2524) {
                return x$2524 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2517(x$2525) {
            return function id$2517(x$2526) {
                return x$2526;
            }.curry().apply(null, arguments);
        }
        function inc$2516(x$2527) {
            return function inc$2516(x$2528) {
                return x$2528 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2518(x$2529) {
            return function square$2518(x$2530) {
                return x$2530 * x$2530;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2502(id$2517, Some$2505(2)), Some$2505(2), 'identity');
        require('buster').assert.equals(map$2502(id$2517, None$2506), id$2517(None$2506), 'identity');
        require('buster').assert.equals(map$2502(function (x$2531) {
            return inc$2516(square$2518(x$2531));
        }, Some$2505(2)), function (x$2532) {
            return map$2502(inc$2516)(map$2502(square$2518)(x$2532));
        }(Some$2505(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2541(f$2557) {
            return function comp$2541(f$2558) {
                return function (g$2559) {
                    return function (x$2560) {
                        return f$2558(g$2559(x$2560));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2542(x$2561) {
            return function id$2542(x$2562) {
                return x$2562;
            }.curry().apply(null, arguments);
        }
        function add$2543(a$2563, b$2564) {
            return function add$2543(a$2565, b$2566) {
                return a$2565 + b$2566;
            }.curry().apply(null, arguments);
        }
        function prod$2544(a$2567) {
            return function prod$2544(a$2568) {
                return a$2568 * a$2568;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2504.of(id$2542).ap(Some$2505(2)), Some$2505(2), 'identity');
        require('buster').assert.equals(Some$2505(add$2543(2)).map(comp$2541).ap(Some$2505(prod$2544)).ap(Some$2505(2)), Some$2505(add$2543(2)).ap(Some$2505(prod$2544).ap(Some$2505(2))), 'composition');
        require('buster').assert.equals(Option$2504.of(prod$2544).ap(Some$2505(2)), Option$2504.of(prod$2544(2)), 'homomorphism');
        require('buster').assert.equals(Some$2505(prod$2544).ap(Some$2505(2)), Some$2505(function (f$2569) {
            return f$2569(2);
        }.curry()).ap(Some$2505(prod$2544)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2505([1]).concat(Some$2505([2])).concat(Some$2505([3])), Some$2505([1]).concat(Some$2505([2]).concat(Some$2505([3]))), 'associativity');
        require('buster').assert.equals(Some$2505([1]).concat(Some$2505([1]).empty()), Some$2505([1]), 'right identity');
        require('buster').assert.equals(Some$2505([1]).empty().concat(Some$2505([1])), Some$2505([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2577(x$2579) {
            return function m_prod$2577(x$2580) {
                return Some$2505(x$2580 * x$2580);
            }.curry().apply(null, arguments);
        }
        function m_inc$2578(x$2581) {
            return function m_inc$2578(x$2582) {
                return Some$2505(x$2582 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2505(2).chain(m_prod$2577).chain(m_inc$2578), Some$2505(2).chain(function (x$2583) {
            return m_prod$2577(x$2583).chain(m_inc$2578);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2585 = C$2355.Data.Collection.foldl;
    var foldl1$2586 = C$2355.Data.Collection.foldl1;
    var foldr$2587 = C$2355.Data.Collection.foldr;
    var foldr1$2588 = C$2355.Data.Collection.foldr1;
    var flatten$2589 = C$2355.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2585(function (acc$2598, x$2599) {
                return acc$2598.concat(x$2599);
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
            require('buster').assert.equals(foldl1$2586(function (acc$2603, x$2604) {
                return acc$2603.concat([x$2604]);
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
            require('buster').assert.equals(foldr$2587(function (acc$2608, x$2609) {
                return acc$2608.concat(x$2609);
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
            require('buster').assert.equals(foldr1$2588(function (acc$2613, x$2614) {
                return acc$2613.concat([x$2614]);
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
        var Some$2615 = C$2355.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2589([
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
            require('buster').assert.equals(flatten$2589([
                Some$2615([1]),
                Some$2615([2])
            ]), Some$2615([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2628(f$2632) {
            return function comp$2628(f$2633) {
                return function (g$2634) {
                    return function (x$2635) {
                        return f$2633(g$2634(x$2635));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2629(x$2636) {
            return function id$2629(x$2637) {
                return x$2637;
            }.curry().apply(null, arguments);
        }
        function add$2630(a$2638, b$2639) {
            return function add$2630(a$2640, b$2641) {
                return a$2640 + b$2641;
            }.curry().apply(null, arguments);
        }
        function prod$2631(a$2642) {
            return function prod$2631(a$2643) {
                return a$2643 * a$2643;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2629).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2630(2)].map(comp$2628).ap([prod$2631]).ap([2]), [add$2630(2)].ap([prod$2631].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2631).ap([2]), Array.of(prod$2631(2)), 'homomorphism');
            require('buster').assert.equals([prod$2631].ap([2]), [function (f$2658) {
                    return f$2658(2);
                }.curry()].ap([prod$2631]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2663(x$2665) {
            return function m_prod$2663(x$2666) {
                return [x$2666 * x$2666];
            }.curry().apply(null, arguments);
        }
        function m_inc$2664(x$2667) {
            return function m_inc$2664(x$2668) {
                return [x$2668 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$2663).chain(m_inc$2664), [
            1,
            2,
            3
        ].chain(function (x$2669) {
            return m_prod$2663(x$2669).chain(m_inc$2664);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2671 = C$2355.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2679 = {
                    map: function (f$2681) {
                        return f$2681(1);
                    }.curry()
                };
            require('buster').assert(map$2671(function (x$2682) {
                return x$2682 + 2;
            }.curry(), obj$2679) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2684 = C$2355.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2688 = {
                    ap: function (fb$2694) {
                        return this.val(fb$2694.val);
                    }.curry(),
                    val: function (x$2695) {
                        return x$2695 + 1;
                    }.curry()
                };
            var fb$2691 = { val: 2 };
            require('buster').assert(ap$2684(fa$2688, fb$2691) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2697 = C$2355.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2705 = {
                    chain: function (f$2707) {
                        return f$2707(1);
                    }.curry()
                };
            require('buster').assert(chain$2697(obj$2705, function (x$2708) {
                return x$2708 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});