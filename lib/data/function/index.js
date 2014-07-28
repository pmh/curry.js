(function () {
  "use strict";

  require("../../core")

  // id :: a -> a
  fun id (x) -> x

  // constant :: a -> b -> a
  fun constant (x) -> fun (_) -> x

  // unary :: Function -> (a -> b)
  fun unary (f) -> fun (x) -> f(x)

  // binary :: Function -> (a -> b -> c)
  fun binary (f) -> fun (x, y) -> f(x, y)

  // ternary :: Function -> (a -> b -> c -> d)
  fun ternary (f) -> fun (x, y, z) -> f(x, y, z)

  module.exports = { id       : id
                   , constant : constant
                   , unary    : unary
                   , binary   : binary
                   , ternary  : ternary
                   }
}());