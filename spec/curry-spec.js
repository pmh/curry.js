var C = require("../lib/curry");

describe "CurryJS" {
  { __, curry, compose } := C.Core;

  describe "curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))" {

    it "should return a curried version of the function" {
      addMany := curry(function (a, b, c, d) { return a + b + c + d });
      nums    := curry(function (a, b)       { return [a, b]        });
      
      test "single argument application" { addMany(1)(2)(3)(4) === 10     }
      test "multi argument application"  { addMany(1, 2)(3, 4) === 10     }
      test "full application"            { addMany(1, 2, 3, 4) === 10     }
      test "flipped application"         { nums(__, 2)(1)      =>= [1, 2] }
    };

    it "should accept an optional arity argument" {
      curried := curry(function () { return [].slice.call(arguments) }, 3);

      test "partial application" {
        curried(1)(2)(3) =>= [1,2,3]
      }
    }

    it "should be installed on Function.prototype" {
      add := (function (a, b) { return a + b; }).curry();

      test "single argument application" { add(2)(4) === (6) }
    };
  }

  describe "compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)" {

    it "should compose multiple functions" {
      split  := curry (function (sep, s ) { return s.split(sep);   });
      map    := curry (function (f, xs  ) { return xs.map(f);      });
      upcase := curry (function (s      ) { return s.toUpperCase() });
      join   := curry (function (sep, xs) { return xs.join(sep);   });

      test "function composition" {
        compose(join("-"), map(upcase), split(" "))("foo bar baz") === "FOO-BAR-BAZ"
      }
    };
  }
}

describe "CurryJS.Predicates" {
  { not, and, or, isObject, isArray, isNumber, isRegExp, isString, isNull, isUndef, exists } := C.Predicates;

  describe "not :: Truthy -> Bool" {
    test "not(true)"  { not(true)  === false }
    test "not(false)" { not(false) === true  }
  }

  describe "and :: [Truthy] -> Bool" {
    test "and([true,  true ]) => true " { and([true,  true ]) === true  }
    test "and([true,  false]) => false" { and([true,  false]) === false }
    test "and([false, true ]) => false" { and([false, true ]) === false }
    test "and([false, false]) => false" { and([false, false]) === false }
    test "and(['',    true ]) => false" { and(['',    true ]) === false }
    test "and(['x',   true ]) => true " { and(['x',   true ]) === true  }
    test "and([0,     true ]) => false" { and([0,     true ]) === false }
    test "and([1,     true ]) => true " { and([1,     true ]) === true  }
  }

  describe "or :: [Truthy] -> Bool" {
    test "or([true,  true ]) => true " { or([true,  true ]) === true  }
    test "or([true,  false]) => true " { or([true,  false]) === true  }
    test "or([false, true ]) => true " { or([false, true ]) === true  }
    test "or([false, false]) => false" { or([false, false]) === false }
    test "or(['',    true ]) => true " { or(['',    true ]) === true  }
    test "or(['',    false]) => false" { or(['',    false]) === false }
    test "or(['x',   true ]) => true " { or(['x',   true ]) === true  }
    test "or([0,     true ]) => true " { or([0,     true ]) === true }
    test "or([0,     false]) => false" { or([0,     false]) === false }
    test "or([1,     true ]) => true " { or([1,     true ]) === true  }
    test "or([1,     false]) => true " { or([1,     false]) === true  }
  }

  describe "isObject" {
    test "isObject({})  => true " { isObject({})  === true  }
    test "isObject([])  => false" { isObject([])  === false }
    test "isObject(0)   => false" { isObject(0)   === false }
    test "isObject(/x/) => false" { isObject(/x/) === false }
    test "isObject('0') => false" { isObject('x') === false }
    test "isObject(0)   => false" { isObject(0)   === false }
  }

  describe "isArray" {
    test "isArray([])  => true " { isArray([])  === true  }
    test "isArray({})  => false" { isArray({})  === false }
    test "isArray(0)   => false" { isArray(0)   === false }
    test "isArray(/x/) => false" { isArray(/x/) === false }
    test "isArray('x') => false" { isArray('x') === false }
  }

  describe "isNumber" {
    test "isNumber(0)   => true " { isNumber(0)   === true  }
    test "isNumber([])  => false" { isNumber([])  === false }
    test "isNumber({})  => false" { isNumber({})  === false }
    test "isNumber(/x/) => false" { isNumber(/x/) === false }
    test "isNumber('x') => false" { isNumber('x') === false }
  }

  describe "isRegExp" {
    test "isRegExp(/x/) => true " { isRegExp(/x/) === true  }
    test "isRegExp(0)   => false" { isRegExp(0)   === false }
    test "isRegExp([])  => false" { isRegExp([])  === false }
    test "isRegExp({})  => false" { isRegExp({})  === false }
    test "isRegExp('x') => false" { isRegExp('x') === false }
  }

  describe "isString" {
    test "isString('x') => true " { isString('x') === true  }
    test "isString(/x/) => false" { isString(/x/) === false }
    test "isString(0)   => false" { isString(0)   === false }
    test "isString([])  => false" { isString([])  === false }
    test "isString({})  => false" { isString({})  === false }
  }

  describe "isNull" {
    test "isNull(null)  => true " { isNull(null)  === true  }
    test "isNull('x')   => true " { isNull('x')   === false }
    test "isNull(/x/)   => false" { isNull(/x/)   === false }
    test "isNull(0)     => false" { isNull(0)     === false }
    test "isNull([])    => false" { isNull([])    === false }
    test "isNull({})    => false" { isNull({})    === false }
  }

  describe "isUndef" {
    test "isUndef(undefined)  => true " { isUndef(undefined)  === true  }
    test "isUndef('x')        => false" { isUndef('x')        === false }
    test "isUndef(/x/)        => false" { isUndef(/x/)        === false }
    test "isUndef(0)          => false" { isUndef(0)          === false }
    test "isUndef([])         => false" { isUndef([])         === false }
    test "isUndef({})         => false" { isUndef({})         === false }
  }

  describe "exists" {
    test "exists(undefined)  => false" { exists(undefined)  === false }
    test "exists(null)       => false" { exists(null)       === false }
    test "exists('x')        => true " { exists('x')        === true  }
    test "exists(/x/)        => true " { exists(/x/)        === true  }
    test "exists(0)          => true " { exists(0)          === true  }
    test "exists([])         => true " { exists([])         === true  }
    test "exists({})         => true " { exists({})         === true  }
  }
}

