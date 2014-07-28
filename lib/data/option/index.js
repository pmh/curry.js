(function () {
  "use strict";

  { instance } := require("../../core")
  { Base     } := require("../../adt-derivers.js")
  { Monad    } := require("../../control/monad")
  { Monoid   } := require("../../control/monoid")
  
  union Option { Some { val: * }, None } deriving Base

  instance(Monad, Option, {
    of    : fun (self, x) -> Some(x),
    chain : fun (self, f) -> match {
      (Some(x) , Function) => f(x),
      (None    , Function) => None
    }
  });

  instance(Monoid, Option, {
    empty  : fun (self) -> None,
    concat : fun (a, b) -> match {
      (Option   , None    ) => a,
      (None     , Option  ) => b,
      (Some(v1) , Some(v2)) => Some (v1.concat(v2))
    }
  });

  // maybe :: b -> (a -> b) -> Option a -> b
  fun maybe (n, f, option) -> match {
    (n, *, None)    => n,
    (*, f, Some(x)) => f(x)
  }

  // fromOption :: a -> Option a -> a
  fun fromOption (n, o) -> match (o) {
    Some(x) => x,
    None    => n
  }

  module.exports = { Option     : Option
                   , Some       : Some
                   , None       : None
                   , maybe      : maybe
                   , fromOption : fromOption
                   }
}());