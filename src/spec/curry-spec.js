var C$2247 = require('../lib/curry');
require('buster').spec.describe('CurryJS', function () {
    var __$2252 = C$2247.Core.__;
    var curry$2253 = C$2247.Core.curry;
    var compose$2254 = C$2247.Core.compose;
    ;
    require('buster').spec.describe('curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))', function () {
        ;
        require('buster').spec.it('should return a curried version of the function', function () {
            var addMany$2261 = curry$2253(function (a$2268, b$2269, c$2270, d$2271) {
                    return a$2268 + b$2269 + c$2270 + d$2271;
                });
            var nums$2263 = curry$2253(function (a$2272, b$2273) {
                    return [
                        a$2272,
                        b$2273
                    ];
                });
            ;
            require('buster').assert(addMany$2261(1)(2)(3)(4) === 10, 'single argument application');
            require('buster').assert(addMany$2261(1, 2)(3, 4) === 10, 'multi argument application');
            require('buster').assert(addMany$2261(1, 2, 3, 4) === 10, 'full application');
            require('buster').assert.equals(nums$2263(__$2252, 2)(1), [
                1,
                2
            ], 'flipped application');
        });
        ;
        require('buster').spec.it('should accept an optional arity argument', function () {
            var curried$2275 = curry$2253(function () {
                    return [].slice.call(arguments);
                }, 3);
            ;
            require('buster').assert.equals(curried$2275(1)(2)(3), [
                1,
                2,
                3
            ], 'partial application');
        });
        require('buster').spec.it('should be installed on Function.prototype', function () {
            var add$2278 = function (a$2280, b$2281) {
                    return a$2280 + b$2281;
                }.curry();
            ;
            require('buster').assert(add$2278(2)(4) === 6, 'single argument application');
        });
    });
    require('buster').spec.describe('compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)', function () {
        ;
        require('buster').spec.it('should compose multiple functions', function () {
            var split$2284 = curry$2253(function (sep$2292, s$2293) {
                    return s$2293.split(sep$2292);
                });
            var map$2286 = curry$2253(function (f$2294, xs$2295) {
                    return xs$2295.map(f$2294);
                });
            var upcase$2288 = curry$2253(function (s$2296) {
                    return s$2296.toUpperCase();
                });
            var join$2290 = curry$2253(function (sep$2297, xs$2298) {
                    return xs$2298.join(sep$2297);
                });
            ;
            require('buster').assert(compose$2254(join$2290('-'), map$2286(upcase$2288), split$2284(' '))('foo bar baz') === 'FOO-BAR-BAZ', 'function composition');
        });
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2300 = C$2247.Data.Collection.foldl;
    var foldl1$2301 = C$2247.Data.Collection.foldl1;
    var foldr$2302 = C$2247.Data.Collection.foldr;
    var foldr1$2303 = C$2247.Data.Collection.foldr1;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2300(function (acc$2312, x$2313) {
                return acc$2312.concat(x$2313);
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
            require('buster').assert.equals(foldl1$2301(function (acc$2318, x$2319) {
                return acc$2318.concat([x$2319]);
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
            require('buster').assert.equals(foldr$2302(function (acc$2324, x$2325) {
                return acc$2324.concat(x$2325);
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
            require('buster').assert.equals(foldr1$2303(function (acc$2330, x$2331) {
                return acc$2330.concat([x$2331]);
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
    var map$2333 = C$2247.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2344 = {
                    map: function (f$2347) {
                        return f$2347(1);
                    }.curry()
                };
            require('buster').assert(map$2333(function (x$2348) {
                return x$2348 + 2;
            }.curry(), obj$2344) === 3, 'map over functor');
        });
    });
});