var adt$2510 = require('adt-simple');
var Curry$2511 = {
        derive: adt$2510.eachVariant(function (v$2512, adt$2513) {
            if (v$2512.fields && v$2512.fields.length) {
                var ctr$2514 = v$2512.constructor, curried$2515 = ctr$2514.curry(v$2512.fields.length);
                v$2512.constructor = curried$2515;
                v$2512.constructor.prototype = ctr$2514.prototype;
                v$2512.prototype.constructor = curried$2515;
                if (adt$2513.constructor === ctr$2514) {
                    adt$2513.constructor = v$2512.constructor;
                    for (var k$2516 in ctr$2514) {
                        if (ctr$2514.hasOwnProperty(k$2516)) {
                            adt$2513.constructor[k$2516] = ctr$2514[k$2516];
                        }
                    }
                }
            }
        })
    };
module.exports = {
    Eq: adt$2510.Eq,
    Clone: adt$2510.Clone,
    Setter: adt$2510.Setter,
    ToString: adt$2510.ToString,
    ToJSON: adt$2510.ToJSON,
    Curry: Curry$2511,
    Extractor: adt$2510.Extractor,
    Reflect: adt$2510.Reflect,
    Cata: adt$2510.Cata,
    LateDeriving: adt$2510.LateDeriving,
    Base: adt$2510.composeDeriving(Curry$2511, adt$2510.Base)
};
//# sourceMappingURL=adt-derivers.js.map