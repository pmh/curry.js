var merge$2615 = require('../../../../lib/data/collection/object').merge;
var set$2616 = require('../../../../lib/data/collection/object').set;
var map$2619 = require('../../../../lib/control/functor').map;
require('buster').spec.describe('Data.Collection.Object', function () {
    require('buster').spec.describe('merge', function () {
        ;
        require('buster').spec.it('merges two objects', function () {
            ;
            require('buster').assert.equals(merge$2615({ a: 'b' }, { c: 'd' }), {
                a: 'b',
                c: 'd'
            }, 'different keys');
            require('buster').assert.equals(merge$2615({ a: 'b' }, { a: 'd' }), { a: 'b' }, 'same keys');
        });
    });
    require('buster').spec.describe('set', function () {
        ;
        require('buster').spec.it('returns a new object with the new key present', function () {
            ;
            require('buster').assert.equals(set$2616({ a: 'b' }, 'c', 'd'), {
                a: 'b',
                c: 'd'
            }, 'set new key');
        });
    });
    require('buster').spec.describe('map', function () {
        ;
        require('buster').spec.it('applies a function to every value of an object', function () {
            ;
            require('buster').assert.equals(map$2619(function (x$2631) {
                return x$2631 + 1;
            }.curry(), {
                a: 1,
                b: 2,
                c: 3
            }), {
                a: 2,
                b: 3,
                c: 4
            }, 'inc');
        });
    });
});