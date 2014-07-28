var id$2615 = require('../../../lib/data/function').id;
var constant$2616 = require('../../../lib/data/function').constant;
var unary$2617 = require('../../../lib/data/function').unary;
var binary$2618 = require('../../../lib/data/function').binary;
var ternary$2619 = require('../../../lib/data/function').ternary;
;
require('buster').spec.describe('Data.Function', function () {
    require('buster').spec.describe('id', function () {
        ;
        require('buster').spec.it('returns it\'s argument unchanged', function () {
            ;
            require('buster').assert(id$2615(23) == 23, 'identity');
        });
    });
    require('buster').spec.describe('constant', function () {
        ;
        require('buster').spec.it('returns a new function that always returns the argument', function () {
            ;
            require('buster').assert(constant$2616(23)() == 23, 'constant');
        });
    });
    require('buster').spec.describe('unary', function () {
        ;
        require('buster').spec.it('it turns an n-arity function into a unary one', function () {
            ;
            require('buster').assert.equals(unary$2617(function (x$2633, y$2634) {
                return [
                    x$2633,
                    y$2634
                ];
            }.curry())(1, 2)(3), [
                1,
                3
            ], 'unary');
        });
    });
    require('buster').spec.describe('binary', function () {
        ;
        require('buster').spec.it('it turns a n-arity function into a binary one', function () {
            ;
            require('buster').assert.equals(binary$2618(function (x$2638, y$2639, z$2640) {
                return [
                    x$2638,
                    y$2639,
                    z$2640
                ];
            }.curry())(1, 2, 3)(4), [
                1,
                2,
                4
            ], 'binary');
        });
    });
    require('buster').spec.describe('ternary', function () {
        ;
        require('buster').spec.it('it turns a n-arity function into a ternary one', function () {
            ;
            require('buster').assert.equals(ternary$2619(function (x$2644, y$2645, z$2646, w$2647) {
                return [
                    x$2644,
                    y$2645,
                    z$2646,
                    w$2647
                ];
            }.curry())(1, 2, 3, 4)(5), [
                1,
                2,
                3,
                5
            ], 'ternary');
        });
    });
});