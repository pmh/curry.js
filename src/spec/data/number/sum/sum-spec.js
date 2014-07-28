var Sum$2615 = require('../../../../lib/data/number/sum').Sum;
var getSum$2616 = require('../../../../lib/data/number/sum').getSum;
;
require('buster').spec.describe('Data.Number.Sum', function () {
    require('buster').spec.describe('empty', function () {
        ;
        require('buster').spec.it('returns Sum(0)', function () {
            ;
            require('buster').assert.equals(Sum$2615.empty(), Sum$2615(0), 'empty');
        });
    });
    require('buster').spec.describe('getSum', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getSum$2616(Sum$2615(2)) == 2, 'getSum');
        });
    });
    require('buster').spec.describe('concat', function () {
        ;
        require('buster').spec.it('returns a Sum containing the sum of the values', function () {
            ;
            require('buster').assert.equals(Sum$2615(2).concat(Sum$2615(4)), Sum$2615(6), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Sum$2615(1).concat(Sum$2615(2)).concat(Sum$2615(3)), Sum$2615(1).concat(Sum$2615(2).concat(Sum$2615(3))), 'associativity');
            require('buster').assert.equals(Sum$2615(1).concat(Sum$2615.empty()), Sum$2615(1), 'right identity');
            require('buster').assert.equals(Sum$2615.empty().concat(Sum$2615(1)), Sum$2615(1), 'left identity');
        });
    });
});