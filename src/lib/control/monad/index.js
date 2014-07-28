(function () {
    'use strict';
    var __$2511 = require('../../core').__;
    var Protocol$2512 = require('../../core').Protocol;
    var map$2514 = require('../../control/functor').map;
    var Monad$2516 = Protocol$2512('Monad', {
            constructor: {
                of: function (x$2522) {
                    return this.prototype.of(x$2522);
                }.curry()
            },
            prototype: {
                of: Protocol$2512.required,
                chain: Protocol$2512.required,
                map: function (self$2528, f$2529) {
                    return self$2528.chain(function (x$2530) {
                        return self$2528.of(f$2529(x$2530));
                    }.bind(this));
                }.curry(),
                ap: function (self$2531, x$2532) {
                    return self$2531.chain(map$2514(__$2511, x$2532).bind(this));
                }.curry()
            }
        });
    // chain :: Monad m => m a -> (a -> m b) -> m b
    function chain$2518(xs$2533, f$2534) {
        return function chain$2518(xs$2535, f$2536) {
            return xs$2535.chain(f$2536);
        }.curry().apply(null, arguments);
    }
    ;
    // pure :: Monad m => m -> b -> m b
    function pure$2520(m$2537, x$2538) {
        return function pure$2520(m$2539, x$2540) {
            return m$2539.of ? m$2539.of(x$2540) : m$2539.constructor.of(x$2540);
        }.curry().apply(null, arguments);
    }
    module.exports = {
        Monad: Monad$2516,
        chain: chain$2518,
        pure: pure$2520
    };
}());
//# sourceMappingURL=index.js.map