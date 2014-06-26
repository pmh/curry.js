var buster = require("buster")
  , expect = buster.expect;

buster.spec.expose();

var C = require("../lib/curry");

describe "CurryJS" {
  var Core = C.Core;

  describe "curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))" {

    it "should return a curried version of the function" {
      var addMany = Core.curry(function (a, b, c, d) { return a + b + c + d })
        , nums    = Core.curry(function (a, b)       { return [a, b]        });
      
      test "single argument application" { addMany(1)(2)(3)(4) === 10     }
      test "multi argument application"  { addMany(1, 2)(3, 4) === 10     }
      test "full application"            { addMany(1, 2, 3, 4) === 10     }
      test "flipped application"         { nums(Core.__, 2)(1) =>= [1, 2] }
    };

    it "should accept an optional arity argument" {
      var curried = Core.curry(function () { return [].slice.call(arguments) }, 3);
      test "partial application" {
        curried(1)(2)(3) =>= [1,2,3]
      }
    }

    it "should be installed on Function.prototype" {
      var add = (function (a, b) { return a + b; }).curry();

      test "single argument application" { add(2)(4) === (6) }
    };
  }

  describe "compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)" {

    it "should compose multiple functions" {
      var split  = Core.curry (function (sep, s ) { return s.split(sep);   })
        , map    = Core.curry (function (f, xs  ) { return xs.map(f);      })
        , upcase = Core.curry (function (s      ) { return s.toUpperCase() })
        , join   = Core.curry (function (sep, xs) { return xs.join(sep);   });

      test "function composition" {
        Core.compose(join("-"), map(upcase), split(" "))("foo bar baz") === "FOO-BAR-BAZ"
      }
    };
  }
}

describe "CurryJS.Data.Collection" {
  var Collection = C.Data.Collection;

  describe "foldl :: (a -> b -> a) -> a -> [b] -> a" {
    it "should fold a list from the left" {
      test "concat" { Collection.foldl(fun (acc, x) = acc.concat(x), [], [6, 4, 2]) =>= [6, 4, 2] }
    }
  }

  describe "foldl1 :: (a -> a -> a) -> [a] -> a" {
    it "should fold a list from the left using the first element as accumulator" {
      test "concat" {
        Collection.foldl1(fun (acc, x) = acc.concat([x]), [[], [6], [4], [2]])
          =>= [[6], [4], [2]]
      }
    }
  }

  describe "foldr :: (a -> b -> b) -> b -> [a] -> b" {
    it "should fold a list from the right" {
      test "concat" {
        Collection.foldr(fun (acc, x) = acc.concat(x), [], [6, 4, 2]) =>= [2, 4, 6]
      }
    }
  }

  describe "foldr1 :: (a -> a -> a) -> [a] -> a" {
    it "should fold a list from the left using the last element as accumulator" {
      test "concat" { 
        Collection.foldr1(fun (acc, x) = acc.concat([x]), [[6], [4], [2], []])
          =>= [[2], [4], [6]] 
      }
    }
  }
}