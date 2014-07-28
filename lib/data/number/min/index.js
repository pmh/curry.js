(function () {
  "use strict";

  { instance } := require("../../../core")
  { Base     } := require("../../../adt-derivers")
  { Monoid   } := require("../../../control/monoid")
  
  data Min (Number) deriving Base

  instance(Monoid, Min, {
    empty  : fun (self) -> Min(Infinity),
    concat : fun (a, b) -> match {
      (Min(x), Min(y)) => Min(x < y ? x : y)
    }
  })

  fun getMin (x) -> match { Min(x) => x }

  module.exports = { Min    : Min
                   , getMin : getMin
                   }
}());