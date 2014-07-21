var C$2585 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2602 = C$2585.Core.__;
    var curry$2603 = C$2585.Core.curry;
    var compose$2604 = C$2585.Core.compose;
    var Protocol$2605 = C$2585.Core.Protocol;
    var instance$2606 = C$2585.Core.instance;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2615 = curry$2603(function (a$2622, b$2623, c$2624, d$2625) {
                    return a$2622 + b$2623 + c$2624 + d$2625;
                });
            var nums$2617 = curry$2603(function (a$2626, b$2627) {
                    return [
                        a$2626,
                        b$2627
                    ];
                });
            ;
            require('buster').assert(addMany$2615(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2615(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2615(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2617(__$2602, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2629 = curry$2603(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2629(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2632 = function (a$2634, b$2635) {
                    return a$2634 + b$2635;
                }.curry();
            ;
            require('buster').assert(add$2632(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2638 = curry$2603(function (sep$2646, s$2647) {
                    return s$2647.split(sep$2646);
                });
            var map$2640 = curry$2603(function (f$2648, xs$2649) {
                    return xs$2649.map(f$2648);
                });
            var upcase$2642 = curry$2603(function (s$2650) {
                    return s$2650.toUpperCase();
                });
            var join$2644 = curry$2603(function (sep$2651, xs$2652) {
                    return xs$2652.join(sep$2651);
                });
            ;
            require('buster').assert(compose$2604(join$2644('-'), map$2640(upcase$2642), split$2638(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
    require('buster').spec.describe('Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }', function () {
        ;
        require('buster').spec.it('should create a protocol with correct fields', function () {
            var specObj$2655 = { foo: 'bar' };
            var name$2657 = Protocol$2605('MyProtocol', specObj$2655).name;
            var spec$2658 = Protocol$2605('MyProtocol', specObj$2655).spec;
            var instance$2659 = Protocol$2605('MyProtocol', specObj$2655).instance;
            ;
            ;
            require('buster').assert(name$2657 == 'MyProtocol', 'name field');
            require('buster').assert(spec$2658 == specObj$2655, 'spec field');
            require('buster').assert(typeof instance$2659 == 'function', 'instance field');
        });
    });
    require('buster').spec.describe('instance :: Protocol -> ADT -> Object -> undefined', function () {
        ;
        require('buster').spec.it('should should not overwrite existing fields', function () {
            protocol = Protocol$2605('MyProtocol', {
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
            instance$2606(protocol, type, {});
            var foo$2667 = type.foo;
            ;
            var bar$2669 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2667() == 'bar1', 'existing constructor fields');
            require('buster').assert(bar$2669() == 'baz1', 'existing prototype fields');
        });
        require('buster').spec.it('should copy over default implementations', function () {
            protocol = Protocol$2605('MyProtocol', {
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
            instance$2606(protocol, type, {});
            var foo$2677 = type.foo;
            ;
            var bar$2679 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2677() == 'bar', 'default constructor implementations');
            require('buster').assert(bar$2679() == 'baz', 'default prototype implementations');
        });
        require('buster').spec.it('should throw an error on missing implementations', function () {
            protocol = Protocol$2605('MyProtocol', { constructor: { foo: Protocol$2605.required } });
            type = {};
            require('buster').assert.exception(function () {
                instance$2606(protocol, type, {});
            }, 'Error');
            protocol = Protocol$2605('MyProtocol', { prototype: { foo: Protocol$2605.required } });
            type = { prototype: {} };
            require('buster').assert.exception(function () {
                instance$2606(protocol, type, {});
            }, 'Error');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2687 = C$2585.Predicates.not;
    var and$2688 = C$2585.Predicates.and;
    var or$2689 = C$2585.Predicates.or;
    var isObject$2690 = C$2585.Predicates.isObject;
    var isArray$2691 = C$2585.Predicates.isArray;
    var isNumber$2692 = C$2585.Predicates.isNumber;
    var isRegExp$2693 = C$2585.Predicates.isRegExp;
    var isString$2694 = C$2585.Predicates.isString;
    var isNull$2695 = C$2585.Predicates.isNull;
    var isUndef$2696 = C$2585.Predicates.isUndef;
    var exists$2697 = C$2585.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2687(true) === false, 'not(true)');
        require('buster').assert(not$2687(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2688([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2688([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2688([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2688([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2688([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2688([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2688([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2688([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2689([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2689([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2689([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2689([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2689([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2689([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2689([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2689([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2689([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2689([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2689([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2690({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2690([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2690(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2690(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2690('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2690(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2691([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2691({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2691(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2691(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2691('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2692(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2692([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2692({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2692(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2692('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2693(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2693(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2693([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2693({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2693('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2694('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2694(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2694(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2694([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2694({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2695(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2695('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2695(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2695(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2695([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2695({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2696(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2696('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2696(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2696(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2696([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2696({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2697(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2697(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2697('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2697(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2697(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2697([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2697({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2776 = C$2585.Math.plus;
    var minus$2777 = C$2585.Math.minus;
    var times$2778 = C$2585.Math.times;
    var div$2779 = C$2585.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2776(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2777(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2778(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2779(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Sum', function () {
    var Sum$2793 = C$2585.Number.Sum.Sum;
    var getSum$2794 = C$2585.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 0', function () {
            ;
            require('buster').assert.equals(Sum$2793(2).empty(), Sum$2793(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2794(Sum$2793(2)) == 2, 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of the values', function () {
            ;
            require('buster').assert.equals(Sum$2793(2).concat(Sum$2793(4)), Sum$2793(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2793(1).concat(Sum$2793(2)).concat(Sum$2793(3)), Sum$2793(1).concat(Sum$2793(2).concat(Sum$2793(3))), 'associativity');
            require('buster').assert.equals(Sum$2793(1).concat(Sum$2793(1).empty()), Sum$2793(1), 'right identity');
            require('buster').assert.equals(Sum$2793(1).empty().concat(Sum$2793(1)), Sum$2793(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Product', function () {
    var Product$2809 = C$2585.Number.Product.Product;
    var getProduct$2810 = C$2585.Number.Product.getProduct;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Product$2809(2).empty(), Product$2809(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct :: Product a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2810(Product$2809(2)) == 2, 'getProduct');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Product containing the product of the values', function () {
            ;
            require('buster').assert.equals(Product$2809(2).concat(Product$2809(4)), Product$2809(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2809(1).concat(Product$2809(2)).concat(Product$2809(3)), Product$2809(1).concat(Product$2809(2).concat(Product$2809(3))), 'associativity');
            require('buster').assert.equals(Product$2809(1).concat(Product$2809(1).empty()), Product$2809(1), 'right identity');
            require('buster').assert.equals(Product$2809(1).empty().concat(Product$2809(1)), Product$2809(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Max', function () {
    var Max$2825 = C$2585.Number.Max.Max;
    var getMax$2826 = C$2585.Number.Max.getMax;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Max$2825(2).empty(), Max$2825(-Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMax :: Max a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMax$2826(Max$2825(2)) == 2, 'getMax');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Max containing the largest value', function () {
            ;
            require('buster').assert.equals(Max$2825(2).concat(Max$2825(4)), Max$2825(4), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Max$2825(1).concat(Max$2825(2)).concat(Max$2825(3)), Max$2825(1).concat(Max$2825(2).concat(Max$2825(3))), 'associativity');
            require('buster').assert.equals(Max$2825(1).concat(Max$2825(1).empty()), Max$2825(1), 'right identity');
            require('buster').assert.equals(Max$2825(1).empty().concat(Max$2825(1)), Max$2825(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Min', function () {
    var Min$2841 = C$2585.Number.Min.Min;
    var getMin$2842 = C$2585.Number.Min.getMin;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Min$2841(2).empty(), Min$2841(Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMin :: Min a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMin$2842(Min$2841(2)) == 2, 'getMin');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Min containing the smallest value', function () {
            ;
            require('buster').assert.equals(Min$2841(2).concat(Min$2841(4)), Min$2841(2), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Min$2841(1).concat(Min$2841(2)).concat(Min$2841(3)), Min$2841(1).concat(Min$2841(2).concat(Min$2841(3))), 'associativity');
            require('buster').assert.equals(Min$2841(1).concat(Min$2841(1).empty()), Min$2841(1), 'right identity');
            require('buster').assert.equals(Min$2841(1).empty().concat(Min$2841(1)), Min$2841(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2857 = C$2585.Control.Functor.map;
    ;
    var Option$2859 = C$2585.Data.Option.Option;
    var Some$2860 = C$2585.Data.Option.Some;
    var None$2861 = C$2585.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2871(x$2878) {
            return function inc$2871(x$2879) {
                return x$2879 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2872(x$2880) {
            return function id$2872(x$2881) {
                return x$2881;
            }.curry().apply(null, arguments);
        }
        function inc$2871(x$2882) {
            return function inc$2871(x$2883) {
                return x$2883 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2873(x$2884) {
            return function square$2873(x$2885) {
                return x$2885 * x$2885;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2857(id$2872, Some$2860(2)), Some$2860(2), 'identity');
        require('buster').assert.equals(map$2857(id$2872, None$2861), id$2872(None$2861), 'identity');
        require('buster').assert.equals(map$2857(function (x$2886) {
            return inc$2871(square$2873(x$2886));
        }, Some$2860(2)), function (x$2887) {
            return map$2857(inc$2871)(map$2857(square$2873)(x$2887));
        }(Some$2860(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2896(f$2912) {
            return function comp$2896(f$2913) {
                return function (g$2914) {
                    return function (x$2915) {
                        return f$2913(g$2914(x$2915));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2897(x$2916) {
            return function id$2897(x$2917) {
                return x$2917;
            }.curry().apply(null, arguments);
        }
        function add$2898(a$2918, b$2919) {
            return function add$2898(a$2920, b$2921) {
                return a$2920 + b$2921;
            }.curry().apply(null, arguments);
        }
        function prod$2899(a$2922) {
            return function prod$2899(a$2923) {
                return a$2923 * a$2923;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2859.of(id$2897).ap(Some$2860(2)), Some$2860(2), 'identity');
        require('buster').assert.equals(Some$2860(add$2898(2)).map(comp$2896).ap(Some$2860(prod$2899)).ap(Some$2860(2)), Some$2860(add$2898(2)).ap(Some$2860(prod$2899).ap(Some$2860(2))), 'composition');
        require('buster').assert.equals(Option$2859.of(prod$2899).ap(Some$2860(2)), Option$2859.of(prod$2899(2)), 'homomorphism');
        require('buster').assert.equals(Some$2860(prod$2899).ap(Some$2860(2)), Some$2860(function (f$2924) {
            return f$2924(2);
        }.curry()).ap(Some$2860(prod$2899)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2860([1]).concat(Some$2860([2])).concat(Some$2860([3])), Some$2860([1]).concat(Some$2860([2]).concat(Some$2860([3]))), 'associativity');
        require('buster').assert.equals(Some$2860([1]).concat(Option$2859.empty()), Some$2860([1]), 'right identity');
        require('buster').assert.equals(Option$2859.empty().concat(Some$2860([1])), Some$2860([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2932(x$2934) {
            return function m_prod$2932(x$2935) {
                return Some$2860(x$2935 * x$2935);
            }.curry().apply(null, arguments);
        }
        function m_inc$2933(x$2936) {
            return function m_inc$2933(x$2937) {
                return Some$2860(x$2937 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2860(2).chain(m_prod$2932).chain(m_inc$2933), Some$2860(2).chain(function (x$2938) {
            return m_prod$2932(x$2938).chain(m_inc$2933);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2940 = C$2585.Control.Functor.map;
    ;
    var Either$2942 = C$2585.Data.Either.Either;
    var Left$2943 = C$2585.Data.Either.Left;
    var Right$2944 = C$2585.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2954(x$2961) {
            return function inc$2954(x$2962) {
                return x$2962 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2955(x$2963) {
            return function id$2955(x$2964) {
                return x$2964;
            }.curry().apply(null, arguments);
        }
        function inc$2954(x$2965) {
            return function inc$2954(x$2966) {
                return x$2966 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2956(x$2967) {
            return function square$2956(x$2968) {
                return x$2968 * x$2968;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2940(id$2955, Right$2944(2)), Right$2944(2), 'map identity');
        require('buster').assert.equals(map$2940(id$2955, Left$2943(2)), id$2955(Left$2943(2)), 'map identity');
        require('buster').assert.equals(map$2940(function (x$2969) {
            return inc$2954(square$2956(x$2969));
        }, Right$2944(2)), function (x$2970) {
            return map$2940(inc$2954)(map$2940(square$2956)(x$2970));
        }(Right$2944(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2979(f$2995) {
            return function comp$2979(f$2996) {
                return function (g$2997) {
                    return function (x$2998) {
                        return f$2996(g$2997(x$2998));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2980(x$2999) {
            return function id$2980(x$3000) {
                return x$3000;
            }.curry().apply(null, arguments);
        }
        function add$2981(a$3001, b$3002) {
            return function add$2981(a$3003, b$3004) {
                return a$3003 + b$3004;
            }.curry().apply(null, arguments);
        }
        function prod$2982(a$3005) {
            return function prod$2982(a$3006) {
                return a$3006 * a$3006;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2942.of(id$2980).ap(Right$2944(2)), Right$2944(2), 'identity');
        require('buster').assert.equals(Right$2944(add$2981(2)).map(comp$2979).ap(Right$2944(prod$2982)).ap(Right$2944(2)), Right$2944(add$2981(2)).ap(Right$2944(prod$2982).ap(Right$2944(2))), 'composition');
        require('buster').assert.equals(Either$2942.of(prod$2982).ap(Right$2944(2)), Either$2942.of(prod$2982(2)), 'homomorphism');
        require('buster').assert.equals(Right$2944(prod$2982).ap(Right$2944(2)), Right$2944(function (f$3007) {
            return f$3007(2);
        }.curry()).ap(Right$2944(prod$2982)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2944([1]).concat(Right$2944([2])).concat(Right$2944([3])), Right$2944([1]).concat(Right$2944([2]).concat(Right$2944([3]))), 'associativity');
        require('buster').assert.equals(Right$2944([1]).concat(Right$2944([1]).empty()), Right$2944([1]), 'right identity');
        require('buster').assert.equals(Right$2944([1]).empty().concat(Right$2944([1])), Right$2944([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$3015(x$3017) {
            return function m_prod$3015(x$3018) {
                return Right$2944(x$3018 * x$3018);
            }.curry().apply(null, arguments);
        }
        function m_inc$3016(x$3019) {
            return function m_inc$3016(x$3020) {
                return Right$2944(x$3020 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2944(2).chain(m_prod$3015).chain(m_inc$3016), Right$2944(2).chain(function (x$3021) {
            return m_prod$3015(x$3021).chain(m_inc$3016);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$3023 = C$2585.Data.Collection.foldl;
    var foldl1$3024 = C$2585.Data.Collection.foldl1;
    var foldr$3025 = C$2585.Data.Collection.foldr;
    var foldr1$3026 = C$2585.Data.Collection.foldr1;
    var flatten$3027 = C$2585.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$3023(function (acc$3036, x$3037) {
                return acc$3036.concat(x$3037);
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
            require('buster').assert.equals(foldl1$3024(function (acc$3041, x$3042) {
                return acc$3041.concat([x$3042]);
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
            require('buster').assert.equals(foldr$3025(function (acc$3046, x$3047) {
                return acc$3046.concat(x$3047);
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
            require('buster').assert.equals(foldr1$3026(function (acc$3051, x$3052) {
                return acc$3051.concat([x$3052]);
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
        var Some$3053 = C$2585.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$3027([
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
            require('buster').assert.equals(flatten$3027([
                Some$3053([1]),
                Some$3053([2])
            ]), Some$3053([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$3066(f$3070) {
            return function comp$3066(f$3071) {
                return function (g$3072) {
                    return function (x$3073) {
                        return f$3071(g$3072(x$3073));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$3067(x$3074) {
            return function id$3067(x$3075) {
                return x$3075;
            }.curry().apply(null, arguments);
        }
        function add$3068(a$3076, b$3077) {
            return function add$3068(a$3078, b$3079) {
                return a$3078 + b$3079;
            }.curry().apply(null, arguments);
        }
        function prod$3069(a$3080) {
            return function prod$3069(a$3081) {
                return a$3081 * a$3081;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$3067).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$3068(2)].map(comp$3066).ap([prod$3069]).ap([2]), [add$3068(2)].ap([prod$3069].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$3069).ap([2]), Array.of(prod$3069(2)), 'homomorphism');
            require('buster').assert.equals([prod$3069].ap([2]), [function (f$3096) {
                    return f$3096(2);
                }.curry()].ap([prod$3069]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$3101(x$3103) {
            return function m_prod$3101(x$3104) {
                return [x$3104 * x$3104];
            }.curry().apply(null, arguments);
        }
        function m_inc$3102(x$3105) {
            return function m_inc$3102(x$3106) {
                return [x$3106 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$3101).chain(m_inc$3102), [
            1,
            2,
            3
        ].chain(function (x$3107) {
            return m_prod$3101(x$3107).chain(m_inc$3102);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Object', function () {
    var merge$3109 = C$2585.Data.Object.merge;
    ;
    require('buster').spec.describe('merge :: Object -> Object -> Object', function () {
        ;
        require('buster').spec.it('merges two objects', function () {
            ;
            require('buster').assert.equals(merge$3109({ a: 'b' }, { c: 'd' }), {
                a: 'b',
                c: 'd'
            }, 'different keys');
            require('buster').assert.equals(merge$3109({ a: 'b' }, { a: 'd' }), { a: 'b' }, 'same keys');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$3115 = C$2585.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$3123 = {
                    map: function (f$3125) {
                        return f$3125(1);
                    }.curry()
                };
            require('buster').assert(map$3115(function (x$3126) {
                return x$3126 + 2;
            }.curry(), obj$3123) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$3128 = C$2585.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$3132 = {
                    ap: function (fb$3138) {
                        return this.val(fb$3138.val);
                    }.curry(),
                    val: function (x$3139) {
                        return x$3139 + 1;
                    }.curry()
                };
            var fb$3135 = { val: 2 };
            require('buster').assert(ap$3128(fa$3132, fb$3135) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$3141 = C$2585.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$3149 = {
                    chain: function (f$3151) {
                        return f$3151(1);
                    }.curry()
                };
            require('buster').assert(chain$3141(obj$3149, function (x$3152) {
                return x$3152 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});