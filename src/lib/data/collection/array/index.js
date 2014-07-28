(function () {
    'use strict';
    var __$2511 = require('../../../core').__;
    var extendNative$2512 = require('../../../core').extendNative;
    var map$2514 = require('../../../control/functor').map;
    var Some$2516 = require('../../../data/option').Some;
    var None$2517 = require('../../../data/option').None;
    extendNative$2512(Array, 'of', function (self$2525, x$2526) {
        return [x$2526];
    }.curry());
    extendNative$2512(Array.prototype, 'ap', function (self$2527, x$2528) {
        return this.chain(map$2514(__$2511, x$2528).bind(this));
    }.curry());
    extendNative$2512(Array.prototype, 'chain', function (self$2529, f$2530) {
        return map$2514(f$2530, this).reduce(function (xs$2531, ys$2532) {
            return xs$2531.concat(ys$2532);
        }.curry(), []);
    }.curry());
    extendNative$2512(Array.prototype, 'head', function (self$2533) {
        return self$2533[0] ? Some$2516(self$2533[0]) : None$2517;
    }.curry());
    extendNative$2512(Array.prototype, 'tail', function (self$2534) {
        return self$2534.slice(1);
    }.curry());
}());
//# sourceMappingURL=index.js.map