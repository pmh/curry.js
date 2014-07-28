var adt = require("adt-simple")

var Curry = {
  derive: adt.eachVariant(function(v, adt) {
    if (v.fields && v.fields.length) {
      var ctr     = v.constructor
        , curried = ctr.curry(v.fields.length);

      v.constructor = curried;
      v.constructor.prototype = ctr.prototype;
      v.prototype.constructor = curried;

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