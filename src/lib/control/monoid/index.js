(function () {
    'use strict';
    var Protocol$2511 = require('../../core').Protocol;
    var Monoid$2513 = Protocol$2511('Monoid', {
            constructor: {
                empty: function () {
                    return this.prototype.empty();
                }.curry()
            },
            prototype: {
                empty: Protocol$2511.required,
                concat: Protocol$2511.required
            }
        });
    // concat :: (Monoid a) => a -> a -> a
    function concat$2515(a$2518, b$2519) {
        return function concat$2515(a$2520, b$2521) {
            return a$2520.concat(b$2521);
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        Monoid: Monoid$2513,
        concat: concat$2515
    };
}());
//# sourceMappingURL=index.js.map