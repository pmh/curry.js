var buster$2170 = require('buster'), expect$2171 = buster$2170.expect;
buster$2170.spec.expose();
var C$2172 = require('../lib/curry'), Core$2173 = C$2172.Core;
require('buster').spec.describe('Curry.Core', function () {
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2179 = Core$2173.curry(function (a$2185, b$2186, c$2187, d$2188) {
                    return a$2185 + b$2186 + c$2187 + d$2188;
                }), nums$2180 = Core$2173.curry(function (a$2189, b$2190) {
                    return [
                        a$2189,
                        b$2190
                    ];
                });
            require('buster').assert(addMany$2179(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2179(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2179(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2180(Core$2173.__, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2191 = function (a$2193, b$2194) {
                    return a$2193 + b$2194;
                }.curry();
            require('buster').assert(add$2191(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2196 = Core$2173.curry(function (sep$2201, s$2202) {
                    return s$2202.split(sep$2201);
                }), map$2197 = Core$2173.curry(function (f$2203, xs$2204) {
                    return xs$2204.map(f$2203);
                }), upcase$2198 = Core$2173.curry(function (s$2205) {
                    return s$2205.toUpperCase();
                }), join$2199 = Core$2173.curry(function (sep$2206, xs$2207) {
                    return xs$2207.join(sep$2206);
                });
            require('buster').assert(Core$2173.compose(join$2199('-'), map$2197(upcase$2198), split$2196(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});