var C$2614 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2632 = C$2614.Core.__;
    var curry$2633 = C$2614.Core.curry;
    var compose$2634 = C$2614.Core.compose;
    var Protocol$2635 = C$2614.Core.Protocol;
    var instance$2636 = C$2614.Core.instance;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2645 = curry$2633(function (a$2652, b$2653, c$2654, d$2655) {
                    return a$2652 + b$2653 + c$2654 + d$2655;
                });
            var nums$2647 = curry$2633(function (a$2656, b$2657) {
                    return [
                        a$2656,
                        b$2657
                    ];
                });
            ;
            require('buster').assert(addMany$2645(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2645(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2645(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2647(__$2632, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2659 = curry$2633(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2659(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2662 = function (a$2664, b$2665) {
                    return a$2664 + b$2665;
                }.curry();
            ;
            require('buster').assert(add$2662(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2668 = curry$2633(function (sep$2676, s$2677) {
                    return s$2677.split(sep$2676);
                });
            var map$2670 = curry$2633(function (f$2678, xs$2679) {
                    return xs$2679.map(f$2678);
                });
            var upcase$2672 = curry$2633(function (s$2680) {
                    return s$2680.toUpperCase();
                });
            var join$2674 = curry$2633(function (sep$2681, xs$2682) {
                    return xs$2682.join(sep$2681);
                });
            ;
            require('buster').assert(compose$2634(join$2674('-'), map$2670(upcase$2672), split$2668(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
    require('buster').spec.describe('Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }', function () {
        ;
        require('buster').spec.it('should create a protocol with correct fields', function () {
            var specObj$2685 = { foo: 'bar' };
            var name$2687 = Protocol$2635('MyProtocol', specObj$2685).name;
            var spec$2688 = Protocol$2635('MyProtocol', specObj$2685).spec;
            var instance$2689 = Protocol$2635('MyProtocol', specObj$2685).instance;
            ;
            ;
            require('buster').assert(name$2687 == 'MyProtocol', 'name field');
            require('buster').assert(spec$2688 == specObj$2685, 'spec field');
            require('buster').assert(typeof instance$2689 == 'function', 'instance field');
        });
    });
    require('buster').spec.describe('instance :: Protocol -> ADT -> Object -> undefined', function () {
        ;
        require('buster').spec.it('should should not overwrite existing fields', function () {
            protocol = Protocol$2635('MyProtocol', {
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
            instance$2636(protocol, type, {});
            var foo$2697 = type.foo;
            ;
            var bar$2699 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2697() == 'bar1', 'existing constructor fields');
            require('buster').assert(bar$2699() == 'baz1', 'existing prototype fields');
        });
        require('buster').spec.it('should copy over default implementations', function () {
            protocol = Protocol$2635('MyProtocol', {
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
            instance$2636(protocol, type, {});
            var foo$2707 = type.foo;
            ;
            var bar$2709 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2707() == 'bar', 'default constructor implementations');
            require('buster').assert(bar$2709() == 'baz', 'default prototype implementations');
        });
        require('buster').spec.it('should throw an error on missing implementations', function () {
            protocol = Protocol$2635('MyProtocol', { constructor: { foo: Protocol$2635.required } });
            type = {};
            require('buster').assert.exception(function () {
                instance$2636(protocol, type, {});
            }, 'Error');
            protocol = Protocol$2635('MyProtocol', { prototype: { foo: Protocol$2635.required } });
            type = { prototype: {} };
            require('buster').assert.exception(function () {
                instance$2636(protocol, type, {});
            }, 'Error');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2717 = C$2614.Predicates.not;
    var and$2718 = C$2614.Predicates.and;
    var or$2719 = C$2614.Predicates.or;
    var isObject$2720 = C$2614.Predicates.isObject;
    var isArray$2721 = C$2614.Predicates.isArray;
    var isNumber$2722 = C$2614.Predicates.isNumber;
    var isRegExp$2723 = C$2614.Predicates.isRegExp;
    var isString$2724 = C$2614.Predicates.isString;
    var isNull$2725 = C$2614.Predicates.isNull;
    var isUndef$2726 = C$2614.Predicates.isUndef;
    var exists$2727 = C$2614.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2717(true) === false, 'not(true)');
        require('buster').assert(not$2717(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2718([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2718([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2718([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2718([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2718([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2718([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2718([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2718([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2719([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2719([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2719([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2719([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2719([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2719([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2719([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2719([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2719([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2719([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2719([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2720({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2720([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2720(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2720(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2720('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2720(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2721([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2721({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2721(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2721(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2721('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2722(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2722([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2722({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2722(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2722('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2723(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2723(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2723([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2723({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2723('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2724('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2724(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2724(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2724([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2724({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2725(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2725('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2725(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2725(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2725([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2725({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2726(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2726('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2726(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2726(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2726([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2726({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2727(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2727(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2727('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2727(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2727(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2727([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2727({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2806 = C$2614.Math.plus;
    var minus$2807 = C$2614.Math.minus;
    var times$2808 = C$2614.Math.times;
    var div$2809 = C$2614.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2806(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2807(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2808(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2809(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Function', function () {
    var id$2823 = C$2614.Function.id;
    var constant$2824 = C$2614.Function.constant;
    var unary$2825 = C$2614.Function.unary;
    var binary$2826 = C$2614.Function.binary;
    var ternary$2827 = C$2614.Function.ternary;
    ;
    require('buster').spec.describe('id :: a -> a', function () {
        ;
        require('buster').spec.it('returns it\'s argument unchanged', function () {
            ;
            require('buster').assert(id$2823(23) == 23, 'identity');
        });
    });
    require('buster').spec.describe('constant :: a -> a', function () {
        ;
        require('buster').spec.it('returns a new function that always returns the argument', function () {
            ;
            require('buster').assert(constant$2824(23)() == 23, 'constant');
        });
    });
    require('buster').spec.describe('unary :: Function -> (a -> b)', function () {
        ;
        require('buster').spec.it('it turns an n-arity function into a unary one', function () {
            ;
            require('buster').assert.equals(unary$2825(function (x$2840, y$2841) {
                return [
                    x$2840,
                    y$2841
                ];
            }.curry())(1, 2)(3), [
                1,
                3
            ], 'unary');
        });
    });
    require('buster').spec.describe('binary :: Function -> (a -> b)', function () {
        ;
        require('buster').spec.it('it turns a n-arity function into a binary one', function () {
            ;
            require('buster').assert.equals(binary$2826(function (x$2845, y$2846, z$2847) {
                return [
                    x$2845,
                    y$2846,
                    z$2847
                ];
            }.curry())(1, 2, 3)(4), [
                1,
                2,
                4
            ], 'binary');
        });
    });
    require('buster').spec.describe('ternary :: Function -> (a -> b)', function () {
        ;
        require('buster').spec.it('it turns a n-arity function into a ternary one', function () {
            ;
            require('buster').assert.equals(ternary$2827(function (x$2851, y$2852, z$2853, w$2854) {
                return [
                    x$2851,
                    y$2852,
                    z$2853,
                    w$2854
                ];
            }.curry())(1, 2, 3, 4)(5), [
                1,
                2,
                3,
                5
            ], 'ternary');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Sum', function () {
    var Sum$2856 = C$2614.Number.Sum.Sum;
    var getSum$2857 = C$2614.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 0', function () {
            ;
            require('buster').assert.equals(Sum$2856(2).empty(), Sum$2856(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2857(Sum$2856(2)) == 2, 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of the values', function () {
            ;
            require('buster').assert.equals(Sum$2856(2).concat(Sum$2856(4)), Sum$2856(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2856(1).concat(Sum$2856(2)).concat(Sum$2856(3)), Sum$2856(1).concat(Sum$2856(2).concat(Sum$2856(3))), 'associativity');
            require('buster').assert.equals(Sum$2856(1).concat(Sum$2856(1).empty()), Sum$2856(1), 'right identity');
            require('buster').assert.equals(Sum$2856(1).empty().concat(Sum$2856(1)), Sum$2856(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Product', function () {
    var Product$2872 = C$2614.Number.Product.Product;
    var getProduct$2873 = C$2614.Number.Product.getProduct;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Product$2872(2).empty(), Product$2872(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct :: Product a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2873(Product$2872(2)) == 2, 'getProduct');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Product containing the product of the values', function () {
            ;
            require('buster').assert.equals(Product$2872(2).concat(Product$2872(4)), Product$2872(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2872(1).concat(Product$2872(2)).concat(Product$2872(3)), Product$2872(1).concat(Product$2872(2).concat(Product$2872(3))), 'associativity');
            require('buster').assert.equals(Product$2872(1).concat(Product$2872(1).empty()), Product$2872(1), 'right identity');
            require('buster').assert.equals(Product$2872(1).empty().concat(Product$2872(1)), Product$2872(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Max', function () {
    var Max$2888 = C$2614.Number.Max.Max;
    var getMax$2889 = C$2614.Number.Max.getMax;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Max$2888(2).empty(), Max$2888(-Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMax :: Max a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMax$2889(Max$2888(2)) == 2, 'getMax');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Max containing the largest value', function () {
            ;
            require('buster').assert.equals(Max$2888(2).concat(Max$2888(4)), Max$2888(4), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Max$2888(1).concat(Max$2888(2)).concat(Max$2888(3)), Max$2888(1).concat(Max$2888(2).concat(Max$2888(3))), 'associativity');
            require('buster').assert.equals(Max$2888(1).concat(Max$2888(1).empty()), Max$2888(1), 'right identity');
            require('buster').assert.equals(Max$2888(1).empty().concat(Max$2888(1)), Max$2888(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Min', function () {
    var Min$2904 = C$2614.Number.Min.Min;
    var getMin$2905 = C$2614.Number.Min.getMin;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Min$2904(2).empty(), Min$2904(Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMin :: Min a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMin$2905(Min$2904(2)) == 2, 'getMin');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Min containing the smallest value', function () {
            ;
            require('buster').assert.equals(Min$2904(2).concat(Min$2904(4)), Min$2904(2), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Min$2904(1).concat(Min$2904(2)).concat(Min$2904(3)), Min$2904(1).concat(Min$2904(2).concat(Min$2904(3))), 'associativity');
            require('buster').assert.equals(Min$2904(1).concat(Min$2904(1).empty()), Min$2904(1), 'right identity');
            require('buster').assert.equals(Min$2904(1).empty().concat(Min$2904(1)), Min$2904(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var id$2920 = C$2614.Function.id;
    ;
    var map$2922 = C$2614.Control.Functor.map;
    ;
    var Option$2924 = C$2614.Data.Option.Option;
    var Some$2925 = C$2614.Data.Option.Some;
    var None$2926 = C$2614.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2934(x$2940) {
            return function inc$2934(x$2941) {
                return x$2941 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2935(x$2942) {
            return function square$2935(x$2943) {
                return x$2943 * x$2943;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2922(id$2920, Some$2925(2)), Some$2925(2), 'identity');
        require('buster').assert.equals(map$2922(id$2920, None$2926), id$2920(None$2926), 'identity');
        require('buster').assert.equals(map$2922(function (x$2944) {
            return inc$2934(square$2935(x$2944));
        }, Some$2925(2)), function (x$2945) {
            return map$2922(inc$2934)(map$2922(square$2935)(x$2945));
        }(Some$2925(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2953(f$2969) {
            return function comp$2953(f$2970) {
                return function (g$2971) {
                    return function (x$2972) {
                        return f$2970(g$2971(x$2972));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function add$2954(a$2973, b$2974) {
            return function add$2954(a$2975, b$2976) {
                return a$2975 + b$2976;
            }.curry().apply(null, arguments);
        }
        function prod$2955(a$2977) {
            return function prod$2955(a$2978) {
                return a$2978 * a$2978;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2924.of(id$2920).ap(Some$2925(2)), Some$2925(2), 'identity');
        require('buster').assert.equals(Some$2925(add$2954(2)).map(function (x$2979) {
            return comp$2953(x$2979);
        }.curry()).ap(Some$2925(prod$2955)).ap(Some$2925(2)), Some$2925(add$2954(2)).ap(Some$2925(prod$2955).ap(Some$2925(2))), 'composition');
        require('buster').assert.equals(Option$2924.of(prod$2955).ap(Some$2925(2)), Option$2924.of(prod$2955(2)), 'homomorphism');
        require('buster').assert.equals(Some$2925(prod$2955).ap(Some$2925(2)), Some$2925(function (f$2980) {
            return f$2980(2);
        }.curry()).ap(Some$2925(prod$2955)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2925([1]).concat(Some$2925([2])).concat(Some$2925([3])), Some$2925([1]).concat(Some$2925([2]).concat(Some$2925([3]))), 'associativity');
        require('buster').assert.equals(Some$2925([1]).concat(Option$2924.empty()), Some$2925([1]), 'right identity');
        require('buster').assert.equals(Option$2924.empty().concat(Some$2925([1])), Some$2925([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2988(x$2990) {
            return function m_prod$2988(x$2991) {
                return Some$2925(x$2991 * x$2991);
            }.curry().apply(null, arguments);
        }
        function m_inc$2989(x$2992) {
            return function m_inc$2989(x$2993) {
                return Some$2925(x$2993 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2925(2).chain(m_prod$2988).chain(m_inc$2989), Some$2925(2).chain(function (x$2994) {
            return m_prod$2988(x$2994).chain(m_inc$2989);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var id$2996 = C$2614.Function.id;
    ;
    var map$2998 = C$2614.Control.Functor.map;
    ;
    var Either$3000 = C$2614.Data.Either.Either;
    var Left$3001 = C$2614.Data.Either.Left;
    var Right$3002 = C$2614.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$3010(x$3016) {
            return function inc$3010(x$3017) {
                return x$3017 + 1;
            }.curry().apply(null, arguments);
        }
        function square$3011(x$3018) {
            return function square$3011(x$3019) {
                return x$3019 * x$3019;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2998(id$2996, Right$3002(2)), Right$3002(2), 'map identity');
        require('buster').assert.equals(map$2998(id$2996, Left$3001(2)), id$2996(Left$3001(2)), 'map identity');
        require('buster').assert.equals(map$2998(function (x$3020) {
            return inc$3010(square$3011(x$3020));
        }, Right$3002(2)), function (x$3021) {
            return map$2998(inc$3010)(map$2998(square$3011)(x$3021));
        }(Right$3002(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$3029(f$3045) {
            return function comp$3029(f$3046) {
                return function (g$3047) {
                    return function (x$3048) {
                        return f$3046(g$3047(x$3048));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function add$3030(a$3049, b$3050) {
            return function add$3030(a$3051, b$3052) {
                return a$3051 + b$3052;
            }.curry().apply(null, arguments);
        }
        function prod$3031(a$3053) {
            return function prod$3031(a$3054) {
                return a$3054 * a$3054;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$3000.of(id$2996).ap(Right$3002(2)), Right$3002(2), 'identity');
        require('buster').assert.equals(Right$3002(add$3030(2)).map(function (x$3055) {
            return comp$3029(x$3055);
        }.curry()).ap(Right$3002(prod$3031)).ap(Right$3002(2)), Right$3002(add$3030(2)).ap(Right$3002(prod$3031).ap(Right$3002(2))), 'composition');
        require('buster').assert.equals(Either$3000.of(prod$3031).ap(Right$3002(2)), Either$3000.of(prod$3031(2)), 'homomorphism');
        require('buster').assert.equals(Right$3002(prod$3031).ap(Right$3002(2)), Right$3002(function (f$3056) {
            return f$3056(2);
        }.curry()).ap(Right$3002(prod$3031)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$3002([1]).concat(Right$3002([2])).concat(Right$3002([3])), Right$3002([1]).concat(Right$3002([2]).concat(Right$3002([3]))), 'associativity');
        require('buster').assert.equals(Right$3002([1]).concat(Right$3002([1]).empty()), Right$3002([1]), 'right identity');
        require('buster').assert.equals(Right$3002([1]).empty().concat(Right$3002([1])), Right$3002([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$3064(x$3066) {
            return function m_prod$3064(x$3067) {
                return Right$3002(x$3067 * x$3067);
            }.curry().apply(null, arguments);
        }
        function m_inc$3065(x$3068) {
            return function m_inc$3065(x$3069) {
                return Right$3002(x$3069 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$3002(2).chain(m_prod$3064).chain(m_inc$3065), Right$3002(2).chain(function (x$3070) {
            return m_prod$3064(x$3070).chain(m_inc$3065);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$3072 = C$2614.Data.Collection.foldl;
    var foldl1$3073 = C$2614.Data.Collection.foldl1;
    var foldr$3074 = C$2614.Data.Collection.foldr;
    var foldr1$3075 = C$2614.Data.Collection.foldr1;
    var filter$3076 = C$2614.Data.Collection.filter;
    var flatten$3077 = C$2614.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$3072(function (acc$3087, x$3088) {
                return acc$3087.concat(x$3088);
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
            require('buster').assert.equals(foldl1$3073(function (acc$3092, x$3093) {
                return acc$3092.concat([x$3093]);
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
            require('buster').assert.equals(foldr$3074(function (acc$3097, x$3098) {
                return acc$3097.concat(x$3098);
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
            require('buster').assert.equals(foldr1$3075(function (acc$3102, x$3103) {
                return acc$3102.concat([x$3103]);
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
    require('buster').spec.describe('filter :: (a -> Bool) -> [a] -> [a]', function () {
        ;
        require('buster').spec.it('filters a list according to a predicate function', function () {
            ;
            require('buster').assert.equals(filter$3076(function (x$3107) {
                return x$3107 > 3;
            }.curry(), [
                1,
                2,
                3,
                4,
                5
            ]), [
                4,
                5
            ], 'filter');
        });
    });
    require('buster').spec.describe('flatten :: Monoid a => [a] -> a', function () {
        var Some$3108 = C$2614.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$3077([
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
            require('buster').assert.equals(flatten$3077([
                Some$3108([1]),
                Some$3108([2])
            ]), Some$3108([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    var id$3113 = C$2614.Function.id;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$3122(f$3125) {
            return function comp$3122(f$3126) {
                return function (g$3127) {
                    return function (x$3128) {
                        return f$3126(g$3127(x$3128));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function add$3123(a$3129, b$3130) {
            return function add$3123(a$3131, b$3132) {
                return a$3131 + b$3132;
            }.curry().apply(null, arguments);
        }
        function prod$3124(a$3133) {
            return function prod$3124(a$3134) {
                return a$3134 * a$3134;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$3113).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$3123(2)].map(function (x$3149) {
                return comp$3122(x$3149);
            }.curry()).ap([prod$3124]).ap([2]), [add$3123(2)].ap([prod$3124].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$3124).ap([2]), Array.of(prod$3124(2)), 'homomorphism');
            require('buster').assert.equals([prod$3124].ap([2]), [function (f$3151) {
                    return f$3151(2);
                }.curry()].ap([prod$3124]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$3156(x$3158) {
            return function m_prod$3156(x$3159) {
                return [x$3159 * x$3159];
            }.curry().apply(null, arguments);
        }
        function m_inc$3157(x$3160) {
            return function m_inc$3157(x$3161) {
                return [x$3161 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$3156).chain(m_inc$3157), [
            1,
            2,
            3
        ].chain(function (x$3162) {
            return m_prod$3156(x$3162).chain(m_inc$3157);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Object', function () {
    var merge$3164 = C$2614.Data.Object.merge;
    var set$3165 = C$2614.Data.Object.set;
    ;
    var map$3167 = C$2614.Data.Collection.map;
    ;
    require('buster').spec.describe('merge :: Object -> Object -> Object', function () {
        ;
        require('buster').spec.it('merges two objects', function () {
            ;
            require('buster').assert.equals(merge$3164({ a: 'b' }, { c: 'd' }), {
                a: 'b',
                c: 'd'
            }, 'different keys');
            require('buster').assert.equals(merge$3164({ a: 'b' }, { a: 'd' }), { a: 'b' }, 'same keys');
        });
    });
    require('buster').spec.describe('set :: Object -> String -> a', function () {
        ;
        require('buster').spec.it('returns a new object with the new key present', function () {
            ;
            require('buster').assert.equals(set$3165({ a: 'b' }, 'c', 'd'), {
                a: 'b',
                c: 'd'
            }, 'set new key');
        });
    });
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('applies a function to every value of an object', function () {
            ;
            require('buster').assert.equals({
                a: 1,
                b: 2,
                c: 3
            }.map(function (x$3179) {
                return x$3179 + 1;
            }.curry()), {
                a: 2,
                b: 3,
                c: 4
            }, 'inc');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$3181 = C$2614.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$3189 = {
                    map: function (f$3191) {
                        return f$3191(1);
                    }.curry()
                };
            require('buster').assert(map$3181(function (x$3192) {
                return x$3192 + 2;
            }.curry(), obj$3189) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$3194 = C$2614.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$3198 = {
                    ap: function (fb$3204) {
                        return this.val(fb$3204.val);
                    }.curry(),
                    val: function (x$3205) {
                        return x$3205 + 1;
                    }.curry()
                };
            var fb$3201 = { val: 2 };
            require('buster').assert(ap$3194(fa$3198, fb$3201) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$3207 = C$2614.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$3215 = {
                    chain: function (f$3217) {
                        return f$3217(1);
                    }.curry()
                };
            require('buster').assert(chain$3207(obj$3215, function (x$3218) {
                return x$3218 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});