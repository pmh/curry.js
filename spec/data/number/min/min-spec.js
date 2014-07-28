{ Min, getMin } := require("../../../../lib/data/number/min");

describe "Data.Number.Min" {
  describe "empty" {
    it "returns Min(Infinity)" {
      test "empty" { Min.empty() =>= Min(Infinity) }
    }
  }

  describe "getMin" {
    it "returns the wrapped number" {
      test "getMin" { getMin(Min(2)) == 2 }
    }
  }

  describe "concat" {
    it "returns a Min containing the smallest value" {
      test "concat" { Min(2).concat(Min(4)) =>= Min(2) }
    }

    it "satisfies the monoid laws" {
      test "associativity" {
        Min(1).concat(Min(2)).concat(Min(3)) =>=
          Min(1).concat(Min(2).concat(Min(3)))
      }

      test "right identity" {
        Min(1).concat(Min.empty()) =>= Min(1)
      }

      test "left identity" {
        Min.empty().concat(Min(1)) =>= Min(1)
      }
    }
  }
}