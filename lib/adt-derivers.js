var adt = require("adt-simple")

var Curry = {
  derive: adt.eachVariant(function(v, adt) {
    if (v.fields && v.fields.length) {
      var ctr     = v.constructor
        , curried = ctr.curry(v.fields.length);

      v.constructor = curried;
      v.constructor.prototype = ctr.prototype;
      v.prototype.constructor = curried;
      v.prototype.of = function (x) { return adt.constructor.of(x); };

      if (adt.constructor === ctr) {
        adt.constructor = v.constructor;
        for (var k in ctr) {
          if (ctr.hasOwnProperty(k)) {
            adt.constructor[k] = ctr[k];
          }
        }
      }
    }
  })
};

function unrollApply(fn, a) {
  switch (a.length) {
    case 0:  return fn();
    case 1:  return fn(a[0]);
    case 2:  return fn(a[0], a[1]);
    case 3:  return fn(a[0], a[1], a[2]);
    case 4:  return fn(a[0], a[1], a[2], a[3]);
    default: return fn.apply(null, a);
  }
}

module.exports = {
  Eq           : adt.Eq,
  Clone        : adt.Clone,
  Setter       : adt.Setter,
  ToString     : adt.ToString,
  ToJSON       : adt.ToJSON,
  Curry        : Curry,
  Extractor    : adt.Extractor,
  Reflect      : adt.Reflect,
  Cata         : adt.Cata,
  LateDeriving : adt.LateDeriving,
  Base         : adt.composeDeriving(Curry, adt.Base)
};