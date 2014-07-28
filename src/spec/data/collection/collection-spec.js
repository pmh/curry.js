var Option$2615 = require('../../../lib/data/option').Option;
var Some$2616 = require('../../../lib/data/option').Some;
var None$2617 = require('../../../lib/data/option').None;
;
var foldl$2619 = require('../../../lib/data/collection').foldl;
var foldl1$2620 = require('../../../lib/data/collection').foldl1;
var foldr$2621 = require('../../../lib/data/collection').foldr;
var foldr1$2622 = require('../../../lib/data/collection').foldr1;
var filter$2623 = require('../../../lib/data/collection').filter;
var head$2624 = require('../../../lib/data/collection').head;
var tail$2625 = require('../../../lib/data/collection').tail;
var flatten$2626 = require('../../../lib/data/collection').flatten;
;
require('buster').spec.describe('Data.Collection', function () {
    require('buster').spec.describe('foldl', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2619(function (acc$2639, x$2640) {
                return acc$2639.concat(x$2640);
            }.curry(), [], [
                6,
                4,
                2
            ]), [
                6,
                4,
                2
            ], 'concat');
        });
    });
    require('buster').spec.describe('foldl1', function () {
        ;
        require('buster').spec.it('should fold a list from the left using the first element as accumulator', function () {
            ;
            require('buster').assert.equals(foldl1$2620(function (acc$2644, x$2645) {
                return acc$2644.concat([x$2645]);
            }.curry(), [
                [],
                [6],
                [4],
                [2]
            ]), [
                [6],
                [4],
                [2]
            ], 'concat');
        });
    });
    require('buster').spec.describe('foldr', function () {
        ;
        require('buster').spec.it('should fold a list from the right', function () {
            ;
            require('buster').assert.equals(foldr$2621(function (acc$2649, x$2650) {
                return acc$2649.concat(x$2650);
            }.curry(), [], [
                6,
                4,
                2
            ]), [
                2,
                4,
                6
            ], 'concat');
        });
    });
    require('buster').spec.describe('foldr1', function () {
        ;
        require('buster').spec.it('should fold a list from the left using the last element as accumulator', function () {
            ;
            require('buster').assert.equals(foldr1$2622(function (acc$2654, x$2655) {
                return acc$2654.concat([x$2655]);
            }.curry(), [
                [6],
                [4],
                [2],
                []
            ]), [
                [2],
                [4],
                [6]
            ], 'concat');
        });
    });
    require('buster').spec.describe('filter', function () {
        ;
        require('buster').spec.it('filters a list according to a predicate function', function () {
            ;
            require('buster').assert.equals(filter$2623(function (x$2659) {
                return x$2659 > 3;
            }.curry(), [
                1,
                2,
                3,
                4,
                5
            ]), [
                4,
                5
            ], 'filter');
        });
    });
    require('buster').spec.describe('head', function () {
        ;
        require('buster').spec.it('returns the first element wrapped in a some for non-empty arrays', function () {
            ;
            require('buster').assert.equals(head$2624([
                1,
                2,
                3,
                4,
                5
            ]), Some$2616(1), 'head non-empty');
        });
        require('buster').spec.it('returns none for empty arrays', function () {
            ;
            require('buster').assert.equals(head$2624([]), None$2617, 'head empty');
        });
    });
    require('buster').spec.describe('tail', function () {
        ;
        require('buster').spec.it('returns a list with all but the first element for non-empty arrays', function () {
            ;
            require('buster').assert.equals(tail$2625([
                1,
                2,
                3,
                4,
                5
            ]), [
                2,
                3,
                4,
                5
            ], 'tail non-empty');
        });
        require('buster').spec.it('returns an empty list for empty arrays', function () {
            ;
            require('buster').assert.equals(tail$2625([]), [], 'tail empty');
        });
    });
    require('buster').spec.describe('flatten', function () {
        ;
        require('buster').spec.it('flattens a list of monoid values', function () {
            ;
            require('buster').assert.equals(flatten$2626([
                [
                    1,
                    2,
                    3
                ],
                [
                    4,
                    5,
                    6
                ]
            ]), [
                1,
                2,
                3,
                4,
                5,
                6
            ], 'list of lists');
            require('buster').assert.equals(flatten$2626([
                Some$2616([1]),
                Some$2616([2])
            ]), Some$2616([
                1,
                2
            ]), 'list of options');
        });
    });
});