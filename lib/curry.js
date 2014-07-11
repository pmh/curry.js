(function () {
  "use strict";

  { Base }    := require("./adt-derivers")
  __slice     := [].slice;
  __toString  := {}.toString;

  // ***************************************************************
  // **                       CurryJS.Core                        **
  // ***************************************************************

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

    if (arity < 2) return f;

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
  // **                    CurryJS.Predicates                     **
  // ***************************************************************

  // not :: Truthy -> Bool
  fun not (x) = !x

  // and :: [Truthy] -> Bool
  fun and (xs) = xs.every(fun (x) = !!x)

  // and :: [Truthy] -> Bool
  fun or (xs) = xs.some(fun (x) = !!x)

  // isObject :: a -> Bool
  fun isObject (x) = match { Object  => true, * => false }

  // isArray :: a -> Bool
  fun isArray (x) = match { Array   => true, * => false }

  // isNumber :: a -> Bool
  fun isNumber (x) = match { Number  => true, * => false }

  // isRegExp :: a -> Bool
  fun isRegExp (x) = match { RegExp  => true, * => false }

  // isString :: a -> Bool
  fun isString (x) = match { String  => true, * => false }

  // isNull :: a -> Bool
  fun isNull (x) = match { null    => true, * => false }

  // isUndef :: a -> Bool
  fun isUndef (x) = match { void(0) => true, * => false }

  // exists :: a -> Bool
  fun exists (x) = not .. or $ [isNull(x), isUndef(x)]

  // ***************************************************************
  // **                        CurryJS.Math                       **
  // ***************************************************************  

  // plus :: Number a => a -> a -> a
  fun plus (a, b) = a + b

  // minus :: Number a => a -> a -> a
  fun minus (a, b) = a - b

  // times :: Number a => a -> a -> a
  fun times (a, b) = a * b

  // div :: Number a => a -> a -> a
  fun div (a, b) = a / b

  // ***************************************************************
  // **                  CurryJS.Control.Functor                  **
  // ***************************************************************

  // map :: Functor f => (a -> b) -> f a -> f b
  fun map (f, xs) = xs.map(f);

  // ***************************************************************
  // **                CurryJS.Control.Applicative                **
  // ***************************************************************

  // ap :: Applicative f => f (a -> b) -> f a -> f b
  fun ap (f, xs) = f.ap(xs);

  // ***************************************************************
  // **                   CurryJS.Control.Monad                   **
  // ***************************************************************

  // chain :: Monad m => m a -> (a -> m b) -> m b
  fun chain (xs, f) = xs.chain(f);

  // pure :: Monad m => m -> b -> m b
  fun pure (f, x) = f.of ? f.of(x) : f.constructor.of(x)

  // ***************************************************************
  // **                    CurryJS.Data.Option                    **
  // ***************************************************************

  union Option { Some { val: * }, None } deriving Base
  
  Option.of = Some

  fun Option.prototype.map (self, f) = self >>= pure(self) .. f

  fun Option.prototype.ap  (self, x) = self >>= map(__, x)
  
  fun Option.prototype.chain (self, f) = match {
    (Some(x) , Function) => f(x),
    (None    , Function) => None
  }

  fun Option.prototype.empty (self) = None

  fun Option.prototype.concat (self, other) = match {
    (None     , Option  ) => other,
    (Option   , None    ) => self,
    (Some(v1) , Some(v2)) => Some (v1.concat(v2))
  }

  // ***************************************************************
  // **                    CurryJS.Data.Either                    **
  // ***************************************************************

  union Either { Left { l: * }, Right { r: * } } deriving Base

  Either.of = Right;

  fun Either.prototype.map (self, f) = self >>= pure(self) .. f

  fun Either.prototype.ap  (self, x) = self >>= map(__, x)
  
  fun Either.prototype.chain (self, f) = match {
    (Right(x) , Function) => f(x),
    (Left(x)  , *       ) => self
  }

  fun Either.prototype.empty (self) = Left()

  fun Either.prototype.concat (self, other) = match {
    (Left(x)   , Either   ) => other,
    (Either    , Left(x)  ) => self,
    (Right(r1) , Right(r2)) => Right (r1.concat(r2))
  }

  // ***************************************************************
  // **                  CurryJS.Data.Collection                  **
  // ***************************************************************

  // foldl :: (a -> b -> a) -> a -> [b] -> a
  fun foldl (f, acc, xs) = xs.reduce(f, acc);

  // foldl1 :: (a -> a -> a) -> [a] -> a
  fun foldl1 (f, xs) = xs.reduce(f);

  // foldr :: (a -> b -> b) -> b -> [a] -> b
  fun foldr (f, acc, xs) = xs.reduceRight(f, acc);

  // foldr1 :: (a -> a -> a) -> [a] -> a
  fun foldr1 (f, xs) = xs.reduceRight(f);
  
  // flatten :: Monoid a => [a] -> a
  fun flatten (xs) = foldl1(fun (xs, ys) = xs.concat(ys), xs);

  // ***************************************************************
  // **                    CurryJS.Data.Array                     **
  // ***************************************************************

  extendNative(Array, "of", fun (x) = [x]);

  extendNative(Array.prototype, "ap",    fun (x) = this >>= map(__, x))
  extendNative(Array.prototype, "chain", fun (f) = flatten .. map(f) $ this)

  module.exports = {
    Core : {
      __      : __,
      curry   : curry,
      compose : compose,
    },
    Predicates : {
      not       : not,
      and       : and,
      or        : or,
      isObject  : isObject,
      isArray   : isArray,
      isNumber  : isNumber,
      isRegExp  : isRegExp,
      isString  : isString,
      isNull    : isNull,
      isUndef   : isUndef,
      exists    : exists
    },
    Math : {
      plus  : plus,
      minus : minus,
      times : times,
      div   : div
    },
    Data : {
      Either : {
        Either : Either,
        Left   : Left,
        Right  : Right
      },
      Option : {
        Option : Option,
        Some   : Some,
        None   : None
      },
      Collection : {
        foldl   : foldl,
        foldl1  : foldl1,
        foldr   : foldr,
        foldr1  : foldr1,
        flatten : flatten
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