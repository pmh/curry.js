var C$2355 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2367 = C$2355.Core.__;
    var curry$2368 = C$2355.Core.curry;
    var compose$2369 = C$2355.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2376 = curry$2368(function (a$2383, b$2384, c$2385, d$2386) {
                    return a$2383 + b$2384 + c$2385 + d$2386;
                });
            var nums$2378 = curry$2368(function (a$2387, b$2388) {
                    return [
                        a$2387,
                        b$2388
                    ];
                });
            ;
            require('buster').assert(addMany$2376(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2376(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2376(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2378(__$2367, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2390 = curry$2368(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2390(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2393 = function (a$2395, b$2396) {
                    return a$2395 + b$2396;
                }.curry();
            ;
            require('buster').assert(add$2393(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2399 = curry$2368(function (sep$2407, s$2408) {
                    return s$2408.split(sep$2407);
                });
            var map$2401 = curry$2368(function (f$2409, xs$2410) {
                    return xs$2410.map(f$2409);
                });
            var upcase$2403 = curry$2368(function (s$2411) {
                    return s$2411.toUpperCase();
                });
            var join$2405 = curry$2368(function (sep$2412, xs$2413) {
                    return xs$2413.join(sep$2412);
                });
            ;
            require('buster').assert(compose$2369(join$2405('-'), map$2401(upcase$2403), split$2399(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2415 = C$2355.Predicates.not;
    var and$2416 = C$2355.Predicates.and;
    var or$2417 = C$2355.Predicates.or;
    var isObject$2418 = C$2355.Predicates.isObject;
    var isArray$2419 = C$2355.Predicates.isArray;
    var isNumber$2420 = C$2355.Predicates.isNumber;
    var isRegExp$2421 = C$2355.Predicates.isRegExp;
    var isString$2422 = C$2355.Predicates.isString;
    var isNull$2423 = C$2355.Predicates.isNull;
    var isUndef$2424 = C$2355.Predicates.isUndef;
    var exists$2425 = C$2355.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2415(true) === false, 'not(true)');
        require('buster').assert(not$2415(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2416([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2416([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2416([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2416([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2416([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2416([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2416([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2416([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2417([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2417([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2417([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2417([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2417([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2417([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2417([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2417([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2417([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2417([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2417([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2418({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2418([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2418(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2418(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2418('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2418(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2419([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2419({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2419(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2419(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2419('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2420(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2420([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2420({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2420(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2420('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2421(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2421(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2421([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2421({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2421('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2422('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2422(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2422(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2422([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2422({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2423(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2423('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2423(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2423(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2423([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2423({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2424(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2424('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2424(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2424(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2424([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2424({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2425(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2425(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2425('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2425(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2425(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2425([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2425({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2504 = C$2355.Math.plus;
    var minus$2505 = C$2355.Math.minus;
    var times$2506 = C$2355.Math.times;
    var div$2507 = C$2355.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2504(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2505(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2506(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2507(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2521 = C$2355.Control.Functor.map;
    ;
    var Option$2523 = C$2355.Data.Option.Option;
    var Some$2524 = C$2355.Data.Option.Some;
    var None$2525 = C$2355.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2535(x$2542) {
            return function inc$2535(x$2543) {
                return x$2543 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2536(x$2544) {
            return function id$2536(x$2545) {
                return x$2545;
            }.curry().apply(null, arguments);
        }
        function inc$2535(x$2546) {
            return function inc$2535(x$2547) {
                return x$2547 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2537(x$2548) {
            return function square$2537(x$2549) {
                return x$2549 * x$2549;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2521(id$2536, Some$2524(2)), Some$2524(2), 'identity');
        require('buster').assert.equals(map$2521(id$2536, None$2525), id$2536(None$2525), 'identity');
        require('buster').assert.equals(map$2521(function (x$2550) {
            return inc$2535(square$2537(x$2550));
        }, Some$2524(2)), function (x$2551) {
            return map$2521(inc$2535)(map$2521(square$2537)(x$2551));
        }(Some$2524(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2560(f$2576) {
            return function comp$2560(f$2577) {
                return function (g$2578) {
                    return function (x$2579) {
                        return f$2577(g$2578(x$2579));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2561(x$2580) {
            return function id$2561(x$2581) {
                return x$2581;
            }.curry().apply(null, arguments);
        }
        function add$2562(a$2582, b$2583) {
            return function add$2562(a$2584, b$2585) {
                return a$2584 + b$2585;
            }.curry().apply(null, arguments);
        }
        function prod$2563(a$2586) {
            return function prod$2563(a$2587) {
                return a$2587 * a$2587;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2523.of(id$2561).ap(Some$2524(2)), Some$2524(2), 'identity');
        require('buster').assert.equals(Some$2524(add$2562(2)).map(comp$2560).ap(Some$2524(prod$2563)).ap(Some$2524(2)), Some$2524(add$2562(2)).ap(Some$2524(prod$2563).ap(Some$2524(2))), 'composition');
        require('buster').assert.equals(Option$2523.of(prod$2563).ap(Some$2524(2)), Option$2523.of(prod$2563(2)), 'homomorphism');
        require('buster').assert.equals(Some$2524(prod$2563).ap(Some$2524(2)), Some$2524(function (f$2588) {
            return f$2588(2);
        }.curry()).ap(Some$2524(prod$2563)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2524([1]).concat(Some$2524([2])).concat(Some$2524([3])), Some$2524([1]).concat(Some$2524([2]).concat(Some$2524([3]))), 'associativity');
        require('buster').assert.equals(Some$2524([1]).concat(Some$2524([1]).empty()), Some$2524([1]), 'right identity');
        require('buster').assert.equals(Some$2524([1]).empty().concat(Some$2524([1])), Some$2524([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2596(x$2598) {
            return function m_prod$2596(x$2599) {
                return Some$2524(x$2599 * x$2599);
            }.curry().apply(null, arguments);
        }
        function m_inc$2597(x$2600) {
            return function m_inc$2597(x$2601) {
                return Some$2524(x$2601 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2524(2).chain(m_prod$2596).chain(m_inc$2597), Some$2524(2).chain(function (x$2602) {
            return m_prod$2596(x$2602).chain(m_inc$2597);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2604 = C$2355.Control.Functor.map;
    ;
    var Either$2606 = C$2355.Data.Either.Either;
    var Left$2607 = C$2355.Data.Either.Left;
    var Right$2608 = C$2355.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2618(x$2625) {
            return function inc$2618(x$2626) {
                return x$2626 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2619(x$2627) {
            return function id$2619(x$2628) {
                return x$2628;
            }.curry().apply(null, arguments);
        }
        function inc$2618(x$2629) {
            return function inc$2618(x$2630) {
                return x$2630 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2620(x$2631) {
            return function square$2620(x$2632) {
                return x$2632 * x$2632;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2604(id$2619, Right$2608(2)), Right$2608(2), 'map identity');
        require('buster').assert.equals(map$2604(id$2619, Left$2607(2)), id$2619(Left$2607(2)), 'map identity');
        require('buster').assert.equals(map$2604(function (x$2633) {
            return inc$2618(square$2620(x$2633));
        }, Right$2608(2)), function (x$2634) {
            return map$2604(inc$2618)(map$2604(square$2620)(x$2634));
        }(Right$2608(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2643(f$2659) {
            return function comp$2643(f$2660) {
                return function (g$2661) {
                    return function (x$2662) {
                        return f$2660(g$2661(x$2662));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2644(x$2663) {
            return function id$2644(x$2664) {
                return x$2664;
            }.curry().apply(null, arguments);
        }
        function add$2645(a$2665, b$2666) {
            return function add$2645(a$2667, b$2668) {
                return a$2667 + b$2668;
            }.curry().apply(null, arguments);
        }
        function prod$2646(a$2669) {
            return function prod$2646(a$2670) {
                return a$2670 * a$2670;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2606.of(id$2644).ap(Right$2608(2)), Right$2608(2), 'identity');
        require('buster').assert.equals(Right$2608(add$2645(2)).map(comp$2643).ap(Right$2608(prod$2646)).ap(Right$2608(2)), Right$2608(add$2645(2)).ap(Right$2608(prod$2646).ap(Right$2608(2))), 'composition');
        require('buster').assert.equals(Either$2606.of(prod$2646).ap(Right$2608(2)), Either$2606.of(prod$2646(2)), 'homomorphism');
        require('buster').assert.equals(Right$2608(prod$2646).ap(Right$2608(2)), Right$2608(function (f$2671) {
            return f$2671(2);
        }.curry()).ap(Right$2608(prod$2646)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2608([1]).concat(Right$2608([2])).concat(Right$2608([3])), Right$2608([1]).concat(Right$2608([2]).concat(Right$2608([3]))), 'associativity');
        require('buster').assert.equals(Right$2608([1]).concat(Right$2608([1]).empty()), Right$2608([1]), 'right identity');
        require('buster').assert.equals(Right$2608([1]).empty().concat(Right$2608([1])), Right$2608([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2679(x$2681) {
            return function m_prod$2679(x$2682) {
                return Right$2608(x$2682 * x$2682);
            }.curry().apply(null, arguments);
        }
        function m_inc$2680(x$2683) {
            return function m_inc$2680(x$2684) {
                return Right$2608(x$2684 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2608(2).chain(m_prod$2679).chain(m_inc$2680), Right$2608(2).chain(function (x$2685) {
            return m_prod$2679(x$2685).chain(m_inc$2680);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2687 = C$2355.Data.Collection.foldl;
    var foldl1$2688 = C$2355.Data.Collection.foldl1;
    var foldr$2689 = C$2355.Data.Collection.foldr;
    var foldr1$2690 = C$2355.Data.Collection.foldr1;
    var flatten$2691 = C$2355.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2687(function (acc$2700, x$2701) {
                return acc$2700.concat(x$2701);
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
            require('buster').assert.equals(foldl1$2688(function (acc$2705, x$2706) {
                return acc$2705.concat([x$2706]);
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
            require('buster').assert.equals(foldr$2689(function (acc$2710, x$2711) {
                return acc$2710.concat(x$2711);
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
            require('buster').assert.equals(foldr1$2690(function (acc$2715, x$2716) {
                return acc$2715.concat([x$2716]);
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
        var Some$2717 = C$2355.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2691([
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
            require('buster').assert.equals(flatten$2691([
                Some$2717([1]),
                Some$2717([2])
            ]), Some$2717([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2730(f$2734) {
            return function comp$2730(f$2735) {
                return function (g$2736) {
                    return function (x$2737) {
                        return f$2735(g$2736(x$2737));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2731(x$2738) {
            return function id$2731(x$2739) {
                return x$2739;
            }.curry().apply(null, arguments);
        }
        function add$2732(a$2740, b$2741) {
            return function add$2732(a$2742, b$2743) {
                return a$2742 + b$2743;
            }.curry().apply(null, arguments);
        }
        function prod$2733(a$2744) {
            return function prod$2733(a$2745) {
                return a$2745 * a$2745;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2731).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2732(2)].map(comp$2730).ap([prod$2733]).ap([2]), [add$2732(2)].ap([prod$2733].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2733).ap([2]), Array.of(prod$2733(2)), 'homomorphism');
            require('buster').assert.equals([prod$2733].ap([2]), [function (f$2760) {
                    return f$2760(2);
                }.curry()].ap([prod$2733]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2765(x$2767) {
            return function m_prod$2765(x$2768) {
                return [x$2768 * x$2768];
            }.curry().apply(null, arguments);
        }
        function m_inc$2766(x$2769) {
            return function m_inc$2766(x$2770) {
                return [x$2770 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$2765).chain(m_inc$2766), [
            1,
            2,
            3
        ].chain(function (x$2771) {
            return m_prod$2765(x$2771).chain(m_inc$2766);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2773 = C$2355.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2781 = {
                    map: function (f$2783) {
                        return f$2783(1);
                    }.curry()
                };
            require('buster').assert(map$2773(function (x$2784) {
                return x$2784 + 2;
            }.curry(), obj$2781) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2786 = C$2355.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2790 = {
                    ap: function (fb$2796) {
                        return this.val(fb$2796.val);
                    }.curry(),
                    val: function (x$2797) {
                        return x$2797 + 1;
                    }.curry()
                };
            var fb$2793 = { val: 2 };
            require('buster').assert(ap$2786(fa$2790, fb$2793) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2799 = C$2355.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2807 = {
                    chain: function (f$2809) {
                        return f$2809(1);
                    }.curry()
                };
            require('buster').assert(chain$2799(obj$2807, function (x$2810) {
                return x$2810 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});