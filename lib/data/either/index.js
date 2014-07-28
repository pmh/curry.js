(function () {
  "use strict";

  { instance } := require("../../core")
  { Base     } := require("../../adt-derivers.js")
  { Monad    } := require("../../control/monad")
  { Monoid   } := require("../../control/monoid")
  
  union Either { Left { l: * }, Right { r: * } } deriving Base

  instance(Monad, Either, {
    of    : fun (self, x) -> Right(x),
    chain : fun (self, f) -> match {
      (Right(x) , Function) => f(x),
      (Left(x)  , *       ) => self
    }
  });

  instance(Monoid, Either, {
    empty  : fun (self) -> Left(),
    concat : fun (a, b) -> match {
      (Either    , Left(x)  ) => a,
      (Left(x)   , Either   ) => b,
      (Right(r1) , Right(r2)) => Right (r1.concat(r2))
    }
  })

  module.exports = { Either : Either
                   , Left   : Left
                   , Right  : Right
                   }
}());