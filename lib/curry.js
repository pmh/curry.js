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
  *   times    := curry(fun (a, b) -> a * b);
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

  // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
  Protocol := function (name, spec) {
    return {
      name     : name,
      spec     : spec,
      instance : function (type, impl) {
        var name        = this.name
          , spec        = this.spec
          , constructor = spec.constructor
          , proto       = spec.prototype
          , k;

        Object.keys(constructor || {}).map(function (field) {
          if (constructor[field] === Protocol.required && !impl.hasOwnProperty(field) && !type.hasOwnProperty(field))
            throw Protocol.required(name, field);
          else if (!type.hasOwnProperty(field) && !impl.hasOwnProperty(field))
            type[field] = function () { return constructor[field].curry().apply(this, [this].concat(__slice.call(arguments))); }
          else if (impl.hasOwnProperty(field))
            type[field] = function () { return impl[field].curry().apply(this, [this].concat(__slice.call(arguments))); }
        });

        Object.keys(proto || {}).map(function (field) {
          if (proto[field] === Protocol.required && !impl.hasOwnProperty(field) && !type.prototype.hasOwnProperty(field))
            throw Protocol.required(name, field);
          else if (!type.prototype.hasOwnProperty(field) && !impl.hasOwnProperty(field))
            type.prototype[field] = function () { return proto[field].curry().apply(this, [this].concat(__slice.call(arguments))); }
          else if (impl.hasOwnProperty(field))
            type.prototype[field] = function () { return impl[field].curry().apply(this, [this].concat(__slice.call(arguments))); }
        });
      }
    }
  }

  Protocol.required = fun (name, field) ->
    new Error(name + " expected required field: '" + field + "' to be defined!")

  // instance :: Protocol -> ADT -> Object -> undefined
  fun instance (protocol, type, impl) ->
    protocol.instance(type, impl);

  // ***************************************************************
  // **                    CurryJS.Predicates                     **
  // ***************************************************************

  // not :: Truthy -> Bool
  fun not (x) -> !x

  // and :: [Truthy] -> Bool
  fun and (xs) -> xs.every(fun (x) -> !!x)

  // and :: [Truthy] -> Bool
  fun or (xs) -> xs.some(fun (x) -> !!x)

  // isObject :: a -> Bool
  fun isObject (x) -> match { Object  => true, * => false }

  // isArray :: a -> Bool
  fun isArray (x) -> match { Array   => true, * => false }

  // isNumber :: a -> Bool
  fun isNumber (x) -> match { Number  => true, * => false }

  // isRegExp :: a -> Bool
  fun isRegExp (x) -> match { RegExp  => true, * => false }

  // isString :: a -> Bool
  fun isString (x) -> match { String  => true, * => false }

  // isNull :: a -> Bool
  fun isNull (x) -> match { null    => true, * => false }

  // isUndef :: a -> Bool
  fun isUndef (x) -> match { void(0) => true, * => false }

  // exists :: a -> Bool
  fun exists (x) -> not .. or $ [isNull(x), isUndef(x)]

  // ***************************************************************
  // **                        CurryJS.Math                       **
  // ***************************************************************  

  // plus :: Number a => a -> a -> a
  fun plus (a, b) -> a + b

  // minus :: Number a => a -> a -> a
  fun minus (a, b) -> a - b

  // times :: Number a => a -> a -> a
  fun times (a, b) -> a * b

  // div :: Number a => a -> a -> a
  fun div (a, b) -> a / b

  // ***************************************************************
  // **                  CurryJS.Control.Functor                  **
  // ***************************************************************

  Functor := Protocol("Functor", {
    prototype : { map : Protocol.required }
  });

  // map :: Functor f => (a -> b) -> f a -> f b
  fun map (f, xs) -> xs.map(f);

  // ***************************************************************
  // **                CurryJS.Control.Applicative                **
  // ***************************************************************

  Applicative := Protocol("Applicative", {
    prototype : { ap : Protocol.required }
  });

  // ap :: Applicative f => f (a -> b) -> f a -> f b
  fun ap (f, xs) -> f.ap(xs);

  // ***************************************************************
  // **                   CurryJS.Control.Monad                   **
  // ***************************************************************

  Monad := Protocol('Monad', {
    constructor : {
      of: function (x) { return this.prototype.of(x); }
    },
    prototype : {
      of    : Protocol.required,
      chain : Protocol.required,

      map   : fun (self, f) -> self >>= compose(self.of, f),
      ap    : fun (self, x) -> self >>= map(__, x)
    }
  });

  // chain :: Monad m => m a -> (a -> m b) -> m b
  fun chain (xs, f) -> xs.chain(f);

  // pure :: Monad m => m -> b -> m b
  fun pure (f, x) -> f.of ? f.of(x) : f.constructor.of(x)

  // ***************************************************************
  // **                  CurryJS.Control.Monoid                   **
  // ***************************************************************

  Monoid := Protocol('Monoid', {
    constructor : {
      empty: function () { return this.prototype.empty(); }
    },
    prototype : {
      empty  : Protocol.required,
      concat : Protocol.required
    }
  });

  // concat :: (Monoid a) => a -> a -> a
  fun concat (a, b) ->
    a.concat(b);

  // ***************************************************************
  // **                    CurryJS.Number.Sum                     **
  // *************************************************************** 

  data Sum (Number) deriving Base

  instance(Monoid, Sum, {
    empty  : fun -> Sum(0),
    concat : fun (a, b) -> match {
      (Sum(x), Sum(y)) => Sum (x + y)
    }
  })

  fun getSum (x) -> match { Sum(x) => x }

  // ***************************************************************
  // **                  CurryJS.Number.Product                   **
  // *************************************************************** 

  data Product (Number) deriving Base

  instance(Monoid, Product, {
    empty  : fun (self) -> Product(1),
    concat : fun (a, b) -> match {
      (Product(x), Product(y)) => Product(x * y)
    }
  });

  fun getProduct (x) -> match { Product(x) => x }

  // ***************************************************************
  // **                    CurryJS.Number.Max                     **
  // *************************************************************** 

  data Max (Number) deriving Base

  instance(Monoid, Max, {
    empty  : fun (self) -> Max(-Infinity),
    concat : fun (a, b) -> match {
      (Max(x), Max(y)) => Max(x > y ? x : y)
    }
  })

  fun getMax (x) -> match { Max(x) => x }


  // ***************************************************************
  // **                    CurryJS.Number.Min                     **
  // *************************************************************** 

  data Min (Number) deriving Base

  instance(Monoid, Min, {
    empty  : fun (self) -> Min(Infinity),
    concat : fun (a, b) -> match {
      (Min(x), Min(y)) => Min(x < y ? x : y)
    }
  })

  fun getMin (x) -> match { Min(x) => x }

  // ***************************************************************
  // **                    CurryJS.Data.Option                    **
  // ***************************************************************

  union Option { Some { val: * }, None } deriving Base

  instance(Monad, Option, {
    of    : fun (self, x) -> Some(x),
    chain : fun (self, f) -> match {
      (Some(x) , Function) => f(x),
      (None    , Function) => None
    }
  });

  instance(Monoid, Option, {
    empty  : fun (self) -> None,
    concat : fun (a, b) -> match {
      (Option   , None    ) => a,
      (None     , Option  ) => b,
      (Some(v1) , Some(v2)) => Some (v1.concat(v2))
    }
  });

  // ***************************************************************
  // **                    CurryJS.Data.Either                    **
  // ***************************************************************

  union Either { Left { l: * }, Right { r: * } } deriving Base

  instance(Monad, Either, {
    of    : fun (self, x) -> Right(x),
    chain : fun (self, f) -> match {
      (Right(x) , Function) => f(x),
      (Left(x)  , *       ) => self
    }
  });

  instance(Monoid, Either, {
    empty  : fun (self) -> Left(),
    concat : fun (a, b) -> match {
      (Either    , Left(x)  ) => a,
      (Left(x)   , Either   ) => b,
      (Right(r1) , Right(r2)) => Right (r1.concat(r2))
    }
  })

  // ***************************************************************
  // **                  CurryJS.Data.Collection                  **
  // ***************************************************************

  // foldl :: (a -> b -> a) -> a -> [b] -> a
  fun foldl (f, acc, xs) -> xs.reduce(f, acc);

  // foldl1 :: (a -> a -> a) -> [a] -> a
  fun foldl1 (f, xs) -> xs.reduce(f);

  // foldr :: (a -> b -> b) -> b -> [a] -> b
  fun foldr (f, acc, xs) -> xs.reduceRight(f, acc);

  // foldr1 :: (a -> a -> a) -> [a] -> a
  fun foldr1 (f, xs) -> xs.reduceRight(f);
  
  // flatten :: Monoid a => [a] -> a
  fun flatten (xs) -> foldl1(fun (xs, ys) -> xs.concat(ys), xs);

  // ***************************************************************
  // **                    CurryJS.Data.Array                     **
  // ***************************************************************

  extendNative(Array, "of", fun (x) -> [x]);

  extendNative(Array.prototype, "ap",    fun (x) -> this >>= map(__, x))
  extendNative(Array.prototype, "chain", fun (f) -> flatten .. map(f) $ this)

  module.exports = {
    Core : {
      __       : __,
      curry    : curry,
      compose  : compose,
      Protocol : Protocol,
      instance : instance
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
    Number : {
      Sum: {
        Sum    : Sum,
        getSum : getSum
      },
      Product: {
        Product    : Product,
        getProduct : getProduct
      },
      Max: {
        Max    : Max,
        getMax : getMax
      },
      Min: {
        Min    : Min,
        getMin : getMin
      }
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
        Monad : Monad,
        chain : chain
      },
      Monoid: {
        Monoid : Monoid,
        concat : concat
      }
    }
  }
})()