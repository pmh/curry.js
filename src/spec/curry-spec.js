var C$2355 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2371 = C$2355.Core.__;
    var curry$2372 = C$2355.Core.curry;
    var compose$2373 = C$2355.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2380 = curry$2372(function (a$2387, b$2388, c$2389, d$2390) {
                    return a$2387 + b$2388 + c$2389 + d$2390;
                });
            var nums$2382 = curry$2372(function (a$2391, b$2392) {
                    return [
                        a$2391,
                        b$2392
                    ];
                });
            ;
            require('buster').assert(addMany$2380(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2380(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2380(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2382(__$2371, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2394 = curry$2372(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2394(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2397 = function (a$2399, b$2400) {
                    return a$2399 + b$2400;
                }.curry();
            ;
            require('buster').assert(add$2397(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2403 = curry$2372(function (sep$2411, s$2412) {
                    return s$2412.split(sep$2411);
                });
            var map$2405 = curry$2372(function (f$2413, xs$2414) {
                    return xs$2414.map(f$2413);
                });
            var upcase$2407 = curry$2372(function (s$2415) {
                    return s$2415.toUpperCase();
                });
            var join$2409 = curry$2372(function (sep$2416, xs$2417) {
                    return xs$2417.join(sep$2416);
                });
            ;
            require('buster').assert(compose$2373(join$2409('-'), map$2405(upcase$2407), split$2403(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2419 = C$2355.Predicates.not;
    var and$2420 = C$2355.Predicates.and;
    var or$2421 = C$2355.Predicates.or;
    var isObject$2422 = C$2355.Predicates.isObject;
    var isArray$2423 = C$2355.Predicates.isArray;
    var isNumber$2424 = C$2355.Predicates.isNumber;
    var isRegExp$2425 = C$2355.Predicates.isRegExp;
    var isString$2426 = C$2355.Predicates.isString;
    var isNull$2427 = C$2355.Predicates.isNull;
    var isUndef$2428 = C$2355.Predicates.isUndef;
    var exists$2429 = C$2355.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2419(true) === false, 'not(true)');
        require('buster').assert(not$2419(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2420([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2420([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2420([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2420([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2420([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2420([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2420([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2420([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2421([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2421([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2421([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2421([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2421([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2421([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2421([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2421([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2421([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2421([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2421([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2422({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2422([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2422(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2422(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2422('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2422(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2423([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2423({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2423(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2423(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2423('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2424(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2424([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2424({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2424(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2424('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2425(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2425(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2425([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2425({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2425('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2426('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2426(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2426(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2426([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2426({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2427(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2427('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2427(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2427(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2427([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2427({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2428(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2428('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2428(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2428(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2428([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2428({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2429(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2429(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2429('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2429(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2429(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2429([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2429({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2508 = C$2355.Math.plus;
    var minus$2509 = C$2355.Math.minus;
    var times$2510 = C$2355.Math.times;
    var div$2511 = C$2355.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2508(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2509(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2510(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2511(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Sum', function () {
    var Sum$2525 = C$2355.Number.Sum.Sum;
    var getSum$2526 = C$2355.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 0', function () {
            ;
            require('buster').assert.equals(Sum$2525(2).empty(), Sum$2525(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2526(Sum$2525(2)) == 2, 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of the values', function () {
            ;
            require('buster').assert.equals(Sum$2525(2).concat(Sum$2525(4)), Sum$2525(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2525(1).concat(Sum$2525(2)).concat(Sum$2525(3)), Sum$2525(1).concat(Sum$2525(2).concat(Sum$2525(3))), 'associativity');
            require('buster').assert.equals(Sum$2525(1).concat(Sum$2525(1).empty()), Sum$2525(1), 'right identity');
            require('buster').assert.equals(Sum$2525(1).empty().concat(Sum$2525(1)), Sum$2525(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Product', function () {
    var Product$2541 = C$2355.Number.Product.Product;
    var getProduct$2542 = C$2355.Number.Product.getProduct;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Product$2541(2).empty(), Product$2541(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct :: Product a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2542(Product$2541(2)) == 2, 'getProduct');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Product containing the product of the values', function () {
            ;
            require('buster').assert.equals(Product$2541(2).concat(Product$2541(4)), Product$2541(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2541(1).concat(Product$2541(2)).concat(Product$2541(3)), Product$2541(1).concat(Product$2541(2).concat(Product$2541(3))), 'associativity');
            require('buster').assert.equals(Product$2541(1).concat(Product$2541(1).empty()), Product$2541(1), 'right identity');
            require('buster').assert.equals(Product$2541(1).empty().concat(Product$2541(1)), Product$2541(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Max', function () {
    var Max$2557 = C$2355.Number.Max.Max;
    var getMax$2558 = C$2355.Number.Max.getMax;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Max$2557(2).empty(), Max$2557(-Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMax :: Max a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMax$2558(Max$2557(2)) == 2, 'getMax');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Max containing the largest value', function () {
            ;
            require('buster').assert.equals(Max$2557(2).concat(Max$2557(4)), Max$2557(4), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Max$2557(1).concat(Max$2557(2)).concat(Max$2557(3)), Max$2557(1).concat(Max$2557(2).concat(Max$2557(3))), 'associativity');
            require('buster').assert.equals(Max$2557(1).concat(Max$2557(1).empty()), Max$2557(1), 'right identity');
            require('buster').assert.equals(Max$2557(1).empty().concat(Max$2557(1)), Max$2557(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Min', function () {
    var Min$2573 = C$2355.Number.Min.Min;
    var getMin$2574 = C$2355.Number.Min.getMin;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Min$2573(2).empty(), Min$2573(Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMin :: Min a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMin$2574(Min$2573(2)) == 2, 'getMin');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Min containing the smallest value', function () {
            ;
            require('buster').assert.equals(Min$2573(2).concat(Min$2573(4)), Min$2573(2), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Min$2573(1).concat(Min$2573(2)).concat(Min$2573(3)), Min$2573(1).concat(Min$2573(2).concat(Min$2573(3))), 'associativity');
            require('buster').assert.equals(Min$2573(1).concat(Min$2573(1).empty()), Min$2573(1), 'right identity');
            require('buster').assert.equals(Min$2573(1).empty().concat(Min$2573(1)), Min$2573(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2589 = C$2355.Control.Functor.map;
    ;
    var Option$2591 = C$2355.Data.Option.Option;
    var Some$2592 = C$2355.Data.Option.Some;
    var None$2593 = C$2355.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2603(x$2610) {
            return function inc$2603(x$2611) {
                return x$2611 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2604(x$2612) {
            return function id$2604(x$2613) {
                return x$2613;
            }.curry().apply(null, arguments);
        }
        function inc$2603(x$2614) {
            return function inc$2603(x$2615) {
                return x$2615 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2605(x$2616) {
            return function square$2605(x$2617) {
                return x$2617 * x$2617;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2589(id$2604, Some$2592(2)), Some$2592(2), 'identity');
        require('buster').assert.equals(map$2589(id$2604, None$2593), id$2604(None$2593), 'identity');
        require('buster').assert.equals(map$2589(function (x$2618) {
            return inc$2603(square$2605(x$2618));
        }, Some$2592(2)), function (x$2619) {
            return map$2589(inc$2603)(map$2589(square$2605)(x$2619));
        }(Some$2592(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2628(f$2644) {
            return function comp$2628(f$2645) {
                return function (g$2646) {
                    return function (x$2647) {
                        return f$2645(g$2646(x$2647));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2629(x$2648) {
            return function id$2629(x$2649) {
                return x$2649;
            }.curry().apply(null, arguments);
        }
        function add$2630(a$2650, b$2651) {
            return function add$2630(a$2652, b$2653) {
                return a$2652 + b$2653;
            }.curry().apply(null, arguments);
        }
        function prod$2631(a$2654) {
            return function prod$2631(a$2655) {
                return a$2655 * a$2655;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2591.of(id$2629).ap(Some$2592(2)), Some$2592(2), 'identity');
        require('buster').assert.equals(Some$2592(add$2630(2)).map(comp$2628).ap(Some$2592(prod$2631)).ap(Some$2592(2)), Some$2592(add$2630(2)).ap(Some$2592(prod$2631).ap(Some$2592(2))), 'composition');
        require('buster').assert.equals(Option$2591.of(prod$2631).ap(Some$2592(2)), Option$2591.of(prod$2631(2)), 'homomorphism');
        require('buster').assert.equals(Some$2592(prod$2631).ap(Some$2592(2)), Some$2592(function (f$2656) {
            return f$2656(2);
        }.curry()).ap(Some$2592(prod$2631)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2592([1]).concat(Some$2592([2])).concat(Some$2592([3])), Some$2592([1]).concat(Some$2592([2]).concat(Some$2592([3]))), 'associativity');
        require('buster').assert.equals(Some$2592([1]).concat(Some$2592([1]).empty()), Some$2592([1]), 'right identity');
        require('buster').assert.equals(Some$2592([1]).empty().concat(Some$2592([1])), Some$2592([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2664(x$2666) {
            return function m_prod$2664(x$2667) {
                return Some$2592(x$2667 * x$2667);
            }.curry().apply(null, arguments);
        }
        function m_inc$2665(x$2668) {
            return function m_inc$2665(x$2669) {
                return Some$2592(x$2669 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2592(2).chain(m_prod$2664).chain(m_inc$2665), Some$2592(2).chain(function (x$2670) {
            return m_prod$2664(x$2670).chain(m_inc$2665);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2672 = C$2355.Control.Functor.map;
    ;
    var Either$2674 = C$2355.Data.Either.Either;
    var Left$2675 = C$2355.Data.Either.Left;
    var Right$2676 = C$2355.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2686(x$2693) {
            return function inc$2686(x$2694) {
                return x$2694 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2687(x$2695) {
            return function id$2687(x$2696) {
                return x$2696;
            }.curry().apply(null, arguments);
        }
        function inc$2686(x$2697) {
            return function inc$2686(x$2698) {
                return x$2698 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2688(x$2699) {
            return function square$2688(x$2700) {
                return x$2700 * x$2700;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2672(id$2687, Right$2676(2)), Right$2676(2), 'map identity');
        require('buster').assert.equals(map$2672(id$2687, Left$2675(2)), id$2687(Left$2675(2)), 'map identity');
        require('buster').assert.equals(map$2672(function (x$2701) {
            return inc$2686(square$2688(x$2701));
        }, Right$2676(2)), function (x$2702) {
            return map$2672(inc$2686)(map$2672(square$2688)(x$2702));
        }(Right$2676(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2711(f$2727) {
            return function comp$2711(f$2728) {
                return function (g$2729) {
                    return function (x$2730) {
                        return f$2728(g$2729(x$2730));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2712(x$2731) {
            return function id$2712(x$2732) {
                return x$2732;
            }.curry().apply(null, arguments);
        }
        function add$2713(a$2733, b$2734) {
            return function add$2713(a$2735, b$2736) {
                return a$2735 + b$2736;
            }.curry().apply(null, arguments);
        }
        function prod$2714(a$2737) {
            return function prod$2714(a$2738) {
                return a$2738 * a$2738;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2674.of(id$2712).ap(Right$2676(2)), Right$2676(2), 'identity');
        require('buster').assert.equals(Right$2676(add$2713(2)).map(comp$2711).ap(Right$2676(prod$2714)).ap(Right$2676(2)), Right$2676(add$2713(2)).ap(Right$2676(prod$2714).ap(Right$2676(2))), 'composition');
        require('buster').assert.equals(Either$2674.of(prod$2714).ap(Right$2676(2)), Either$2674.of(prod$2714(2)), 'homomorphism');
        require('buster').assert.equals(Right$2676(prod$2714).ap(Right$2676(2)), Right$2676(function (f$2739) {
            return f$2739(2);
        }.curry()).ap(Right$2676(prod$2714)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2676([1]).concat(Right$2676([2])).concat(Right$2676([3])), Right$2676([1]).concat(Right$2676([2]).concat(Right$2676([3]))), 'associativity');
        require('buster').assert.equals(Right$2676([1]).concat(Right$2676([1]).empty()), Right$2676([1]), 'right identity');
        require('buster').assert.equals(Right$2676([1]).empty().concat(Right$2676([1])), Right$2676([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2747(x$2749) {
            return function m_prod$2747(x$2750) {
                return Right$2676(x$2750 * x$2750);
            }.curry().apply(null, arguments);
        }
        function m_inc$2748(x$2751) {
            return function m_inc$2748(x$2752) {
                return Right$2676(x$2752 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2676(2).chain(m_prod$2747).chain(m_inc$2748), Right$2676(2).chain(function (x$2753) {
            return m_prod$2747(x$2753).chain(m_inc$2748);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2755 = C$2355.Data.Collection.foldl;
    var foldl1$2756 = C$2355.Data.Collection.foldl1;
    var foldr$2757 = C$2355.Data.Collection.foldr;
    var foldr1$2758 = C$2355.Data.Collection.foldr1;
    var flatten$2759 = C$2355.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2755(function (acc$2768, x$2769) {
                return acc$2768.concat(x$2769);
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
            require('buster').assert.equals(foldl1$2756(function (acc$2773, x$2774) {
                return acc$2773.concat([x$2774]);
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
            require('buster').assert.equals(foldr$2757(function (acc$2778, x$2779) {
                return acc$2778.concat(x$2779);
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
            require('buster').assert.equals(foldr1$2758(function (acc$2783, x$2784) {
                return acc$2783.concat([x$2784]);
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
        var Some$2785 = C$2355.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2759([
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
            require('buster').assert.equals(flatten$2759([
                Some$2785([1]),
                Some$2785([2])
            ]), Some$2785([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2798(f$2802) {
            return function comp$2798(f$2803) {
                return function (g$2804) {
                    return function (x$2805) {
                        return f$2803(g$2804(x$2805));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2799(x$2806) {
            return function id$2799(x$2807) {
                return x$2807;
            }.curry().apply(null, arguments);
        }
        function add$2800(a$2808, b$2809) {
            return function add$2800(a$2810, b$2811) {
                return a$2810 + b$2811;
            }.curry().apply(null, arguments);
        }
        function prod$2801(a$2812) {
            return function prod$2801(a$2813) {
                return a$2813 * a$2813;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2799).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2800(2)].map(comp$2798).ap([prod$2801]).ap([2]), [add$2800(2)].ap([prod$2801].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2801).ap([2]), Array.of(prod$2801(2)), 'homomorphism');
            require('buster').assert.equals([prod$2801].ap([2]), [function (f$2828) {
                    return f$2828(2);
                }.curry()].ap([prod$2801]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2833(x$2835) {
            return function m_prod$2833(x$2836) {
                return [x$2836 * x$2836];
            }.curry().apply(null, arguments);
        }
        function m_inc$2834(x$2837) {
            return function m_inc$2834(x$2838) {
                return [x$2838 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$2833).chain(m_inc$2834), [
            1,
            2,
            3
        ].chain(function (x$2839) {
            return m_prod$2833(x$2839).chain(m_inc$2834);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2841 = C$2355.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2849 = {
                    map: function (f$2851) {
                        return f$2851(1);
                    }.curry()
                };
            require('buster').assert(map$2841(function (x$2852) {
                return x$2852 + 2;
            }.curry(), obj$2849) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2854 = C$2355.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2858 = {
                    ap: function (fb$2864) {
                        return this.val(fb$2864.val);
                    }.curry(),
                    val: function (x$2865) {
                        return x$2865 + 1;
                    }.curry()
                };
            var fb$2861 = { val: 2 };
            require('buster').assert(ap$2854(fa$2858, fb$2861) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2867 = C$2355.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2875 = {
                    chain: function (f$2877) {
                        return f$2877(1);
                    }.curry()
                };
            require('buster').assert(chain$2867(obj$2875, function (x$2878) {
                return x$2878 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});