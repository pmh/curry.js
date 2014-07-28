{ concat } := require("../../../lib/control/monoid");

describe "Control.Monoid" {
  describe "concat" {
    it "should delegate to the monoid instance" {
      obj := { concat: fun (x) -> x + 2 }

      test "concat monoid values" {
        concat(obj, 3) === 5
      }
    }
  }
}