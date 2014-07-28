var __$2615 = require('../../lib/core').__;
var curry$2616 = require('../../lib/core').curry;
var compose$2617 = require('../../lib/core').compose;
var Protocol$2618 = require('../../lib/core').Protocol;
var instance$2619 = require('../../lib/core').instance;
;
require('buster').spec.describe('Core', function () {
    require('buster').spec.describe('curry', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2629 = curry$2616(function (a$2636, b$2637, c$2638, d$2639) {
                    return a$2636 + b$2637 + c$2638 + d$2639;
                });
            var nums$2631 = curry$2616(function (a$2640, b$2641) {
                    return [
                        a$2640,
                        b$2641
                    ];
                });
            ;
            require('buster').assert(addMany$2629(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2629(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2629(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2631(__$2615, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2643 = curry$2616(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2643(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2646 = function (a$2648, b$2649) {
                    return a$2648 + b$2649;
                }.curry();
            ;
            require('buster').assert(add$2646(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2652 = curry$2616(function (sep$2660, s$2661) {
                    return s$2661.split(sep$2660);
                });
            var map$2654 = curry$2616(function (f$2662, xs$2663) {
                    return xs$2663.map(f$2662);
                });
            var upcase$2656 = curry$2616(function (s$2664) {
                    return s$2664.toUpperCase();
                });
            var join$2658 = curry$2616(function (sep$2665, xs$2666) {
                    return xs$2666.join(sep$2665);
                });
            ;
            require('buster').assert(compose$2617(join$2658('-'), map$2654(upcase$2656), split$2652(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
    require('buster').spec.describe('Protocol', function () {
        ;
        require('buster').spec.it('should create a protocol with correct fields', function () {
            var specObj$2669 = { foo: 'bar' };
            var name$2671 = Protocol$2618('MyProtocol', specObj$2669).name;
            var spec$2672 = Protocol$2618('MyProtocol', specObj$2669).spec;
            var instance$2673 = Protocol$2618('MyProtocol', specObj$2669).instance;
            ;
            ;
            require('buster').assert(name$2671 == 'MyProtocol', 'name field');
            require('buster').assert(spec$2672 == specObj$2669, 'spec field');
            require('buster').assert(typeof instance$2673 == 'function', 'instance field');
        });
    });
    require('buster').spec.describe('instance', function () {
        ;
        require('buster').spec.it('should should not overwrite existing fields', function () {
            protocol = Protocol$2618('MyProtocol', {
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
            instance$2619(protocol, type, {});
            var foo$2681 = type.foo;
            ;
            var bar$2683 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2681() == 'bar1', 'existing constructor fields');
            require('buster').assert(bar$2683() == 'baz1', 'existing prototype fields');
        });
        require('buster').spec.it('should copy over default implementations', function () {
            protocol = Protocol$2618('MyProtocol', {
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
            instance$2619(protocol, type, {});
            var foo$2691 = type.foo;
            ;
            var bar$2693 = type.prototype.bar;
            ;
            ;
            require('buster').assert(foo$2691() == 'bar', 'default constructor implementations');
            require('buster').assert(bar$2693() == 'baz', 'default prototype implementations');
        });
        require('buster').spec.it('should throw an error on missing implementations', function () {
            protocol = Protocol$2618('MyProtocol', { constructor: { foo: Protocol$2618.required } });
            type = {};
            require('buster').assert.exception(function () {
                instance$2619(protocol, type, {});
            }, 'Error');
            protocol = Protocol$2618('MyProtocol', { prototype: { foo: Protocol$2618.required } });
            type = { prototype: {} };
            require('buster').assert.exception(function () {
                instance$2619(protocol, type, {});
            }, 'Error');
        });
    });
});