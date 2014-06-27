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