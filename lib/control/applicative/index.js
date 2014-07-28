(function () {
  "use strict";

  { Protocol } := require("../../core")

  Applicative := Protocol("Applicative", {
    prototype : { ap : Protocol.required }
  });

  // ap :: Applicative f => f (a -> b) -> f a -> f b
  fun ap (f, xs) -> f.ap(xs);

  module.exports = { Applicative : Applicative
                   , ap          : ap
                   }

}());