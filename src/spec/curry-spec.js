var buster$2075 = require('buster'), expect$2076 = buster$2075.expect;
buster$2075.spec.expose();
var C$2077 = require('../lib/curry'), Core$2078 = C$2077.Core;
describe('Curry.Core', function () {
    describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        it('returns a new function that can be partially applied', function () {
            var addMany$2085 = Core$2078.curry(function (a$2086, b$2087, c$2088, d$2089) {
                    return a$2086 + b$2087 + c$2088 + d$2089;
                });
            expect$2076(addMany$2085(1)(2)(3)(4)).toEqual(10);
            expect$2076(addMany$2085(1, 2)(3, 4)).toEqual(10);
            expect$2076(addMany$2085(1, 2, 3, 4)).toEqual(10);
        });
        it('returns a new function that can be partially applied with argument holes', function () {
            var mod$2091 = Core$2078.curry(function (a$2093, b$2094) {
                    return a$2093 % b$2094;
                });
            var mod2$2092 = mod$2091(Core$2078.__, 2);
            expect$2076(mod2$2092(2)).toEqual(0);
            expect$2076(mod2$2092(3)).toEqual(1);
        });
    });
    describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        it('returns the composition of multiple functions', function () {
            var split$2100 = Core$2078.curry(function (sep$2104, s$2105) {
                    return s$2105.split(sep$2104);
                }), map$2101 = Core$2078.curry(function (f$2106, xs$2107) {
                    return xs$2107.map(f$2106);
                }), upcase$2102 = Core$2078.curry(function (s$2108) {
                    return s$2108.toUpperCase();
                }), join$2103 = Core$2078.curry(function (sep$2109, xs$2110) {
                    return xs$2110.join(sep$2109);
                });
            expect$2076(Core$2078.compose(join$2103('-'), map$2101(upcase$2102), split$2100(' '))('foo bar baz')).toEqual('FOO-BAR-BAZ');
        });
    });
});