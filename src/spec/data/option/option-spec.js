var id$2615 = require('../../../lib/data/function').id;
;
var map$2617 = require('../../../lib/control/functor').map;
;
var Option$2619 = require('../../../lib/data/option').Option;
var Some$2620 = require('../../../lib/data/option').Some;
var None$2621 = require('../../../lib/data/option').None;
var maybe$2622 = require('../../../lib/data/option').maybe;
var fromOption$2623 = require('../../../lib/data/option').fromOption;
;
require('buster').spec.describe('Data.Option', function () {
    require('buster').spec.describe('map', function () {
        function inc$2634(x$2636) {
            return function inc$2634(x$2637) {
                return x$2637 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2635(x$2638) {
            return function square$2635(x$2639) {
                return x$2639 * x$2639;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the functor laws', function () {
            ;
            require('buster').assert.equals(map$2617(id$2615, Some$2620(2)), Some$2620(2), 'identity');
            require('buster').assert.equals(map$2617(id$2615, None$2621), id$2615(None$2621), 'identity');
            require('buster').assert.equals(map$2617(function (x$2645) {
                return inc$2634(square$2635(x$2645));
            }, Some$2620(2)), function (x$2646) {
                return map$2617(inc$2634)(map$2617(square$2635)(x$2646));
            }(Some$2620(2)), 'composition');
        });
    });
    require('buster').spec.describe('ap', function () {
        function comp$2653(f$2656) {
            return function comp$2653(f$2657) {
                return function (g$2658) {
                    return function (x$2659) {
                        return f$2657(g$2658(x$2659));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function add$2654(a$2660, b$2661) {
            return function add$2654(a$2662, b$2663) {
                return a$2662 + b$2663;
            }.curry().apply(null, arguments);
        }
        function prod$2655(a$2664) {
            return function prod$2655(a$2665) {
                return a$2665 * a$2665;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the applicative laws', function () {
            ;
            require('buster').assert.equals(Option$2619.of(id$2615).ap(Some$2620(2)), Some$2620(2), 'identity');
            require('buster').assert.equals(Some$2620(add$2654(2)).map(function (x$2681) {
                return comp$2653(x$2681);
            }.curry()).ap(Some$2620(prod$2655)).ap(Some$2620(2)), Some$2620(add$2654(2)).ap(Some$2620(prod$2655).ap(Some$2620(2))), 'composition');
            require('buster').assert.equals(Option$2619.of(prod$2655).ap(Some$2620(2)), Option$2619.of(prod$2655(2)), 'homomorphism');
            require('buster').assert.equals(Some$2620(prod$2655).ap(Some$2620(2)), Some$2620(function (f$2682) {
                return f$2682(2);
            }.curry()).ap(Some$2620(prod$2655)), 'interchange');
        });
    });
    require('buster').spec.describe('concat', function () {
        ;
        require('buster').spec.it('returns it\'s first argument when the second argument is None', function () {
            ;
            require('buster').assert.equals(Some$2620(1).concat(None$2621), Some$2620(1), 'concat');
        });
        require('buster').spec.it('returns it\'s second argument when the first argument is None', function () {
            ;
            require('buster').assert.equals(None$2621.concat(Some$2620(1)), Some$2620(1), 'concat');
        });
        require('buster').spec.it('concatenates the wrapped values and wraps them back up when both are Some', function () {
            ;
            require('buster').assert.equals(Some$2620([1]).concat(Some$2620([2])), Some$2620([
                1,
                2
            ]), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Some$2620([1]).concat(Some$2620([2])).concat(Some$2620([3])), Some$2620([1]).concat(Some$2620([2]).concat(Some$2620([3]))), 'associativity');
            require('buster').assert.equals(Some$2620([1]).concat(Option$2619.empty()), Some$2620([1]), 'right identity');
            require('buster').assert.equals(Option$2619.empty().concat(Some$2620([1])), Some$2620([1]), 'left identity');
        });
    });
    require('buster').spec.describe('chain', function () {
        function m_prod$2696(x$2698) {
            return function m_prod$2696(x$2699) {
                return Some$2620(x$2699 * x$2699);
            }.curry().apply(null, arguments);
        }
        function m_inc$2697(x$2700) {
            return function m_inc$2697(x$2701) {
                return Some$2620(x$2701 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the monad laws', function () {
            ;
            require('buster').assert.equals(Some$2620(2).chain(m_prod$2696).chain(m_inc$2697), Some$2620(2).chain(function (x$2704) {
                return m_prod$2696(x$2704).chain(m_inc$2697);
            }.curry()), 'associativity');
        });
    });
    require('buster').spec.describe('maybe', function () {
        ;
        require('buster').spec.it('returns the default value if the option value is None', function () {
            ;
            require('buster').assert.equals(maybe$2622('Nothing', function (x$2709) {
                return x$2709 + '!!';
            }.curry(), None$2621), 'Nothing', 'maybe');
        });
        require('buster').spec.it('returns the result of applying to the value inside the Some if the option value is Some', function () {
            ;
            require('buster').assert.equals(maybe$2622('Nothing', function (x$2712) {
                return x$2712 + '!!';
            }.curry(), Some$2620('foo')), 'foo!!', 'maybe');
        });
    });
    require('buster').spec.describe('fromOption', function () {
        ;
        require('buster').spec.it('returns the default value if the option value is None', function () {
            ;
            require('buster').assert.equals(fromOption$2623('Nothing', None$2621), 'Nothing', 'fromOption');
        });
        require('buster').spec.it('returns the value inside the Some if the option value is Some', function () {
            ;
            require('buster').assert.equals(fromOption$2623('Nothing', Some$2620('foo')), 'foo', 'fromOption');
        });
    });
});