var C$2355 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2368 = C$2355.Core.__;
    var curry$2369 = C$2355.Core.curry;
    var compose$2370 = C$2355.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2377 = curry$2369(function (a$2384, b$2385, c$2386, d$2387) {
                    return a$2384 + b$2385 + c$2386 + d$2387;
                });
            var nums$2379 = curry$2369(function (a$2388, b$2389) {
                    return [
                        a$2388,
                        b$2389
                    ];
                });
            ;
            require('buster').assert(addMany$2377(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2377(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2377(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2379(__$2368, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2391 = curry$2369(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2391(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2394 = function (a$2396, b$2397) {
                    return a$2396 + b$2397;
                }.curry();
            ;
            require('buster').assert(add$2394(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2400 = curry$2369(function (sep$2408, s$2409) {
                    return s$2409.split(sep$2408);
                });
            var map$2402 = curry$2369(function (f$2410, xs$2411) {
                    return xs$2411.map(f$2410);
                });
            var upcase$2404 = curry$2369(function (s$2412) {
                    return s$2412.toUpperCase();
                });
            var join$2406 = curry$2369(function (sep$2413, xs$2414) {
                    return xs$2414.join(sep$2413);
                });
            ;
            require('buster').assert(compose$2370(join$2406('-'), map$2402(upcase$2404), split$2400(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2416 = C$2355.Predicates.not;
    var and$2417 = C$2355.Predicates.and;
    var or$2418 = C$2355.Predicates.or;
    var isObject$2419 = C$2355.Predicates.isObject;
    var isArray$2420 = C$2355.Predicates.isArray;
    var isNumber$2421 = C$2355.Predicates.isNumber;
    var isRegExp$2422 = C$2355.Predicates.isRegExp;
    var isString$2423 = C$2355.Predicates.isString;
    var isNull$2424 = C$2355.Predicates.isNull;
    var isUndef$2425 = C$2355.Predicates.isUndef;
    var exists$2426 = C$2355.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2416(true) === false, 'not(true)');
        require('buster').assert(not$2416(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2417([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2417([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2417([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2417([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2417([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2417([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2417([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2417([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2418([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2418([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2418([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2418([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2418([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2418([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2418([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2418([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2418([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2418([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2418([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2419({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2419([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2419(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2419(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2419('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2419(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2420([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2420({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2420(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2420(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2420('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2421(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2421([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2421({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2421(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2421('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2422(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2422(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2422([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2422({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2422('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2423('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2423(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2423(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2423([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2423({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2424(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2424('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2424(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2424(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2424([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2424({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2425(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2425('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2425(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2425(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2425([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2425({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2426(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2426(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2426('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2426(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2426(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2426([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2426({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2505 = C$2355.Math.plus;
    var minus$2506 = C$2355.Math.minus;
    var times$2507 = C$2355.Math.times;
    var div$2508 = C$2355.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2505(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2506(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2507(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2508(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Sum', function () {
    var Sum$2522 = C$2355.Number.Sum.Sum;
    var getSum$2523 = C$2355.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('uses 0 as the identity value', function () {
            ;
            require('buster').assert.equals(Sum$2522(2).empty(), Sum$2522(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('extracts the number from the sum', function () {
            ;
            require('buster').assert(getSum$2523(Sum$2522(2)), 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('performs addition', function () {
            ;
            require('buster').assert.equals(Sum$2522(2).concat(Sum$2522(4)), Sum$2522(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2522(1).concat(Sum$2522(2)).concat(Sum$2522(3)), Sum$2522(1).concat(Sum$2522(2).concat(Sum$2522(3))), 'associativity');
            require('buster').assert.equals(Sum$2522(1).concat(Sum$2522(1).empty()), Sum$2522(1), 'right identity');
            require('buster').assert.equals(Sum$2522(1).empty().concat(Sum$2522(1)), Sum$2522(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2538 = C$2355.Control.Functor.map;
    ;
    var Option$2540 = C$2355.Data.Option.Option;
    var Some$2541 = C$2355.Data.Option.Some;
    var None$2542 = C$2355.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2552(x$2559) {
            return function inc$2552(x$2560) {
                return x$2560 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2553(x$2561) {
            return function id$2553(x$2562) {
                return x$2562;
            }.curry().apply(null, arguments);
        }
        function inc$2552(x$2563) {
            return function inc$2552(x$2564) {
                return x$2564 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2554(x$2565) {
            return function square$2554(x$2566) {
                return x$2566 * x$2566;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2538(id$2553, Some$2541(2)), Some$2541(2), 'identity');
        require('buster').assert.equals(map$2538(id$2553, None$2542), id$2553(None$2542), 'identity');
        require('buster').assert.equals(map$2538(function (x$2567) {
            return inc$2552(square$2554(x$2567));
        }, Some$2541(2)), function (x$2568) {
            return map$2538(inc$2552)(map$2538(square$2554)(x$2568));
        }(Some$2541(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2577(f$2593) {
            return function comp$2577(f$2594) {
                return function (g$2595) {
                    return function (x$2596) {
                        return f$2594(g$2595(x$2596));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2578(x$2597) {
            return function id$2578(x$2598) {
                return x$2598;
            }.curry().apply(null, arguments);
        }
        function add$2579(a$2599, b$2600) {
            return function add$2579(a$2601, b$2602) {
                return a$2601 + b$2602;
            }.curry().apply(null, arguments);
        }
        function prod$2580(a$2603) {
            return function prod$2580(a$2604) {
                return a$2604 * a$2604;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2540.of(id$2578).ap(Some$2541(2)), Some$2541(2), 'identity');
        require('buster').assert.equals(Some$2541(add$2579(2)).map(comp$2577).ap(Some$2541(prod$2580)).ap(Some$2541(2)), Some$2541(add$2579(2)).ap(Some$2541(prod$2580).ap(Some$2541(2))), 'composition');
        require('buster').assert.equals(Option$2540.of(prod$2580).ap(Some$2541(2)), Option$2540.of(prod$2580(2)), 'homomorphism');
        require('buster').assert.equals(Some$2541(prod$2580).ap(Some$2541(2)), Some$2541(function (f$2605) {
            return f$2605(2);
        }.curry()).ap(Some$2541(prod$2580)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2541([1]).concat(Some$2541([2])).concat(Some$2541([3])), Some$2541([1]).concat(Some$2541([2]).concat(Some$2541([3]))), 'associativity');
        require('buster').assert.equals(Some$2541([1]).concat(Some$2541([1]).empty()), Some$2541([1]), 'right identity');
        require('buster').assert.equals(Some$2541([1]).empty().concat(Some$2541([1])), Some$2541([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2613(x$2615) {
            return function m_prod$2613(x$2616) {
                return Some$2541(x$2616 * x$2616);
            }.curry().apply(null, arguments);
        }
        function m_inc$2614(x$2617) {
            return function m_inc$2614(x$2618) {
                return Some$2541(x$2618 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2541(2).chain(m_prod$2613).chain(m_inc$2614), Some$2541(2).chain(function (x$2619) {
            return m_prod$2613(x$2619).chain(m_inc$2614);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2621 = C$2355.Control.Functor.map;
    ;
    var Either$2623 = C$2355.Data.Either.Either;
    var Left$2624 = C$2355.Data.Either.Left;
    var Right$2625 = C$2355.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2635(x$2642) {
            return function inc$2635(x$2643) {
                return x$2643 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2636(x$2644) {
            return function id$2636(x$2645) {
                return x$2645;
            }.curry().apply(null, arguments);
        }
        function inc$2635(x$2646) {
            return function inc$2635(x$2647) {
                return x$2647 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2637(x$2648) {
            return function square$2637(x$2649) {
                return x$2649 * x$2649;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2621(id$2636, Right$2625(2)), Right$2625(2), 'map identity');
        require('buster').assert.equals(map$2621(id$2636, Left$2624(2)), id$2636(Left$2624(2)), 'map identity');
        require('buster').assert.equals(map$2621(function (x$2650) {
            return inc$2635(square$2637(x$2650));
        }, Right$2625(2)), function (x$2651) {
            return map$2621(inc$2635)(map$2621(square$2637)(x$2651));
        }(Right$2625(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2660(f$2676) {
            return function comp$2660(f$2677) {
                return function (g$2678) {
                    return function (x$2679) {
                        return f$2677(g$2678(x$2679));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2661(x$2680) {
            return function id$2661(x$2681) {
                return x$2681;
            }.curry().apply(null, arguments);
        }
        function add$2662(a$2682, b$2683) {
            return function add$2662(a$2684, b$2685) {
                return a$2684 + b$2685;
            }.curry().apply(null, arguments);
        }
        function prod$2663(a$2686) {
            return function prod$2663(a$2687) {
                return a$2687 * a$2687;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2623.of(id$2661).ap(Right$2625(2)), Right$2625(2), 'identity');
        require('buster').assert.equals(Right$2625(add$2662(2)).map(comp$2660).ap(Right$2625(prod$2663)).ap(Right$2625(2)), Right$2625(add$2662(2)).ap(Right$2625(prod$2663).ap(Right$2625(2))), 'composition');
        require('buster').assert.equals(Either$2623.of(prod$2663).ap(Right$2625(2)), Either$2623.of(prod$2663(2)), 'homomorphism');
        require('buster').assert.equals(Right$2625(prod$2663).ap(Right$2625(2)), Right$2625(function (f$2688) {
            return f$2688(2);
        }.curry()).ap(Right$2625(prod$2663)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2625([1]).concat(Right$2625([2])).concat(Right$2625([3])), Right$2625([1]).concat(Right$2625([2]).concat(Right$2625([3]))), 'associativity');
        require('buster').assert.equals(Right$2625([1]).concat(Right$2625([1]).empty()), Right$2625([1]), 'right identity');
        require('buster').assert.equals(Right$2625([1]).empty().concat(Right$2625([1])), Right$2625([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2696(x$2698) {
            return function m_prod$2696(x$2699) {
                return Right$2625(x$2699 * x$2699);
            }.curry().apply(null, arguments);
        }
        function m_inc$2697(x$2700) {
            return function m_inc$2697(x$2701) {
                return Right$2625(x$2701 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2625(2).chain(m_prod$2696).chain(m_inc$2697), Right$2625(2).chain(function (x$2702) {
            return m_prod$2696(x$2702).chain(m_inc$2697);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2704 = C$2355.Data.Collection.foldl;
    var foldl1$2705 = C$2355.Data.Collection.foldl1;
    var foldr$2706 = C$2355.Data.Collection.foldr;
    var foldr1$2707 = C$2355.Data.Collection.foldr1;
    var flatten$2708 = C$2355.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2704(function (acc$2717, x$2718) {
                return acc$2717.concat(x$2718);
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
            require('buster').assert.equals(foldl1$2705(function (acc$2722, x$2723) {
                return acc$2722.concat([x$2723]);
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
            require('buster').assert.equals(foldr$2706(function (acc$2727, x$2728) {
                return acc$2727.concat(x$2728);
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
            require('buster').assert.equals(foldr1$2707(function (acc$2732, x$2733) {
                return acc$2732.concat([x$2733]);
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
        var Some$2734 = C$2355.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2708([
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
            require('buster').assert.equals(flatten$2708([
                Some$2734([1]),
                Some$2734([2])
            ]), Some$2734([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2747(f$2751) {
            return function comp$2747(f$2752) {
                return function (g$2753) {
                    return function (x$2754) {
                        return f$2752(g$2753(x$2754));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2748(x$2755) {
            return function id$2748(x$2756) {
                return x$2756;
            }.curry().apply(null, arguments);
        }
        function add$2749(a$2757, b$2758) {
            return function add$2749(a$2759, b$2760) {
                return a$2759 + b$2760;
            }.curry().apply(null, arguments);
        }
        function prod$2750(a$2761) {
            return function prod$2750(a$2762) {
                return a$2762 * a$2762;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2748).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2749(2)].map(comp$2747).ap([prod$2750]).ap([2]), [add$2749(2)].ap([prod$2750].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2750).ap([2]), Array.of(prod$2750(2)), 'homomorphism');
            require('buster').assert.equals([prod$2750].ap([2]), [function (f$2777) {
                    return f$2777(2);
                }.curry()].ap([prod$2750]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2782(x$2784) {
            return function m_prod$2782(x$2785) {
                return [x$2785 * x$2785];
            }.curry().apply(null, arguments);
        }
        function m_inc$2783(x$2786) {
            return function m_inc$2783(x$2787) {
                return [x$2787 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$2782).chain(m_inc$2783), [
            1,
            2,
            3
        ].chain(function (x$2788) {
            return m_prod$2782(x$2788).chain(m_inc$2783);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2790 = C$2355.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2798 = {
                    map: function (f$2800) {
                        return f$2800(1);
                    }.curry()
                };
            require('buster').assert(map$2790(function (x$2801) {
                return x$2801 + 2;
            }.curry(), obj$2798) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2803 = C$2355.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2807 = {
                    ap: function (fb$2813) {
                        return this.val(fb$2813.val);
                    }.curry(),
                    val: function (x$2814) {
                        return x$2814 + 1;
                    }.curry()
                };
            var fb$2810 = { val: 2 };
            require('buster').assert(ap$2803(fa$2807, fb$2810) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2816 = C$2355.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2824 = {
                    chain: function (f$2826) {
                        return f$2826(1);
                    }.curry()
                };
            require('buster').assert(chain$2816(obj$2824, function (x$2827) {
                return x$2827 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});