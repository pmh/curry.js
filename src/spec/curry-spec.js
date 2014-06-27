var C$2247 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2253 = C$2247.Core.__;
    var curry$2254 = C$2247.Core.curry;
    var compose$2255 = C$2247.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2262 = curry$2254(function (a$2269, b$2270, c$2271, d$2272) {
                    return a$2269 + b$2270 + c$2271 + d$2272;
                });
            var nums$2264 = curry$2254(function (a$2273, b$2274) {
                    return [
                        a$2273,
                        b$2274
                    ];
                });
            ;
            require('buster').assert(addMany$2262(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2262(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2262(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2264(__$2253, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2276 = curry$2254(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2276(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2279 = function (a$2281, b$2282) {
                    return a$2281 + b$2282;
                }.curry();
            ;
            require('buster').assert(add$2279(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2285 = curry$2254(function (sep$2293, s$2294) {
                    return s$2294.split(sep$2293);
                });
            var map$2287 = curry$2254(function (f$2295, xs$2296) {
                    return xs$2296.map(f$2295);
                });
            var upcase$2289 = curry$2254(function (s$2297) {
                    return s$2297.toUpperCase();
                });
            var join$2291 = curry$2254(function (sep$2298, xs$2299) {
                    return xs$2299.join(sep$2298);
                });
            ;
            require('buster').assert(compose$2255(join$2291('-'), map$2287(upcase$2289), split$2285(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2301 = C$2247.Data.Collection.foldl;
    var foldl1$2302 = C$2247.Data.Collection.foldl1;
    var foldr$2303 = C$2247.Data.Collection.foldr;
    var foldr1$2304 = C$2247.Data.Collection.foldr1;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2301(function (acc$2313, x$2314) {
                return acc$2313.concat(x$2314);
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
            require('buster').assert.equals(foldl1$2302(function (acc$2319, x$2320) {
                return acc$2319.concat([x$2320]);
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
            require('buster').assert.equals(foldr$2303(function (acc$2325, x$2326) {
                return acc$2325.concat(x$2326);
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
            require('buster').assert.equals(foldr1$2304(function (acc$2331, x$2332) {
                return acc$2331.concat([x$2332]);
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
    var map$2334 = C$2247.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2345 = {
                    map: function (f$2348) {
                        return f$2348(1);
                    }.curry()
                };
            require('buster').assert(map$2334(function (x$2349) {
                return x$2349 + 2;
            }.curry(), obj$2345) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2351 = C$2247.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var obj$2362 = {
                    ap: function (f$2365) {
                        return f$2365(1);
                    }.curry()
                };
            require('buster').assert(ap$2351(function (x$2366) {
                return x$2366 + 2;
            }.curry(), obj$2362) === 3, 'apply over functor');
        });
    });
});