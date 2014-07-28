(function () {
  "use strict";

  { __, Protocol } := require("../../core")
  { map          } := require("../../control/functor")

  Monad := Protocol('Monad', {
    constructor : {
      of: fun (x) -> this.prototype.of(x)
    },
    prototype : {
      of    : Protocol.required,
      chain : Protocol.required,

      map   : fun (self, f) -> self >>= self.of .. f,
      ap    : fun (self, x) -> self >>= map(__, x)
    }
  });

  // chain :: Monad m => m a -> (a -> m b) -> m b
  fun chain (xs, f) -> xs.chain(f);

  // pure :: Monad m => m -> b -> m b
  fun pure (m, x) -> m.of ? m.of(x) : m.constructor.of(x)

  module.exports = { Monad : Monad
                   , chain : chain
                   , pure  : pure
                   }

}());