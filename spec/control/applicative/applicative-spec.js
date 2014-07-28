{ ap } := require("../../../lib/control/applicative");

describe "Control.Applicative" {

  describe "ap" {
    it "should delegate to the applicative" {
      fa := { ap: fun (fb) -> this.val(fb.val), val: fun (x) -> x + 1 }
      fb := { val: 2 }

      test "apply over functor" {
        ap(fa, fb) === 3
      }
    }
  }
}
