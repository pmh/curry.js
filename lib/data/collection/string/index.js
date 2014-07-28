(function () {
  "use strict";

  { __, extendNative } := require ('../../../core')
  { unary            } := require ('../../../data/function')
  { map              } := require ('../../../control/functor')

  Object.defineProperty(String.prototype, "reduce", {
    value: function (f, acc) {
      var xs = this.split("");
      
      return (exists(acc)) ? xs.reduce(f, acc) : xs.reduce(f)
    }
  });

  extendNative(String.prototype, "map", fun (self, f) -> 
    self.split("").map(unary(f)).join(""))

  extendNative(String.prototype, "filter", fun (self, f) -> 
    self.split("").filter(unary(f)).join(""))

  extendNative(String.prototype, "head", fun (self) -> self.split("").head())
  extendNative(String.prototype, "tail", fun (self) -> self.split("").tail())
}());