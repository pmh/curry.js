(function () {
    'use strict';
    var instance$2511 = require('../../core').instance;
    var Base$2513 = require('../../adt-derivers.js').Base;
    var Monad$2515 = require('../../control/monad').Monad;
    var Monoid$2520 = require('../../control/monoid').Monoid;
    var Option$2521 = function () {
            function Option$2536() {
            }
            function Some$2537(val$2540) {
                if (!(this instanceof Some$2537)) {
                    return new Some$2537(val$2540);
                }
                this.val = val$2540;
            }
            Some$2537.prototype = new Option$2536();
            Some$2537.prototype.constructor = Some$2537;
            function None$2538() {
            }
            None$2538.prototype = new Option$2536();
            None$2538.prototype.constructor = None$2538;
            var derived$2539 = Base$2513.derive({
                    name: 'Option',
                    constructor: Option$2536,
                    prototype: Option$2536.prototype,
                    variants: [
                        {
                            name: 'Some',
                            constructor: Some$2537,
                            prototype: Some$2537.prototype,
                            fields: ['val']
                        },
                        {
                            name: 'None',
                            constructor: None$2538,
                            prototype: None$2538.prototype
                        }
                    ]
                });
            Option$2536.Some = derived$2539.variants[0].constructor;
            Option$2536.None = new derived$2539.variants[1].constructor();
            return Option$2536;
        }();
    var Some$2522 = Option$2521.Some;
    var None$2523 = Option$2521.None;
    instance$2511(Monad$2515, Option$2521, {
        of: function (self$2547, x$2548) {
            return Some$2522(x$2548);
        }.curry(),
        chain: function (self$2549, f$2550) {
            return function (a0$2551, a1$2552) {
                var r0$2553 = Some$2522.unapply(a0$2551);
                if (r0$2553 != null && (r0$2553.length === 1 && (typeof a1$2552 === 'function' || Object.prototype.toString.call(a1$2552) === '[object Function]'))) {
                    var x$2554 = r0$2553[0];
                    return f$2550(x$2554);
                }
                if ((None$2523.hasInstance ? None$2523.hasInstance(a0$2551) : a0$2551 instanceof None$2523) && (typeof a1$2552 === 'function' || Object.prototype.toString.call(a1$2552) === '[object Function]')) {
                    return None$2523;
                }
                throw new TypeError('No match');
            }.call(this, self$2549, f$2550);
        }.curry()
    });
    instance$2511(Monoid$2520, Option$2521, {
        empty: function (self$2561) {
            return None$2523;
        }.curry(),
        concat: function (a$2562, b$2563) {
            return function (a0$2564, a1$2565) {
                if ((Option$2521.hasInstance ? Option$2521.hasInstance(a0$2564) : a0$2564 instanceof Option$2521) && (None$2523.hasInstance ? None$2523.hasInstance(a1$2565) : a1$2565 instanceof None$2523)) {
                    return a$2562;
                }
                if ((None$2523.hasInstance ? None$2523.hasInstance(a0$2564) : a0$2564 instanceof None$2523) && (Option$2521.hasInstance ? Option$2521.hasInstance(a1$2565) : a1$2565 instanceof Option$2521)) {
                    return b$2563;
                }
                var r0$2566 = Some$2522.unapply(a0$2564);
                if (r0$2566 != null && r0$2566.length === 1) {
                    var r1$2567 = Some$2522.unapply(a1$2565);
                    if (r1$2567 != null && r1$2567.length === 1) {
                        var v1$2568 = r0$2566[0];
                        var v2$2569 = r1$2567[0];
                        return Some$2522(v1$2568.concat(v2$2569));
                    }
                }
                throw new TypeError('No match');
            }.call(this, a$2562, b$2563);
        }.curry()
    });
    // maybe :: b -> (a -> b) -> Option a -> b
    function maybe$2534(n$2570, f$2571, option$2572) {
        return function maybe$2534(n$2573, f$2574, option$2575) {
            return function (a0$2576, a1$2577, a2$2578) {
                if (None$2523.hasInstance ? None$2523.hasInstance(a2$2578) : a2$2578 instanceof None$2523) {
                    var n$2580 = a0$2576;
                    return n$2580;
                }
                var r0$2579 = Some$2522.unapply(a2$2578);
                if (r0$2579 != null && r0$2579.length === 1) {
                    var f$2581 = a1$2577;
                    var x$2582 = r0$2579[0];
                    return f$2581(x$2582);
                }
                throw new TypeError('No match');
            }.call(this, n$2573, f$2574, option$2575);
        }.curry().apply(null, arguments);
    }
    // fromOption :: a -> Option a -> a
    function fromOption$2535(n$2583, o$2584) {
        return function fromOption$2535(n$2585, o$2586) {
            return function (a0$2587) {
                var r0$2588 = Some$2522.unapply(a0$2587);
                if (r0$2588 != null && r0$2588.length === 1) {
                    var x$2589 = r0$2588[0];
                    return x$2589;
                }
                if (None$2523.hasInstance ? None$2523.hasInstance(a0$2587) : a0$2587 instanceof None$2523) {
                    return n$2585;
                }
                throw new TypeError('No match');
            }.call(this, o$2586);
        }.curry().apply(null, arguments);
    }
    module.exports = {
        Option: Option$2521,
        Some: Some$2522,
        None: None$2523,
        maybe: maybe$2534,
        fromOption: fromOption$2535
    };
}());
//# sourceMappingURL=index.js.map