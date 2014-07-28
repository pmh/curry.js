{ Sum, getSum } := require("../../../../lib/data/number/sum");

describe "Data.Number.Sum" {
  describe "empty" {
    it "returns Sum(0)" {
      test "empty" { Sum.empty() =>= Sum(0) }
    }
  }

  describe "getSum" {
    it "returns the wrapped number" {
      test "getSum" { getSum(Sum(2)) == 2 }
    }
  }

  describe "concat" {
    it "returns a Sum containing the sum of the values" {
      test "concat" { Sum(2).concat(Sum(4)) =>= Sum(6) }
    }

    it "satisfies the monoid laws" {
      test "associativity" {
        Sum(1).concat(Sum(2)).concat(Sum(3)) =>=
          Sum(1).concat(Sum(2).concat(Sum(3)))
      }

      test "right identity" {
        Sum(1).concat(Sum.empty()) =>= Sum(1)
      }

      test "left identity" {
        Sum.empty().concat(Sum(1)) =>= Sum(1)
      }
    }
  }
}
