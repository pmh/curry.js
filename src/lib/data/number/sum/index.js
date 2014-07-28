(function () {
    'use strict';
    var instance$2511 = require('../../../core').instance;
    var Base$2513 = require('../../../adt-derivers').Base;
    var Monoid$2518 = require('../../../control/monoid').Monoid;
    var Sum$2519 = function () {
            function Sum$2526(_0$2528) {
                if (!(this instanceof Sum$2526)) {
                    return new Sum$2526(_0$2528);
                }
                if (typeof _0$2528 === 'number' || Object.prototype.toString.call(_0$2528) === '[object Number]') {
                    this['0'] = _0$2528;
                } else {
                    throw new TypeError('Unexpected type for field: Sum.0');
                }
            }
            Sum$2526.prototype.length = 1;
            var derived$2527 = Base$2513.derive({
                    name: 'Sum',
                    constructor: Sum$2526,
                    prototype: Sum$2526.prototype,
                    variants: [{
                            name: 'Sum',
                            constructor: Sum$2526,
                            prototype: Sum$2526.prototype,
                            fields: ['0']
                        }]
                });
            return derived$2527.constructor;
        }();
    instance$2511(Monoid$2518, Sum$2519, {
        empty: function () {
            return Sum$2519(0);
        }.curry(),
        concat: function (a$2536, b$2537) {
            return function (a0$2538, a1$2539) {
                var r0$2540 = Sum$2519.unapply(a0$2538);
                if (r0$2540 != null && r0$2540.length === 1) {
                    var r1$2541 = Sum$2519.unapply(a1$2539);
                    if (r1$2541 != null && r1$2541.length === 1) {
                        var x$2542 = r0$2540[0];
                        var y$2543 = r1$2541[0];
                        return Sum$2519(x$2542 + y$2543);
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2536, b$2537);
        }.curry()
    });
    function getSum$2525(x$2544) {
        return function getSum$2525(x$2545) {
            return function (a0$2546) {
                var r0$2547 = Sum$2519.unapply(a0$2546);
                if (r0$2547 != null && r0$2547.length === 1) {
                    var x$2548 = r0$2547[0];
                    return x$2548;
                }
                throw new TypeError('No match');
            }.call(this, x$2545);
        }.curry().apply(null, arguments);
    }
    module.exports = {
        Sum: Sum$2519,
        getSum: getSum$2525
    };
}());
//# sourceMappingURL=index.js.map