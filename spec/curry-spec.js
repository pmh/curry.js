var C = require("../lib/curry");

describe "CurryJS" {
  { __, curry, compose, Protocol, instance } := C.Core;

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

  describe "Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }" {
    it "should create a protocol with correct fields" {
      specObj                  := { foo: 'bar' }
      { name, spec, instance } := Protocol("MyProtocol", specObj);

      test "name field" {
        name == "MyProtocol"
      }

      test "spec field" {
        spec == specObj
      }

      test "instance field" {
        typeof(instance) == "function"
      }
    }
  }

  describe "instance :: Protocol -> ADT -> Object -> undefined" {
    it "should should not overwrite existing fields" {
      protocol = Protocol("MyProtocol", { constructor: { foo: fun () -> "bar2" }, prototype: { bar: fun () -> "baz2" } });
      type     = { foo: fun () -> "bar1", prototype: { bar: fun () -> "baz1" } }

      instance(protocol, type, {});

      { foo } := type;
      { bar } := type.prototype;

      test "existing constructor fields" {
        foo() == "bar1"
      }

      test "existing prototype fields" {
        bar() == "baz1"
      }
    }

    it "should copy over default implementations" {
      protocol = Protocol("MyProtocol", { constructor: { foo: fun () -> "bar" }, prototype: { bar: fun () -> "baz" } });
      type     = { prototype: { } }

      instance(protocol, type, {});

      { foo } := type;
      { bar } := type.prototype;

      test "default constructor implementations" {
        foo() == "bar"
      }

      test "default prototype implementations" {
        bar() == "baz"
      }
    }

    it "should throw an error on missing implementations" {
      protocol = Protocol("MyProtocol", { constructor: { foo: Protocol.required } });
      type     = {}

      test "missing constructor implementation" {
        instance(protocol, type, {}) =!= "Error"
      }

      protocol = Protocol("MyProtocol", { prototype: { foo: Protocol.required } });
      type     = { prototype: { } }

      test "missing prototype implementation" {
        instance(protocol, type, {}) =!= "Error"
      }
    }
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

describe "CurryJS.Math" {
  { plus, minus, times, div } := C.Math;

  describe "plus" {
    it "it performs addition" {
      test "addition" { plus(4, 2) == 6 }
    }
  }

  describe "minus" {
    it "it performs subtraction" {
      test "subtraction" { minus(4, 2) == 2 }
    }
  }

  describe "times" {
    it "it performs multiplication" {
      test "multiplication" { times(4, 2) == 8 }
    }
  }

  describe "div" {
    it "it performs division" {
      test "division" { div(4, 2) == 2 }
    }
  }
}

describe "CurryJS.Function" {
  { id, constant, unary, binary, ternary } := C.Function;

  describe "id :: a -> a" {
    it "returns it's argument unchanged" {
      test "identity" { id(23) == 23 }
    }
  }

  describe "constant :: a -> a" {
    it "returns a new function that always returns the argument" {
      test "constant" { constant(23)() == 23 }
    }
  }

  describe "unary :: Function -> (a -> b)" {
    it "it turns an n-arity function into a unary one" {
      test "unary" {
        unary(fun (x, y) -> [x, y])(1,2)(3) =>= [1,3]
      }
    }
  }

  describe "binary :: Function -> (a -> b)" {
    it "it turns a n-arity function into a binary one" {
      test "binary" {
        binary(fun (x, y, z) -> [x, y, z])(1,2,3)(4) =>= [1,2,4]
      }
    }
  }

  describe "ternary :: Function -> (a -> b)" {
    it "it turns a n-arity function into a ternary one" {
      test "ternary" {
        ternary(fun (x, y, z, w) -> [x, y, z, w])(1,2,3,4)(5) =>= [1,2,3,5]
      }
    }
  }
}

describe "CurryJS.Number.Sum" {
  { Sum, getSum } := C.Number.Sum;

  describe "empty :: Monoid a => a" {
    it "returns 0" {
      test "empty" { Sum(2).empty() =>= Sum(0) }
    }
  }

  describe "getSum :: Sum a -> a" {
    it "returns the wrapped number" {
      test "getSum" { getSum(Sum(2)) == 2 }
    }
  }

  describe "concat :: Monoid a => a -> a -> a" {
    it "returns a Sum containing the sum of the values" {
      test "concat" { Sum(2).concat(Sum(4)) =>= Sum(6) }
    }

    it "satisfies the monoid laws" {
      test "associativity" {
        Sum(1).concat(Sum(2)).concat(Sum(3)) =>=
          Sum(1).concat(Sum(2).concat(Sum(3)))
      }

      test "right identity" {
        Sum(1).concat(Sum(1).empty()) =>= Sum(1)
      }

      test "left identity" {
        Sum(1).empty().concat(Sum(1)) =>= Sum(1)
      }
    }
  }
}

describe "CurryJS.Number.Product" {
  { Product, getProduct } := C.Number.Product;

  describe "empty :: Monoid a => a" {
    it "returns 1" {
      test "empty" { Product(2).empty() =>= Product(1) }
    }
  }

  describe "getProduct :: Product a -> a" {
    it "returns the wrapped number" {
      test "getProduct" { getProduct(Product(2)) == 2 }
    }
  }

  describe "concat :: Monoid a => a -> a -> a" {
    it "returns a Product containing the product of the values" {
      test "concat" { Product(2).concat(Product(4)) =>= Product(8) }
    }

    it "satisfies the monoid laws" {
      test "associativity" {
        Product(1).concat(Product(2)).concat(Product(3)) =>=
          Product(1).concat(Product(2).concat(Product(3)))
      }

      test "right identity" {
        Product(1).concat(Product(1).empty()) =>= Product(1)
      }

      test "left identity" {
        Product(1).empty().concat(Product(1)) =>= Product(1)
      }
    }
  }
}

describe "CurryJS.Number.Max" {
  { Max, getMax } := C.Number.Max;

  describe "empty :: Monoid a => a" {
    it "returns 1" {
      test "empty" { Max(2).empty() =>= Max(-Infinity) }
    }
  }

  describe "getMax :: Max a -> a" {
    it "returns the wrapped number" {
      test "getMax" { getMax(Max(2)) == 2 }
    }
  }

  describe "concat :: Monoid a => a -> a -> a" {
    it "returns a Max containing the largest value" {
      test "concat" { Max(2).concat(Max(4)) =>= Max(4) }
    }

    it "satisfies the monoid laws" {
      test "associativity" {
        Max(1).concat(Max(2)).concat(Max(3)) =>=
          Max(1).concat(Max(2).concat(Max(3)))
      }

      test "right identity" {
        Max(1).concat(Max(1).empty()) =>= Max(1)
      }

      test "left identity" {
        Max(1).empty().concat(Max(1)) =>= Max(1)
      }
    }
  }
}

describe "CurryJS.Number.Min" {
  { Min, getMin } := C.Number.Min;

  describe "empty :: Monoid a => a" {
    it "returns 1" {
      test "empty" { Min(2).empty() =>= Min(Infinity) }
    }
  }

  describe "getMin :: Min a -> a" {
    it "returns the wrapped number" {
      test "getMin" { getMin(Min(2)) == 2 }
    }
  }

  describe "concat :: Monoid a => a -> a -> a" {
    it "returns a Min containing the smallest value" {
      test "concat" { Min(2).concat(Min(4)) =>= Min(2) }
    }

    it "satisfies the monoid laws" {
      test "associativity" {
        Min(1).concat(Min(2)).concat(Min(3)) =>=
          Min(1).concat(Min(2).concat(Min(3)))
      }

      test "right identity" {
        Min(1).concat(Min(1).empty()) =>= Min(1)
      }

      test "left identity" {
        Min(1).empty().concat(Min(1)) =>= Min(1)
      }
    }
  }
}

describe "CurryJS.Data.Option" {
  { id                 } := C.Function;
  { map                } := C.Control.Functor;
  { Option, Some, None } := C.Data.Option;

  describe "map :: Functor f => (a -> b) -> f a -> f b" {
    fun inc    (x) -> x + 1
    fun square (x) -> x * x

    test "identity" {
      map(id, Some(2)) =>= Some(2)
      map(id, None)    =>= id(None)
    }

    test "composition" {
      map(inc .. square, Some(2)) =>= map(inc) .. map(square) $ Some(2)
    }
  }

  describe "ap :: Applicative f => f (a -> b) -> f a -> f b" {
    fun comp (f) -> fun (g) -> fun (x) -> f(g(x))
    fun add  (a, b) -> a + b
    fun prod (a)    -> a * a

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
      Some(prod) <*> Some(2) =>= Some(fun (f) -> f(2)) <*> Some(prod)
    }
  }

  describe "concat :: Monoid a => a -> a -> a" {

    it "returns it's first argument when the second argument is None" {
      test "concat" { Some(1).concat(None) =>= Some(1) }
    }

    it "returns it's second argument when the first argument is None" {
      test "concat" { None.concat(Some(1)) =>= Some(1) }
    }

    it "concatenates the wrapped values and wraps them back up when both are Some" {
      test "concat" { Some([1]).concat(Some([2])) =>= Some([1,2]) }
    }

    it "satisfies the laws" {
      test "associativity" {
        Some([1]).concat(Some([2])).concat(Some([3])) =>=
          Some([1]).concat(Some([2]).concat(Some([3])))
      }

      test "right identity" {
        Some([1]).concat(Option.empty()) =>= Some([1])
      }

      test "left identity" {
        Option.empty().concat(Some([1])) =>= Some([1])
      }
    }
  }

  describe "chain :: Monad m => m a -> (a -> m b) -> m b" {
    fun m_prod (x) -> Some(x*x)
    fun m_inc  (x) -> Some(x+1)

    test "associativity" {
      Some(2).chain(m_prod).chain(m_inc) =>= Some(2).chain(fun (x) -> m_prod(x).chain(m_inc) )
    }
  }
}

describe "CurryJS.Data.Either" {
  { id                  } := C.Function;
  { map                 } := C.Control.Functor;
  { Either, Left, Right } := C.Data.Either;

  describe "map :: Functor f => (a -> b) -> f a -> f b" {
    fun inc    (x) -> x + 1
    fun square (x) -> x * x

    test "map identity" {
      map(id, Right(2)) =>= Right(2)
      map(id, Left(2))  =>= id(Left(2))
    }

    test "composition" {
      map(inc .. square, Right(2)) =>= map(inc) .. map(square) $ Right(2)
    }
  }

  describe "ap :: Applicative f => f (a -> b) -> f a -> f b" {
    fun comp (f) -> fun (g) -> fun (x) -> f(g(x))
    fun add  (a, b) -> a + b
    fun prod (a)    -> a * a

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
      Right(prod) <*> Right(2) =>= Right(fun (f) -> f(2)) <*> Right(prod)
    }
  }

  describe "concat :: Monoid a => a -> a -> a" {
    it "returns it's first argument when the second argument is Left" {
      test "concat" { Right(1).concat(Left(2)) =>= Right(1) }
    }

    it "returns it's second argument when the first argument is Left" {
      test "concat" { Left(2).concat(Right(1)) =>= Right(1) }
    }

    it "concatenates the wrapped values and wraps them back up when both are Right" {
      test "concat" { Right([1]).concat(Right([2])) =>= Right([1,2]) }
    }

    it "satisfies the laws" {
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
  }

  describe "chain :: Monad m => m a -> (a -> m b) -> m b" {
    fun m_prod (x) -> Right(x*x)
    fun m_inc  (x) -> Right(x+1)

    test "associativity" {
      Right(2).chain(m_prod).chain(m_inc) =>= Right(2).chain(fun (x) -> m_prod(x).chain(m_inc) )
    }
  }
}

describe "CurryJS.Data.Collection" {
  { Option, Some, None } := C.Data.Option;
  {foldl, foldl1, foldr, foldr1, filter, head, tail, flatten} := C.Data.Collection;

  describe "foldl :: (a -> b -> a) -> a -> [b] -> a" {
    it "should fold a list from the left" {
      test "concat" { foldl(fun (acc, x) -> acc.concat(x), [], [6, 4, 2]) =>= [6, 4, 2] }
    }
  }

  describe "foldl1 :: (a -> a -> a) -> [a] -> a" {
    it "should fold a list from the left using the first element as accumulator" {
      test "concat" {
        foldl1(fun (acc, x) -> acc.concat([x]), [[], [6], [4], [2]]) =>= [[6], [4], [2]]
      }
    }
  }

  describe "foldr :: (a -> b -> b) -> b -> [a] -> b" {
    it "should fold a list from the right" {
      test "concat" {
        foldr(fun (acc, x) -> acc.concat(x), [], [6, 4, 2]) =>= [2, 4, 6]
      }
    }
  }

  describe "foldr1 :: (a -> a -> a) -> [a] -> a" {
    it "should fold a list from the left using the last element as accumulator" {
      test "concat" { 
        foldr1(fun (acc, x) -> acc.concat([x]), [[6], [4], [2], []]) =>= [[2], [4], [6]] 
      }
    }
  }

  describe "filter :: (a -> Bool) -> [a] -> [a]" {
    it "filters a list according to a predicate function" {
      test "filter" {
        filter(fun (x) -> x > 3, [1,2,3,4,5]) =>= [4, 5]
      }
    }
  }

  describe "head :: [a] -> Option a" {
    it "returns the first element wrapped in a some for non-empty arrays" {
      test "head non-empty" {
        head([1,2,3,4,5]) =>= Some(1)
      }
    }

    it "returns none for empty arrays" {
      test "head empty" {
        head([]) =>= None
      }
    }
  }

  describe "tail :: [a] -> [a]" {
    it "returns a list with all but the first element for non-empty arrays" {
      test "tail non-empty" {
        tail([1,2,3,4,5]) =>= [2,3,4,5]
      }
    }

    it "returns an empty list for empty arrays" {
      test "tail empty" {
        tail([]) =>= []
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
  { id } := C.Function;

  describe "ap :: Applicative f => f (a -> b) -> f a -> f b" {
    fun comp (f) -> fun (g) -> fun (x) -> f(g(x))
    fun add  (a, b) -> a + b
    fun prod (a)    -> a * a

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
        [prod] <*> [2] =>= [fun (f) -> f(2)] <*> [prod]
      }
    }
  }

  describe "chain :: Monad m => m a -> (a -> m b) -> m b" {
    fun m_prod (x) -> [x*x]
    fun m_inc  (x) -> [x+1]

    test "associativity" {
      [1,2,3].chain(m_prod).chain(m_inc) =>= [1,2,3].chain(fun (x) -> m_prod(x).chain(m_inc) )
    }
  }
}

describe "CurryJS.Data.Object" {
  { merge, set } := C.Data.Object;
  { map }        := C.Data.Collection;

  describe "merge :: Object -> Object -> Object" {
    it "merges two objects" {
      test "different keys" {
        merge({a: 'b'}, {c: 'd'}) =>= { a: 'b', c: 'd' }
      }
      test "same keys" {
        merge({a: 'b'}, {a: 'd'}) =>= { a: 'b' }
      }
    }
  }

  describe "set :: Object -> String -> a" {
    it "returns a new object with the new key present" {
      test "set new key" {
        set({a: 'b'}, 'c', 'd') =>= { a: 'b', c: 'd' }
      }
    }
  }

  describe "map :: Functor f => (a -> b) -> f a -> f b" {
    it "applies a function to every value of an object" {
      test "inc" {
        { a: 1, b: 2, c: 3 }.map(fun (x) -> x + 1) =>= { a: 2, b: 3, c: 4 }
      }
    }
  }
}

describe "CurryJS.Control.Functor" {
  { map } := C.Control.Functor;

  describe "map :: Functor f => (a -> b) -> f a -> f b" {
    it "should delegate to the functor" {
      obj := { map: fun (f) -> f(1) }

      test "map over functor" {
        map(fun (x) -> x + 2, obj) === 3
      }
    }
  }
}

describe "CurryJS.Control.Applicative" {
  { ap } := C.Control.Applicative;

  describe "ap :: Applicative f => f (a -> b) -> f a -> f b" {
    it "should delegate to the applicative" {
      fa := { ap: fun (fb) -> this.val(fb.val), val: fun (x) -> x + 1 }
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
      obj := { chain: fun (f) -> f(1) }

      test "chain monadic values" {
        chain(obj, fun (x) -> x + 2) === 3
      }
    }
  }
}