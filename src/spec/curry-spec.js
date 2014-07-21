var C$2614 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2631 = C$2614.Core.__;
    var curry$2632 = C$2614.Core.curry;
    var compose$2633 = C$2614.Core.compose;
    var Protocol$2634 = C$2614.Core.Protocol;
    var instance$2635 = C$2614.Core.instance;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2644 = curry$2632(function (a$2651, b$2652, c$2653, d$2654) {
                    return a$2651 + b$2652 + c$2653 + d$2654;
                });
            var nums$2646 = curry$2632(function (a$2655, b$2656) {
                    return [
                        a$2655,
                        b$2656
                    ];
                });
            ;
            require('buster').assert(addMany$2644(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2644(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2644(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2646(__$2631, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2658 = curry$2632(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2658(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2661 = function (a$2663, b$2664) {
                    return a$2663 + b$2664;
                }.curry();
            ;
            require('buster').assert(add$2661(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2667 = curry$2632(function (sep$2675, s$2676) {
                    return s$2676.split(sep$2675);
                });
            var map$2669 = curry$2632(function (f$2677, xs$2678) {
                    return xs$2678.map(f$2677);
                });
            var upcase$2671 = curry$2632(function (s$2679) {
                    return s$2679.toUpperCase();
                });
            var join$2673 = curry$2632(function (sep$2680, xs$2681) {
                    return xs$2681.join(sep$2680);
                });
            ;
            require('buster').assert(compose$2633(join$2673('-'), map$2669(upcase$2671), split$2667(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
    require('buster').spec.describe('Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }', function () {
        ;
        require('buster').spec.it('should create a protocol with correct fields', function () {
            var specObj$2684 = { foo: 'bar' };
            var name$2686 = Protocol$2634('MyProtocol', specObj$2684).name;
            var spec$2687 = Protocol$2634('MyProtocol', specObj$2684).spec;
            var instance$2688 = Protocol$2634('MyProtocol', specObj$2684).instance;
            ;
            ;
            require('buster').assert(name$2686 == 'MyProtocol', 'name field');
            require('buster').assert(spec$2687 == specObj$2684, 'spec field');
            require('buster').assert(typeof instance$2688 == 'function', 'instance field');
        });
    });
    require('buster').spec.describe('instance :: Protocol -> ADT -> Object -> undefined', function () {
        ;
        require('buster').spec.it('should should not overwrite existing fields', function () {
            protocol = Protocol$2634('MyProtocol', {
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
            instance$2635(protocol, type, {});
            var foo$2696 = type.foo;
            ;
            var bar$2698 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2696() == 'bar1', 'existing constructor fields');
            require('buster').assert(bar$2698() == 'baz1', 'existing prototype fields');
        });
        require('buster').spec.it('should copy over default implementations', function () {
            protocol = Protocol$2634('MyProtocol', {
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
            instance$2635(protocol, type, {});
            var foo$2706 = type.foo;
            ;
            var bar$2708 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2706() == 'bar', 'default constructor implementations');
            require('buster').assert(bar$2708() == 'baz', 'default prototype implementations');
        });
        require('buster').spec.it('should throw an error on missing implementations', function () {
            protocol = Protocol$2634('MyProtocol', { constructor: { foo: Protocol$2634.required } });
            type = {};
            require('buster').assert.exception(function () {
                instance$2635(protocol, type, {});
            }, 'Error');
            protocol = Protocol$2634('MyProtocol', { prototype: { foo: Protocol$2634.required } });
            type = { prototype: {} };
            require('buster').assert.exception(function () {
                instance$2635(protocol, type, {});
            }, 'Error');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2716 = C$2614.Predicates.not;
    var and$2717 = C$2614.Predicates.and;
    var or$2718 = C$2614.Predicates.or;
    var isObject$2719 = C$2614.Predicates.isObject;
    var isArray$2720 = C$2614.Predicates.isArray;
    var isNumber$2721 = C$2614.Predicates.isNumber;
    var isRegExp$2722 = C$2614.Predicates.isRegExp;
    var isString$2723 = C$2614.Predicates.isString;
    var isNull$2724 = C$2614.Predicates.isNull;
    var isUndef$2725 = C$2614.Predicates.isUndef;
    var exists$2726 = C$2614.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2716(true) === false, 'not(true)');
        require('buster').assert(not$2716(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2717([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2717([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2717([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2717([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2717([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2717([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2717([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2717([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2718([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2718([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2718([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2718([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2718([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2718([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2718([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2718([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2718([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2718([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2718([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2719({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2719([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2719(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2719(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2719('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2719(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2720([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2720({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2720(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2720(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2720('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2721(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2721([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2721({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2721(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2721('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2722(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2722(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2722([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2722({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2722('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2723('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2723(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2723(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2723([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2723({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2724(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2724('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2724(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2724(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2724([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2724({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2725(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2725('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2725(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2725(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2725([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2725({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2726(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2726(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2726('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2726(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2726(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2726([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2726({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2805 = C$2614.Math.plus;
    var minus$2806 = C$2614.Math.minus;
    var times$2807 = C$2614.Math.times;
    var div$2808 = C$2614.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2805(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2806(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2807(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2808(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Sum', function () {
    var Sum$2822 = C$2614.Number.Sum.Sum;
    var getSum$2823 = C$2614.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 0', function () {
            ;
            require('buster').assert.equals(Sum$2822(2).empty(), Sum$2822(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2823(Sum$2822(2)) == 2, 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of the values', function () {
            ;
            require('buster').assert.equals(Sum$2822(2).concat(Sum$2822(4)), Sum$2822(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2822(1).concat(Sum$2822(2)).concat(Sum$2822(3)), Sum$2822(1).concat(Sum$2822(2).concat(Sum$2822(3))), 'associativity');
            require('buster').assert.equals(Sum$2822(1).concat(Sum$2822(1).empty()), Sum$2822(1), 'right identity');
            require('buster').assert.equals(Sum$2822(1).empty().concat(Sum$2822(1)), Sum$2822(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Product', function () {
    var Product$2838 = C$2614.Number.Product.Product;
    var getProduct$2839 = C$2614.Number.Product.getProduct;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Product$2838(2).empty(), Product$2838(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct :: Product a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2839(Product$2838(2)) == 2, 'getProduct');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Product containing the product of the values', function () {
            ;
            require('buster').assert.equals(Product$2838(2).concat(Product$2838(4)), Product$2838(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2838(1).concat(Product$2838(2)).concat(Product$2838(3)), Product$2838(1).concat(Product$2838(2).concat(Product$2838(3))), 'associativity');
            require('buster').assert.equals(Product$2838(1).concat(Product$2838(1).empty()), Product$2838(1), 'right identity');
            require('buster').assert.equals(Product$2838(1).empty().concat(Product$2838(1)), Product$2838(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Max', function () {
    var Max$2854 = C$2614.Number.Max.Max;
    var getMax$2855 = C$2614.Number.Max.getMax;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Max$2854(2).empty(), Max$2854(-Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMax :: Max a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMax$2855(Max$2854(2)) == 2, 'getMax');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Max containing the largest value', function () {
            ;
            require('buster').assert.equals(Max$2854(2).concat(Max$2854(4)), Max$2854(4), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Max$2854(1).concat(Max$2854(2)).concat(Max$2854(3)), Max$2854(1).concat(Max$2854(2).concat(Max$2854(3))), 'associativity');
            require('buster').assert.equals(Max$2854(1).concat(Max$2854(1).empty()), Max$2854(1), 'right identity');
            require('buster').assert.equals(Max$2854(1).empty().concat(Max$2854(1)), Max$2854(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Min', function () {
    var Min$2870 = C$2614.Number.Min.Min;
    var getMin$2871 = C$2614.Number.Min.getMin;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Min$2870(2).empty(), Min$2870(Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMin :: Min a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMin$2871(Min$2870(2)) == 2, 'getMin');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Min containing the smallest value', function () {
            ;
            require('buster').assert.equals(Min$2870(2).concat(Min$2870(4)), Min$2870(2), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Min$2870(1).concat(Min$2870(2)).concat(Min$2870(3)), Min$2870(1).concat(Min$2870(2).concat(Min$2870(3))), 'associativity');
            require('buster').assert.equals(Min$2870(1).concat(Min$2870(1).empty()), Min$2870(1), 'right identity');
            require('buster').assert.equals(Min$2870(1).empty().concat(Min$2870(1)), Min$2870(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2886 = C$2614.Control.Functor.map;
    ;
    var Option$2888 = C$2614.Data.Option.Option;
    var Some$2889 = C$2614.Data.Option.Some;
    var None$2890 = C$2614.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2900(x$2907) {
            return function inc$2900(x$2908) {
                return x$2908 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2901(x$2909) {
            return function id$2901(x$2910) {
                return x$2910;
            }.curry().apply(null, arguments);
        }
        function inc$2900(x$2911) {
            return function inc$2900(x$2912) {
                return x$2912 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2902(x$2913) {
            return function square$2902(x$2914) {
                return x$2914 * x$2914;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2886(id$2901, Some$2889(2)), Some$2889(2), 'identity');
        require('buster').assert.equals(map$2886(id$2901, None$2890), id$2901(None$2890), 'identity');
        require('buster').assert.equals(map$2886(function (x$2915) {
            return inc$2900(square$2902(x$2915));
        }, Some$2889(2)), function (x$2916) {
            return map$2886(inc$2900)(map$2886(square$2902)(x$2916));
        }(Some$2889(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2925(f$2941) {
            return function comp$2925(f$2942) {
                return function (g$2943) {
                    return function (x$2944) {
                        return f$2942(g$2943(x$2944));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2926(x$2945) {
            return function id$2926(x$2946) {
                return x$2946;
            }.curry().apply(null, arguments);
        }
        function add$2927(a$2947, b$2948) {
            return function add$2927(a$2949, b$2950) {
                return a$2949 + b$2950;
            }.curry().apply(null, arguments);
        }
        function prod$2928(a$2951) {
            return function prod$2928(a$2952) {
                return a$2952 * a$2952;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2888.of(id$2926).ap(Some$2889(2)), Some$2889(2), 'identity');
        require('buster').assert.equals(Some$2889(add$2927(2)).map(comp$2925).ap(Some$2889(prod$2928)).ap(Some$2889(2)), Some$2889(add$2927(2)).ap(Some$2889(prod$2928).ap(Some$2889(2))), 'composition');
        require('buster').assert.equals(Option$2888.of(prod$2928).ap(Some$2889(2)), Option$2888.of(prod$2928(2)), 'homomorphism');
        require('buster').assert.equals(Some$2889(prod$2928).ap(Some$2889(2)), Some$2889(function (f$2953) {
            return f$2953(2);
        }.curry()).ap(Some$2889(prod$2928)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2889([1]).concat(Some$2889([2])).concat(Some$2889([3])), Some$2889([1]).concat(Some$2889([2]).concat(Some$2889([3]))), 'associativity');
        require('buster').assert.equals(Some$2889([1]).concat(Option$2888.empty()), Some$2889([1]), 'right identity');
        require('buster').assert.equals(Option$2888.empty().concat(Some$2889([1])), Some$2889([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2961(x$2963) {
            return function m_prod$2961(x$2964) {
                return Some$2889(x$2964 * x$2964);
            }.curry().apply(null, arguments);
        }
        function m_inc$2962(x$2965) {
            return function m_inc$2962(x$2966) {
                return Some$2889(x$2966 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2889(2).chain(m_prod$2961).chain(m_inc$2962), Some$2889(2).chain(function (x$2967) {
            return m_prod$2961(x$2967).chain(m_inc$2962);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2969 = C$2614.Control.Functor.map;
    ;
    var Either$2971 = C$2614.Data.Either.Either;
    var Left$2972 = C$2614.Data.Either.Left;
    var Right$2973 = C$2614.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2983(x$2990) {
            return function inc$2983(x$2991) {
                return x$2991 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2984(x$2992) {
            return function id$2984(x$2993) {
                return x$2993;
            }.curry().apply(null, arguments);
        }
        function inc$2983(x$2994) {
            return function inc$2983(x$2995) {
                return x$2995 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2985(x$2996) {
            return function square$2985(x$2997) {
                return x$2997 * x$2997;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2969(id$2984, Right$2973(2)), Right$2973(2), 'map identity');
        require('buster').assert.equals(map$2969(id$2984, Left$2972(2)), id$2984(Left$2972(2)), 'map identity');
        require('buster').assert.equals(map$2969(function (x$2998) {
            return inc$2983(square$2985(x$2998));
        }, Right$2973(2)), function (x$2999) {
            return map$2969(inc$2983)(map$2969(square$2985)(x$2999));
        }(Right$2973(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$3008(f$3024) {
            return function comp$3008(f$3025) {
                return function (g$3026) {
                    return function (x$3027) {
                        return f$3025(g$3026(x$3027));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$3009(x$3028) {
            return function id$3009(x$3029) {
                return x$3029;
            }.curry().apply(null, arguments);
        }
        function add$3010(a$3030, b$3031) {
            return function add$3010(a$3032, b$3033) {
                return a$3032 + b$3033;
            }.curry().apply(null, arguments);
        }
        function prod$3011(a$3034) {
            return function prod$3011(a$3035) {
                return a$3035 * a$3035;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2971.of(id$3009).ap(Right$2973(2)), Right$2973(2), 'identity');
        require('buster').assert.equals(Right$2973(add$3010(2)).map(comp$3008).ap(Right$2973(prod$3011)).ap(Right$2973(2)), Right$2973(add$3010(2)).ap(Right$2973(prod$3011).ap(Right$2973(2))), 'composition');
        require('buster').assert.equals(Either$2971.of(prod$3011).ap(Right$2973(2)), Either$2971.of(prod$3011(2)), 'homomorphism');
        require('buster').assert.equals(Right$2973(prod$3011).ap(Right$2973(2)), Right$2973(function (f$3036) {
            return f$3036(2);
        }.curry()).ap(Right$2973(prod$3011)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2973([1]).concat(Right$2973([2])).concat(Right$2973([3])), Right$2973([1]).concat(Right$2973([2]).concat(Right$2973([3]))), 'associativity');
        require('buster').assert.equals(Right$2973([1]).concat(Right$2973([1]).empty()), Right$2973([1]), 'right identity');
        require('buster').assert.equals(Right$2973([1]).empty().concat(Right$2973([1])), Right$2973([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$3044(x$3046) {
            return function m_prod$3044(x$3047) {
                return Right$2973(x$3047 * x$3047);
            }.curry().apply(null, arguments);
        }
        function m_inc$3045(x$3048) {
            return function m_inc$3045(x$3049) {
                return Right$2973(x$3049 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2973(2).chain(m_prod$3044).chain(m_inc$3045), Right$2973(2).chain(function (x$3050) {
            return m_prod$3044(x$3050).chain(m_inc$3045);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$3052 = C$2614.Data.Collection.foldl;
    var foldl1$3053 = C$2614.Data.Collection.foldl1;
    var foldr$3054 = C$2614.Data.Collection.foldr;
    var foldr1$3055 = C$2614.Data.Collection.foldr1;
    var flatten$3056 = C$2614.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$3052(function (acc$3065, x$3066) {
                return acc$3065.concat(x$3066);
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
            require('buster').assert.equals(foldl1$3053(function (acc$3070, x$3071) {
                return acc$3070.concat([x$3071]);
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
            require('buster').assert.equals(foldr$3054(function (acc$3075, x$3076) {
                return acc$3075.concat(x$3076);
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
            require('buster').assert.equals(foldr1$3055(function (acc$3080, x$3081) {
                return acc$3080.concat([x$3081]);
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
        var Some$3082 = C$2614.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$3056([
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
            require('buster').assert.equals(flatten$3056([
                Some$3082([1]),
                Some$3082([2])
            ]), Some$3082([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$3095(f$3099) {
            return function comp$3095(f$3100) {
                return function (g$3101) {
                    return function (x$3102) {
                        return f$3100(g$3101(x$3102));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$3096(x$3103) {
            return function id$3096(x$3104) {
                return x$3104;
            }.curry().apply(null, arguments);
        }
        function add$3097(a$3105, b$3106) {
            return function add$3097(a$3107, b$3108) {
                return a$3107 + b$3108;
            }.curry().apply(null, arguments);
        }
        function prod$3098(a$3109) {
            return function prod$3098(a$3110) {
                return a$3110 * a$3110;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$3096).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$3097(2)].map(comp$3095).ap([prod$3098]).ap([2]), [add$3097(2)].ap([prod$3098].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$3098).ap([2]), Array.of(prod$3098(2)), 'homomorphism');
            require('buster').assert.equals([prod$3098].ap([2]), [function (f$3125) {
                    return f$3125(2);
                }.curry()].ap([prod$3098]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$3130(x$3132) {
            return function m_prod$3130(x$3133) {
                return [x$3133 * x$3133];
            }.curry().apply(null, arguments);
        }
        function m_inc$3131(x$3134) {
            return function m_inc$3131(x$3135) {
                return [x$3135 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$3130).chain(m_inc$3131), [
            1,
            2,
            3
        ].chain(function (x$3136) {
            return m_prod$3130(x$3136).chain(m_inc$3131);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Object', function () {
    var merge$3138 = C$2614.Data.Object.merge;
    var set$3139 = C$2614.Data.Object.set;
    ;
    require('buster').spec.describe('merge :: Object -> Object -> Object', function () {
        ;
        require('buster').spec.it('merges two objects', function () {
            ;
            require('buster').assert.equals(merge$3138({ a: 'b' }, { c: 'd' }), {
                a: 'b',
                c: 'd'
            }, 'different keys');
            require('buster').assert.equals(merge$3138({ a: 'b' }, { a: 'd' }), { a: 'b' }, 'same keys');
        });
    });
    require('buster').spec.describe('set :: Object -> String -> a', function () {
        ;
        require('buster').spec.it('returns a new object with the new key present', function () {
            ;
            require('buster').assert.equals(set$3139({ a: 'b' }, 'c', 'd'), {
                a: 'b',
                c: 'd'
            }, 'set new key');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$3148 = C$2614.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$3156 = {
                    map: function (f$3158) {
                        return f$3158(1);
                    }.curry()
                };
            require('buster').assert(map$3148(function (x$3159) {
                return x$3159 + 2;
            }.curry(), obj$3156) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$3161 = C$2614.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$3165 = {
                    ap: function (fb$3171) {
                        return this.val(fb$3171.val);
                    }.curry(),
                    val: function (x$3172) {
                        return x$3172 + 1;
                    }.curry()
                };
            var fb$3168 = { val: 2 };
            require('buster').assert(ap$3161(fa$3165, fb$3168) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$3174 = C$2614.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$3182 = {
                    chain: function (f$3184) {
                        return f$3184(1);
                    }.curry()
                };
            require('buster').assert(chain$3174(obj$3182, function (x$3185) {
                return x$3185 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});