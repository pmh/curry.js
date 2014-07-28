var id$2616 = require('../../../../lib/data/function').id;
require('buster').spec.describe('Data.Collection.Array', function () {
    require('buster').spec.describe('ap', function () {
        function comp$2625(f$2628) {
            return function comp$2625(f$2629) {
                return function (g$2630) {
                    return function (x$2631) {
                        return f$2629(g$2630(x$2631));
                    }.curry();
                }.curry();
            }.curry().apply(null, arguments);
        }
        function add$2626(a$2632, b$2633) {
            return function add$2626(a$2634, b$2635) {
                return a$2634 + b$2635;
            }.curry().apply(null, arguments);
        }
        function prod$2627(a$2636) {
            return function prod$2627(a$2637) {
                return a$2637 * a$2637;
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the laws', function () {
            ;
            require('buster').assert.equals(Array.of(id$2616).ap([2]), [2], 'identity');
            require('buster').assert.equals([add$2626(2)].map(function (x$2652) {
                return comp$2625(x$2652);
            }.curry()).ap([prod$2627]).ap([2]), [add$2626(2)].ap([prod$2627].ap([2])), 'composition');
            require('buster').assert.equals(Array.of(prod$2627).ap([2]), Array.of(prod$2627(2)), 'homomorphism');
            require('buster').assert.equals([prod$2627].ap([2]), [function (f$2654) {
                    return f$2654(2);
                }.curry()].ap([prod$2627]), 'interchange');
        });
    });
    require('buster').spec.describe('chain', function () {
        function m_prod$2658(x$2660) {
            return function m_prod$2658(x$2661) {
                return [x$2661 * x$2661];
            }.curry().apply(null, arguments);
        }
        function m_inc$2659(x$2662) {
            return function m_inc$2659(x$2663) {
                return [x$2663 + 1];
            }.curry().apply(null, arguments);
        }
        ;
        require('buster').spec.it('satisfies the monad laws', function () {
            ;
            require('buster').assert.equals([
                1,
                2,
                3
            ].chain(m_prod$2658).chain(m_inc$2659), [
                1,
                2,
                3
            ].chain(function (x$2666) {
                return m_prod$2658(x$2666).chain(m_inc$2659);
            }.curry()), 'associativity');
        });
    });
});