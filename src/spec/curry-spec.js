var C$2247 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var Core$2251 = C$2247.Core;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2257 = Core$2251.curry(function (a$2263, b$2264, c$2265, d$2266) {
                    return a$2263 + b$2264 + c$2265 + d$2266;
                }), nums$2258 = Core$2251.curry(function (a$2267, b$2268) {
                    return [
                        a$2267,
                        b$2268
                    ];
                });
            ;
            require('buster').assert(addMany$2257(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2257(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2257(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2258(Core$2251.__, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2269 = Core$2251.curry(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2269(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2271 = function (a$2273, b$2274) {
                    return a$2273 + b$2274;
                }.curry();
            ;
            require('buster').assert(add$2271(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2276 = Core$2251.curry(function (sep$2281, s$2282) {
                    return s$2282.split(sep$2281);
                }), map$2277 = Core$2251.curry(function (f$2283, xs$2284) {
                    return xs$2284.map(f$2283);
                }), upcase$2278 = Core$2251.curry(function (s$2285) {
                    return s$2285.toUpperCase();
                }), join$2279 = Core$2251.curry(function (sep$2286, xs$2287) {
                    return xs$2287.join(sep$2286);
                });
            ;
            require('buster').assert(Core$2251.compose(join$2279('-'), map$2277(upcase$2278), split$2276(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var Collection$2288 = C$2247.Data.Collection;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(Collection$2288.foldl(function (acc$2297, x$2298) {
                return acc$2297.concat(x$2298);
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
        ;
        require('buster').spec.it('should fold a list from the left using the first element as accumulator', function () {
            ;
            require('buster').assert.equals(Collection$2288.foldl1(function (acc$2303, x$2304) {
                return acc$2303.concat([x$2304]);
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
        ;
        require('buster').spec.it('should fold a list from the right', function () {
            ;
            require('buster').assert.equals(Collection$2288.foldr(function (acc$2309, x$2310) {
                return acc$2309.concat(x$2310);
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
        ;
        require('buster').spec.it('should fold a list from the left using the last element as accumulator', function () {
            ;
            require('buster').assert.equals(Collection$2288.foldr1(function (acc$2315, x$2316) {
                return acc$2315.concat([x$2316]);
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
require('buster').spec.describe('CurryJS.Control.Functor', function () {
    var Functor$2317 = C$2247.Control.Functor;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2327 = {
                    map: function (f$2330) {
                        return f$2330(1);
                    }.curry()
                };
            require('buster').assert(Functor$2317.map(function (x$2331) {
                return x$2331 + 2;
            }.curry(), obj$2327) === 3, 'map over functor');
        });
    });
});