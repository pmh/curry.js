var C$2247 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2254 = C$2247.Core.__;
    var curry$2255 = C$2247.Core.curry;
    var compose$2256 = C$2247.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2263 = curry$2255(function (a$2270, b$2271, c$2272, d$2273) {
                    return a$2270 + b$2271 + c$2272 + d$2273;
                });
            var nums$2265 = curry$2255(function (a$2274, b$2275) {
                    return [
                        a$2274,
                        b$2275
                    ];
                });
            ;
            require('buster').assert(addMany$2263(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2263(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2263(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2265(__$2254, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2277 = curry$2255(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2277(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2280 = function (a$2282, b$2283) {
                    return a$2282 + b$2283;
                }.curry();
            ;
            require('buster').assert(add$2280(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2286 = curry$2255(function (sep$2294, s$2295) {
                    return s$2295.split(sep$2294);
                });
            var map$2288 = curry$2255(function (f$2296, xs$2297) {
                    return xs$2297.map(f$2296);
                });
            var upcase$2290 = curry$2255(function (s$2298) {
                    return s$2298.toUpperCase();
                });
            var join$2292 = curry$2255(function (sep$2299, xs$2300) {
                    return xs$2300.join(sep$2299);
                });
            ;
            require('buster').assert(compose$2256(join$2292('-'), map$2288(upcase$2290), split$2286(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2302 = C$2247.Data.Collection.foldl;
    var foldl1$2303 = C$2247.Data.Collection.foldl1;
    var foldr$2304 = C$2247.Data.Collection.foldr;
    var foldr1$2305 = C$2247.Data.Collection.foldr1;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2302(function (acc$2314, x$2315) {
                return acc$2314.concat(x$2315);
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
            require('buster').assert.equals(foldl1$2303(function (acc$2320, x$2321) {
                return acc$2320.concat([x$2321]);
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
            require('buster').assert.equals(foldr$2304(function (acc$2326, x$2327) {
                return acc$2326.concat(x$2327);
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
            require('buster').assert.equals(foldr1$2305(function (acc$2332, x$2333) {
                return acc$2332.concat([x$2333]);
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
    var map$2335 = C$2247.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2346 = {
                    map: function (f$2349) {
                        return f$2349(1);
                    }.curry()
                };
            require('buster').assert(map$2335(function (x$2350) {
                return x$2350 + 2;
            }.curry(), obj$2346) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2352 = C$2247.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var obj$2363 = {
                    ap: function (f$2366) {
                        return f$2366(1);
                    }.curry()
                };
            require('buster').assert(ap$2352(function (x$2367) {
                return x$2367 + 2;
            }.curry(), obj$2363) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2369 = C$2247.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2380 = {
                    chain: function (f$2383) {
                        return f$2383(1);
                    }.curry()
                };
            require('buster').assert(chain$2369(obj$2380, function (x$2384) {
                return x$2384 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});