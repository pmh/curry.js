var Product$2615 = require('../../../../lib/data/number/product').Product;
var getProduct$2616 = require('../../../../lib/data/number/product').getProduct;
;
require('buster').spec.describe('Data.Number.Product', function () {
    require('buster').spec.describe('empty', function () {
        ;
        require('buster').spec.it('returns Product(1)', function () {
            ;
            require('buster').assert.equals(Product$2615.empty(), Product$2615(1), 'empty');
        });
    });
    require('buster').spec.describe('getProduct', function () {
        ;
        require('buster').spec.it('returns the wrapped number', function () {
            ;
            require('buster').assert(getProduct$2616(Product$2615(2)) == 2, 'getProduct');
        });
    });
    require('buster').spec.describe('concat', function () {
        ;
        require('buster').spec.it('returns a Product containing the product of the values', function () {
            ;
            require('buster').assert.equals(Product$2615(2).concat(Product$2615(4)), Product$2615(8), 'concat');
        });
        require('buster').spec.it('satisfies the monoid laws', function () {
            ;
            require('buster').assert.equals(Product$2615(1).concat(Product$2615(2)).concat(Product$2615(3)), Product$2615(1).concat(Product$2615(2).concat(Product$2615(3))), 'associativity');
            require('buster').assert.equals(Product$2615(1).concat(Product$2615.empty()), Product$2615(1), 'right identity');
            require('buster').assert.equals(Product$2615.empty().concat(Product$2615(1)), Product$2615(1), 'left identity');
        });
    });
});