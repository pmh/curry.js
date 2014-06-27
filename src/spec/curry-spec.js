var C$2247 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2255 = C$2247.Core.__;
    var curry$2256 = C$2247.Core.curry;
    var compose$2257 = C$2247.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2264 = curry$2256(function (a$2271, b$2272, c$2273, d$2274) {
                    return a$2271 + b$2272 + c$2273 + d$2274;
                });
            var nums$2266 = curry$2256(function (a$2275, b$2276) {
                    return [
                        a$2275,
                        b$2276
                    ];
                });
            ;
            require('buster').assert(addMany$2264(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2264(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2264(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2266(__$2255, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2278 = curry$2256(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2278(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2281 = function (a$2283, b$2284) {
                    return a$2283 + b$2284;
                }.curry();
            ;
            require('buster').assert(add$2281(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2287 = curry$2256(function (sep$2295, s$2296) {
                    return s$2296.split(sep$2295);
                });
            var map$2289 = curry$2256(function (f$2297, xs$2298) {
                    return xs$2298.map(f$2297);
                });
            var upcase$2291 = curry$2256(function (s$2299) {
                    return s$2299.toUpperCase();
                });
            var join$2293 = curry$2256(function (sep$2300, xs$2301) {
                    return xs$2301.join(sep$2300);
                });
            ;
            require('buster').assert(compose$2257(join$2293('-'), map$2289(upcase$2291), split$2287(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Predicates', function () {
    var not$2303 = C$2247.Predicates.not;
    ;
    require('buster').spec.describe('not :: a -> Bool', function () {
        ;
        require('buster').assert(not$2303(true) === false && not$2303(false) === true, 'negation');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2307 = C$2247.Data.Collection.foldl;
    var foldl1$2308 = C$2247.Data.Collection.foldl1;
    var foldr$2309 = C$2247.Data.Collection.foldr;
    var foldr1$2310 = C$2247.Data.Collection.foldr1;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2307(function (acc$2319, x$2320) {
                return acc$2319.concat(x$2320);
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
            require('buster').assert.equals(foldl1$2308(function (acc$2325, x$2326) {
                return acc$2325.concat([x$2326]);
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
            require('buster').assert.equals(foldr$2309(function (acc$2331, x$2332) {
                return acc$2331.concat(x$2332);
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
            require('buster').assert.equals(foldr1$2310(function (acc$2337, x$2338) {
                return acc$2337.concat([x$2338]);
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
    var map$2340 = C$2247.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2351 = {
                    map: function (f$2354) {
                        return f$2354(1);
                    }.curry()
                };
            require('buster').assert(map$2340(function (x$2355) {
                return x$2355 + 2;
            }.curry(), obj$2351) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2357 = C$2247.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var obj$2368 = {
                    ap: function (f$2371) {
                        return f$2371(1);
                    }.curry()
                };
            require('buster').assert(ap$2357(function (x$2372) {
                return x$2372 + 2;
            }.curry(), obj$2368) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2374 = C$2247.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2385 = {
                    chain: function (f$2388) {
                        return f$2388(1);
                    }.curry()
                };
            require('buster').assert(chain$2374(obj$2385, function (x$2389) {
                return x$2389 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});