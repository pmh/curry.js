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
    var unary$2823 = C$2614.Function.unary;
    var binary$2824 = C$2614.Function.binary;
    var ternary$2825 = C$2614.Function.ternary;
    ;
    require('buster').spec.describe('unary :: Function -> (a -> b)', function () {
        ;
        require('buster').spec.it('it turns an n-arity function into a unary one', function () {
            ;
            require('buster').assert.equals(unary$2823(function (x$2832, y$2833) {
                return [
                    x$2832,
                    y$2833
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
            require('buster').assert.equals(binary$2824(function (x$2837, y$2838, z$2839) {
                return [
                    x$2837,
                    y$2838,
                    z$2839
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
            require('buster').assert.equals(ternary$2825(function (x$2843, y$2844, z$2845, w$2846) {
                return [
                    x$2843,
                    y$2844,
                    z$2845,
                    w$2846
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
    var Sum$2848 = C$2614.Number.Sum.Sum;
    var getSum$2849 = C$2614.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 0', function () {
            ;
            require('buster').assert.equals(Sum$2848(2).empty(), Sum$2848(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2849(Sum$2848(2)) == 2, 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of the values', function () {
            ;
            require('buster').assert.equals(Sum$2848(2).concat(Sum$2848(4)), Sum$2848(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2848(1).concat(Sum$2848(2)).concat(Sum$2848(3)), Sum$2848(1).concat(Sum$2848(2).concat(Sum$2848(3))), 'associativity');
            require('buster').assert.equals(Sum$2848(1).concat(Sum$2848(1).empty()), Sum$2848(1), 'right identity');
            require('buster').assert.equals(Sum$2848(1).empty().concat(Sum$2848(1)), Sum$2848(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Product', function () {
    var Product$2864 = C$2614.Number.Product.Product;
    var getProduct$2865 = C$2614.Number.Product.getProduct;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Product$2864(2).empty(), Product$2864(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct :: Product a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2865(Product$2864(2)) == 2, 'getProduct');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Product containing the product of the values', function () {
            ;
            require('buster').assert.equals(Product$2864(2).concat(Product$2864(4)), Product$2864(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2864(1).concat(Product$2864(2)).concat(Product$2864(3)), Product$2864(1).concat(Product$2864(2).concat(Product$2864(3))), 'associativity');
            require('buster').assert.equals(Product$2864(1).concat(Product$2864(1).empty()), Product$2864(1), 'right identity');
            require('buster').assert.equals(Product$2864(1).empty().concat(Product$2864(1)), Product$2864(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Max', function () {
    var Max$2880 = C$2614.Number.Max.Max;
    var getMax$2881 = C$2614.Number.Max.getMax;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Max$2880(2).empty(), Max$2880(-Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMax :: Max a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMax$2881(Max$2880(2)) == 2, 'getMax');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Max containing the largest value', function () {
            ;
            require('buster').assert.equals(Max$2880(2).concat(Max$2880(4)), Max$2880(4), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Max$2880(1).concat(Max$2880(2)).concat(Max$2880(3)), Max$2880(1).concat(Max$2880(2).concat(Max$2880(3))), 'associativity');
            require('buster').assert.equals(Max$2880(1).concat(Max$2880(1).empty()), Max$2880(1), 'right identity');
            require('buster').assert.equals(Max$2880(1).empty().concat(Max$2880(1)), Max$2880(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Min', function () {
    var Min$2896 = C$2614.Number.Min.Min;
    var getMin$2897 = C$2614.Number.Min.getMin;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Min$2896(2).empty(), Min$2896(Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMin :: Min a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMin$2897(Min$2896(2)) == 2, 'getMin');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Min containing the smallest value', function () {
            ;
            require('buster').assert.equals(Min$2896(2).concat(Min$2896(4)), Min$2896(2), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Min$2896(1).concat(Min$2896(2)).concat(Min$2896(3)), Min$2896(1).concat(Min$2896(2).concat(Min$2896(3))), 'associativity');
            require('buster').assert.equals(Min$2896(1).concat(Min$2896(1).empty()), Min$2896(1), 'right identity');
            require('buster').assert.equals(Min$2896(1).empty().concat(Min$2896(1)), Min$2896(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2912 = C$2614.Control.Functor.map;
    ;
    var Option$2914 = C$2614.Data.Option.Option;
    var Some$2915 = C$2614.Data.Option.Some;
    var None$2916 = C$2614.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2926(x$2933) {
            return function inc$2926(x$2934) {
                return x$2934 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2927(x$2935) {
            return function id$2927(x$2936) {
                return x$2936;
            }.curry().apply(null, arguments);
        }
        function inc$2926(x$2937) {
            return function inc$2926(x$2938) {
                return x$2938 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2928(x$2939) {
            return function square$2928(x$2940) {
                return x$2940 * x$2940;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2912(id$2927, Some$2915(2)), Some$2915(2), 'identity');
        require('buster').assert.equals(map$2912(id$2927, None$2916), id$2927(None$2916), 'identity');
        require('buster').assert.equals(map$2912(function (x$2941) {
            return inc$2926(square$2928(x$2941));
        }, Some$2915(2)), function (x$2942) {
            return map$2912(inc$2926)(map$2912(square$2928)(x$2942));
        }(Some$2915(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2951(f$2968) {
            return function comp$2951(f$2969) {
                return function (g$2970) {
                    return function (x$2971) {
                        return f$2969(g$2970(x$2971));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2952(x$2972) {
            return function id$2952(x$2973) {
                return x$2973;
            }.curry().apply(null, arguments);
        }
        function add$2953(a$2974, b$2975) {
            return function add$2953(a$2976, b$2977) {
                return a$2976 + b$2977;
            }.curry().apply(null, arguments);
        }
        function prod$2954(a$2978) {
            return function prod$2954(a$2979) {
                return a$2979 * a$2979;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2914.of(id$2952).ap(Some$2915(2)), Some$2915(2), 'identity');
        require('buster').assert.equals(Some$2915(add$2953(2)).map(function (x$2980) {
            return comp$2951(x$2980);
        }.curry()).ap(Some$2915(prod$2954)).ap(Some$2915(2)), Some$2915(add$2953(2)).ap(Some$2915(prod$2954).ap(Some$2915(2))), 'composition');
        require('buster').assert.equals(Option$2914.of(prod$2954).ap(Some$2915(2)), Option$2914.of(prod$2954(2)), 'homomorphism');
        require('buster').assert.equals(Some$2915(prod$2954).ap(Some$2915(2)), Some$2915(function (f$2981) {
            return f$2981(2);
        }.curry()).ap(Some$2915(prod$2954)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2915([1]).concat(Some$2915([2])).concat(Some$2915([3])), Some$2915([1]).concat(Some$2915([2]).concat(Some$2915([3]))), 'associativity');
        require('buster').assert.equals(Some$2915([1]).concat(Option$2914.empty()), Some$2915([1]), 'right identity');
        require('buster').assert.equals(Option$2914.empty().concat(Some$2915([1])), Some$2915([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2989(x$2991) {
            return function m_prod$2989(x$2992) {
                return Some$2915(x$2992 * x$2992);
            }.curry().apply(null, arguments);
        }
        function m_inc$2990(x$2993) {
            return function m_inc$2990(x$2994) {
                return Some$2915(x$2994 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2915(2).chain(m_prod$2989).chain(m_inc$2990), Some$2915(2).chain(function (x$2995) {
            return m_prod$2989(x$2995).chain(m_inc$2990);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2997 = C$2614.Control.Functor.map;
    ;
    var Either$2999 = C$2614.Data.Either.Either;
    var Left$3000 = C$2614.Data.Either.Left;
    var Right$3001 = C$2614.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$3011(x$3018) {
            return function inc$3011(x$3019) {
                return x$3019 + 1;
            }.curry().apply(null, arguments);
        }
        function id$3012(x$3020) {
            return function id$3012(x$3021) {
                return x$3021;
            }.curry().apply(null, arguments);
        }
        function inc$3011(x$3022) {
            return function inc$3011(x$3023) {
                return x$3023 + 1;
            }.curry().apply(null, arguments);
        }
        function square$3013(x$3024) {
            return function square$3013(x$3025) {
                return x$3025 * x$3025;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2997(id$3012, Right$3001(2)), Right$3001(2), 'map identity');
        require('buster').assert.equals(map$2997(id$3012, Left$3000(2)), id$3012(Left$3000(2)), 'map identity');
        require('buster').assert.equals(map$2997(function (x$3026) {
            return inc$3011(square$3013(x$3026));
        }, Right$3001(2)), function (x$3027) {
            return map$2997(inc$3011)(map$2997(square$3013)(x$3027));
        }(Right$3001(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$3036(f$3053) {
            return function comp$3036(f$3054) {
                return function (g$3055) {
                    return function (x$3056) {
                        return f$3054(g$3055(x$3056));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$3037(x$3057) {
            return function id$3037(x$3058) {
                return x$3058;
            }.curry().apply(null, arguments);
        }
        function add$3038(a$3059, b$3060) {
            return function add$3038(a$3061, b$3062) {
                return a$3061 + b$3062;
            }.curry().apply(null, arguments);
        }
        function prod$3039(a$3063) {
            return function prod$3039(a$3064) {
                return a$3064 * a$3064;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2999.of(id$3037).ap(Right$3001(2)), Right$3001(2), 'identity');
        require('buster').assert.equals(Right$3001(add$3038(2)).map(function (x$3065) {
            return comp$3036(x$3065);
        }.curry()).ap(Right$3001(prod$3039)).ap(Right$3001(2)), Right$3001(add$3038(2)).ap(Right$3001(prod$3039).ap(Right$3001(2))), 'composition');
        require('buster').assert.equals(Either$2999.of(prod$3039).ap(Right$3001(2)), Either$2999.of(prod$3039(2)), 'homomorphism');
        require('buster').assert.equals(Right$3001(prod$3039).ap(Right$3001(2)), Right$3001(function (f$3066) {
            return f$3066(2);
        }.curry()).ap(Right$3001(prod$3039)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$3001([1]).concat(Right$3001([2])).concat(Right$3001([3])), Right$3001([1]).concat(Right$3001([2]).concat(Right$3001([3]))), 'associativity');
        require('buster').assert.equals(Right$3001([1]).concat(Right$3001([1]).empty()), Right$3001([1]), 'right identity');
        require('buster').assert.equals(Right$3001([1]).empty().concat(Right$3001([1])), Right$3001([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$3074(x$3076) {
            return function m_prod$3074(x$3077) {
                return Right$3001(x$3077 * x$3077);
            }.curry().apply(null, arguments);
        }
        function m_inc$3075(x$3078) {
            return function m_inc$3075(x$3079) {
                return Right$3001(x$3079 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$3001(2).chain(m_prod$3074).chain(m_inc$3075), Right$3001(2).chain(function (x$3080) {
            return m_prod$3074(x$3080).chain(m_inc$3075);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$3082 = C$2614.Data.Collection.foldl;
    var foldl1$3083 = C$2614.Data.Collection.foldl1;
    var foldr$3084 = C$2614.Data.Collection.foldr;
    var foldr1$3085 = C$2614.Data.Collection.foldr1;
    var flatten$3086 = C$2614.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$3082(function (acc$3095, x$3096) {
                return acc$3095.concat(x$3096);
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
            require('buster').assert.equals(foldl1$3083(function (acc$3100, x$3101) {
                return acc$3100.concat([x$3101]);
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
            require('buster').assert.equals(foldr$3084(function (acc$3105, x$3106) {
                return acc$3105.concat(x$3106);
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
            require('buster').assert.equals(foldr1$3085(function (acc$3110, x$3111) {
                return acc$3110.concat([x$3111]);
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
        var Some$3112 = C$2614.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$3086([
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
            require('buster').assert.equals(flatten$3086([
                Some$3112([1]),
                Some$3112([2])
            ]), Some$3112([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$3125(f$3129) {
            return function comp$3125(f$3130) {
                return function (g$3131) {
                    return function (x$3132) {
                        return f$3130(g$3131(x$3132));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$3126(x$3133) {
            return function id$3126(x$3134) {
                return x$3134;
            }.curry().apply(null, arguments);
        }
        function add$3127(a$3135, b$3136) {
            return function add$3127(a$3137, b$3138) {
                return a$3137 + b$3138;
            }.curry().apply(null, arguments);
        }
        function prod$3128(a$3139) {
            return function prod$3128(a$3140) {
                return a$3140 * a$3140;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$3126).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$3127(2)].map(function (x$3155) {
                return comp$3125(x$3155);
            }.curry()).ap([prod$3128]).ap([2]), [add$3127(2)].ap([prod$3128].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$3128).ap([2]), Array.of(prod$3128(2)), 'homomorphism');
            require('buster').assert.equals([prod$3128].ap([2]), [function (f$3157) {
                    return f$3157(2);
                }.curry()].ap([prod$3128]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$3162(x$3164) {
            return function m_prod$3162(x$3165) {
                return [x$3165 * x$3165];
            }.curry().apply(null, arguments);
        }
        function m_inc$3163(x$3166) {
            return function m_inc$3163(x$3167) {
                return [x$3167 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$3162).chain(m_inc$3163), [
            1,
            2,
            3
        ].chain(function (x$3168) {
            return m_prod$3162(x$3168).chain(m_inc$3163);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Object', function () {
    var merge$3170 = C$2614.Data.Object.merge;
    var set$3171 = C$2614.Data.Object.set;
    ;
    var map$3173 = C$2614.Data.Collection.map;
    ;
    require('buster').spec.describe('merge :: Object -> Object -> Object', function () {
        ;
        require('buster').spec.it('merges two objects', function () {
            ;
            require('buster').assert.equals(merge$3170({ a: 'b' }, { c: 'd' }), {
                a: 'b',
                c: 'd'
            }, 'different keys');
            require('buster').assert.equals(merge$3170({ a: 'b' }, { a: 'd' }), { a: 'b' }, 'same keys');
        });
    });
    require('buster').spec.describe('set :: Object -> String -> a', function () {
        ;
        require('buster').spec.it('returns a new object with the new key present', function () {
            ;
            require('buster').assert.equals(set$3171({ a: 'b' }, 'c', 'd'), {
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
            }.map(function (x$3185) {
                return x$3185 + 1;
            }.curry()), {
                a: 2,
                b: 3,
                c: 4
            }, 'inc');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$3187 = C$2614.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$3195 = {
                    map: function (f$3197) {
                        return f$3197(1);
                    }.curry()
                };
            require('buster').assert(map$3187(function (x$3198) {
                return x$3198 + 2;
            }.curry(), obj$3195) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$3200 = C$2614.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$3204 = {
                    ap: function (fb$3210) {
                        return this.val(fb$3210.val);
                    }.curry(),
                    val: function (x$3211) {
                        return x$3211 + 1;
                    }.curry()
                };
            var fb$3207 = { val: 2 };
            require('buster').assert(ap$3200(fa$3204, fb$3207) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$3213 = C$2614.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$3221 = {
                    chain: function (f$3223) {
                        return f$3223(1);
                    }.curry()
                };
            require('buster').assert(chain$3213(obj$3221, function (x$3224) {
                return x$3224 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});