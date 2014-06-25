var buster$2079 = require('buster'), expect$2080 = buster$2079.expect;
buster$2079.spec.expose();
var C$2081 = require('../lib/curry'), Core$2082 = C$2081.Core;
describe('Curry.Core', function () {
    describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        it('returns a new function that can be partially applied', function () {
            var addMany$2090 = Core$2082.curry(function (a$2091, b$2092, c$2093, d$2094) {
                    return a$2091 + b$2092 + c$2093 + d$2094;
                });
            expect$2080(addMany$2090(1)(2)(3)(4)).toEqual(10);
            expect$2080(addMany$2090(1, 2)(3, 4)).toEqual(10);
            expect$2080(addMany$2090(1, 2, 3, 4)).toEqual(10);
        });
        it('returns a new function that can be partially applied with argument holes', function () {
            var mod$2096 = Core$2082.curry(function (a$2098, b$2099) {
                    return a$2098 % b$2099;
                });
            var mod2$2097 = mod$2096(Core$2082.__, 2);
            expect$2080(mod2$2097(2)).toEqual(0);
            expect$2080(mod2$2097(3)).toEqual(1);
        });
        it('is added to the Function prototype', function () {
            var add$2101 = function (a$2102, b$2103) {
                    return a$2102 + b$2103;
                }.curry();
            expect$2080(add$2101(2)(4)).toEqual(6);
        });
    });
    describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        it('returns the composition of multiple functions', function () {
            var split$2109 = Core$2082.curry(function (sep$2113, s$2114) {
                    return s$2114.split(sep$2113);
                }), map$2110 = Core$2082.curry(function (f$2115, xs$2116) {
                    return xs$2116.map(f$2115);
                }), upcase$2111 = Core$2082.curry(function (s$2117) {
                    return s$2117.toUpperCase();
                }), join$2112 = Core$2082.curry(function (sep$2118, xs$2119) {
                    return xs$2119.join(sep$2118);
                });
            expect$2080(Core$2082.compose(join$2112('-'), map$2110(upcase$2111), split$2109(' '))('foo bar baz')).toEqual('FOO-BAR-BAZ');
        });
    });
});
//# sourceMappingURL=curry-spec.js.map