var C$2355 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2371 = C$2355.Core.__;
    var curry$2372 = C$2355.Core.curry;
    var compose$2373 = C$2355.Core.compose;
    var Protocol$2374 = C$2355.Core.Protocol;
    var instance$2375 = C$2355.Core.instance;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2384 = curry$2372(function (a$2391, b$2392, c$2393, d$2394) {
                    return a$2391 + b$2392 + c$2393 + d$2394;
                });
            var nums$2386 = curry$2372(function (a$2395, b$2396) {
                    return [
                        a$2395,
                        b$2396
                    ];
                });
            ;
            require('buster').assert(addMany$2384(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2384(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2384(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2386(__$2371, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2398 = curry$2372(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2398(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2401 = function (a$2403, b$2404) {
                    return a$2403 + b$2404;
                }.curry();
            ;
            require('buster').assert(add$2401(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2407 = curry$2372(function (sep$2415, s$2416) {
                    return s$2416.split(sep$2415);
                });
            var map$2409 = curry$2372(function (f$2417, xs$2418) {
                    return xs$2418.map(f$2417);
                });
            var upcase$2411 = curry$2372(function (s$2419) {
                    return s$2419.toUpperCase();
                });
            var join$2413 = curry$2372(function (sep$2420, xs$2421) {
                    return xs$2421.join(sep$2420);
                });
            ;
            require('buster').assert(compose$2373(join$2413('-'), map$2409(upcase$2411), split$2407(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
    require('buster').spec.describe('Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }', function () {
        ;
        require('buster').spec.it('should create a protocol with correct fields', function () {
            var specObj$2424 = { foo: 'bar' };
            var name$2426 = Protocol$2374('MyProtocol', specObj$2424).name;
            var spec$2427 = Protocol$2374('MyProtocol', specObj$2424).spec;
            var instance$2428 = Protocol$2374('MyProtocol', specObj$2424).instance;
            ;
            ;
            require('buster').assert(name$2426 == 'MyProtocol', 'name field');
            require('buster').assert(spec$2427 == specObj$2424, 'spec field');
            require('buster').assert(typeof instance$2428 == 'function', 'instance field');
        });
    });
    require('buster').spec.describe('instance :: Protocol -> ADT -> Object -> undefined', function () {
        ;
        require('buster').spec.it('should should not overwrite existing fields', function () {
            protocol = Protocol$2374('MyProtocol', {
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
            instance$2375(protocol, type, {});
            var foo$2436 = type.foo;
            ;
            var bar$2438 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2436() == 'bar1', 'existing constructor fields');
            require('buster').assert(bar$2438() == 'baz1', 'existing prototype fields');
        });
        require('buster').spec.it('should copy over default implementations', function () {
            protocol = Protocol$2374('MyProtocol', {
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
            instance$2375(protocol, type, {});
            var foo$2446 = type.foo;
            ;
            var bar$2448 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2446() == 'bar', 'default constructor implementations');
            require('buster').assert(bar$2448() == 'baz', 'default prototype implementations');
        });
        require('buster').spec.it('should throw an error on missing implementations', function () {
            protocol = Protocol$2374('MyProtocol', { constructor: { foo: Protocol$2374.required } });
            type = {};
            require('buster').assert.exception(function () {
                instance$2375(protocol, type, {});
            }, 'Error');
            protocol = Protocol$2374('MyProtocol', { prototype: { foo: Protocol$2374.required } });
            type = { prototype: {} };
            require('buster').assert.exception(function () {
                instance$2375(protocol, type, {});
            }, 'Error');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2456 = C$2355.Predicates.not;
    var and$2457 = C$2355.Predicates.and;
    var or$2458 = C$2355.Predicates.or;
    var isObject$2459 = C$2355.Predicates.isObject;
    var isArray$2460 = C$2355.Predicates.isArray;
    var isNumber$2461 = C$2355.Predicates.isNumber;
    var isRegExp$2462 = C$2355.Predicates.isRegExp;
    var isString$2463 = C$2355.Predicates.isString;
    var isNull$2464 = C$2355.Predicates.isNull;
    var isUndef$2465 = C$2355.Predicates.isUndef;
    var exists$2466 = C$2355.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2456(true) === false, 'not(true)');
        require('buster').assert(not$2456(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2457([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2457([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2457([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2457([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2457([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2457([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2457([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2457([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2458([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2458([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2458([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2458([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2458([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2458([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2458([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2458([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2458([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2458([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2458([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2459({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2459([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2459(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2459(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2459('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2459(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2460([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2460({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2460(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2460(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2460('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2461(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2461([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2461({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2461(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2461('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2462(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2462(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2462([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2462({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2462('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2463('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2463(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2463(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2463([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2463({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2464(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2464('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2464(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2464(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2464([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2464({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2465(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2465('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2465(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2465(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2465([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2465({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2466(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2466(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2466('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2466(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2466(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2466([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2466({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2545 = C$2355.Math.plus;
    var minus$2546 = C$2355.Math.minus;
    var times$2547 = C$2355.Math.times;
    var div$2548 = C$2355.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2545(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2546(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2547(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2548(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Sum', function () {
    var Sum$2562 = C$2355.Number.Sum.Sum;
    var getSum$2563 = C$2355.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 0', function () {
            ;
            require('buster').assert.equals(Sum$2562(2).empty(), Sum$2562(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2563(Sum$2562(2)) == 2, 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of the values', function () {
            ;
            require('buster').assert.equals(Sum$2562(2).concat(Sum$2562(4)), Sum$2562(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2562(1).concat(Sum$2562(2)).concat(Sum$2562(3)), Sum$2562(1).concat(Sum$2562(2).concat(Sum$2562(3))), 'associativity');
            require('buster').assert.equals(Sum$2562(1).concat(Sum$2562(1).empty()), Sum$2562(1), 'right identity');
            require('buster').assert.equals(Sum$2562(1).empty().concat(Sum$2562(1)), Sum$2562(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Product', function () {
    var Product$2578 = C$2355.Number.Product.Product;
    var getProduct$2579 = C$2355.Number.Product.getProduct;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Product$2578(2).empty(), Product$2578(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct :: Product a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2579(Product$2578(2)) == 2, 'getProduct');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Product containing the product of the values', function () {
            ;
            require('buster').assert.equals(Product$2578(2).concat(Product$2578(4)), Product$2578(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2578(1).concat(Product$2578(2)).concat(Product$2578(3)), Product$2578(1).concat(Product$2578(2).concat(Product$2578(3))), 'associativity');
            require('buster').assert.equals(Product$2578(1).concat(Product$2578(1).empty()), Product$2578(1), 'right identity');
            require('buster').assert.equals(Product$2578(1).empty().concat(Product$2578(1)), Product$2578(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Max', function () {
    var Max$2594 = C$2355.Number.Max.Max;
    var getMax$2595 = C$2355.Number.Max.getMax;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Max$2594(2).empty(), Max$2594(-Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMax :: Max a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMax$2595(Max$2594(2)) == 2, 'getMax');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Max containing the largest value', function () {
            ;
            require('buster').assert.equals(Max$2594(2).concat(Max$2594(4)), Max$2594(4), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Max$2594(1).concat(Max$2594(2)).concat(Max$2594(3)), Max$2594(1).concat(Max$2594(2).concat(Max$2594(3))), 'associativity');
            require('buster').assert.equals(Max$2594(1).concat(Max$2594(1).empty()), Max$2594(1), 'right identity');
            require('buster').assert.equals(Max$2594(1).empty().concat(Max$2594(1)), Max$2594(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Min', function () {
    var Min$2610 = C$2355.Number.Min.Min;
    var getMin$2611 = C$2355.Number.Min.getMin;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Min$2610(2).empty(), Min$2610(Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMin :: Min a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMin$2611(Min$2610(2)) == 2, 'getMin');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Min containing the smallest value', function () {
            ;
            require('buster').assert.equals(Min$2610(2).concat(Min$2610(4)), Min$2610(2), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Min$2610(1).concat(Min$2610(2)).concat(Min$2610(3)), Min$2610(1).concat(Min$2610(2).concat(Min$2610(3))), 'associativity');
            require('buster').assert.equals(Min$2610(1).concat(Min$2610(1).empty()), Min$2610(1), 'right identity');
            require('buster').assert.equals(Min$2610(1).empty().concat(Min$2610(1)), Min$2610(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2626 = C$2355.Control.Functor.map;
    ;
    var Option$2628 = C$2355.Data.Option.Option;
    var Some$2629 = C$2355.Data.Option.Some;
    var None$2630 = C$2355.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2640(x$2647) {
            return function inc$2640(x$2648) {
                return x$2648 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2641(x$2649) {
            return function id$2641(x$2650) {
                return x$2650;
            }.curry().apply(null, arguments);
        }
        function inc$2640(x$2651) {
            return function inc$2640(x$2652) {
                return x$2652 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2642(x$2653) {
            return function square$2642(x$2654) {
                return x$2654 * x$2654;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2626(id$2641, Some$2629(2)), Some$2629(2), 'identity');
        require('buster').assert.equals(map$2626(id$2641, None$2630), id$2641(None$2630), 'identity');
        require('buster').assert.equals(map$2626(function (x$2655) {
            return inc$2640(square$2642(x$2655));
        }, Some$2629(2)), function (x$2656) {
            return map$2626(inc$2640)(map$2626(square$2642)(x$2656));
        }(Some$2629(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2665(f$2681) {
            return function comp$2665(f$2682) {
                return function (g$2683) {
                    return function (x$2684) {
                        return f$2682(g$2683(x$2684));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2666(x$2685) {
            return function id$2666(x$2686) {
                return x$2686;
            }.curry().apply(null, arguments);
        }
        function add$2667(a$2687, b$2688) {
            return function add$2667(a$2689, b$2690) {
                return a$2689 + b$2690;
            }.curry().apply(null, arguments);
        }
        function prod$2668(a$2691) {
            return function prod$2668(a$2692) {
                return a$2692 * a$2692;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2628.of(id$2666).ap(Some$2629(2)), Some$2629(2), 'identity');
        require('buster').assert.equals(Some$2629(add$2667(2)).map(comp$2665).ap(Some$2629(prod$2668)).ap(Some$2629(2)), Some$2629(add$2667(2)).ap(Some$2629(prod$2668).ap(Some$2629(2))), 'composition');
        require('buster').assert.equals(Option$2628.of(prod$2668).ap(Some$2629(2)), Option$2628.of(prod$2668(2)), 'homomorphism');
        require('buster').assert.equals(Some$2629(prod$2668).ap(Some$2629(2)), Some$2629(function (f$2693) {
            return f$2693(2);
        }.curry()).ap(Some$2629(prod$2668)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2629([1]).concat(Some$2629([2])).concat(Some$2629([3])), Some$2629([1]).concat(Some$2629([2]).concat(Some$2629([3]))), 'associativity');
        require('buster').assert.equals(Some$2629([1]).concat(Option$2628.empty()), Some$2629([1]), 'right identity');
        require('buster').assert.equals(Option$2628.empty().concat(Some$2629([1])), Some$2629([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2701(x$2703) {
            return function m_prod$2701(x$2704) {
                return Some$2629(x$2704 * x$2704);
            }.curry().apply(null, arguments);
        }
        function m_inc$2702(x$2705) {
            return function m_inc$2702(x$2706) {
                return Some$2629(x$2706 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2629(2).chain(m_prod$2701).chain(m_inc$2702), Some$2629(2).chain(function (x$2707) {
            return m_prod$2701(x$2707).chain(m_inc$2702);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2709 = C$2355.Control.Functor.map;
    ;
    var Either$2711 = C$2355.Data.Either.Either;
    var Left$2712 = C$2355.Data.Either.Left;
    var Right$2713 = C$2355.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2723(x$2730) {
            return function inc$2723(x$2731) {
                return x$2731 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2724(x$2732) {
            return function id$2724(x$2733) {
                return x$2733;
            }.curry().apply(null, arguments);
        }
        function inc$2723(x$2734) {
            return function inc$2723(x$2735) {
                return x$2735 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2725(x$2736) {
            return function square$2725(x$2737) {
                return x$2737 * x$2737;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2709(id$2724, Right$2713(2)), Right$2713(2), 'map identity');
        require('buster').assert.equals(map$2709(id$2724, Left$2712(2)), id$2724(Left$2712(2)), 'map identity');
        require('buster').assert.equals(map$2709(function (x$2738) {
            return inc$2723(square$2725(x$2738));
        }, Right$2713(2)), function (x$2739) {
            return map$2709(inc$2723)(map$2709(square$2725)(x$2739));
        }(Right$2713(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2748(f$2764) {
            return function comp$2748(f$2765) {
                return function (g$2766) {
                    return function (x$2767) {
                        return f$2765(g$2766(x$2767));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2749(x$2768) {
            return function id$2749(x$2769) {
                return x$2769;
            }.curry().apply(null, arguments);
        }
        function add$2750(a$2770, b$2771) {
            return function add$2750(a$2772, b$2773) {
                return a$2772 + b$2773;
            }.curry().apply(null, arguments);
        }
        function prod$2751(a$2774) {
            return function prod$2751(a$2775) {
                return a$2775 * a$2775;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2711.of(id$2749).ap(Right$2713(2)), Right$2713(2), 'identity');
        require('buster').assert.equals(Right$2713(add$2750(2)).map(comp$2748).ap(Right$2713(prod$2751)).ap(Right$2713(2)), Right$2713(add$2750(2)).ap(Right$2713(prod$2751).ap(Right$2713(2))), 'composition');
        require('buster').assert.equals(Either$2711.of(prod$2751).ap(Right$2713(2)), Either$2711.of(prod$2751(2)), 'homomorphism');
        require('buster').assert.equals(Right$2713(prod$2751).ap(Right$2713(2)), Right$2713(function (f$2776) {
            return f$2776(2);
        }.curry()).ap(Right$2713(prod$2751)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2713([1]).concat(Right$2713([2])).concat(Right$2713([3])), Right$2713([1]).concat(Right$2713([2]).concat(Right$2713([3]))), 'associativity');
        require('buster').assert.equals(Right$2713([1]).concat(Right$2713([1]).empty()), Right$2713([1]), 'right identity');
        require('buster').assert.equals(Right$2713([1]).empty().concat(Right$2713([1])), Right$2713([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2784(x$2786) {
            return function m_prod$2784(x$2787) {
                return Right$2713(x$2787 * x$2787);
            }.curry().apply(null, arguments);
        }
        function m_inc$2785(x$2788) {
            return function m_inc$2785(x$2789) {
                return Right$2713(x$2789 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2713(2).chain(m_prod$2784).chain(m_inc$2785), Right$2713(2).chain(function (x$2790) {
            return m_prod$2784(x$2790).chain(m_inc$2785);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2792 = C$2355.Data.Collection.foldl;
    var foldl1$2793 = C$2355.Data.Collection.foldl1;
    var foldr$2794 = C$2355.Data.Collection.foldr;
    var foldr1$2795 = C$2355.Data.Collection.foldr1;
    var flatten$2796 = C$2355.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2792(function (acc$2805, x$2806) {
                return acc$2805.concat(x$2806);
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
            require('buster').assert.equals(foldl1$2793(function (acc$2810, x$2811) {
                return acc$2810.concat([x$2811]);
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
            require('buster').assert.equals(foldr$2794(function (acc$2815, x$2816) {
                return acc$2815.concat(x$2816);
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
            require('buster').assert.equals(foldr1$2795(function (acc$2820, x$2821) {
                return acc$2820.concat([x$2821]);
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
        var Some$2822 = C$2355.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2796([
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
            require('buster').assert.equals(flatten$2796([
                Some$2822([1]),
                Some$2822([2])
            ]), Some$2822([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2835(f$2839) {
            return function comp$2835(f$2840) {
                return function (g$2841) {
                    return function (x$2842) {
                        return f$2840(g$2841(x$2842));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2836(x$2843) {
            return function id$2836(x$2844) {
                return x$2844;
            }.curry().apply(null, arguments);
        }
        function add$2837(a$2845, b$2846) {
            return function add$2837(a$2847, b$2848) {
                return a$2847 + b$2848;
            }.curry().apply(null, arguments);
        }
        function prod$2838(a$2849) {
            return function prod$2838(a$2850) {
                return a$2850 * a$2850;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2836).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2837(2)].map(comp$2835).ap([prod$2838]).ap([2]), [add$2837(2)].ap([prod$2838].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2838).ap([2]), Array.of(prod$2838(2)), 'homomorphism');
            require('buster').assert.equals([prod$2838].ap([2]), [function (f$2865) {
                    return f$2865(2);
                }.curry()].ap([prod$2838]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2870(x$2872) {
            return function m_prod$2870(x$2873) {
                return [x$2873 * x$2873];
            }.curry().apply(null, arguments);
        }
        function m_inc$2871(x$2874) {
            return function m_inc$2871(x$2875) {
                return [x$2875 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$2870).chain(m_inc$2871), [
            1,
            2,
            3
        ].chain(function (x$2876) {
            return m_prod$2870(x$2876).chain(m_inc$2871);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$2878 = C$2355.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2886 = {
                    map: function (f$2888) {
                        return f$2888(1);
                    }.curry()
                };
            require('buster').assert(map$2878(function (x$2889) {
                return x$2889 + 2;
            }.curry(), obj$2886) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2891 = C$2355.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2895 = {
                    ap: function (fb$2901) {
                        return this.val(fb$2901.val);
                    }.curry(),
                    val: function (x$2902) {
                        return x$2902 + 1;
                    }.curry()
                };
            var fb$2898 = { val: 2 };
            require('buster').assert(ap$2891(fa$2895, fb$2898) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2904 = C$2355.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2912 = {
                    chain: function (f$2914) {
                        return f$2914(1);
                    }.curry()
                };
            require('buster').assert(chain$2904(obj$2912, function (x$2915) {
                return x$2915 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});