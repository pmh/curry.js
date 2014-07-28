(function () {
  "use strict";
  
  { Protocol } := require("../../core")

  Monoid := Protocol('Monoid', {
    constructor : {
      empty: fun -> this.prototype.empty()
    },
    prototype : {
      empty  : Protocol.required,
      concat : Protocol.required
    }
  });

  // concat :: (Monoid a) => a -> a -> a
  fun concat (a, b) ->
    a.concat(b);

  module.exports = { Monoid : Monoid
                   , concat : concat
                   }

}());