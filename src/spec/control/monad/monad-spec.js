var chain$2615 = require('../../../lib/control/monad').chain;
;
require('buster').spec.describe('Control.Monad', function () {
    require('buster').spec.describe('chain', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2624 = {
                    chain: function (f$2626) {
                        return f$2626(1);
                    }.curry()
                };
            require('buster').assert(chain$2615(obj$2624, function (x$2627) {
                return x$2627 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});