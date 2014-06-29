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
    var isObject$2304 = C$2247.Predicates.isObject;
    var isArray$2305 = C$2247.Predicates.isArray;
    var isNumber$2306 = C$2247.Predicates.isNumber;
    var isRegExp$2307 = C$2247.Predicates.isRegExp;
    var isString$2308 = C$2247.Predicates.isString;
    var isNull$2309 = C$2247.Predicates.isNull;
    var isUndef$2310 = C$2247.Predicates.isUndef;
    ;
    require('buster').spec.describe('not :: a -> Bool', function () {
        ;
        require('buster').assert(not$2303(true) === false, 'not(true)');
        require('buster').assert(not$2303(false) === true, 'not(false)');
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').assert(isObject$2304({}) === true, 'isObject({})  => true ');
        require('buster').assert(isObject$2304([]) === false, 'isObject([])  => false');
        require('buster').assert(isObject$2304(0) === false, 'isObject(0)   => false');
        require('buster').assert(isObject$2304(/x/) === false, 'isObject(/x/) => false');
        require('buster').assert(isObject$2304('x') === false, 'isObject(\'0\') => false');
        require('buster').assert(isObject$2304(0) === false, 'isObject(0)   => false');
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').assert(isArray$2305([]) === true, 'isArray([])  => true ');
        require('buster').assert(isArray$2305({}) === false, 'isArray({})  => false');
        require('buster').assert(isArray$2305(0) === false, 'isArray(0)   => false');
        require('buster').assert(isArray$2305(/x/) === false, 'isArray(/x/) => false');
        require('buster').assert(isArray$2305('x') === false, 'isArray(\'x\') => false');
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').assert(isNumber$2306(0) === true, 'isNumber(0)   => true ');
        require('buster').assert(isNumber$2306([]) === false, 'isNumber([])  => false');
        require('buster').assert(isNumber$2306({}) === false, 'isNumber({})  => false');
        require('buster').assert(isNumber$2306(/x/) === false, 'isNumber(/x/) => false');
        require('buster').assert(isNumber$2306('x') === false, 'isNumber(\'x\') => false');
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').assert(isRegExp$2307(/x/) === true, 'isRegExp(/x/) => true ');
        require('buster').assert(isRegExp$2307(0) === false, 'isRegExp(0)   => false');
        require('buster').assert(isRegExp$2307([]) === false, 'isRegExp([])  => false');
        require('buster').assert(isRegExp$2307({}) === false, 'isRegExp({})  => false');
        require('buster').assert(isRegExp$2307('x') === false, 'isRegExp(\'x\') => false');
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').assert(isString$2308('x') === true, 'isString(\'x\') => true ');
        require('buster').assert(isString$2308(/x/) === false, 'isString(/x/) => false');
        require('buster').assert(isString$2308(0) === false, 'isString(0)   => false');
        require('buster').assert(isString$2308([]) === false, 'isString([])  => false');
        require('buster').assert(isString$2308({}) === false, 'isString({})  => false');
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').assert(isNull$2309(null) === true, 'isNull(null)  => true ');
        require('buster').assert(isNull$2309('x') === false, 'isNull(\'x\')   => true ');
        require('buster').assert(isNull$2309(/x/) === false, 'isNull(/x/)   => false');
        require('buster').assert(isNull$2309(0) === false, 'isNull(0)     => false');
        require('buster').assert(isNull$2309([]) === false, 'isNull([])    => false');
        require('buster').assert(isNull$2309({}) === false, 'isNull({})    => false');
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').assert(isUndef$2310(undefined) === true, 'isUndef(undefined)  => true ');
        require('buster').assert(isUndef$2310('x') === false, 'isUndef(\'x\')        => false');
        require('buster').assert(isUndef$2310(/x/) === false, 'isUndef(/x/)        => false');
        require('buster').assert(isUndef$2310(0) === false, 'isUndef(0)          => false');
        require('buster').assert(isUndef$2310([]) === false, 'isUndef([])         => false');
        require('buster').assert(isUndef$2310({}) === false, 'isUndef({})         => false');
    });
});
require('buster').spec.describe('CurryJS.Data.Collection', function () {
    var foldl$2360 = C$2247.Data.Collection.foldl;
    var foldl1$2361 = C$2247.Data.Collection.foldl1;
    var foldr$2362 = C$2247.Data.Collection.foldr;
    var foldr1$2363 = C$2247.Data.Collection.foldr1;
    ;
    require('buster').spec.describe('foldl :: (a -> b -> a) -> a -> [b] -> a', function () {
        ;
        require('buster').spec.it('should fold a list from the left', function () {
            ;
            require('buster').assert.equals(foldl$2360(function (acc$2372, x$2373) {
                return acc$2372.concat(x$2373);
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
            require('buster').assert.equals(foldl1$2361(function (acc$2378, x$2379) {
                return acc$2378.concat([x$2379]);
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
            require('buster').assert.equals(foldr$2362(function (acc$2384, x$2385) {
                return acc$2384.concat(x$2385);
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
            require('buster').assert.equals(foldr1$2363(function (acc$2390, x$2391) {
                return acc$2390.concat([x$2391]);
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
    var map$2393 = C$2247.Control.Functor.map;
    ;
    require('buster').spec.describe('map :: Functor f => (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the functor', function () {
            var obj$2404 = {
                    map: function (f$2407) {
                        return f$2407(1);
                    }.curry()
                };
            require('buster').assert(map$2393(function (x$2408) {
                return x$2408 + 2;
            }.curry(), obj$2404) === 3, 'map over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Applicative', function () {
    var ap$2410 = C$2247.Control.Applicative.ap;
    ;
    require('buster').spec.describe('ap :: Applicative f => f (a -> b) -> f a -> f b', function () {
        ;
        require('buster').spec.it('should delegate to the applicative', function () {
            var obj$2421 = {
                    ap: function (f$2424) {
                        return f$2424(1);
                    }.curry()
                };
            require('buster').assert(ap$2410(function (x$2425) {
                return x$2425 + 2;
            }.curry(), obj$2421) === 3, 'apply over functor');
        });
    });
});
require('buster').spec.describe('CurryJS.Control.Monad', function () {
    var chain$2427 = C$2247.Control.Monad.chain;
    ;
    require('buster').spec.describe('chain :: Monad m => m a -> (a -> m b) -> m b', function () {
        ;
        require('buster').spec.it('should delegate to the monad instance', function () {
            var obj$2438 = {
                    chain: function (f$2441) {
                        return f$2441(1);
                    }.curry()
                };
            require('buster').assert(chain$2427(obj$2438, function (x$2442) {
                return x$2442 + 2;
            }.curry()) === 3, 'chain monadic values');
        });
    });
});