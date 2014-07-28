(function () {
  "use strict";

  { Protocol } := require("../../core")
  { unary    } := require("../../data/function")

  Functor := Protocol("Functor", {
    prototype : { map : Protocol.required }
  });

  // map :: Functor f => (a -> b) -> f a -> f b
  fun map (f, xs) -> xs.map(unary(f));

  module.exports = { Functor : Functor
                   , map     : map
                   }
}());