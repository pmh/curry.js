var concat$2615 = require('../../../lib/control/monoid').concat;
;
require('buster').spec.describe('Control.Monoid', function () {
    require('buster').spec.describe('concat', function () {
        ;
        require('buster').spec.it('should delegate to the monoid instance', function () {
            var obj$2621 = {
                    concat: function (x$2623) {
                        return x$2623 + 2;
                    }.curry()
                };
            require('buster').assert(concat$2615(obj$2621, 3) === 5, 'concat monoid values');
        });
    });
});