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

describe "CurryJS.Data.Option" {
  { map                } := C.Control.Functor;
  { Option, Some, None } := C.Data.Option;

  describe "map :: Functor f => (a -> b) -> f a -> f b" {
    fun inc    (x) = x + 1
    fun id     (x) = x
    fun inc    (x) = x + 1
    fun square (x) = x * x

    test "identity" {
      map(id, Some(2)) =>= Some(2)
      map(id, None)    =>= id(None)
    }

    test "composition" {
      map(inc .. square, Some(2)) =>= map(inc) .. map(square) $ Some(2)
    }
  }

  describe "ap :: Applicative f => f (a -> b) -> f a -> f b" {
    fun comp (f) = fun (g) = fun (x) = f(g(x))

    fun id   (x)    = x
    fun add  (a, b) = a + b
    fun prod (a)    = a * a

    test "identity" {
      Option.of(id) <*> Some(2) =>= Some(2)
    }

    test "composition" {
      comp <$> Some(add(2)) <*> Some(prod) <*> Some(2) =>=
        Some(add(2)) <*> (Some(prod) <*> Some(2))
    }

    test "homomorphism" {
      Option.of(prod) <*> Some(2) =>= Option.of(prod(2))
    }

    test "interchange" {
      Some(prod) <*> Some(2) =>= Some(fun (f) = f(2)) <*> Some(prod)
    }
  }

  describe "concat :: Monoid a => a -> a -> a" {
    test "associativity" {
      Some([1]).concat(Some([2])).concat(Some([3])) =>=
        Some([1]).concat(Some([2]).concat(Some([3])))
    }

    test "right identity" {
      Some([1]).concat(Some([1]).empty()) =>= Some([1])
    }

    test "left identity" {
      Some([1]).empty().concat(Some([1])) =>= Some([1])
    }
  }

  describe "chain :: Monad m => m a -> (a -> m b) -> m b" {
    fun m_prod (x) = Some(x*x)
    fun m_inc  (x) = Some(x+1)

    test "associativity" {
      Some(2).chain(m_prod).chain(m_inc) =>= Some(2).chain(fun (x) = m_prod(x).chain(m_inc) )
    }
  }
}

describe "CurryJS.Data.Option" {
  { map                 } := C.Control.Functor;
  { Either, Left, Right } := C.Data.Either;

  describe "map :: Functor f => (a -> b) -> f a -> f b" {
    fun inc    (x) = x + 1
    fun id     (x) = x
    fun inc    (x) = x + 1
    fun square (x) = x * x

    test "map identity" {
      map(id, Right(2)) =>= Right(2)
      map(id, Left(2))  =>= id(Left(2))
    }

    test "composition" {
      map(inc .. square, Right(2)) =>= map(inc) .. map(square) $ Right(2)
    }
  }

  describe "ap :: Applicative f => f (a -> b) -> f a -> f b" {
    fun comp (f) = fun (g) = fun (x) = f(g(x))

    fun id   (x)    = x
    fun add  (a, b) = a + b
    fun prod (a)    = a * a

    test "identity" {
      Either.of(id) <*> Right(2) =>= Right(2)
    }

    test "composition" {
      comp <$> Right(add(2)) <*> Right(prod) <*> Right(2) =>=
        Right(add(2)) <*> (Right(prod) <*> Right(2))
    }

    test "homomorphism" {
      Either.of(prod) <*> Right(2) =>= Either.of(prod(2))
    }

    test "interchange" {
      Right(prod) <*> Right(2) =>= Right(fun (f) = f(2)) <*> Right(prod)
    }
  }

  describe "concat :: Monoid a => a -> a -> a" {
    test "associativity" {
      Right([1]).concat(Right([2])).concat(Right([3])) =>=
        Right([1]).concat(Right([2]).concat(Right([3])))
    }

    test "right identity" {
      Right([1]).concat(Right([1]).empty()) =>= Right([1])
    }

    test "left identity" {
      Right([1]).empty().concat(Right([1])) =>= Right([1])
    }
  }

  describe "chain :: Monad m => m a -> (a -> m b) -> m b" {
    fun m_prod (x) = Right(x*x)
    fun m_inc  (x) = Right(x+1)

    test "associativity" {
      Right(2).chain(m_prod).chain(m_inc) =>= Right(2).chain(fun (x) = m_prod(x).chain(m_inc) )
    }
  }
}

describe "CurryJS.Data.Collection" {
  {foldl, foldl1, foldr, foldr1, flatten} := C.Data.Collection;

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

  describe "flatten :: Monoid a => [a] -> a" {
    var Some = C.Data.Option.Some;

    it "flattens a list of monoid values" {
      test "list of lists" {
        flatten([[1,2,3], [4,5,6]]) =>= [1,2,3,4,5,6]
      }
      test "list of options" {
        flatten([Some([1]), Some([2])]) =>= Some([1,2])
      }
    }
  }
}

describe "CurryJS.Data.Array" {
  describe "ap :: Applicative f => f (a -> b) -> f a -> f b" {
    fun comp (f) = fun (g) = fun (x) = f(g(x))

    fun id   (x)    = x
    fun add  (a, b) = a + b
    fun prod (a)    = a * a

    it "satisfies the laws" {
      test "identity" {
        Array.of(id) <*> [2] =>= [2]
      }

      test "composition" {
        comp <$> [add(2)] <*> [prod] <*> [2] =>=
          [add(2)] <*> ([prod] <*> [2])
      }

      test "homomorphism" {
        Array.of(prod) <*> [2] =>= Array.of(prod(2))
      }

      test "interchange" {
        [prod] <*> [2] =>= [fun (f) = f(2)] <*> [prod]
      }
    }
  }

  describe "chain :: Monad m => m a -> (a -> m b) -> m b" {
    fun m_prod (x) = [x*x]
    fun m_inc  (x) = [x+1]

    test "associativity" {
      [1,2,3].chain(m_prod).chain(m_inc) =>= [1,2,3].chain(fun (x) = m_prod(x).chain(m_inc) )
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
      fa := { ap: fun (fb) = this.val(fb.val), val: fun (x) = x + 1 }
      fb := { val: 2 }

      test "apply over functor" {
        ap(fa, fb) === 3
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