var plus$2615 = require('../../lib/math').plus;
var minus$2616 = require('../../lib/math').minus;
var times$2617 = require('../../lib/math').times;
var div$2618 = require('../../lib/math').div;
;
require('buster').spec.describe('Math', function () {
    require('buster').spec.describe('plus', function () {
        ;
        require('buster').spec.it('performs addition', function () {
            ;
            require('buster').assert(plus$2615(4, 2) == 6, 'addition');
        });
    });
    require('buster').spec.describe('minus', function () {
        ;
        require('buster').spec.it('performs subtraction', function () {
            ;
            require('buster').assert(minus$2616(4, 2) == 2, 'subtraction');
        });
    });
    require('buster').spec.describe('times', function () {
        ;
        require('buster').spec.it('performs multiplication', function () {
            ;
            require('buster').assert(times$2617(4, 2) == 8, 'multiplication');
        });
    });
    require('buster').spec.describe('div', function () {
        ;
        require('buster').spec.it('performs division', function () {
            ;
            require('buster').assert(div$2618(4, 2) == 2, 'division');
        });
    });
});