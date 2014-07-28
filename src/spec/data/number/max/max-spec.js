var Max$2615 = require('../../../../lib/data/number/max').Max;
var getMax$2616 = require('../../../../lib/data/number/max').getMax;
;
require('buster').spec.describe('Data.Number.Max', function () {
    require('buster').spec.describe('empty', function () {
        ;
        require('buster').spec.it('returns Max(-Infinity)', function () {
            ;
            require('buster').assert.equals(Max$2615.empty(), Max$2615(-Infinity), 'empty');
        });
    });
    require('buster').spec.describe('getMax', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getMax$2616(Max$2615(2)) == 2, 'getMax');
        });
    });
    require('buster').spec.describe('concat', function () {
        ;
        require('buster').spec.it('returns a Max containing the largest value', function () {
            ;
            require('buster').assert.equals(Max$2615(2).concat(Max$2615(4)), Max$2615(4), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Max$2615(1).concat(Max$2615(2)).concat(Max$2615(3)), Max$2615(1).concat(Max$2615(2).concat(Max$2615(3))), 'associativity');
            require('buster').assert.equals(Max$2615(1).concat(Max$2615.empty()), Max$2615(1), 'right identity');
            require('buster').assert.equals(Max$2615.empty().concat(Max$2615(1)), Max$2615(1), 'left identity');
        });
    });
});