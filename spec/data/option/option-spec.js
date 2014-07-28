{ id                                    } := require("../../../lib/data/function");
{ map                                   } := require("../../../lib/control/functor");
{ Option, Some, None, maybe, fromOption } := require("../../../lib/data/option");

describe "Data.Option" {
  describe "map" {
    fun inc    (x) -> x + 1
    fun square (x) -> x * x

    it "satisfies the functor laws" {
      test "identity" {
        map(id, Some(2)) =>= Some(2)
        map(id, None)    =>= id(None)
      }

      test "composition" {
        map(inc .. square, Some(2)) =>= map(inc) .. map(square) $ Some(2)
      }
    }
  }

  describe "ap" {
    fun comp (f) -> fun (g) -> fun (x) -> f(g(x))
    fun add  (a, b) -> a + b
    fun prod (a)    -> a * a

    it "satisfies the applicative laws" {
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
  }

  describe "concat" {
    it "returns it's first argument when the second argument is None" {
      test "concat" { Some(1).concat(None) =>= Some(1) }
    }

    it "returns it's second argument when the first argument is None" {
      test "concat" { None.concat(Some(1)) =>= Some(1) }
    }

    it "concatenates the wrapped values and wraps them back up when both are Some" {
      test "concat" { Some([1]).concat(Some([2])) =>= Some([1,2]) }
    }

    it "satisfies the monoid laws" {
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

  describe "chain" {
    fun m_prod (x) -> Some(x*x)
    fun m_inc  (x) -> Some(x+1)

    it "satisfies the monad laws" {
      test "associativity" {
        Some(2).chain(m_prod).chain(m_inc) =>= Some(2).chain(fun (x) -> m_prod(x).chain(m_inc) )
      }
    }
  }

  describe "maybe" {
    it "returns the default value if the option value is None" {
      test "maybe" { maybe("Nothing", fun (x) -> x + "!!", None) =>= "Nothing" }
    }

    it "returns the result of applying to the value inside the Some if the option value is Some" {
      test "maybe" { maybe("Nothing", fun (x) -> x + "!!", Some("foo")) =>= "foo!!" }
    }
  }

  describe "fromOption" {
    it "returns the default value if the option value is None" {
      test "fromOption" { fromOption("Nothing", None) =>= "Nothing" }
    }

    it "returns the value inside the Some if the option value is Some" {
      test "fromOption" { fromOption("Nothing", Some("foo")) =>= "foo" }
    }
  }
}