var C$2375 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2391 = C$2375.Core.__;
    var curry$2392 = C$2375.Core.curry;
    var compose$2393 = C$2375.Core.compose;
    var Protocol$2394 = C$2375.Core.Protocol;
    var instance$2395 = C$2375.Core.instance;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2404 = curry$2392(function (a$2411, b$2412, c$2413, d$2414) {
                    return a$2411 + b$2412 + c$2413 + d$2414;
                });
            var nums$2406 = curry$2392(function (a$2415, b$2416) {
                    return [
                        a$2415,
                        b$2416
                    ];
                });
            ;
            require('buster').assert(addMany$2404(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2404(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2404(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2406(__$2391, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2418 = curry$2392(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2418(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2421 = function (a$2423, b$2424) {
                    return a$2423 + b$2424;
                }.curry();
            ;
            require('buster').assert(add$2421(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2427 = curry$2392(function (sep$2435, s$2436) {
                    return s$2436.split(sep$2435);
                });
            var map$2429 = curry$2392(function (f$2437, xs$2438) {
                    return xs$2438.map(f$2437);
                });
            var upcase$2431 = curry$2392(function (s$2439) {
                    return s$2439.toUpperCase();
                });
            var join$2433 = curry$2392(function (sep$2440, xs$2441) {
                    return xs$2441.join(sep$2440);
                });
            ;
            require('buster').assert(compose$2393(join$2433('-'), map$2429(upcase$2431), split$2427(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
    require('buster').spec.describe('Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }', function () {
        ;
        require('buster').spec.it('should create a protocol with correct fields', function () {
            var specObj$2444 = { foo: 'bar' };
            var name$2446 = Protocol$2394('MyProtocol', specObj$2444).name;
            var spec$2447 = Protocol$2394('MyProtocol', specObj$2444).spec;
            var instance$2448 = Protocol$2394('MyProtocol', specObj$2444).instance;
            ;
            ;
            require('buster').assert(name$2446 == 'MyProtocol', 'name field');
            require('buster').assert(spec$2447 == specObj$2444, 'spec field');
            require('buster').assert(typeof instance$2448 == 'function', 'instance field');
        });
    });
    require('buster').spec.describe('instance :: Protocol -> ADT -> Object -> undefined', function () {
        ;
        require('buster').spec.it('should should not overwrite existing fields', function () {
            protocol = Protocol$2394('MyProtocol', {
                constructor: {
                    foo: function () {
                        return 'bar2';
                    }.curry()
                },
                prototype: {
                    bar: function () {
                        return 'baz2';
                    }.curry()
                }
            });
            type = {
                foo: function () {
                    return 'bar1';
                }.curry(),
                prototype: {
                    bar: function () {
                        return 'baz1';
                    }.curry()
                }
            };
            instance$2395(protocol, type, {});
            var foo$2456 = type.foo;
            ;
            var bar$2458 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2456() == 'bar1', 'existing constructor fields');
            require('buster').assert(bar$2458() == 'baz1', 'existing prototype fields');
        });
        require('buster').spec.it('should copy over default implementations', function () {
            protocol = Protocol$2394('MyProtocol', {
                constructor: {
                    foo: function () {
                        return 'bar';
                    }.curry()
                },
                prototype: {
                    bar: function () {
                        return 'baz';
                    }.curry()
                }
            });
            type = { prototype: {} };
            instance$2395(protocol, type, {});
            var foo$2466 = type.foo;
            ;
            var bar$2468 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2466() == 'bar', 'default constructor implementations');
            require('buster').assert(bar$2468() == 'baz', 'default prototype implementations');
        });
        require('buster').spec.it('should throw an error on missing implementations', function () {
            protocol = Protocol$2394('MyProtocol', { constructor: { foo: Protocol$2394.required } });
            type = {};
            require('buster').assert.exception(function () {
                instance$2395(protocol, type, {});
            }, 'Error');
            protocol = Protocol$2394('MyProtocol', { prototype: { foo: Protocol$2394.required } });
            type = { prototype: {} };
            require('buster').assert.exception(function () {
                instance$2395(protocol, type, {});
            }, 'Error');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2476 = C$2375.Predicates.not;
    var and$2477 = C$2375.Predicates.and;
    var or$2478 = C$2375.Predicates.or;
    var isObject$2479 = C$2375.Predicates.isObject;
    var isArray$2480 = C$2375.Predicates.isArray;
    var isNumber$2481 = C$2375.Predicates.isNumber;
    var isRegExp$2482 = C$2375.Predicates.isRegExp;
    var isString$2483 = C$2375.Predicates.isString;
    var isNull$2484 = C$2375.Predicates.isNull;
    var isUndef$2485 = C$2375.Predicates.isUndef;
    var exists$2486 = C$2375.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2476(true) === false, 'not(true)');
        require('buster').assert(not$2476(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2477([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2477([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2477([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2477([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2477([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2477([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2477([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2477([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2478([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2478([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2478([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2478([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2478([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2478([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2478([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2478([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2478([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2478([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2478([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2479({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2479([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2479(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2479(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2479('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2479(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2480([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2480({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2480(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2480(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2480('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2481(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2481([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2481({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2481(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2481('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2482(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2482(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2482([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2482({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2482('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2483('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2483(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2483(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2483([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2483({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2484(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2484('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2484(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2484(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2484([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2484({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2485(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2485('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2485(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2485(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2485([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2485({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2486(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2486(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2486('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2486(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2486(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2486([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2486({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2565 = C$2375.Math.plus;
    var minus$2566 = C$2375.Math.minus;
    var times$2567 = C$2375.Math.times;
    var div$2568 = C$2375.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2565(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2566(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2567(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2568(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Sum', function () {
    var Sum$2582 = C$2375.Number.Sum.Sum;
    var getSum$2583 = C$2375.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 0', function () {
            ;
            require('buster').assert.equals(Sum$2582(2).empty(), Sum$2582(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2583(Sum$2582(2)) == 2, 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of the values', function () {
            ;
            require('buster').assert.equals(Sum$2582(2).concat(Sum$2582(4)), Sum$2582(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2582(1).concat(Sum$2582(2)).concat(Sum$2582(3)), Sum$2582(1).concat(Sum$2582(2).concat(Sum$2582(3))), 'associativity');
            require('buster').assert.equals(Sum$2582(1).concat(Sum$2582(1).empty()), Sum$2582(1), 'right identity');
            require('buster').assert.equals(Sum$2582(1).empty().concat(Sum$2582(1)), Sum$2582(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Product', function () {
    var Product$2598 = C$2375.Number.Product.Product;
    var getProduct$2599 = C$2375.Number.Product.getProduct;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Product$2598(2).empty(), Product$2598(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct :: Product a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2599(Product$2598(2)) == 2, 'getProduct');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Product containing the product of the values', function () {
            ;
            require('buster').assert.equals(Product$2598(2).concat(Product$2598(4)), Product$2598(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2598(1).concat(Product$2598(2)).concat(Product$2598(3)), Product$2598(1).concat(Product$2598(2).concat(Product$2598(3))), 'associativity');
            require('buster').assert.equals(Product$2598(1).concat(Product$2598(1).empty()), Product$2598(1), 'right identity');
            require('buster').assert.equals(Product$2598(1).empty().concat(Product$2598(1)), Product$2598(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Max', function () {
    var Max$2614 = C$2375.Number.Max.Max;
    var getMax$2615 = C$2375.Number.Max.getMax;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Max$2614(2).empty(), Max$2614(-Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMax :: Max a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMax$2615(Max$2614(2)) == 2, 'getMax');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Max containing the largest value', function () {
            ;
            require('buster').assert.equals(Max$2614(2).concat(Max$2614(4)), Max$2614(4), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Max$2614(1).concat(Max$2614(2)).concat(Max$2614(3)), Max$2614(1).concat(Max$2614(2).concat(Max$2614(3))), 'associativity');
            require('buster').assert.equals(Max$2614(1).concat(Max$2614(1).empty()), Max$2614(1), 'right identity');
            require('buster').assert.equals(Max$2614(1).empty().concat(Max$2614(1)), Max$2614(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Min', function () {
    var Min$2630 = C$2375.Number.Min.Min;
    var getMin$2631 = C$2375.Number.Min.getMin;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Min$2630(2).empty(), Min$2630(Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMin :: Min a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMin$2631(Min$2630(2)) == 2, 'getMin');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Min containing the smallest value', function () {
            ;
            require('buster').assert.equals(Min$2630(2).concat(Min$2630(4)), Min$2630(2), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Min$2630(1).concat(Min$2630(2)).concat(Min$2630(3)), Min$2630(1).concat(Min$2630(2).concat(Min$2630(3))), 'associativity');
            require('buster').assert.equals(Min$2630(1).concat(Min$2630(1).empty()), Min$2630(1), 'right identity');
            require('buster').assert.equals(Min$2630(1).empty().concat(Min$2630(1)), Min$2630(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2646 = C$2375.Control.Functor.map;
    ;
    var Option$2648 = C$2375.Data.Option.Option;
    var Some$2649 = C$2375.Data.Option.Some;
    var None$2650 = C$2375.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2660(x$2667) {
            return function inc$2660(x$2668) {
                return x$2668 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2661(x$2669) {
            return function id$2661(x$2670) {
                return x$2670;
            }.curry().apply(null, arguments);
        }
        function inc$2660(x$2671) {
            return function inc$2660(x$2672) {
                return x$2672 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2662(x$2673) {
            return function square$2662(x$2674) {
                return x$2674 * x$2674;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2646(id$2661, Some$2649(2)), Some$2649(2), 'identity');
        require('buster').assert.equals(map$2646(id$2661, None$2650), id$2661(None$2650), 'identity');
        require('buster').assert.equals(map$2646(function (x$2675) {
            return inc$2660(square$2662(x$2675));
        }, Some$2649(2)), function (x$2676) {
            return map$2646(inc$2660)(map$2646(square$2662)(x$2676));
        }(Some$2649(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2685(f$2701) {
            return function comp$2685(f$2702) {
                return function (g$2703) {
                    return function (x$2704) {
                        return f$2702(g$2703(x$2704));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2686(x$2705) {
            return function id$2686(x$2706) {
                return x$2706;
            }.curry().apply(null, arguments);
        }
        function add$2687(a$2707, b$2708) {
            return function add$2687(a$2709, b$2710) {
                return a$2709 + b$2710;
            }.curry().apply(null, arguments);
        }
        function prod$2688(a$2711) {
            return function prod$2688(a$2712) {
                return a$2712 * a$2712;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2648.of(id$2686).ap(Some$2649(2)), Some$2649(2), 'identity');
        require('buster').assert.equals(Some$2649(add$2687(2)).map(comp$2685).ap(Some$2649(prod$2688)).ap(Some$2649(2)), Some$2649(add$2687(2)).ap(Some$2649(prod$2688).ap(Some$2649(2))), 'composition');
        require('buster').assert.equals(Option$2648.of(prod$2688).ap(Some$2649(2)), Option$2648.of(prod$2688(2)), 'homomorphism');
        require('buster').assert.equals(Some$2649(prod$2688).ap(Some$2649(2)), Some$2649(function (f$2713) {
            return f$2713(2);
        }.curry()).ap(Some$2649(prod$2688)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2649([1]).concat(Some$2649([2])).concat(Some$2649([3])), Some$2649([1]).concat(Some$2649([2]).concat(Some$2649([3]))), 'associativity');
        require('buster').assert.equals(Some$2649([1]).concat(Option$2648.empty()), Some$2649([1]), 'right identity');
        require('buster').assert.equals(Option$2648.empty().concat(Some$2649([1])), Some$2649([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2721(x$2723) {
            return function m_prod$2721(x$2724) {
                return Some$2649(x$2724 * x$2724);
            }.curry().apply(null, arguments);
        }
        function m_inc$2722(x$2725) {
            return function m_inc$2722(x$2726) {
                return Some$2649(x$2726 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2649(2).chain(m_prod$2721).chain(m_inc$2722), Some$2649(2).chain(function (x$2727) {
            return m_prod$2721(x$2727).chain(m_inc$2722);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2729 = C$2375.Control.Functor.map;
    ;
    var Either$2731 = C$2375.Data.Either.Either;
    var Left$2732 = C$2375.Data.Either.Left;
    var Right$2733 = C$2375.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2743(x$2750) {
            return function inc$2743(x$2751) {
                return x$2751 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2744(x$2752) {
            return function id$2744(x$2753) {
                return x$2753;
            }.curry().apply(null, arguments);
        }
        function inc$2743(x$2754) {
            return function inc$2743(x$2755) {
                return x$2755 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2745(x$2756) {
            return function square$2745(x$2757) {
                return x$2757 * x$2757;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2729(id$2744, Right$2733(2)), Right$2733(2), 'map identity');
        require('buster').assert.equals(map$2729(id$2744, Left$2732(2)), id$2744(Left$2732(2)), 'map identity');
        require('buster').assert.equals(map$2729(function (x$2758) {
            return inc$2743(square$2745(x$2758));
        }, Right$2733(2)), function (x$2759) {
            return map$2729(inc$2743)(map$2729(square$2745)(x$2759));
        }(Right$2733(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2768(f$2784) {
            return function comp$2768(f$2785) {
                return function (g$2786) {
                    return function (x$2787) {
                        return f$2785(g$2786(x$2787));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2769(x$2788) {
            return function id$2769(x$2789) {
                return x$2789;
            }.curry().apply(null, arguments);
        }
        function add$2770(a$2790, b$2791) {
            return function add$2770(a$2792, b$2793) {
                return a$2792 + b$2793;
            }.curry().apply(null, arguments);
        }
        function prod$2771(a$2794) {
            return function prod$2771(a$2795) {
                return a$2795 * a$2795;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2731.of(id$2769).ap(Right$2733(2)), Right$2733(2), 'identity');
        require('buster').assert.equals(Right$2733(add$2770(2)).map(comp$2768).ap(Right$2733(prod$2771)).ap(Right$2733(2)), Right$2733(add$2770(2)).ap(Right$2733(prod$2771).ap(Right$2733(2))), 'composition');
        require('buster').assert.equals(Either$2731.of(prod$2771).ap(Right$2733(2)), Either$2731.of(prod$2771(2)), 'homomorphism');
        require('buster').assert.equals(Right$2733(prod$2771).ap(Right$2733(2)), Right$2733(function (f$2796) {
            return f$2796(2);
        }.curry()).ap(Right$2733(prod$2771)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2733([1]).concat(Right$2733([2])).concat(Right$2733([3])), Right$2733([1]).concat(Right$2733([2]).concat(Right$2733([3]))), 'associativity');
        require('buster').assert.equals(Right$2733([1]).concat(Right$2733([1]).empty()), Right$2733([1]), 'right identity');
        require('buster').assert.equals(Right$2733([1]).empty().concat(Right$2733([1])), Right$2733([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2804(x$2806) {
            return function m_prod$2804(x$2807) {
                return Right$2733(x$2807 * x$2807);
            }.curry().apply(null, arguments);
        }
        function m_inc$2805(x$2808) {
            return function m_inc$2805(x$2809) {
                return Right$2733(x$2809 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2733(2).chain(m_prod$2804).chain(m_inc$2805), Right$2733(2).chain(function (x$2810) {
            return m_prod$2804(x$2810).chain(m_inc$2805);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2812 = C$2375.Data.Collection.foldl;
    var foldl1$2813 = C$2375.Data.Collection.foldl1;
    var foldr$2814 = C$2375.Data.Collection.foldr;
    var foldr1$2815 = C$2375.Data.Collection.foldr1;
    var flatten$2816 = C$2375.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2812(function (acc$2825, x$2826) {
                return acc$2825.concat(x$2826);
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
            require('buster').assert.equals(foldl1$2813(function (acc$2830, x$2831) {
                return acc$2830.concat([x$2831]);
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
            require('buster').assert.equals(foldr$2814(function (acc$2835, x$2836) {
                return acc$2835.concat(x$2836);
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
            require('buster').assert.equals(foldr1$2815(function (acc$2840, x$2841) {
                return acc$2840.concat([x$2841]);
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
        var Some$2842 = C$2375.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2816([
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
            require('buster').assert.equals(flatten$2816([
                Some$2842([1]),
                Some$2842([2])
            ]), Some$2842([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2855(f$2859) {
            return function comp$2855(f$2860) {
                return function (g$2861) {
                    return function (x$2862) {
                        return f$2860(g$2861(x$2862));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2856(x$2863) {
            return function id$2856(x$2864) {
                return x$2864;
            }.curry().apply(null, arguments);
        }
        function add$2857(a$2865, b$2866) {
            return function add$2857(a$2867, b$2868) {
                return a$2867 + b$2868;
            }.curry().apply(null, arguments);
        }
        function prod$2858(a$2869) {
            return function prod$2858(a$2870) {
                return a$2870 * a$2870;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2856).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2857(2)].map(comp$2855).ap([prod$2858]).ap([2]), [add$2857(2)].ap([prod$2858].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2858).ap([2]), Array.of(prod$2858(2)), 'homomorphism');
            require('buster').assert.equals([prod$2858].ap([2]), [function (f$2885) {
                    return f$2885(2);
                }.curry()].ap([prod$2858]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2890(x$2892) {
            return function m_prod$2890(x$2893) {
                return [x$2893 * x$2893];
            }.curry().apply(null, arguments);
        }
        function m_inc$2891(x$2894) {
            return function m_inc$2891(x$2895) {
                return [x$2895 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$2890).chain(m_inc$2891), [
            1,
            2,
            3
        ].chain(function (x$2896) {
            return m_prod$2890(x$2896).chain(m_inc$2891);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2898 = C$2375.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2906 = {
                    map: function (f$2908) {
                        return f$2908(1);
                    }.curry()
                };
            require('buster').assert(map$2898(function (x$2909) {
                return x$2909 + 2;
            }.curry(), obj$2906) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2911 = C$2375.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2915 = {
                    ap: function (fb$2921) {
                        return this.val(fb$2921.val);
                    }.curry(),
                    val: function (x$2922) {
                        return x$2922 + 1;
                    }.curry()
                };
            var fb$2918 = { val: 2 };
            require('buster').assert(ap$2911(fa$2915, fb$2918) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2924 = C$2375.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2932 = {
                    chain: function (f$2934) {
                        return f$2934(1);
                    }.curry()
                };
            require('buster').assert(chain$2924(obj$2932, function (x$2935) {
                return x$2935 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});