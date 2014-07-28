var map$2615 = require('../../../lib/control/functor').map;
;
require('buster').spec.describe('Control.Functor', function () {
    require('buster').spec.describe('map', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2624 = {
                    map: function (f$2626) {
                        return f$2626(1);
                    }.curry()
                };
            require('buster').assert(map$2615(function (x$2627) {
                return x$2627 + 2;
            }.curry(), obj$2624) === 3, 'map over functor');
        });
    });
});