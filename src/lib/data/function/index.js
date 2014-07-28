(function () {
    'use strict';
    require('../../core');
    // id :: a -> a
    function id$2519(x$2524) {
        return function id$2519(x$2525) {
            return x$2525;
        }.curry().apply(null, arguments);
    }
    // constant :: a -> b -> a
    function constant$2520(x$2526) {
        return function constant$2520(x$2527) {
            return function (_$2528) {
                return x$2527;
            }.curry();
        }.curry().apply(null, arguments);
    }
    // unary :: Function -> (a -> b)
    function unary$2521(f$2529) {
        return function unary$2521(f$2530) {
            return function (x$2531) {
                return f$2530(x$2531);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // binary :: Function -> (a -> b -> c)
    function binary$2522(f$2532) {
        return function binary$2522(f$2533) {
            return function (x$2534, y$2535) {
                return f$2533(x$2534, y$2535);
            }.curry();
        }.curry().apply(null, arguments);
    }
    // ternary :: Function -> (a -> b -> c -> d)
    function ternary$2523(f$2536) {
        return function ternary$2523(f$2537) {
            return function (x$2538, y$2539, z$2540) {
                return f$2537(x$2538, y$2539, z$2540);
            }.curry();
        }.curry().apply(null, arguments);
    }
    module.exports = {
        id: id$2519,
        constant: constant$2520,
        unary: unary$2521,
        binary: binary$2522,
        ternary: ternary$2523
    };
}());
//# sourceMappingURL=index.js.map