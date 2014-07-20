var C$2585 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2601 = C$2585.Core.__;
    var curry$2602 = C$2585.Core.curry;
    var compose$2603 = C$2585.Core.compose;
    var Protocol$2604 = C$2585.Core.Protocol;
    var instance$2605 = C$2585.Core.instance;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2614 = curry$2602(function (a$2621, b$2622, c$2623, d$2624) {
                    return a$2621 + b$2622 + c$2623 + d$2624;
                });
            var nums$2616 = curry$2602(function (a$2625, b$2626) {
                    return [
                        a$2625,
                        b$2626
                    ];
                });
            ;
            require('buster').assert(addMany$2614(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2614(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2614(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2616(__$2601, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2628 = curry$2602(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2628(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2631 = function (a$2633, b$2634) {
                    return a$2633 + b$2634;
                }.curry();
            ;
            require('buster').assert(add$2631(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2637 = curry$2602(function (sep$2645, s$2646) {
                    return s$2646.split(sep$2645);
                });
            var map$2639 = curry$2602(function (f$2647, xs$2648) {
                    return xs$2648.map(f$2647);
                });
            var upcase$2641 = curry$2602(function (s$2649) {
                    return s$2649.toUpperCase();
                });
            var join$2643 = curry$2602(function (sep$2650, xs$2651) {
                    return xs$2651.join(sep$2650);
                });
            ;
            require('buster').assert(compose$2603(join$2643('-'), map$2639(upcase$2641), split$2637(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
    require('buster').spec.describe('Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }', function () {
        ;
        require('buster').spec.it('should create a protocol with correct fields', function () {
            var specObj$2654 = { foo: 'bar' };
            var name$2656 = Protocol$2604('MyProtocol', specObj$2654).name;
            var spec$2657 = Protocol$2604('MyProtocol', specObj$2654).spec;
            var instance$2658 = Protocol$2604('MyProtocol', specObj$2654).instance;
            ;
            ;
            require('buster').assert(name$2656 == 'MyProtocol', 'name field');
            require('buster').assert(spec$2657 == specObj$2654, 'spec field');
            require('buster').assert(typeof instance$2658 == 'function', 'instance field');
        });
    });
    require('buster').spec.describe('instance :: Protocol -> ADT -> Object -> undefined', function () {
        ;
        require('buster').spec.it('should should not overwrite existing fields', function () {
            protocol = Protocol$2604('MyProtocol', {
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
            instance$2605(protocol, type, {});
            var foo$2666 = type.foo;
            ;
            var bar$2668 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2666() == 'bar1', 'existing constructor fields');
            require('buster').assert(bar$2668() == 'baz1', 'existing prototype fields');
        });
        require('buster').spec.it('should copy over default implementations', function () {
            protocol = Protocol$2604('MyProtocol', {
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
            instance$2605(protocol, type, {});
            var foo$2676 = type.foo;
            ;
            var bar$2678 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2676() == 'bar', 'default constructor implementations');
            require('buster').assert(bar$2678() == 'baz', 'default prototype implementations');
        });
        require('buster').spec.it('should throw an error on missing implementations', function () {
            protocol = Protocol$2604('MyProtocol', { constructor: { foo: Protocol$2604.required } });
            type = {};
            require('buster').assert.exception(function () {
                instance$2605(protocol, type, {});
            }, 'Error');
            protocol = Protocol$2604('MyProtocol', { prototype: { foo: Protocol$2604.required } });
            type = { prototype: {} };
            require('buster').assert.exception(function () {
                instance$2605(protocol, type, {});
            }, 'Error');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2686 = C$2585.Predicates.not;
    var and$2687 = C$2585.Predicates.and;
    var or$2688 = C$2585.Predicates.or;
    var isObject$2689 = C$2585.Predicates.isObject;
    var isArray$2690 = C$2585.Predicates.isArray;
    var isNumber$2691 = C$2585.Predicates.isNumber;
    var isRegExp$2692 = C$2585.Predicates.isRegExp;
    var isString$2693 = C$2585.Predicates.isString;
    var isNull$2694 = C$2585.Predicates.isNull;
    var isUndef$2695 = C$2585.Predicates.isUndef;
    var exists$2696 = C$2585.Predicates.exists;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2686(true) === false, 'not(true)');
        require('buster').assert(not$2686(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2687([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2687([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2687([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2687([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2687([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2687([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2687([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2687([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('or :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(or$2688([
            true,
            true
        ]) === true, 'or([true,  true ]) => true ');
        require('buster').assert(or$2688([
            true,
            false
        ]) === true, 'or([true,  false]) => true ');
        require('buster').assert(or$2688([
            false,
            true
        ]) === true, 'or([false, true ]) => true ');
        require('buster').assert(or$2688([
            false,
            false
        ]) === false, 'or([false, false]) => false');
        require('buster').assert(or$2688([
            '',
            true
        ]) === true, 'or([\'\',    true ]) => true ');
        require('buster').assert(or$2688([
            '',
            false
        ]) === false, 'or([\'\',    false]) => false');
        require('buster').assert(or$2688([
            'x',
            true
        ]) === true, 'or([\'x\',   true ]) => true ');
        require('buster').assert(or$2688([
            0,
            true
        ]) === true, 'or([0,     true ]) => true ');
        require('buster').assert(or$2688([
            0,
            false
        ]) === false, 'or([0,     false]) => false');
        require('buster').assert(or$2688([
            1,
            true
        ]) === true, 'or([1,     true ]) => true ');
        require('buster').assert(or$2688([
            1,
            false
        ]) === true, 'or([1,     false]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2689({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2689([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2689(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2689(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2689('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2689(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2690([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2690({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2690(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2690(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2690('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2691(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2691([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2691({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2691(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2691('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2692(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2692(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2692([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2692({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2692('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2693('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2693(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2693(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2693([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2693({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2694(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2694('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2694(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2694(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2694([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2694({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2695(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2695('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2695(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2695(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2695([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2695({}) === false, 'isUndef({})         => false');
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').assert(exists$2696(undefined) === false, 'exists(undefined)  => false');
        require('buster').assert(exists$2696(null) === false, 'exists(null)       => false');
        require('buster').assert(exists$2696('x') === true, 'exists(\'x\')        => true ');
        require('buster').assert(exists$2696(/x/) === true, 'exists(/x/)        => true ');
        require('buster').assert(exists$2696(0) === true, 'exists(0)          => true ');
        require('buster').assert(exists$2696([]) === true, 'exists([])         => true ');
        require('buster').assert(exists$2696({}) === true, 'exists({})         => true ');
    });
});
require('buster').spec.describe('CurryJS.Math', function () {
    var plus$2775 = C$2585.Math.plus;
    var minus$2776 = C$2585.Math.minus;
    var times$2777 = C$2585.Math.times;
    var div$2778 = C$2585.Math.div;
    ;
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('it performs addition', function () {
            ;
            require('buster').assert(plus$2775(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('it performs subtraction', function () {
            ;
            require('buster').assert(minus$2776(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('it performs multiplication', function () {
            ;
            require('buster').assert(times$2777(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('it performs division', function () {
            ;
            require('buster').assert(div$2778(4, 2) == 2, 'division');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Sum', function () {
    var Sum$2792 = C$2585.Number.Sum.Sum;
    var getSum$2793 = C$2585.Number.Sum.getSum;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 0', function () {
            ;
            require('buster').assert.equals(Sum$2792(2).empty(), Sum$2792(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum :: Sum a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2793(Sum$2792(2)) == 2, 'getSum');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of the values', function () {
            ;
            require('buster').assert.equals(Sum$2792(2).concat(Sum$2792(4)), Sum$2792(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2792(1).concat(Sum$2792(2)).concat(Sum$2792(3)), Sum$2792(1).concat(Sum$2792(2).concat(Sum$2792(3))), 'associativity');
            require('buster').assert.equals(Sum$2792(1).concat(Sum$2792(1).empty()), Sum$2792(1), 'right identity');
            require('buster').assert.equals(Sum$2792(1).empty().concat(Sum$2792(1)), Sum$2792(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Product', function () {
    var Product$2808 = C$2585.Number.Product.Product;
    var getProduct$2809 = C$2585.Number.Product.getProduct;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Product$2808(2).empty(), Product$2808(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct :: Product a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2809(Product$2808(2)) == 2, 'getProduct');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Product containing the product of the values', function () {
            ;
            require('buster').assert.equals(Product$2808(2).concat(Product$2808(4)), Product$2808(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2808(1).concat(Product$2808(2)).concat(Product$2808(3)), Product$2808(1).concat(Product$2808(2).concat(Product$2808(3))), 'associativity');
            require('buster').assert.equals(Product$2808(1).concat(Product$2808(1).empty()), Product$2808(1), 'right identity');
            require('buster').assert.equals(Product$2808(1).empty().concat(Product$2808(1)), Product$2808(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Max', function () {
    var Max$2824 = C$2585.Number.Max.Max;
    var getMax$2825 = C$2585.Number.Max.getMax;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Max$2824(2).empty(), Max$2824(-Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMax :: Max a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMax$2825(Max$2824(2)) == 2, 'getMax');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Max containing the largest value', function () {
            ;
            require('buster').assert.equals(Max$2824(2).concat(Max$2824(4)), Max$2824(4), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Max$2824(1).concat(Max$2824(2)).concat(Max$2824(3)), Max$2824(1).concat(Max$2824(2).concat(Max$2824(3))), 'associativity');
            require('buster').assert.equals(Max$2824(1).concat(Max$2824(1).empty()), Max$2824(1), 'right identity');
            require('buster').assert.equals(Max$2824(1).empty().concat(Max$2824(1)), Max$2824(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Number.Min', function () {
    var Min$2840 = C$2585.Number.Min.Min;
    var getMin$2841 = C$2585.Number.Min.getMin;
    ;
    require('buster').spec.describe('empty :: Monoid a => a', function () {
        ;
        require('buster').spec.it('returns 1', function () {
            ;
            require('buster').assert.equals(Min$2840(2).empty(), Min$2840(Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMin :: Min a -> a', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMin$2841(Min$2840(2)) == 2, 'getMin');
        });
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').spec.it('returns a Min containing the smallest value', function () {
            ;
            require('buster').assert.equals(Min$2840(2).concat(Min$2840(4)), Min$2840(2), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Min$2840(1).concat(Min$2840(2)).concat(Min$2840(3)), Min$2840(1).concat(Min$2840(2).concat(Min$2840(3))), 'associativity');
            require('buster').assert.equals(Min$2840(1).concat(Min$2840(1).empty()), Min$2840(1), 'right identity');
            require('buster').assert.equals(Min$2840(1).empty().concat(Min$2840(1)), Min$2840(1), 'left identity');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2856 = C$2585.Control.Functor.map;
    ;
    var Option$2858 = C$2585.Data.Option.Option;
    var Some$2859 = C$2585.Data.Option.Some;
    var None$2860 = C$2585.Data.Option.None;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2870(x$2877) {
            return function inc$2870(x$2878) {
                return x$2878 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2871(x$2879) {
            return function id$2871(x$2880) {
                return x$2880;
            }.curry().apply(null, arguments);
        }
        function inc$2870(x$2881) {
            return function inc$2870(x$2882) {
                return x$2882 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2872(x$2883) {
            return function square$2872(x$2884) {
                return x$2884 * x$2884;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2856(id$2871, Some$2859(2)), Some$2859(2), 'identity');
        require('buster').assert.equals(map$2856(id$2871, None$2860), id$2871(None$2860), 'identity');
        require('buster').assert.equals(map$2856(function (x$2885) {
            return inc$2870(square$2872(x$2885));
        }, Some$2859(2)), function (x$2886) {
            return map$2856(inc$2870)(map$2856(square$2872)(x$2886));
        }(Some$2859(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2895(f$2911) {
            return function comp$2895(f$2912) {
                return function (g$2913) {
                    return function (x$2914) {
                        return f$2912(g$2913(x$2914));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2896(x$2915) {
            return function id$2896(x$2916) {
                return x$2916;
            }.curry().apply(null, arguments);
        }
        function add$2897(a$2917, b$2918) {
            return function add$2897(a$2919, b$2920) {
                return a$2919 + b$2920;
            }.curry().apply(null, arguments);
        }
        function prod$2898(a$2921) {
            return function prod$2898(a$2922) {
                return a$2922 * a$2922;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Option$2858.of(id$2896).ap(Some$2859(2)), Some$2859(2), 'identity');
        require('buster').assert.equals(Some$2859(add$2897(2)).map(comp$2895).ap(Some$2859(prod$2898)).ap(Some$2859(2)), Some$2859(add$2897(2)).ap(Some$2859(prod$2898).ap(Some$2859(2))), 'composition');
        require('buster').assert.equals(Option$2858.of(prod$2898).ap(Some$2859(2)), Option$2858.of(prod$2898(2)), 'homomorphism');
        require('buster').assert.equals(Some$2859(prod$2898).ap(Some$2859(2)), Some$2859(function (f$2923) {
            return f$2923(2);
        }.curry()).ap(Some$2859(prod$2898)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Some$2859([1]).concat(Some$2859([2])).concat(Some$2859([3])), Some$2859([1]).concat(Some$2859([2]).concat(Some$2859([3]))), 'associativity');
        require('buster').assert.equals(Some$2859([1]).concat(Option$2858.empty()), Some$2859([1]), 'right identity');
        require('buster').assert.equals(Option$2858.empty().concat(Some$2859([1])), Some$2859([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$2931(x$2933) {
            return function m_prod$2931(x$2934) {
                return Some$2859(x$2934 * x$2934);
            }.curry().apply(null, arguments);
        }
        function m_inc$2932(x$2935) {
            return function m_inc$2932(x$2936) {
                return Some$2859(x$2936 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Some$2859(2).chain(m_prod$2931).chain(m_inc$2932), Some$2859(2).chain(function (x$2937) {
            return m_prod$2931(x$2937).chain(m_inc$2932);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Option', function () {
    var map$2939 = C$2585.Control.Functor.map;
    ;
    var Either$2941 = C$2585.Data.Either.Either;
    var Left$2942 = C$2585.Data.Either.Left;
    var Right$2943 = C$2585.Data.Either.Right;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        function inc$2953(x$2960) {
            return function inc$2953(x$2961) {
                return x$2961 + 1;
            }.curry().apply(null, arguments);
        }
        function id$2954(x$2962) {
            return function id$2954(x$2963) {
                return x$2963;
            }.curry().apply(null, arguments);
        }
        function inc$2953(x$2964) {
            return function inc$2953(x$2965) {
                return x$2965 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2955(x$2966) {
            return function square$2955(x$2967) {
                return x$2967 * x$2967;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(map$2939(id$2954, Right$2943(2)), Right$2943(2), 'map identity');
        require('buster').assert.equals(map$2939(id$2954, Left$2942(2)), id$2954(Left$2942(2)), 'map identity');
        require('buster').assert.equals(map$2939(function (x$2968) {
            return inc$2953(square$2955(x$2968));
        }, Right$2943(2)), function (x$2969) {
            return map$2939(inc$2953)(map$2939(square$2955)(x$2969));
        }(Right$2943(2)), 'composition');
    });
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$2978(f$2994) {
            return function comp$2978(f$2995) {
                return function (g$2996) {
                    return function (x$2997) {
                        return f$2995(g$2996(x$2997));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$2979(x$2998) {
            return function id$2979(x$2999) {
                return x$2999;
            }.curry().apply(null, arguments);
        }
        function add$2980(a$3000, b$3001) {
            return function add$2980(a$3002, b$3003) {
                return a$3002 + b$3003;
            }.curry().apply(null, arguments);
        }
        function prod$2981(a$3004) {
            return function prod$2981(a$3005) {
                return a$3005 * a$3005;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Either$2941.of(id$2979).ap(Right$2943(2)), Right$2943(2), 'identity');
        require('buster').assert.equals(Right$2943(add$2980(2)).map(comp$2978).ap(Right$2943(prod$2981)).ap(Right$2943(2)), Right$2943(add$2980(2)).ap(Right$2943(prod$2981).ap(Right$2943(2))), 'composition');
        require('buster').assert.equals(Either$2941.of(prod$2981).ap(Right$2943(2)), Either$2941.of(prod$2981(2)), 'homomorphism');
        require('buster').assert.equals(Right$2943(prod$2981).ap(Right$2943(2)), Right$2943(function (f$3006) {
            return f$3006(2);
        }.curry()).ap(Right$2943(prod$2981)), 'interchange');
    });
    require('buster').spec.describe('concat :: Monoid a => a -> a -> a', function () {
        ;
        require('buster').assert.equals(Right$2943([1]).concat(Right$2943([2])).concat(Right$2943([3])), Right$2943([1]).concat(Right$2943([2]).concat(Right$2943([3]))), 'associativity');
        require('buster').assert.equals(Right$2943([1]).concat(Right$2943([1]).empty()), Right$2943([1]), 'right identity');
        require('buster').assert.equals(Right$2943([1]).empty().concat(Right$2943([1])), Right$2943([1]), 'left identity');
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$3014(x$3016) {
            return function m_prod$3014(x$3017) {
                return Right$2943(x$3017 * x$3017);
            }.curry().apply(null, arguments);
        }
        function m_inc$3015(x$3018) {
            return function m_inc$3015(x$3019) {
                return Right$2943(x$3019 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals(Right$2943(2).chain(m_prod$3014).chain(m_inc$3015), Right$2943(2).chain(function (x$3020) {
            return m_prod$3014(x$3020).chain(m_inc$3015);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$3022 = C$2585.Data.Collection.foldl;
    var foldl1$3023 = C$2585.Data.Collection.foldl1;
    var foldr$3024 = C$2585.Data.Collection.foldr;
    var foldr1$3025 = C$2585.Data.Collection.foldr1;
    var flatten$3026 = C$2585.Data.Collection.flatten;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$3022(function (acc$3035, x$3036) {
                return acc$3035.concat(x$3036);
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
            require('buster').assert.equals(foldl1$3023(function (acc$3040, x$3041) {
                return acc$3040.concat([x$3041]);
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
            require('buster').assert.equals(foldr$3024(function (acc$3045, x$3046) {
                return acc$3045.concat(x$3046);
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
            require('buster').assert.equals(foldr1$3025(function (acc$3050, x$3051) {
                return acc$3050.concat([x$3051]);
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
        var Some$3052 = C$2585.Data.Option.Some;
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$3026([
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
            require('buster').assert.equals(flatten$3026([
                Some$3052([1]),
                Some$3052([2])
            ]), Some$3052([
                1,
                2
            ]), 'list of options');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Array', function () {
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        function comp$3065(f$3069) {
            return function comp$3065(f$3070) {
                return function (g$3071) {
                    return function (x$3072) {
                        return f$3070(g$3071(x$3072));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function id$3066(x$3073) {
            return function id$3066(x$3074) {
                return x$3074;
            }.curry().apply(null, arguments);
        }
        function add$3067(a$3075, b$3076) {
            return function add$3067(a$3077, b$3078) {
                return a$3077 + b$3078;
            }.curry().apply(null, arguments);
        }
        function prod$3068(a$3079) {
            return function prod$3068(a$3080) {
                return a$3080 * a$3080;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$3066).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$3067(2)].map(comp$3065).ap([prod$3068]).ap([2]), [add$3067(2)].ap([prod$3068].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$3068).ap([2]), Array.of(prod$3068(2)), 'homomorphism');
            require('buster').assert.equals([prod$3068].ap([2]), [function (f$3095) {
                    return f$3095(2);
                }.curry()].ap([prod$3068]), 'interchange');
        });
    });
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        function m_prod$3100(x$3102) {
            return function m_prod$3100(x$3103) {
                return [x$3103 * x$3103];
            }.curry().apply(null, arguments);
        }
        function m_inc$3101(x$3104) {
            return function m_inc$3101(x$3105) {
                return [x$3105 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').assert.equals([
            1,
            2,
            3
        ].chain(m_prod$3100).chain(m_inc$3101), [
            1,
            2,
            3
        ].chain(function (x$3106) {
            return m_prod$3100(x$3106).chain(m_inc$3101);
        }.curry()), 'associativity');
    });
});
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var map$3108 = C$2585.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$3116 = {
                    map: function (f$3118) {
                        return f$3118(1);
                    }.curry()
                };
            require('buster').assert(map$3108(function (x$3119) {
                return x$3119 + 2;
            }.curry(), obj$3116) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$3121 = C$2585.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$3125 = {
                    ap: function (fb$3131) {
                        return this.val(fb$3131.val);
                    }.curry(),
                    val: function (x$3132) {
                        return x$3132 + 1;
                    }.curry()
                };
            var fb$3128 = { val: 2 };
            require('buster').assert(ap$3121(fa$3125, fb$3128) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$3134 = C$2585.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$3142 = {
                    chain: function (f$3144) {
                        return f$3144(1);
                    }.curry()
                };
            require('buster').assert(chain$3134(obj$3142, function (x$3145) {
                return x$3145 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});