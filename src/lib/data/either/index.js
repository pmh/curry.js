(function () {
    'use strict';
    var instance$2511 = require('../../core').instance;
    var Base$2513 = require('../../adt-derivers.js').Base;
    var Monad$2515 = require('../../control/monad').Monad;
    var Monoid$2520 = require('../../control/monoid').Monoid;
    var Either$2521 = function () {
            function Either$2524() {
            }
            function Left$2525(l$2528) {
                if (!(this instanceof Left$2525)) {
                    return new Left$2525(l$2528);
                }
                this.l = l$2528;
            }
            Left$2525.prototype = new Either$2524();
            Left$2525.prototype.constructor = Left$2525;
            function Right$2526(r$2529) {
                if (!(this instanceof Right$2526)) {
                    return new Right$2526(r$2529);
                }
                this.r = r$2529;
            }
            Right$2526.prototype = new Either$2524();
            Right$2526.prototype.constructor = Right$2526;
            var derived$2527 = Base$2513.derive({
                    name: 'Either',
                    constructor: Either$2524,
                    prototype: Either$2524.prototype,
                    variants: [
                        {
                            name: 'Left',
                            constructor: Left$2525,
                            prototype: Left$2525.prototype,
                            fields: ['l']
                        },
                        {
                            name: 'Right',
                            constructor: Right$2526,
                            prototype: Right$2526.prototype,
                            fields: ['r']
                        }
                    ]
                });
            Either$2524.Left = derived$2527.variants[0].constructor;
            Either$2524.Right = derived$2527.variants[1].constructor;
            return Either$2524;
        }();
    var Left$2522 = Either$2521.Left;
    var Right$2523 = Either$2521.Right;
    instance$2511(Monad$2515, Either$2521, {
        of: function (self$2536, x$2537) {
            return Right$2523(x$2537);
        }.curry(),
        chain: function (self$2538, f$2539) {
            return function (a0$2540, a1$2541) {
                var r0$2542 = Right$2523.unapply(a0$2540);
                if (r0$2542 != null && (r0$2542.length === 1 && (typeof a1$2541 === 'function' || Object.prototype.toString.call(a1$2541) === '[object Function]'))) {
                    var x$2544 = r0$2542[0];
                    return f$2539(x$2544);
                }
                var r1$2543 = Left$2522.unapply(a0$2540);
                if (r1$2543 != null && r1$2543.length === 1) {
                    var x$2544 = r1$2543[0];
                    return self$2538;
                }
                throw new TypeError('No match');
            }.call(this, self$2538, f$2539);
        }.curry()
    });
    instance$2511(Monoid$2520, Either$2521, {
        empty: function (self$2551) {
            return Left$2522();
        }.curry(),
        concat: function (a$2552, b$2553) {
            return function (a0$2554, a1$2555) {
                if (Either$2521.hasInstance ? Either$2521.hasInstance(a0$2554) : a0$2554 instanceof Either$2521) {
                    var r0$2558 = Left$2522.unapply(a1$2555);
                    if (r0$2558 != null && r0$2558.length === 1) {
                        var x$2559 = r0$2558[0];
                        return a$2552;
                    }
                }
                var r1$2556 = Left$2522.unapply(a0$2554);
                if (r1$2556 != null && (r1$2556.length === 1 && (Either$2521.hasInstance ? Either$2521.hasInstance(a1$2555) : a1$2555 instanceof Either$2521))) {
                    var x$2559 = r1$2556[0];
                    return b$2553;
                }
                var r2$2557 = Right$2523.unapply(a0$2554);
                if (r2$2557 != null && r2$2557.length === 1) {
                    var r3$2560 = Right$2523.unapply(a1$2555);
                    if (r3$2560 != null && r3$2560.length === 1) {
                        var r1$2561 = r2$2557[0];
                        var r2$2562 = r3$2560[0];
                        return Right$2523(r1$2561.concat(r2$2562));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2552, b$2553);
        }.curry()
    });
    module.exports = {
        Either: Either$2521,
        Left: Left$2522,
        Right: Right$2523
    };
}());
//# sourceMappingURL=index.js.map