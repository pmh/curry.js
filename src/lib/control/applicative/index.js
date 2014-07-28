(function () {
    'use strict';
    var Protocol$2511 = require('../../core').Protocol;
    var Applicative$2513 = Protocol$2511('Applicative', { prototype: { ap: Protocol$2511.required } });
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    function ap$2515(f$2516, xs$2517) {
        return function ap$2515(f$2518, xs$2519) {
            return f$2518.ap(xs$2519);
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        Applicative: Applicative$2513,
        ap: ap$2515
    };
}());
//# sourceMappingURL=index.js.map