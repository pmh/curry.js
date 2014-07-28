var id$2615 = require('../../../lib/data/function').id;
;
var map$2617 = require('../../../lib/control/functor').map;
;
var Either$2619 = require('../../../lib/data/either').Either;
var Left$2620 = require('../../../lib/data/either').Left;
var Right$2621 = require('../../../lib/data/either').Right;
;
require('buster').spec.describe('Data.Either', function () {
    require('buster').spec.describe('map', function () {
        function inc$2630(x$2632) {
            return function inc$2630(x$2633) {
                return x$2633 + 1;
            }.curry().apply(null, arguments);
        }
        function square$2631(x$2634) {
            return function square$2631(x$2635) {
                return x$2635 * x$2635;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the functor laws', function () {
            ;
            require('buster').assert.equals(map$2617(id$2615, Right$2621(2)), Right$2621(2), 'map identity');
            require('buster').assert.equals(map$2617(id$2615, Left$2620(2)), id$2615(Left$2620(2)), 'map identity');
            require('buster').assert.equals(map$2617(function (x$2641) {
                return inc$2630(square$2631(x$2641));
            }, Right$2621(2)), function (x$2642) {
                return map$2617(inc$2630)(map$2617(square$2631)(x$2642));
            }(Right$2621(2)), 'composition');
        });
    });
    require('buster').spec.describe('ap', function () {
        function comp$2649(f$2652) {
            return function comp$2649(f$2653) {
                return function (g$2654) {
                    return function (x$2655) {
                        return f$2653(g$2654(x$2655));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function add$2650(a$2656, b$2657) {
            return function add$2650(a$2658, b$2659) {
                return a$2658 + b$2659;
            }.curry().apply(null, arguments);
        }
        function prod$2651(a$2660) {
            return function prod$2651(a$2661) {
                return a$2661 * a$2661;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the applicative laws', function () {
            ;
            require('buster').assert.equals(Either$2619.of(id$2615).ap(Right$2621(2)), Right$2621(2), 'identity');
            require('buster').assert.equals(Right$2621(add$2650(2)).map(function (x$2677) {
                return comp$2649(x$2677);
            }.curry()).ap(Right$2621(prod$2651)).ap(Right$2621(2)), Right$2621(add$2650(2)).ap(Right$2621(prod$2651).ap(Right$2621(2))), 'composition');
            require('buster').assert.equals(Either$2619.of(prod$2651).ap(Right$2621(2)), Either$2619.of(prod$2651(2)), 'homomorphism');
            require('buster').assert.equals(Right$2621(prod$2651).ap(Right$2621(2)), Right$2621(function (f$2678) {
                return f$2678(2);
            }.curry()).ap(Right$2621(prod$2651)), 'interchange');
        });
    });
    require('buster').spec.describe('concat', function () {
        ;
        require('buster').spec.it('returns it\'s first argument when the second argument is Left', function () {
            ;
            require('buster').assert.equals(Right$2621(1).concat(Left$2620(2)), Right$2621(1), 'concat');
        });
        require('buster').spec.it('returns it\'s second argument when the first argument is Left', function () {
            ;
            require('buster').assert.equals(Left$2620(2).concat(Right$2621(1)), Right$2621(1), 'concat');
        });
        require('buster').spec.it('concatenates the wrapped values and wraps them back up when both are Right', function () {
            ;
            require('buster').assert.equals(Right$2621([1]).concat(Right$2621([2])), Right$2621([
                1,
                2
            ]), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Right$2621([1]).concat(Right$2621([2])).concat(Right$2621([3])), Right$2621([1]).concat(Right$2621([2]).concat(Right$2621([3]))), 'associativity');
            require('buster').assert.equals(Right$2621([1]).concat(Right$2621([1]).empty()), Right$2621([1]), 'right identity');
            require('buster').assert.equals(Right$2621([1]).empty().concat(Right$2621([1])), Right$2621([1]), 'left identity');
        });
    });
    require('buster').spec.describe('chain', function () {
        function m_prod$2692(x$2694) {
            return function m_prod$2692(x$2695) {
                return Right$2621(x$2695 * x$2695);
            }.curry().apply(null, arguments);
        }
        function m_inc$2693(x$2696) {
            return function m_inc$2693(x$2697) {
                return Right$2621(x$2697 + 1);
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the monad laws', function () {
            ;
            require('buster').assert.equals(Right$2621(2).chain(m_prod$2692).chain(m_inc$2693), Right$2621(2).chain(function (x$2700) {
                return m_prod$2692(x$2700).chain(m_inc$2693);
            }.curry()), 'associativity');
        });
    });
});