(function () {
  "use strict";

  { instance } := require("../../../core")
  { Base     } := require("../../../adt-derivers")
  { Monoid   } := require("../../../control/monoid")
  
  data Max (Number) deriving Base

  instance(Monoid, Max, {
    empty  : fun (self) -> Max(-Infinity),
    concat : fun (a, b) -> match {
      (Max(x), Max(y)) => Max(x > y ? x : y)
    }
  })

  fun getMax (x) -> match { Max(x) => x }

  module.exports = { Max    : Max
                   , getMax : getMax
                   }
}());