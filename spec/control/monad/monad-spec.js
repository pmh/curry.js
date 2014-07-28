{ chain } := require("../../../lib/control/monad");

describe "Control.Monad" {
  describe "chain" {
    it "should delegate to the monad instance" {
      obj := { chain: fun (f) -> f(1) }

      test "chain monadic values" {
        chain(obj, fun (x) -> x + 2) === 3
      }
    }
  }
}