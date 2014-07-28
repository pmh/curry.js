var ap$2615 = require('../../../lib/control/applicative').ap;
;
require('buster').spec.describe('Control.Applicative', function () {
    require('buster').spec.describe('ap', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var fa$2620 = {
                    ap: function (fb$2626) {
                        return this.val(fb$2626.val);
                    }.curry(),
                    val: function (x$2627) {
                        return x$2627 + 1;
                    }.curry()
                };
            var fb$2623 = { val: 2 };
            require('buster').assert(ap$2615(fa$2620, fb$2623) === 3, 'apply over functor');
        });
    });
});