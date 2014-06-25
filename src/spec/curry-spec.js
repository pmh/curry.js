var buster$2088 = require('buster'), expect$2089 = buster$2088.expect;
buster$2088.spec.expose();
var C$2090 = require('../lib/curry'), Core$2091 = C$2090.Core;
describe('Curry.Core', function () {
    describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        it('returns a new function that can be partially applied', function () {
            var addMany$2099 = Core$2091.curry(function (a$2100, b$2101, c$2102, d$2103) {
                    return a$2100 + b$2101 + c$2102 + d$2103;
                });
            expect$2089(addMany$2099(1)(2)(3)(4)).toEqual(10);
            expect$2089(addMany$2099(1, 2)(3, 4)).toEqual(10);
            expect$2089(addMany$2099(1, 2, 3, 4)).toEqual(10);
        });
        it('returns a new function that can be partially applied with argument holes', function () {
            var mod$2105 = Core$2091.curry(function (a$2107, b$2108) {
                    return a$2107 % b$2108;
                });
            var mod2$2106 = mod$2105(Core$2091.__, 2);
            expect$2089(mod2$2106(2)).toEqual(0);
            expect$2089(mod2$2106(3)).toEqual(1);
        });
        it('is added to the Function prototype', function () {
            var add$2110 = function (a$2111, b$2112) {
                    return a$2111 + b$2112;
                }.curry();
            expect$2089(add$2110(2)(4)).toEqual(6);
        });
    });
    describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        it('returns the composition of multiple functions', function () {
            var split$2118 = Core$2091.curry(function (sep$2122, s$2123) {
                    return s$2123.split(sep$2122);
                }), map$2119 = Core$2091.curry(function (f$2124, xs$2125) {
                    return xs$2125.map(f$2124);
                }), upcase$2120 = Core$2091.curry(function (s$2126) {
                    return s$2126.toUpperCase();
                }), join$2121 = Core$2091.curry(function (sep$2127, xs$2128) {
                    return xs$2128.join(sep$2127);
                });
            expect$2089(Core$2091.compose(join$2121('-'), map$2119(upcase$2120), split$2118(' '))('foo bar baz')).toEqual('FOO-BAR-BAZ');
        });
    });
});
//# sourceMappingURL=curry-spec.js.map