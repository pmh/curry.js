(function () {
    'use strict';
    var Protocol$2511 = require('../../core').Protocol;
    var unary$2513 = require('../../data/function').unary;
    var Functor$2515 = Protocol$2511('Functor', { prototype: { map: Protocol$2511.required } });
    // map :: Functor f => (a -> b) -> f a -> f b
    function map$2517(f$2518, xs$2519) {
        return function map$2517(f$2520, xs$2521) {
            return xs$2521.map(unary$2513(f$2520));
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        Functor: Functor$2515,
        map: map$2517
    };
}());
//# sourceMappingURL=index.js.map