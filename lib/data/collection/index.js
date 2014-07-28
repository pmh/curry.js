(function () {
  "use strict";

  require("../../core")
  require("./array")

  { unary, binary } := require("../../data/function")
  
  // foldl :: (a -> b -> a) -> a -> [b] -> a
  fun foldl (f, acc, xs) -> xs.reduce(binary(f), acc);

  // foldl1 :: (a -> a -> a) -> [a] -> a
  fun foldl1 (f, xs) -> xs.reduce(binary(f));

  // foldr :: (a -> b -> b) -> b -> [a] -> b
  fun foldr (f, acc, xs) -> xs.reduceRight(binary(f), acc);

  // foldr1 :: (a -> a -> a) -> [a] -> a
  fun foldr1 (f, xs) -> xs.reduceRight(binary(f));

  // filter :: (a -> Bool) -> [a] -> [a]
  fun filter (f, xs) -> xs.filter(unary(f))
  
  // head :: [a] -> Option a
  fun head (xs) -> xs.head()

  // tail :: [a] -> [a]
  fun tail (xs) -> xs.tail();

  // flatten :: Monoid a => [a] -> a
  fun flatten (xs) -> foldl1(fun (xs, ys) -> xs.concat(ys), xs);

  module.exports = { foldl   : foldl
                   , foldl1  : foldl1
                   , foldr   : foldr
                   , foldr1  : foldr1
                   , filter  : filter
                   , head    : head
                   , tail    : tail
                   , flatten : flatten
                   }
}());