(function () {
  "use strict";

  { extendNative } := require ('../../../core')

  // merge :: Object -> Object -> Object
  var merge = function (a, b) {
    var newObj = {}, k;

    for (k in b) {
      if (b.hasOwnProperty(k))
        newObj[k] = b[k];
    }
    for (k in a) {
      if (a.hasOwnProperty(k))
        newObj[k] = a[k];
    }

    return newObj;
  };

  // set :: Object -> String -> a
  fun set (o, k, v) ->
    let newObj := {}, foo := (newObj[k] = v)
    in  merge(o, newObj);

  extendNative(Object.prototype, "map", fun (self, f) ->
    Object.keys(self).reduce(fun (o, k) -> set(o, k, f(self[k])), {}))

  module.exports = { merge : merge
                   , set   : set
                   }
}());