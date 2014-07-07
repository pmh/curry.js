var C$2325 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2334 = C$2325.Core.__;
    var curry$2335 = C$2325.Core.curry;
    var compose$2336 = C$2325.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2343 = curry$2335(function (a$2350, b$2351, c$2352, d$2353) {
                    return a$2350 + b$2351 + c$2352 + d$2353;
                });
            var nums$2345 = curry$2335(function (a$2354, b$2355) {
                    return [
                        a$2354,
                        b$2355
                    ];
                });
            ;
            require('buster').assert(addMany$2343(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2343(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2343(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2345(__$2334, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2357 = curry$2335(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2357(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2360 = function (a$2362, b$2363) {
                    return a$2362 + b$2363;
                }.curry();
            ;
            require('buster').assert(add$2360(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2366 = curry$2335(function (sep$2374, s$2375) {
                    return s$2375.split(sep$2374);
                });
            var map$2368 = curry$2335(function (f$2376, xs$2377) {
                    return xs$2377.map(f$2376);
                });
            var upcase$2370 = curry$2335(function (s$2378) {
                    return s$2378.toUpperCase();
                });
            var join$2372 = curry$2335(function (sep$2379, xs$2380) {
                    return xs$2380.join(sep$2379);
                });
            ;
            require('buster').assert(compose$2336(join$2372('-'), map$2368(upcase$2370), split$2366(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2382 = C$2325.Predicates.not;
    var and$2383 = C$2325.Predicates.and;
    var or$2384 = C$2325.Predicates.or;
    var isObject$2385 = C$2325.Predicates.isObject;
    var isArray$2386 = C$2325.Predicates.isArray;
    var isNumber$2387 = C$2325.Predicates.isNumber;
    var isRegExp$2388 = C$2325.Predicates.isRegExp;
    var isString$2389 = C$2325.Predicates.isString;
    var isNull$2390 = C$2325.Predicates.isNull;
    var isUndef$2391 = C$2325.Predicates.isUndef;
    var exists$2392 = C$2325.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2382(true) === false, 'not(true)');
        require('buster').assert(not$2382(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2383([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2383([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2383([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2383([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2383([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2383([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2383([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2383([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2384([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2384([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2384([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2384([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2384([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2384([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2384([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2384([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2384([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2384([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2384([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2385({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2385([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2385(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2385(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2385('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2385(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2386([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2386({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2386(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2386(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2386('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2387(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2387([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2387({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2387(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2387('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2388(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2388(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2388([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2388({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2388('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2389('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2389(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2389(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2389([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2389({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2390(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2390('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2390(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2390(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2390([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2390({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2391(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2391('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2391(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2391(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2391([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2391({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2392(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2392(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2392('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2392(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2392(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2392([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2392({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2471 = C$2325.Control.Functor.map;
    ;
    var Option$2473 = C$2325.Data.Option.Option;
    var Some$2474 = C$2325.Data.Option.Some;
    var None$2475 = C$2325.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2482(a$2483) {
            return function inc$2482(a$2484) {
                return a$2484 + 1;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the functor laws', function () {
            function id$2489(x$2496) {
                return function id$2489(x$2497) {
                    return x$2497;
                }.curry().apply(null, arguments);
            }
            function inc$2490(x$2498) {
                return function inc$2490(x$2499) {
                    return x$2499 + 1;
                }.curry().apply(null, arguments);
            }
            function square$2491(x$2500) {
                return function square$2491(x$2501) {
                    return x$2501 * x$2501;
                }.curry().apply(null, arguments);
            }
            ;
            require('buster').assert.equals(map$2471(id$2489, Some$2474(2)), Some$2474(2), 'identity');
            require('buster').assert.equals(map$2471(id$2489, None$2475), id$2489(None$2475), 'identity');
            require('buster').assert.equals(map$2471(function (x$2502) {
                return inc$2490(square$2491(x$2502));
            }, Some$2474(2)), function (x$2503) {
                return map$2471(inc$2490)(map$2471(square$2491)(x$2503));
            }(Some$2474(2)), 'composition');
        });
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2511(f$2515) {
            return function comp$2511(f$2516) {
                return function (g$2517) {
                    return function (x$2518) {
                        return f$2516(g$2517(x$2518));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2512(x$2519) {
            return function id$2512(x$2520) {
                return x$2520;
            }.curry().apply(null, arguments);
        }
        function add$2513(a$2521, b$2522) {
            return function add$2513(a$2523, b$2524) {
                return a$2523 + b$2524;
            }.curry().apply(null, arguments);
        }
        function prod$2514(a$2525) {
            return function prod$2514(a$2526) {
                return a$2526 * a$2526;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Option$2473.of(id$2512).ap(Some$2474(2)), Some$2474(2), 'identity');
            require('buster').assert.equals(Some$2474(add$2513(2)).map(comp$2511).ap(Some$2474(prod$2514)).ap(Some$2474(2)), Some$2474(add$2513(2)).ap(Some$2474(prod$2514).ap(Some$2474(2))), 'composition');
            require('buster').assert.equals(Option$2473.of(prod$2514).ap(Some$2474(2)), Option$2473.of(prod$2514(2)), 'homomorphism');
            require('buster').assert.equals(Some$2474(prod$2514).ap(Some$2474(2)), Some$2474(function (f$2541) {
                return f$2541(2);
            }.curry()).ap(Some$2474(prod$2514)), 'interchange');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Some$2474([1]).concat(Some$2474([2])).concat(Some$2474([3])), Some$2474([1]).concat(Some$2474([2]).concat(Some$2474([3]))), 'associativity');
            require('buster').assert.equals(Some$2474([1]).concat(Some$2474([1]).empty()), Some$2474([1]), 'right identity');
            require('buster').assert.equals(Some$2474([1]).empty().concat(Some$2474([1])), Some$2474([1]), 'left identity');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2550(x$2552) {
            return function m_prod$2550(x$2553) {
                return Some$2474(x$2553 * x$2553);
            }.curry().apply(null, arguments);
        }
        function m_inc$2551(x$2554) {
            return function m_inc$2551(x$2555) {
                return Some$2474(x$2555 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2474(2).chain(m_prod$2550).chain(m_inc$2551), Some$2474(2).chain(function (x$2556) {
            return m_prod$2550(x$2556).chain(m_inc$2551);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2558 = C$2325.Data.Collection.foldl;
    var foldl1$2559 = C$2325.Data.Collection.foldl1;
    var foldr$2560 = C$2325.Data.Collection.foldr;
    var foldr1$2561 = C$2325.Data.Collection.foldr1;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2558(function (acc$2569, x$2570) {
                return acc$2569.concat(x$2570);
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
            require('buster').assert.equals(foldl1$2559(function (acc$2574, x$2575) {
                return acc$2574.concat([x$2575]);
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
            require('buster').assert.equals(foldr$2560(function (acc$2579, x$2580) {
                return acc$2579.concat(x$2580);
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
            require('buster').assert.equals(foldr1$2561(function (acc$2584, x$2585) {
                return acc$2584.concat([x$2585]);
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
    var map$2587 = C$2325.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2595 = {
                    map: function (f$2597) {
                        return f$2597(1);
                    }.curry()
                };
            require('buster').assert(map$2587(function (x$2598) {
                return x$2598 + 2;
            }.curry(), obj$2595) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2600 = C$2325.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2604 = {
                    ap: function (fb$2610) {
                        return this.val(fb$2610.val);
                    }.curry(),
                    val: function (x$2611) {
                        return x$2611 + 1;
                    }.curry()
                };
            var fb$2607 = { val: 2 };
            require('buster').assert(ap$2600(fa$2604, fb$2607) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2613 = C$2325.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2621 = {
                    chain: function (f$2623) {
                        return f$2623(1);
                    }.curry()
                };
            require('buster').assert(chain$2613(obj$2621, function (x$2624) {
                return x$2624 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});