describe "CurryJS.Data.Collection" {
  {foldl, foldl1, foldr, foldr1} := C.Data.Collection;

  describe "foldl :: (a -> b -> a) -> a -> [b] -> a" {
    it "should fold a list from the left" {
      test "concat" { foldl(fun (acc, x) = acc.concat(x), [], [6, 4, 2]) =>= [6, 4, 2] }
    }
  }

  describe "foldl1 :: (a -> a -> a) -> [a] -> a" {
    it "should fold a list from the left using the first element as accumulator" {
      test "concat" {
        foldl1(fun (acc, x) = acc.concat([x]), [[], [6], [4], [2]]) =>= [[6], [4], [2]]
      }
    }
  }

  describe "foldr :: (a -> b -> b) -> b -> [a] -> b" {
    it "should fold a list from the right" {
      test "concat" {
        foldr(fun (acc, x) = acc.concat(x), [], [6, 4, 2]) =>= [2, 4, 6]
      }
    }
  }

  describe "foldr1 :: (a -> a -> a) -> [a] -> a" {
    it "should fold a list from the left using the last element as accumulator" {
      test "concat" { 
        foldr1(fun (acc, x) = acc.concat([x]), [[6], [4], [2], []]) =>= [[2], [4], [6]] 
      }
    }
  }
}

describe "CurryJS.Control.Functor" {
  { map } := C.Control.Functor;

  describe "map :: Functor f => (a -> b) -> f a -> f b" {
    it "should delegate to the functor" {
      obj := { map: fun (f) = f(1) }

      test "map over functor" {
        map(fun (x) = x + 2, obj) === 3
      }
    }
  }
}

describe "CurryJS.Control.Applicative" {
  { ap } := C.Control.Applicative;

  describe "ap :: Applicative f => f (a -> b) -> f a -> f b" {
    it "should delegate to the applicative" {
      obj := { ap: fun (f) = f(1) }

      test "apply over functor" {
        ap(fun (x) = x + 2, obj) === 3
      }
    }
  }
}

describe "CurryJS.Control.Monad" {
  { chain } := C.Control.Monad;

  describe "chain :: Monad m => m a -> (a -> m b) -> m b" {
    it "should delegate to the monad instance" {
      obj := { chain: fun (f) = f(1) }

      test "chain monadic values" {
        chain(obj, fun (x) = x + 2) === 3
      }
    }
  }
}