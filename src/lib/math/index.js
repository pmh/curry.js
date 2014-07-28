(function () {
    'use strict';
    require('../core');
    // plus :: Number a => a -> a -> a
    function plus$2514(a$2518, b$2519) {
        return function plus$2514(a$2520, b$2521) {
            return a$2520 + b$2521;
        }.curry().apply(null, arguments);
    }
    // minus :: Number a => a -> a -> a
    function minus$2515(a$2522, b$2523) {
        return function minus$2515(a$2524, b$2525) {
            return a$2524 - b$2525;
        }.curry().apply(null, arguments);
    }
    // times :: Number a => a -> a -> a
    function times$2516(a$2526, b$2527) {
        return function times$2516(a$2528, b$2529) {
            return a$2528 * b$2529;
        }.curry().apply(null, arguments);
    }
    // div :: Number a => a -> a -> a
    function div$2517(a$2530, b$2531) {
        return function div$2517(a$2532, b$2533) {
            return a$2532 / b$2533;
        }.curry().apply(null, arguments);
    }
    module.exports = {
        plus: plus$2514,
        minus: minus$2515,
        times: times$2516,
        div: div$2517
    };
}());
//# sourceMappingURL=index.js.map