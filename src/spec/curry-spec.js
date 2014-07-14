var C$2355 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2370 = C$2355.Core.__;
    var curry$2371 = C$2355.Core.curry;
    var compose$2372 = C$2355.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2379 = curry$2371(function (a$2386, b$2387, c$2388, d$2389) {
                    return a$2386 + b$2387 + c$2388 + d$2389;
                });
            var nums$2381 = curry$2371(function (a$2390, b$2391) {
                    return [
                        a$2390,
                        b$2391
                    ];
                });
            ;
            require('buster').assert(addMany$2379(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2379(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2379(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2381(__$2370, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2393 = curry$2371(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2393(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2396 = function (a$2398, b$2399) {
                    return a$2398 + b$2399;
                }.curry();
            ;
            require('buster').assert(add$2396(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2402 = curry$2371(function (sep$2410, s$2411) {
                    return s$2411.split(sep$2410);
                });
            var map$2404 = curry$2371(function (f$2412, xs$2413) {
                    return xs$2413.map(f$2412);
                });
            var upcase$2406 = curry$2371(function (s$2414) {
                    return s$2414.toUpperCase();
                });
            var join$2408 = curry$2371(function (sep$2415, xs$2416) {
                    return xs$2416.join(sep$2415);
                });
            ;
            require('buster').assert(compose$2372(join$2408('-'), map$2404(upcase$2406), split$2402(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2418 = C$2355.Predicates.not;
    var and$2419 = C$2355.Predicates.and;
    var or$2420 = C$2355.Predicates.or;
    var isObject$2421 = C$2355.Predicates.isObject;
    var isArray$2422 = C$2355.Predicates.isArray;
    var isNumber$2423 = C$2355.Predicates.isNumber;
    var isRegExp$2424 = C$2355.Predicates.isRegExp;
    var isString$2425 = C$2355.Predicates.isString;
    var isNull$2426 = C$2355.Predicates.isNull;
    var isUndef$2427 = C$2355.Predicates.isUndef;
    var exists$2428 = C$2355.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2418(true) === false, 'not(true)');
        require('buster').assert(not$2418(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2419([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2419([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2419([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2419([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2419([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2419([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2419([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2419([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2420([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2420([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2420([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2420([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2420([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2420([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2420([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2420([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2420([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2420([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2420([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2421({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2421([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2421(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2421(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2421('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2421(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2422([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2422({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2422(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2422(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2422('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2423(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2423([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2423({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2423(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2423('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2424(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2424(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2424([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2424({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2424('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2425('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2425(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2425(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2425([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2425({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2426(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2426('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2426(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2426(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2426([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2426({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2427(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2427('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2427(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2427(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2427([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2427({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2428(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2428(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2428('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2428(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2428(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2428([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2428({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2507 = C$2355.Math.plus;
    var minus$2508 = C$2355.Math.minus;
    var times$2509 = C$2355.Math.times;
    var div$2510 = C$2355.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2507(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2508(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2509(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2510(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Sum', function () {
    var Sum$2524 = C$2355.Number.Sum.Sum;
    var getSum$2525 = C$2355.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 0', function () {
            ;
            require('buster').assert.equals(Sum$2524(2).empty(), Sum$2524(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2525(Sum$2524(2)) == 2, 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of the values', function () {
            ;
            require('buster').assert.equals(Sum$2524(2).concat(Sum$2524(4)), Sum$2524(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2524(1).concat(Sum$2524(2)).concat(Sum$2524(3)), Sum$2524(1).concat(Sum$2524(2).concat(Sum$2524(3))), 'associativity');
            require('buster').assert.equals(Sum$2524(1).concat(Sum$2524(1).empty()), Sum$2524(1), 'right identity');
            require('buster').assert.equals(Sum$2524(1).empty().concat(Sum$2524(1)), Sum$2524(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Product', function () {
    var Product$2540 = C$2355.Number.Product.Product;
    var getProduct$2541 = C$2355.Number.Product.getProduct;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Product$2540(2).empty(), Product$2540(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct :: Product a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2541(Product$2540(2)) == 2, 'getProduct');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Product containing the product of the values', function () {
            ;
            require('buster').assert.equals(Product$2540(2).concat(Product$2540(4)), Product$2540(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2540(1).concat(Product$2540(2)).concat(Product$2540(3)), Product$2540(1).concat(Product$2540(2).concat(Product$2540(3))), 'associativity');
            require('buster').assert.equals(Product$2540(1).concat(Product$2540(1).empty()), Product$2540(1), 'right identity');
            require('buster').assert.equals(Product$2540(1).empty().concat(Product$2540(1)), Product$2540(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Max', function () {
    var Max$2556 = C$2355.Number.Max.Max;
    var getMax$2557 = C$2355.Number.Max.getMax;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Max$2556(2).empty(), Max$2556(-Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMax :: Max a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMax$2557(Max$2556(2)) == 2, 'getMax');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Max containing the largest value', function () {
            ;
            require('buster').assert.equals(Max$2556(2).concat(Max$2556(4)), Max$2556(4), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Max$2556(1).concat(Max$2556(2)).concat(Max$2556(3)), Max$2556(1).concat(Max$2556(2).concat(Max$2556(3))), 'associativity');
            require('buster').assert.equals(Max$2556(1).concat(Max$2556(1).empty()), Max$2556(1), 'right identity');
            require('buster').assert.equals(Max$2556(1).empty().concat(Max$2556(1)), Max$2556(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2572 = C$2355.Control.Functor.map;
    ;
    var Option$2574 = C$2355.Data.Option.Option;
    var Some$2575 = C$2355.Data.Option.Some;
    var None$2576 = C$2355.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2586(x$2593) {
            return function inc$2586(x$2594) {
                return x$2594 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2587(x$2595) {
            return function id$2587(x$2596) {
                return x$2596;
            }.curry().apply(null, arguments);
        }
        function inc$2586(x$2597) {
            return function inc$2586(x$2598) {
                return x$2598 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2588(x$2599) {
            return function square$2588(x$2600) {
                return x$2600 * x$2600;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2572(id$2587, Some$2575(2)), Some$2575(2), 'identity');
        require('buster').assert.equals(map$2572(id$2587, None$2576), id$2587(None$2576), 'identity');
        require('buster').assert.equals(map$2572(function (x$2601) {
            return inc$2586(square$2588(x$2601));
        }, Some$2575(2)), function (x$2602) {
            return map$2572(inc$2586)(map$2572(square$2588)(x$2602));
        }(Some$2575(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2611(f$2627) {
            return function comp$2611(f$2628) {
                return function (g$2629) {
                    return function (x$2630) {
                        return f$2628(g$2629(x$2630));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2612(x$2631) {
            return function id$2612(x$2632) {
                return x$2632;
            }.curry().apply(null, arguments);
        }
        function add$2613(a$2633, b$2634) {
            return function add$2613(a$2635, b$2636) {
                return a$2635 + b$2636;
            }.curry().apply(null, arguments);
        }
        function prod$2614(a$2637) {
            return function prod$2614(a$2638) {
                return a$2638 * a$2638;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2574.of(id$2612).ap(Some$2575(2)), Some$2575(2), 'identity');
        require('buster').assert.equals(Some$2575(add$2613(2)).map(comp$2611).ap(Some$2575(prod$2614)).ap(Some$2575(2)), Some$2575(add$2613(2)).ap(Some$2575(prod$2614).ap(Some$2575(2))), 'composition');
        require('buster').assert.equals(Option$2574.of(prod$2614).ap(Some$2575(2)), Option$2574.of(prod$2614(2)), 'homomorphism');
        require('buster').assert.equals(Some$2575(prod$2614).ap(Some$2575(2)), Some$2575(function (f$2639) {
            return f$2639(2);
        }.curry()).ap(Some$2575(prod$2614)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2575([1]).concat(Some$2575([2])).concat(Some$2575([3])), Some$2575([1]).concat(Some$2575([2]).concat(Some$2575([3]))), 'associativity');
        require('buster').assert.equals(Some$2575([1]).concat(Some$2575([1]).empty()), Some$2575([1]), 'right identity');
        require('buster').assert.equals(Some$2575([1]).empty().concat(Some$2575([1])), Some$2575([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2647(x$2649) {
            return function m_prod$2647(x$2650) {
                return Some$2575(x$2650 * x$2650);
            }.curry().apply(null, arguments);
        }
        function m_inc$2648(x$2651) {
            return function m_inc$2648(x$2652) {
                return Some$2575(x$2652 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2575(2).chain(m_prod$2647).chain(m_inc$2648), Some$2575(2).chain(function (x$2653) {
            return m_prod$2647(x$2653).chain(m_inc$2648);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2655 = C$2355.Control.Functor.map;
    ;
    var Either$2657 = C$2355.Data.Either.Either;
    var Left$2658 = C$2355.Data.Either.Left;
    var Right$2659 = C$2355.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2669(x$2676) {
            return function inc$2669(x$2677) {
                return x$2677 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2670(x$2678) {
            return function id$2670(x$2679) {
                return x$2679;
            }.curry().apply(null, arguments);
        }
        function inc$2669(x$2680) {
            return function inc$2669(x$2681) {
                return x$2681 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2671(x$2682) {
            return function square$2671(x$2683) {
                return x$2683 * x$2683;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2655(id$2670, Right$2659(2)), Right$2659(2), 'map identity');
        require('buster').assert.equals(map$2655(id$2670, Left$2658(2)), id$2670(Left$2658(2)), 'map identity');
        require('buster').assert.equals(map$2655(function (x$2684) {
            return inc$2669(square$2671(x$2684));
        }, Right$2659(2)), function (x$2685) {
            return map$2655(inc$2669)(map$2655(square$2671)(x$2685));
        }(Right$2659(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2694(f$2710) {
            return function comp$2694(f$2711) {
                return function (g$2712) {
                    return function (x$2713) {
                        return f$2711(g$2712(x$2713));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2695(x$2714) {
            return function id$2695(x$2715) {
                return x$2715;
            }.curry().apply(null, arguments);
        }
        function add$2696(a$2716, b$2717) {
            return function add$2696(a$2718, b$2719) {
                return a$2718 + b$2719;
            }.curry().apply(null, arguments);
        }
        function prod$2697(a$2720) {
            return function prod$2697(a$2721) {
                return a$2721 * a$2721;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2657.of(id$2695).ap(Right$2659(2)), Right$2659(2), 'identity');
        require('buster').assert.equals(Right$2659(add$2696(2)).map(comp$2694).ap(Right$2659(prod$2697)).ap(Right$2659(2)), Right$2659(add$2696(2)).ap(Right$2659(prod$2697).ap(Right$2659(2))), 'composition');
        require('buster').assert.equals(Either$2657.of(prod$2697).ap(Right$2659(2)), Either$2657.of(prod$2697(2)), 'homomorphism');
        require('buster').assert.equals(Right$2659(prod$2697).ap(Right$2659(2)), Right$2659(function (f$2722) {
            return f$2722(2);
        }.curry()).ap(Right$2659(prod$2697)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2659([1]).concat(Right$2659([2])).concat(Right$2659([3])), Right$2659([1]).concat(Right$2659([2]).concat(Right$2659([3]))), 'associativity');
        require('buster').assert.equals(Right$2659([1]).concat(Right$2659([1]).empty()), Right$2659([1]), 'right identity');
        require('buster').assert.equals(Right$2659([1]).empty().concat(Right$2659([1])), Right$2659([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2730(x$2732) {
            return function m_prod$2730(x$2733) {
                return Right$2659(x$2733 * x$2733);
            }.curry().apply(null, arguments);
        }
        function m_inc$2731(x$2734) {
            return function m_inc$2731(x$2735) {
                return Right$2659(x$2735 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2659(2).chain(m_prod$2730).chain(m_inc$2731), Right$2659(2).chain(function (x$2736) {
            return m_prod$2730(x$2736).chain(m_inc$2731);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2738 = C$2355.Data.Collection.foldl;
    var foldl1$2739 = C$2355.Data.Collection.foldl1;
    var foldr$2740 = C$2355.Data.Collection.foldr;
    var foldr1$2741 = C$2355.Data.Collection.foldr1;
    var flatten$2742 = C$2355.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2738(function (acc$2751, x$2752) {
                return acc$2751.concat(x$2752);
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
            require('buster').assert.equals(foldl1$2739(function (acc$2756, x$2757) {
                return acc$2756.concat([x$2757]);
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
            require('buster').assert.equals(foldr$2740(function (acc$2761, x$2762) {
                return acc$2761.concat(x$2762);
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
            require('buster').assert.equals(foldr1$2741(function (acc$2766, x$2767) {
                return acc$2766.concat([x$2767]);
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
        var Some$2768 = C$2355.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2742([
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
            require('buster').assert.equals(flatten$2742([
                Some$2768([1]),
                Some$2768([2])
            ]), Some$2768([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2781(f$2785) {
            return function comp$2781(f$2786) {
                return function (g$2787) {
                    return function (x$2788) {
                        return f$2786(g$2787(x$2788));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2782(x$2789) {
            return function id$2782(x$2790) {
                return x$2790;
            }.curry().apply(null, arguments);
        }
        function add$2783(a$2791, b$2792) {
            return function add$2783(a$2793, b$2794) {
                return a$2793 + b$2794;
            }.curry().apply(null, arguments);
        }
        function prod$2784(a$2795) {
            return function prod$2784(a$2796) {
                return a$2796 * a$2796;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2782).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2783(2)].map(comp$2781).ap([prod$2784]).ap([2]), [add$2783(2)].ap([prod$2784].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2784).ap([2]), Array.of(prod$2784(2)), 'homomorphism');
            require('buster').assert.equals([prod$2784].ap([2]), [function (f$2811) {
                    return f$2811(2);
                }.curry()].ap([prod$2784]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2816(x$2818) {
            return function m_prod$2816(x$2819) {
                return [x$2819 * x$2819];
            }.curry().apply(null, arguments);
        }
        function m_inc$2817(x$2820) {
            return function m_inc$2817(x$2821) {
                return [x$2821 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$2816).chain(m_inc$2817), [
            1,
            2,
            3
        ].chain(function (x$2822) {
            return m_prod$2816(x$2822).chain(m_inc$2817);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2824 = C$2355.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2832 = {
                    map: function (f$2834) {
                        return f$2834(1);
                    }.curry()
                };
            require('buster').assert(map$2824(function (x$2835) {
                return x$2835 + 2;
            }.curry(), obj$2832) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2837 = C$2355.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2841 = {
                    ap: function (fb$2847) {
                        return this.val(fb$2847.val);
                    }.curry(),
                    val: function (x$2848) {
                        return x$2848 + 1;
                    }.curry()
                };
            var fb$2844 = { val: 2 };
            require('buster').assert(ap$2837(fa$2841, fb$2844) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2850 = C$2355.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2858 = {
                    chain: function (f$2860) {
                        return f$2860(1);
                    }.curry()
                };
            require('buster').assert(chain$2850(obj$2858, function (x$2861) {
                return x$2861 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});