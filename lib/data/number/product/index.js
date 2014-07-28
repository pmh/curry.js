(function () {
  "use strict";

  { instance } := require("../../../core")
  { Base     } := require("../../../adt-derivers")
  { Monoid   } := require("../../../control/monoid")
  
  data Product (Number) deriving Base

  instance(Monoid, Product, {
    empty  : fun (self) -> Product(1),
    concat : fun (a, b) -> match {
      (Product(x), Product(y)) => Product(x * y)
    }
  });

  fun getProduct (x) -> match { Product(x) => x }

  module.exports = { Product    : Product
                   , getProduct : getProduct
                   }
}());