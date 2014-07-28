var Min$2615 = require('../../../../lib/data/number/min').Min;
var getMin$2616 = require('../../../../lib/data/number/min').getMin;
;
require('buster').spec.describe('Data.Number.Min', function () {
    require('buster').spec.describe('empty', function () {
        ;
        require('buster').spec.it('returns Min(Infinity)', function () {
            ;
            require('buster').assert.equals(Min$2615.empty(), Min$2615(Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMin', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMin$2616(Min$2615(2)) == 2, 'getMin');
        });
    });
    require('buster').spec.describe('concat', function () {
        ;
        require('buster').spec.it('returns a Min containing the smallest value', function () {
            ;
            require('buster').assert.equals(Min$2615(2).concat(Min$2615(4)), Min$2615(2), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Min$2615(1).concat(Min$2615(2)).concat(Min$2615(3)), Min$2615(1).concat(Min$2615(2).concat(Min$2615(3))), 'associativity');
            require('buster').assert.equals(Min$2615(1).concat(Min$2615.empty()), Min$2615(1), 'right identity');
            require('buster').assert.equals(Min$2615.empty().concat(Min$2615(1)), Min$2615(1), 'left identity');
        });
    });
});