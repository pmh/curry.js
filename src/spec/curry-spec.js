var buster$2075 = require('buster'), expect$2076 = buster$2075.expect;
buster$2075.spec.expose();
var C$2077 = require('../lib/curry'), Core$2078 = C$2077.Core;
describe('Curry.Core', function () {
    describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        it('returns a new function that can be partially applied', function () {
            var addMany$2086 = Core$2078.curry(function (a$2087, b$2088, c$2089, d$2090) {
                    return a$2087 + b$2088 + c$2089 + d$2090;
                });
            expect$2076(addMany$2086(1)(2)(3)(4)).toEqual(10);
            expect$2076(addMany$2086(1, 2)(3, 4)).toEqual(10);
            expect$2076(addMany$2086(1, 2, 3, 4)).toEqual(10);
        });
        it('returns a new function that can be partially applied with argument holes', function () {
            var mod$2092 = Core$2078.curry(function (a$2094, b$2095) {
                    return a$2094 % b$2095;
                });
            var mod2$2093 = mod$2092(Core$2078.__, 2);
            expect$2076(mod2$2093(2)).toEqual(0);
            expect$2076(mod2$2093(3)).toEqual(1);
        });
        it('is added to the Function prototype', function () {
            var add$2097 = function (a$2098, b$2099) {
                    return a$2098 + b$2099;
                }.curry();
            expect$2076(add$2097(2)(4)).toEqual(6);
        });
    });
    describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        it('returns the composition of multiple functions', function () {
            var split$2105 = Core$2078.curry(function (sep$2109, s$2110) {
                    return s$2110.split(sep$2109);
                }), map$2106 = Core$2078.curry(function (f$2111, xs$2112) {
                    return xs$2112.map(f$2111);
                }), upcase$2107 = Core$2078.curry(function (s$2113) {
                    return s$2113.toUpperCase();
                }), join$2108 = Core$2078.curry(function (sep$2114, xs$2115) {
                    return xs$2115.join(sep$2114);
                });
            expect$2076(Core$2078.compose(join$2108('-'), map$2106(upcase$2107), split$2105(' '))('foo bar baz')).toEqual('FOO-BAR-BAZ');
        });
    });
});