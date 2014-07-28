(function () {
  "use strict";

  { __, extendNative } := require ('../../../core')
  { map              } := require ('../../../control/functor')
  { Some, None       } := require ('../../../data/option')

  extendNative(Array, "of", fun (self, x) -> [x]);

  extendNative(Array.prototype, "ap",    fun (self, x) -> this >>= map(__, x))
  extendNative(Array.prototype, "chain", fun (self, f) -> map(f, this).reduce(fun (xs, ys) -> xs.concat(ys), []))

  extendNative(Array.prototype, "head", fun (self) -> (self[0]) ? Some(self[0]) : None);
  extendNative(Array.prototype, "tail", fun (self) -> self.slice(1));
}());