(function () {
  "use strict";

  { instance } := require("../../../core")
  { Base     } := require("../../../adt-derivers")
  { Monoid   } := require("../../../control/monoid")
  
  data Sum (Number) deriving Base

  instance(Monoid, Sum, {
    empty  : fun -> Sum(0),
    concat : fun (a, b) -> match {
      (Sum(x), Sum(y)) => Sum (x + y)
    }
  })

  fun getSum (x) -> match { Sum(x) => x }

  module.exports = { Sum    : Sum
                   , getSum : getSum
                   }
}());