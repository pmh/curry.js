var C$2325 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2335 = C$2325.Core.__;
    var curry$2336 = C$2325.Core.curry;
    var compose$2337 = C$2325.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2344 = curry$2336(function (a$2351, b$2352, c$2353, d$2354) {
                    return a$2351 + b$2352 + c$2353 + d$2354;
                });
            var nums$2346 = curry$2336(function (a$2355, b$2356) {
                    return [
                        a$2355,
                        b$2356
                    ];
                });
            ;
            require('buster').assert(addMany$2344(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2344(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2344(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2346(__$2335, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2358 = curry$2336(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2358(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2361 = function (a$2363, b$2364) {
                    return a$2363 + b$2364;
                }.curry();
            ;
            require('buster').assert(add$2361(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2367 = curry$2336(function (sep$2375, s$2376) {
                    return s$2376.split(sep$2375);
                });
            var map$2369 = curry$2336(function (f$2377, xs$2378) {
                    return xs$2378.map(f$2377);
                });
            var upcase$2371 = curry$2336(function (s$2379) {
                    return s$2379.toUpperCase();
                });
            var join$2373 = curry$2336(function (sep$2380, xs$2381) {
                    return xs$2381.join(sep$2380);
                });
            ;
            require('buster').assert(compose$2337(join$2373('-'), map$2369(upcase$2371), split$2367(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2383 = C$2325.Predicates.not;
    var and$2384 = C$2325.Predicates.and;
    var or$2385 = C$2325.Predicates.or;
    var isObject$2386 = C$2325.Predicates.isObject;
    var isArray$2387 = C$2325.Predicates.isArray;
    var isNumber$2388 = C$2325.Predicates.isNumber;
    var isRegExp$2389 = C$2325.Predicates.isRegExp;
    var isString$2390 = C$2325.Predicates.isString;
    var isNull$2391 = C$2325.Predicates.isNull;
    var isUndef$2392 = C$2325.Predicates.isUndef;
    var exists$2393 = C$2325.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2383(true) === false, 'not(true)');
        require('buster').assert(not$2383(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2384([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2384([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2384([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2384([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2384([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2384([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2384([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2384([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2385([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2385([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2385([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2385([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2385([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2385([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2385([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2385([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2385([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2385([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2385([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2386({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2386([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2386(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2386(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2386('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2386(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2387([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2387({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2387(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2387(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2387('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2388(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2388([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2388({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2388(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2388('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2389(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2389(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2389([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2389({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2389('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2390('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2390(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2390(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2390([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2390({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2391(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2391('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2391(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2391(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2391([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2391({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2392(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2392('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2392(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2392(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2392([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2392({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2393(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2393(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2393('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2393(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2393(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2393([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2393({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2472 = C$2325.Control.Functor.map;
    ;
    var Option$2474 = C$2325.Data.Option.Option;
    var Some$2475 = C$2325.Data.Option.Some;
    var None$2476 = C$2325.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2486(x$2493) {
            return function inc$2486(x$2494) {
                return x$2494 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2487(x$2495) {
            return function id$2487(x$2496) {
                return x$2496;
            }.curry().apply(null, arguments);
        }
        function inc$2486(x$2497) {
            return function inc$2486(x$2498) {
                return x$2498 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2488(x$2499) {
            return function square$2488(x$2500) {
                return x$2500 * x$2500;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2472(id$2487, Some$2475(2)), Some$2475(2), 'identity');
        require('buster').assert.equals(map$2472(id$2487, None$2476), id$2487(None$2476), 'identity');
        require('buster').assert.equals(map$2472(function (x$2501) {
            return inc$2486(square$2488(x$2501));
        }, Some$2475(2)), function (x$2502) {
            return map$2472(inc$2486)(map$2472(square$2488)(x$2502));
        }(Some$2475(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2511(f$2527) {
            return function comp$2511(f$2528) {
                return function (g$2529) {
                    return function (x$2530) {
                        return f$2528(g$2529(x$2530));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2512(x$2531) {
            return function id$2512(x$2532) {
                return x$2532;
            }.curry().apply(null, arguments);
        }
        function add$2513(a$2533, b$2534) {
            return function add$2513(a$2535, b$2536) {
                return a$2535 + b$2536;
            }.curry().apply(null, arguments);
        }
        function prod$2514(a$2537) {
            return function prod$2514(a$2538) {
                return a$2538 * a$2538;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2474.of(id$2512).ap(Some$2475(2)), Some$2475(2), 'identity');
        require('buster').assert.equals(Some$2475(add$2513(2)).map(comp$2511).ap(Some$2475(prod$2514)).ap(Some$2475(2)), Some$2475(add$2513(2)).ap(Some$2475(prod$2514).ap(Some$2475(2))), 'composition');
        require('buster').assert.equals(Option$2474.of(prod$2514).ap(Some$2475(2)), Option$2474.of(prod$2514(2)), 'homomorphism');
        require('buster').assert.equals(Some$2475(prod$2514).ap(Some$2475(2)), Some$2475(function (f$2539) {
            return f$2539(2);
        }.curry()).ap(Some$2475(prod$2514)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2475([1]).concat(Some$2475([2])).concat(Some$2475([3])), Some$2475([1]).concat(Some$2475([2]).concat(Some$2475([3]))), 'associativity');
        require('buster').assert.equals(Some$2475([1]).concat(Some$2475([1]).empty()), Some$2475([1]), 'right identity');
        require('buster').assert.equals(Some$2475([1]).empty().concat(Some$2475([1])), Some$2475([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2547(x$2549) {
            return function m_prod$2547(x$2550) {
                return Some$2475(x$2550 * x$2550);
            }.curry().apply(null, arguments);
        }
        function m_inc$2548(x$2551) {
            return function m_inc$2548(x$2552) {
                return Some$2475(x$2552 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2475(2).chain(m_prod$2547).chain(m_inc$2548), Some$2475(2).chain(function (x$2553) {
            return m_prod$2547(x$2553).chain(m_inc$2548);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2555 = C$2325.Data.Collection.foldl;
    var foldl1$2556 = C$2325.Data.Collection.foldl1;
    var foldr$2557 = C$2325.Data.Collection.foldr;
    var foldr1$2558 = C$2325.Data.Collection.foldr1;
    var flatten$2559 = C$2325.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2555(function (acc$2568, x$2569) {
                return acc$2568.concat(x$2569);
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
            require('buster').assert.equals(foldl1$2556(function (acc$2573, x$2574) {
                return acc$2573.concat([x$2574]);
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
            require('buster').assert.equals(foldr$2557(function (acc$2578, x$2579) {
                return acc$2578.concat(x$2579);
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
            require('buster').assert.equals(foldr1$2558(function (acc$2583, x$2584) {
                return acc$2583.concat([x$2584]);
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
        var Some$2585 = C$2325.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2559([
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
            require('buster').assert.equals(flatten$2559([
                Some$2585([1]),
                Some$2585([2])
            ]), Some$2585([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2598(f$2602) {
            return function comp$2598(f$2603) {
                return function (g$2604) {
                    return function (x$2605) {
                        return f$2603(g$2604(x$2605));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2599(x$2606) {
            return function id$2599(x$2607) {
                return x$2607;
            }.curry().apply(null, arguments);
        }
        function add$2600(a$2608, b$2609) {
            return function add$2600(a$2610, b$2611) {
                return a$2610 + b$2611;
            }.curry().apply(null, arguments);
        }
        function prod$2601(a$2612) {
            return function prod$2601(a$2613) {
                return a$2613 * a$2613;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2599).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2600(2)].map(comp$2598).ap([prod$2601]).ap([2]), [add$2600(2)].ap([prod$2601].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2601).ap([2]), Array.of(prod$2601(2)), 'homomorphism');
            require('buster').assert.equals([prod$2601].ap([2]), [function (f$2628) {
                    return f$2628(2);
                }.curry()].ap([prod$2601]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2633(x$2635) {
            return function m_prod$2633(x$2636) {
                return [x$2636 * x$2636];
            }.curry().apply(null, arguments);
        }
        function m_inc$2634(x$2637) {
            return function m_inc$2634(x$2638) {
                return [x$2638 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$2633).chain(m_inc$2634), [
            1,
            2,
            3
        ].chain(function (x$2639) {
            return m_prod$2633(x$2639).chain(m_inc$2634);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2641 = C$2325.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2649 = {
                    map: function (f$2651) {
                        return f$2651(1);
                    }.curry()
                };
            require('buster').assert(map$2641(function (x$2652) {
                return x$2652 + 2;
            }.curry(), obj$2649) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2654 = C$2325.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2658 = {
                    ap: function (fb$2664) {
                        return this.val(fb$2664.val);
                    }.curry(),
                    val: function (x$2665) {
                        return x$2665 + 1;
                    }.curry()
                };
            var fb$2661 = { val: 2 };
            require('buster').assert(ap$2654(fa$2658, fb$2661) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2667 = C$2325.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2675 = {
                    chain: function (f$2677) {
                        return f$2677(1);
                    }.curry()
                };
            require('buster').assert(chain$2667(obj$2675, function (x$2678) {
                return x$2678 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});