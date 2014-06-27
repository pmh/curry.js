(function () {
  "use strict";

  { Base } := require("./adt-derivers")
  __slice  := [].slice;

  // *****************************
  // **      CurryJS.Core       **
  // *****************************

  // __ :: () -> ()
  var __ = function noop () {};

  var extendNative = function (native, prop, f) {
    return Object.defineProperty(native, prop, { value: f });
  };

  var withMeta = function (f, meta) {
    var keys = Object.keys(meta);

    keys.forEach(function (name) {
      Object.defineProperty(f, '__' + name, { value: meta[name] });
    });

    return f;
  }

 /*
  * curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))
  *
  * Given any fixed arity function it returns a new function that can be partially applied.
  *
  * Usage:
  *
  *   times    := curry(fun (a, b) a * b);
  *   timesTwo := times(2);
  *   mod2     := mod(__, 2); // __ can be used as a placeholder for partial application
  *
  *   times(2, 4) //=> 8
  *   times(2)(4) //=> 8
  *   timesTwo(4) //=> 8
  *
  *   mod2(2)     //=> 0
  *   mod2(3)     //=> 1
  */
  var curry = function (f, n) {
    var arity = typeof (n) !== "undefined" ? n : (typeof(f.__arity) !== "undefined" ? f.__arity : f.length)
      , name  = f.name || f.__name;

    var curriedFn = withMeta(function () {
      var args      = [].slice.call(arguments, 0, arity)
      ,   realArity = args.filter(function (x) { return x !== __ }).length
      ,   self      = this;

      if (realArity >= arity)
        return f.apply(self, arguments);
      else {
        var g = withMeta(function () {
          var partialArgs = [].slice.call(arguments)
          , newArgs     = [];

          for (var i = 0; i < args.length; i++)
            newArgs[i] = args[i] === __ ? (partialArgs.length === 0 ? undefined : partialArgs.shift()) : args[i];

          return curriedFn.apply(self, newArgs.concat(partialArgs));
        }, { name: name, arity : arity - realArity, curried: true });

        g.toString  = curriedFn.toString.bind(curriedFn);

        return g;
      }
    }, { name: name, arity: arity, curried: true });

    curriedFn.toString = f.toString.bind(f);

    return curriedFn;

  };
  
  extendNative(Function.prototype, "curry", function (n) { return curry(this, n); });

 /*
  * compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)
  *
  * compose takes any number of functions and invokes them right to left
  * passing the value of the previous function to the next.
  *
  * compose(f,g)(x) === f(g(x))
  *
  * Usage:
  *
  * var even = compose(eq (0), mod(__, 2));
  * var odd  = compose(not, even);
  *
  * even (0) => true
  * odd  (0) => false
  * even (1) => false
  * odd  (1) => true
  *
  */
  var compose = function () {
    var fns = __slice.call(arguments), self = this;

    return fns.reduce(function (f, g) {
      return function () {
        return f.call(self, g.apply(self, arguments));
      }
    });
  };

  // ***************************************************************
  // **                  CurryJS.Control.Functor                  **
  // ***************************************************************

  // map :: Functor f => (a -> b) -> f a -> f b
  fun map (f, xs) = xs.map(f);

  // ***************************************************************
  // **                CurryJS.Control.Applicative                **
  // ***************************************************************

  // ap :: Applicative f => f (a -> b) -> f a -> f b
  fun ap (f, xs) = xs.ap(f);

  // ***************************************************************
  // **                   CurryJS.Control.Monad                   **
  // ***************************************************************

  // chain :: Monad m => m a -> (a -> m b) -> m b
  fun chain (xs, f) = xs.chain(f);

  // ***************************************************************
  // **                  CurryJS.Data.Collection                  **
  // ***************************************************************

  // foldl :: (a -> b -> a) -> a -> [b] -> a
  fun foldl  (f, acc, xs) = xs.reduce(f, acc);

  // foldl1 :: (a -> a -> a) -> [a] -> a
  fun foldl1 (f, xs) = xs.reduce(f);

  // foldr :: (a -> b -> b) -> b -> [a] -> b
  fun foldr (f, acc, xs) = xs.reduceRight(f, acc);

  // foldr1 :: (a -> a -> a) -> [a] -> a
  fun foldr1 (f, xs) = xs.reduceRight(f);


  module.exports = {
    Core : {
      __      : __,
      curry   : curry,
      compose : compose,
    },
    Data : {
      Collection : {
        foldl  : foldl,
        foldl1 : foldl1,
        foldr  : foldr,
        foldr1 : foldr1
      },
    },
    Control: {
      Functor: {
        map : map
      },
      Applicative: {
        ap : ap
      },
      Monad: {
        chain : chain
      }
    }
  }
})()