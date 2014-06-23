var buster$2069 = require('buster'), expect$2070 = buster$2069.expect;
buster$2069.spec.expose();
var C$2071 = require('../lib/curry'), Core$2072 = C$2071.Core;
describe('Curry.Core', function () {
    describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        it('returns a new function that can be partially applied', function () {
            var addMany$2078 = Core$2072.curry(function (a$2079, b$2080, c$2081, d$2082) {
                    return a$2079 + b$2080 + c$2081 + d$2082;
                });
            expect$2070(addMany$2078(1)(2)(3)(4)).toEqual(10);
            expect$2070(addMany$2078(1, 2)(3, 4)).toEqual(10);
            expect$2070(addMany$2078(1, 2, 3, 4)).toEqual(10);
        });
        it('returns a new function that can be partially applied with argument holes', function () {
            var mod$2084 = Core$2072.curry(function (a$2086, b$2087) {
                    return a$2086 % b$2087;
                });
            var mod2$2085 = mod$2084(Core$2072.__, 2);
            expect$2070(mod2$2085(2)).toEqual(0);
            expect$2070(mod2$2085(3)).toEqual(1);
        });
    });
});