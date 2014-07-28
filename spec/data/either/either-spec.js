{ id                  } := require("../../../lib/data/function");
{ map                 } := require("../../../lib/control/functor");
{ Either, Left, Right } := require("../../../lib/data/either");

describe "Data.Either" {
  describe "map" {
    fun inc    (x) -> x + 1
    fun square (x) -> x * x

    it "satisfies the functor laws" {
      test "map identity" {
        map(id, Right(2)) =>= Right(2)
        map(id, Left(2))  =>= id(Left(2))
      }

      test "composition" {
        map(inc .. square, Right(2)) =>= map(inc) .. map(square) $ Right(2)
      }
    }
  }

  describe "ap" {
    fun comp (f) -> fun (g) -> fun (x) -> f(g(x))
    fun add  (a, b) -> a + b
    fun prod (a)    -> a * a

    it "satisfies the applicative laws" {
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
  }

  describe "concat" {
    it "returns it's first argument when the second argument is Left" {
      test "concat" { Right(1).concat(Left(2)) =>= Right(1) }
    }

    it "returns it's second argument when the first argument is Left" {
      test "concat" { Left(2).concat(Right(1)) =>= Right(1) }
    }

    it "concatenates the wrapped values and wraps them back up when both are Right" {
      test "concat" { Right([1]).concat(Right([2])) =>= Right([1,2]) }
    }

    it "satisfies the monoid laws" {
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

  describe "chain" {
    fun m_prod (x) -> Right(x*x)
    fun m_inc  (x) -> Right(x+1)

    it "satisfies the monad laws" {
      test "associativity" {
        Right(2).chain(m_prod).chain(m_inc) =>= Right(2).chain(fun (x) -> m_prod(x).chain(m_inc) )
      }
    }
  }
}