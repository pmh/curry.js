(function () {
    'use strict';
    var instance$2511 = require('../../../core').instance;
    var Base$2513 = require('../../../adt-derivers').Base;
    var Monoid$2518 = require('../../../control/monoid').Monoid;
    var Max$2519 = function () {
            function Max$2526(_0$2528) {
                if (!(this instanceof Max$2526)) {
                    return new Max$2526(_0$2528);
                }
                if (typeof _0$2528 === 'number' || Object.prototype.toString.call(_0$2528) === '[object Number]') {
                    this['0'] = _0$2528;
                } else {
                    throw new TypeError('Unexpected type for field: Max.0');
                }
            }
            Max$2526.prototype.length = 1;
            var derived$2527 = Base$2513.derive({
                    name: 'Max',
                    constructor: Max$2526,
                    prototype: Max$2526.prototype,
                    variants: [{
                            name: 'Max',
                            constructor: Max$2526,
                            prototype: Max$2526.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2527.constructor;
        }();
    instance$2511(Monoid$2518, Max$2519, {
        empty: function (self$2535) {
            return Max$2519(-Infinity);
        }.curry(),
        concat: function (a$2536, b$2537) {
            return function (a0$2538, a1$2539) {
                var r0$2540 = Max$2519.unapply(a0$2538);
                if (r0$2540 != null && r0$2540.length === 1) {
                    var r1$2541 = Max$2519.unapply(a1$2539);
                    if (r1$2541 != null && r1$2541.length === 1) {
                        var x$2542 = r0$2540[0];
                        var y$2543 = r1$2541[0];
                        return Max$2519(x$2542 > y$2543 ? x$2542 : y$2543);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2536, b$2537);
        }.curry()
    });
    function getMax$2525(x$2544) {
        return function getMax$2525(x$2545) {
            return function (a0$2546) {
                var r0$2547 = Max$2519.unapply(a0$2546);
                if (r0$2547 != null && r0$2547.length === 1) {
                    var x$2548 = r0$2547[0];
                    return x$2548;
                }
                throw new TypeError('No match');
            }.call(this, x$2545);
        }.curry().apply(null, arguments);
    }
    module.exports = {
        Max: Max$2519,
        getMax: getMax$2525
    };
}());
//# sourceMappingURL=index.js.map