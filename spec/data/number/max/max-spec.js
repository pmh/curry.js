{ Max, getMax } := require("../../../../lib/data/number/max");

describe "Data.Number.Max" {
  describe "empty" {
    it "returns Max(-Infinity)" {
      test "empty" { Max.empty() =>= Max(-Infinity) }
    }
  }

  describe "getMax" {
    it "returns the wrapped number" {
      test "getMax" { getMax(Max(2)) == 2 }
    }
  }

  describe "concat" {
    it "returns a Max containing the largest value" {
      test "concat" { Max(2).concat(Max(4)) =>= Max(4) }
    }

    it "satisfies the monoid laws" {
      test "associativity" {
        Max(1).concat(Max(2)).concat(Max(3)) =>=
          Max(1).concat(Max(2).concat(Max(3)))
      }

      test "right identity" {
        Max(1).concat(Max.empty()) =>= Max(1)
      }

      test "left identity" {
        Max.empty().concat(Max(1)) =>= Max(1)
      }
    }
  }
}