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
    var and$2304 = C$2247.Predicates.and;
    var isObject$2305 = C$2247.Predicates.isObject;
    var isArray$2306 = C$2247.Predicates.isArray;
    var isNumber$2307 = C$2247.Predicates.isNumber;
    var isRegExp$2308 = C$2247.Predicates.isRegExp;
    var isString$2309 = C$2247.Predicates.isString;
    var isNull$2310 = C$2247.Predicates.isNull;
    var isUndef$2311 = C$2247.Predicates.isUndef;
    ;
    require('buster').spec.describe('not :: Truthy -> Bool', function () {
        ;
        require('buster').assert(not$2303(true) === false, 'not(true)');
        require('buster').assert(not$2303(false) === true, 'not(false)');
    });
    require('buster').spec.describe('and :: [Truthy] -> Bool', function () {
        ;
        require('buster').assert(and$2304([
            true,
            true
        ]) === true, 'and([true,  true ]) => true ');
        require('buster').assert(and$2304([
            true,
            false
        ]) === false, 'and([true,  false]) => false');
        require('buster').assert(and$2304([
            false,
            true
        ]) === false, 'and([false, true ]) => false');
        require('buster').assert(and$2304([
            false,
            false
        ]) === false, 'and([false, false]) => false');
        require('buster').assert(and$2304([
            '',
            true
        ]) === false, 'and([\'\',    true ]) => false');
        require('buster').assert(and$2304([
            'x',
            true
        ]) === true, 'and([\'x\',   true ]) => true ');
        require('buster').assert(and$2304([
            0,
            true
        ]) === false, 'and([0,     true ]) => false');
        require('buster').assert(and$2304([
            1,
            true
        ]) === true, 'and([1,     true ]) => true ');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2305({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2305([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2305(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2305(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2305('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2305(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2306([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2306({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2306(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2306(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2306('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2307(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2307([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2307({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2307(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2307('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2308(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2308(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2308([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2308({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2308('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2309('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2309(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2309(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2309([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2309({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2310(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2310('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2310(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2310(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2310([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2310({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2311(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2311('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2311(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2311(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2311([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2311({}) === false, 'isUndef({})         => false');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2370 = C$2247.Data.Collection.foldl;
    var foldl1$2371 = C$2247.Data.Collection.foldl1;
    var foldr$2372 = C$2247.Data.Collection.foldr;
    var foldr1$2373 = C$2247.Data.Collection.foldr1;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2370(function (acc$2382, x$2383) {
                return acc$2382.concat(x$2383);
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
            require('buster').assert.equals(foldl1$2371(function (acc$2388, x$2389) {
                return acc$2388.concat([x$2389]);
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
            require('buster').assert.equals(foldr$2372(function (acc$2394, x$2395) {
                return acc$2394.concat(x$2395);
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
            require('buster').assert.equals(foldr1$2373(function (acc$2400, x$2401) {
                return acc$2400.concat([x$2401]);
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
    var map$2403 = C$2247.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2414 = {
                    map: function (f$2417) {
                        return f$2417(1);
                    }.curry()
                };
            require('buster').assert(map$2403(function (x$2418) {
                return x$2418 + 2;
            }.curry(), obj$2414) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2420 = C$2247.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var obj$2431 = {
                    ap: function (f$2434) {
                        return f$2434(1);
                    }.curry()
                };
            require('buster').assert(ap$2420(function (x$2435) {
                return x$2435 + 2;
            }.curry(), obj$2431) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2437 = C$2247.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2448 = {
                    chain: function (f$2451) {
                        return f$2451(1);
                    }.curry()
                };
            require('buster').assert(chain$2437(obj$2448, function (x$2452) {
                return x$2452 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});