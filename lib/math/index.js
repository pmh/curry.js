(function () {
  "use strict";

  require("../core")

  // plus :: Number a => a -> a -> a
  fun plus (a, b) -> a + b

  // minus :: Number a => a -> a -> a
  fun minus (a, b) -> a - b

  // times :: Number a => a -> a -> a
  fun times (a, b) -> a * b

  // div :: Number a => a -> a -> a
  fun div (a, b) -> a / b

  module.exports = { plus  : plus
                   , minus : minus
                   , times : times
                   , div   : div
                   }

}());