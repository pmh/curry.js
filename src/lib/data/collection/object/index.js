(function () {
    'use strict';
    var extendNative$2511 = require('../../../core').extendNative;
    // merge :: Object -> Object -> Object
    var merge$2512 = function (a$2518, b$2519) {
        var newObj$2520 = {}, k$2521;
        for (k$2521 in b$2519) {
            if (b$2519.hasOwnProperty(k$2521))
                newObj$2520[k$2521] = b$2519[k$2521];
        }
        for (k$2521 in a$2518) {
            if (a$2518.hasOwnProperty(k$2521))
                newObj$2520[k$2521] = a$2518[k$2521];
        }
        return newObj$2520;
    };
    // set :: Object -> String -> a
    function set$2515(o$2522, k$2523, v$2524) {
        return function set$2515(o$2525, k$2526, v$2527) {
            return function () {
                var newObj$2529 = {};
                var foo$2531 = newObj$2529[k$2526] = v$2527;
                return merge$2512(o$2525, newObj$2529);
            }();
        }.curry().apply(null, arguments);
    }
    ;
    extendNative$2511(Object.prototype, 'map', function (self$2532, f$2533) {
        return Object.keys(self$2532).reduce(function (o$2534, k$2535) {
            return set$2515(o$2534, k$2535, f$2533(self$2532[k$2535]));
        }.curry(), {});
    }.curry());
    module.exports = {
        merge: merge$2512,
        set: set$2515
    };
}());
//# sourceMappingURL=index.js.map