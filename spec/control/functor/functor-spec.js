{ map } := require("../../../lib/control/functor");

describe "Control.Functor" {
  describe "map" {
    it "should delegate to the functor" {
      obj := { map: fun (f) -> f(1) }

      test "map over functor" {
        map(fun (x) -> x + 2, obj) === 3
      }
    }
  }
}