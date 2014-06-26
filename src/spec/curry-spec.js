var buster$2247 = require('buster'), expect$2248 = buster$2247.expect;
buster$2247.spec.expose();
var C$2249 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var Core$2252 = C$2249.Core;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2258 = Core$2252.curry(function (a$2264, b$2265, c$2266, d$2267) {
                    return a$2264 + b$2265 + c$2266 + d$2267;
                }), nums$2259 = Core$2252.curry(function (a$2268, b$2269) {
                    return [
                        a$2268,
                        b$2269
                    ];
                });
            require('buster').assert(addMany$2258(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2258(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2258(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2259(Core$2252.__, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2270 = Core$2252.curry(function () {
                    return [].slice.call(arguments);
                }, 3);
            require('buster').assert.equals(curried$2270(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2272 = function (a$2274, b$2275) {
                    return a$2274 + b$2275;
                }.curry();
            require('buster').assert(add$2272(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2277 = Core$2252.curry(function (sep$2282, s$2283) {
                    return s$2283.split(sep$2282);
                }), map$2278 = Core$2252.curry(function (f$2284, xs$2285) {
                    return xs$2285.map(f$2284);
                }), upcase$2279 = Core$2252.curry(function (s$2286) {
                    return s$2286.toUpperCase();
                }), join$2280 = Core$2252.curry(function (sep$2287, xs$2288) {
                    return xs$2288.join(sep$2287);
                });
            require('buster').assert(Core$2252.compose(join$2280('-'), map$2278(upcase$2279), split$2277(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var Collection$2289 = C$2249.Data.Collection;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        require('buster').spec.it('should fold a list from the left', function () {
            require('buster').assert.equals(Collection$2289.foldl(function (acc$2298, x$2299) {
                return acc$2298.concat(x$2299);
            }.curry(), [], [
                6,
                4,
                2
            ]), [
                6,
                4,
                2
            ], 'concat');
        });
    });
    require('buster').spec.describe('foldl1 :: (a -> a -> a) -> [a] -> a', function () {
        require('buster').spec.it('should fold a list from the left using the first element as accumulator', function () {
            require('buster').assert.equals(Collection$2289.foldl1(function (acc$2304, x$2305) {
                return acc$2304.concat([x$2305]);
            }.curry(), [
                [],
                [6],
                [4],
                [2]
            ]), [
                [6],
                [4],
                [2]
            ], 'concat');
        });
    });
    require('buster').spec.describe('foldr :: (a -> b -> b) -> b -> [a] -> b', function () {
        require('buster').spec.it('should fold a list from the right', function () {
            require('buster').assert.equals(Collection$2289.foldr(function (acc$2310, x$2311) {
                return acc$2310.concat(x$2311);
            }.curry(), [], [
                6,
                4,
                2
            ]), [
                2,
                4,
                6
            ], 'concat');
        });
    });
    require('buster').spec.describe('foldr1 :: (a -> a -> a) -> [a] -> a', function () {
        require('buster').spec.it('should fold a list from the left using the last element as accumulator', function () {
            require('buster').assert.equals(Collection$2289.foldr1(function (acc$2316, x$2317) {
                return acc$2316.concat([x$2317]);
            }.curry(), [
                [6],
                [4],
                [2],
                []
            ]), [
                [2],
                [4],
                [6]
            ], 'concat');
        });
    });
});