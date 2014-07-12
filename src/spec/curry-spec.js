var C$2355 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2369 = C$2355.Core.__;
    var curry$2370 = C$2355.Core.curry;
    var compose$2371 = C$2355.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2378 = curry$2370(function (a$2385, b$2386, c$2387, d$2388) {
                    return a$2385 + b$2386 + c$2387 + d$2388;
                });
            var nums$2380 = curry$2370(function (a$2389, b$2390) {
                    return [
                        a$2389,
                        b$2390
                    ];
                });
            ;
            require('buster').assert(addMany$2378(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2378(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2378(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2380(__$2369, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2392 = curry$2370(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2392(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2395 = function (a$2397, b$2398) {
                    return a$2397 + b$2398;
                }.curry();
            ;
            require('buster').assert(add$2395(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2401 = curry$2370(function (sep$2409, s$2410) {
                    return s$2410.split(sep$2409);
                });
            var map$2403 = curry$2370(function (f$2411, xs$2412) {
                    return xs$2412.map(f$2411);
                });
            var upcase$2405 = curry$2370(function (s$2413) {
                    return s$2413.toUpperCase();
                });
            var join$2407 = curry$2370(function (sep$2414, xs$2415) {
                    return xs$2415.join(sep$2414);
                });
            ;
            require('buster').assert(compose$2371(join$2407('-'), map$2403(upcase$2405), split$2401(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2417 = C$2355.Predicates.not;
    var and$2418 = C$2355.Predicates.and;
    var or$2419 = C$2355.Predicates.or;
    var isObject$2420 = C$2355.Predicates.isObject;
    var isArray$2421 = C$2355.Predicates.isArray;
    var isNumber$2422 = C$2355.Predicates.isNumber;
    var isRegExp$2423 = C$2355.Predicates.isRegExp;
    var isString$2424 = C$2355.Predicates.isString;
    var isNull$2425 = C$2355.Predicates.isNull;
    var isUndef$2426 = C$2355.Predicates.isUndef;
    var exists$2427 = C$2355.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2417(true) === false, 'not(true)');
        require('buster').assert(not$2417(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2418([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2418([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2418([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2418([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2418([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2418([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2418([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2418([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2419([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2419([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2419([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2419([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2419([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2419([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2419([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2419([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2419([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2419([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2419([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2420({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2420([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2420(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2420(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2420('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2420(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2421([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2421({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2421(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2421(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2421('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2422(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2422([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2422({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2422(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2422('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2423(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2423(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2423([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2423({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2423('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2424('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2424(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2424(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2424([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2424({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2425(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2425('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2425(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2425(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2425([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2425({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2426(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2426('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2426(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2426(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2426([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2426({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2427(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2427(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2427('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2427(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2427(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2427([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2427({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2506 = C$2355.Math.plus;
    var minus$2507 = C$2355.Math.minus;
    var times$2508 = C$2355.Math.times;
    var div$2509 = C$2355.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2506(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2507(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2508(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2509(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Sum', function () {
    var Sum$2523 = C$2355.Number.Sum.Sum;
    var getSum$2524 = C$2355.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 0', function () {
            ;
            require('buster').assert.equals(Sum$2523(2).empty(), Sum$2523(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2524(Sum$2523(2)), 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of two monoids', function () {
            ;
            require('buster').assert.equals(Sum$2523(2).concat(Sum$2523(4)), Sum$2523(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2523(1).concat(Sum$2523(2)).concat(Sum$2523(3)), Sum$2523(1).concat(Sum$2523(2).concat(Sum$2523(3))), 'associativity');
            require('buster').assert.equals(Sum$2523(1).concat(Sum$2523(1).empty()), Sum$2523(1), 'right identity');
            require('buster').assert.equals(Sum$2523(1).empty().concat(Sum$2523(1)), Sum$2523(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Product', function () {
    var Product$2539 = C$2355.Number.Product.Product;
    var getProduct$2540 = C$2355.Number.Product.getProduct;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Product$2539(2).empty(), Product$2539(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct :: Product a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2540(Product$2539(2)), 'getProduct');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Product() containing the product of the two monoids', function () {
            ;
            require('buster').assert.equals(Product$2539(2).concat(Product$2539(4)), Product$2539(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2539(1).concat(Product$2539(2)).concat(Product$2539(3)), Product$2539(1).concat(Product$2539(2).concat(Product$2539(3))), 'associativity');
            require('buster').assert.equals(Product$2539(1).concat(Product$2539(1).empty()), Product$2539(1), 'right identity');
            require('buster').assert.equals(Product$2539(1).empty().concat(Product$2539(1)), Product$2539(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2555 = C$2355.Control.Functor.map;
    ;
    var Option$2557 = C$2355.Data.Option.Option;
    var Some$2558 = C$2355.Data.Option.Some;
    var None$2559 = C$2355.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2569(x$2576) {
            return function inc$2569(x$2577) {
                return x$2577 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2570(x$2578) {
            return function id$2570(x$2579) {
                return x$2579;
            }.curry().apply(null, arguments);
        }
        function inc$2569(x$2580) {
            return function inc$2569(x$2581) {
                return x$2581 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2571(x$2582) {
            return function square$2571(x$2583) {
                return x$2583 * x$2583;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2555(id$2570, Some$2558(2)), Some$2558(2), 'identity');
        require('buster').assert.equals(map$2555(id$2570, None$2559), id$2570(None$2559), 'identity');
        require('buster').assert.equals(map$2555(function (x$2584) {
            return inc$2569(square$2571(x$2584));
        }, Some$2558(2)), function (x$2585) {
            return map$2555(inc$2569)(map$2555(square$2571)(x$2585));
        }(Some$2558(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2594(f$2610) {
            return function comp$2594(f$2611) {
                return function (g$2612) {
                    return function (x$2613) {
                        return f$2611(g$2612(x$2613));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2595(x$2614) {
            return function id$2595(x$2615) {
                return x$2615;
            }.curry().apply(null, arguments);
        }
        function add$2596(a$2616, b$2617) {
            return function add$2596(a$2618, b$2619) {
                return a$2618 + b$2619;
            }.curry().apply(null, arguments);
        }
        function prod$2597(a$2620) {
            return function prod$2597(a$2621) {
                return a$2621 * a$2621;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2557.of(id$2595).ap(Some$2558(2)), Some$2558(2), 'identity');
        require('buster').assert.equals(Some$2558(add$2596(2)).map(comp$2594).ap(Some$2558(prod$2597)).ap(Some$2558(2)), Some$2558(add$2596(2)).ap(Some$2558(prod$2597).ap(Some$2558(2))), 'composition');
        require('buster').assert.equals(Option$2557.of(prod$2597).ap(Some$2558(2)), Option$2557.of(prod$2597(2)), 'homomorphism');
        require('buster').assert.equals(Some$2558(prod$2597).ap(Some$2558(2)), Some$2558(function (f$2622) {
            return f$2622(2);
        }.curry()).ap(Some$2558(prod$2597)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2558([1]).concat(Some$2558([2])).concat(Some$2558([3])), Some$2558([1]).concat(Some$2558([2]).concat(Some$2558([3]))), 'associativity');
        require('buster').assert.equals(Some$2558([1]).concat(Some$2558([1]).empty()), Some$2558([1]), 'right identity');
        require('buster').assert.equals(Some$2558([1]).empty().concat(Some$2558([1])), Some$2558([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2630(x$2632) {
            return function m_prod$2630(x$2633) {
                return Some$2558(x$2633 * x$2633);
            }.curry().apply(null, arguments);
        }
        function m_inc$2631(x$2634) {
            return function m_inc$2631(x$2635) {
                return Some$2558(x$2635 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2558(2).chain(m_prod$2630).chain(m_inc$2631), Some$2558(2).chain(function (x$2636) {
            return m_prod$2630(x$2636).chain(m_inc$2631);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2638 = C$2355.Control.Functor.map;
    ;
    var Either$2640 = C$2355.Data.Either.Either;
    var Left$2641 = C$2355.Data.Either.Left;
    var Right$2642 = C$2355.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2652(x$2659) {
            return function inc$2652(x$2660) {
                return x$2660 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2653(x$2661) {
            return function id$2653(x$2662) {
                return x$2662;
            }.curry().apply(null, arguments);
        }
        function inc$2652(x$2663) {
            return function inc$2652(x$2664) {
                return x$2664 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2654(x$2665) {
            return function square$2654(x$2666) {
                return x$2666 * x$2666;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2638(id$2653, Right$2642(2)), Right$2642(2), 'map identity');
        require('buster').assert.equals(map$2638(id$2653, Left$2641(2)), id$2653(Left$2641(2)), 'map identity');
        require('buster').assert.equals(map$2638(function (x$2667) {
            return inc$2652(square$2654(x$2667));
        }, Right$2642(2)), function (x$2668) {
            return map$2638(inc$2652)(map$2638(square$2654)(x$2668));
        }(Right$2642(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2677(f$2693) {
            return function comp$2677(f$2694) {
                return function (g$2695) {
                    return function (x$2696) {
                        return f$2694(g$2695(x$2696));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2678(x$2697) {
            return function id$2678(x$2698) {
                return x$2698;
            }.curry().apply(null, arguments);
        }
        function add$2679(a$2699, b$2700) {
            return function add$2679(a$2701, b$2702) {
                return a$2701 + b$2702;
            }.curry().apply(null, arguments);
        }
        function prod$2680(a$2703) {
            return function prod$2680(a$2704) {
                return a$2704 * a$2704;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2640.of(id$2678).ap(Right$2642(2)), Right$2642(2), 'identity');
        require('buster').assert.equals(Right$2642(add$2679(2)).map(comp$2677).ap(Right$2642(prod$2680)).ap(Right$2642(2)), Right$2642(add$2679(2)).ap(Right$2642(prod$2680).ap(Right$2642(2))), 'composition');
        require('buster').assert.equals(Either$2640.of(prod$2680).ap(Right$2642(2)), Either$2640.of(prod$2680(2)), 'homomorphism');
        require('buster').assert.equals(Right$2642(prod$2680).ap(Right$2642(2)), Right$2642(function (f$2705) {
            return f$2705(2);
        }.curry()).ap(Right$2642(prod$2680)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2642([1]).concat(Right$2642([2])).concat(Right$2642([3])), Right$2642([1]).concat(Right$2642([2]).concat(Right$2642([3]))), 'associativity');
        require('buster').assert.equals(Right$2642([1]).concat(Right$2642([1]).empty()), Right$2642([1]), 'right identity');
        require('buster').assert.equals(Right$2642([1]).empty().concat(Right$2642([1])), Right$2642([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2713(x$2715) {
            return function m_prod$2713(x$2716) {
                return Right$2642(x$2716 * x$2716);
            }.curry().apply(null, arguments);
        }
        function m_inc$2714(x$2717) {
            return function m_inc$2714(x$2718) {
                return Right$2642(x$2718 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2642(2).chain(m_prod$2713).chain(m_inc$2714), Right$2642(2).chain(function (x$2719) {
            return m_prod$2713(x$2719).chain(m_inc$2714);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2721 = C$2355.Data.Collection.foldl;
    var foldl1$2722 = C$2355.Data.Collection.foldl1;
    var foldr$2723 = C$2355.Data.Collection.foldr;
    var foldr1$2724 = C$2355.Data.Collection.foldr1;
    var flatten$2725 = C$2355.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2721(function (acc$2734, x$2735) {
                return acc$2734.concat(x$2735);
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
            require('buster').assert.equals(foldl1$2722(function (acc$2739, x$2740) {
                return acc$2739.concat([x$2740]);
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
            require('buster').assert.equals(foldr$2723(function (acc$2744, x$2745) {
                return acc$2744.concat(x$2745);
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
            require('buster').assert.equals(foldr1$2724(function (acc$2749, x$2750) {
                return acc$2749.concat([x$2750]);
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
        var Some$2751 = C$2355.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2725([
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
            require('buster').assert.equals(flatten$2725([
                Some$2751([1]),
                Some$2751([2])
            ]), Some$2751([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2764(f$2768) {
            return function comp$2764(f$2769) {
                return function (g$2770) {
                    return function (x$2771) {
                        return f$2769(g$2770(x$2771));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2765(x$2772) {
            return function id$2765(x$2773) {
                return x$2773;
            }.curry().apply(null, arguments);
        }
        function add$2766(a$2774, b$2775) {
            return function add$2766(a$2776, b$2777) {
                return a$2776 + b$2777;
            }.curry().apply(null, arguments);
        }
        function prod$2767(a$2778) {
            return function prod$2767(a$2779) {
                return a$2779 * a$2779;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2765).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2766(2)].map(comp$2764).ap([prod$2767]).ap([2]), [add$2766(2)].ap([prod$2767].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2767).ap([2]), Array.of(prod$2767(2)), 'homomorphism');
            require('buster').assert.equals([prod$2767].ap([2]), [function (f$2794) {
                    return f$2794(2);
                }.curry()].ap([prod$2767]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2799(x$2801) {
            return function m_prod$2799(x$2802) {
                return [x$2802 * x$2802];
            }.curry().apply(null, arguments);
        }
        function m_inc$2800(x$2803) {
            return function m_inc$2800(x$2804) {
                return [x$2804 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$2799).chain(m_inc$2800), [
            1,
            2,
            3
        ].chain(function (x$2805) {
            return m_prod$2799(x$2805).chain(m_inc$2800);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2807 = C$2355.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2815 = {
                    map: function (f$2817) {
                        return f$2817(1);
                    }.curry()
                };
            require('buster').assert(map$2807(function (x$2818) {
                return x$2818 + 2;
            }.curry(), obj$2815) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2820 = C$2355.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2824 = {
                    ap: function (fb$2830) {
                        return this.val(fb$2830.val);
                    }.curry(),
                    val: function (x$2831) {
                        return x$2831 + 1;
                    }.curry()
                };
            var fb$2827 = { val: 2 };
            require('buster').assert(ap$2820(fa$2824, fb$2827) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2833 = C$2355.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2841 = {
                    chain: function (f$2843) {
                        return f$2843(1);
                    }.curry()
                };
            require('buster').assert(chain$2833(obj$2841, function (x$2844) {
                return x$2844 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});