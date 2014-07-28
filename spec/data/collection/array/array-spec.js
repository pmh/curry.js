{ id } := require('../../../../lib/data/function')

describe "Data.Collection.Array" {
  describe "ap" {
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

  describe "chain" {
    fun m_prod (x) -> [x*x]
    fun m_inc  (x) -> [x+1]

    it "satisfies the monad laws" {
      test "associativity" {
        [1,2,3].chain(m_prod).chain(m_inc) =>= [1,2,3].chain(fun (x) -> m_prod(x).chain(m_inc) )
      }
    }
  }
}