(function () {
    'use strict';
    require('../../core');
    require('./array');
    var unary$2512 = require('../../data/function').unary;
    var binary$2513 = require('../../data/function').binary;
    // foldl :: (a -> b -> a) -> a -> [b] -> a
    function foldl$2514(f$2530, acc$2531, xs$2532) {
        return function foldl$2514(f$2533, acc$2534, xs$2535) {
            return xs$2535.reduce(binary$2513(f$2533), acc$2534);
        }.curry().apply(null, arguments);
    }
    ;
    // foldl1 :: (a -> a -> a) -> [a] -> a
    function foldl1$2516(f$2536, xs$2537) {
        return function foldl1$2516(f$2538, xs$2539) {
            return xs$2539.reduce(binary$2513(f$2538));
        }.curry().apply(null, arguments);
    }
    ;
    // foldr :: (a -> b -> b) -> b -> [a] -> b
    function foldr$2518(f$2540, acc$2541, xs$2542) {
        return function foldr$2518(f$2543, acc$2544, xs$2545) {
            return xs$2545.reduceRight(binary$2513(f$2543), acc$2544);
        }.curry().apply(null, arguments);
    }
    ;
    // foldr1 :: (a -> a -> a) -> [a] -> a
    function foldr1$2520(f$2546, xs$2547) {
        return function foldr1$2520(f$2548, xs$2549) {
            return xs$2549.reduceRight(binary$2513(f$2548));
        }.curry().apply(null, arguments);
    }
    ;
    // filter :: (a -> Bool) -> [a] -> [a]
    function filter$2524(f$2550, xs$2551) {
        return function filter$2524(f$2552, xs$2553) {
            return xs$2553.filter(unary$2512(f$2552));
        }.curry().apply(null, arguments);
    }
    // head :: [a] -> Option a
    function head$2525(xs$2554) {
        return function head$2525(xs$2555) {
            return xs$2555.head();
        }.curry().apply(null, arguments);
    }
    // tail :: [a] -> [a]
    function tail$2526(xs$2556) {
        return function tail$2526(xs$2557) {
            return xs$2557.tail();
        }.curry().apply(null, arguments);
    }
    ;
    // flatten :: Monoid a => [a] -> a
    function flatten$2529(xs$2558) {
        return function flatten$2529(xs$2559) {
            return foldl1$2516(function (xs$2560, ys$2561) {
                return xs$2560.concat(ys$2561);
            }.curry(), xs$2559);
        }.curry().apply(null, arguments);
    }
    ;
    module.exports = {
        foldl: foldl$2514,
        foldl1: foldl1$2516,
        foldr: foldr$2518,
        foldr1: foldr1$2520,
        filter: filter$2524,
        head: head$2525,
        tail: tail$2526,
        flatten: flatten$2529
    };
}());
//# sourceMappingURL=index.js.map