var adt$2226 = require('adt-simple');
var Curry$2227 = {
        derive: adt$2226.eachVariant(function (v$2229, adt$2230) {
            if (v$2229.fields && v$2229.fields.length) {
                var ctr$2231 = v$2229.constructor, curried$2232 = ctr$2231.curry(v$2229.fields.length);
                v$2229.constructor = curried$2232;
                v$2229.constructor.prototype = ctr$2231.prototype;
                v$2229.prototype.constructor = curried$2232;
                v$2229.prototype.of = function (x$2233) {
                    return adt$2230.constructor.of(x$2233);
                };
                if (adt$2230.constructor === ctr$2231) {
                    adt$2230.constructor = v$2229.constructor;
                    for (var k$2234 in ctr$2231) {
                        if (ctr$2231.hasOwnProperty(k$2234)) {
                            adt$2230.constructor[k$2234] = ctr$2231[k$2234];
                        }
                    }
                }
            }
        })
    };
function unrollApply$2228(fn$2235, a$2236) {
    switch (a$2236.length) {
    case 0:
        return fn$2235();
    case 1:
        return fn$2235(a$2236[0]);
    case 2:
        return fn$2235(a$2236[0], a$2236[1]);
    case 3:
        return fn$2235(a$2236[0], a$2236[1], a$2236[2]);
    case 4:
        return fn$2235(a$2236[0], a$2236[1], a$2236[2], a$2236[3]);
    default:
        return fn$2235.apply(null, a$2236);
    }
}
module.exports = {
    Eq: adt$2226.Eq,
    Clone: adt$2226.Clone,
    Setter: adt$2226.Setter,
    ToString: adt$2226.ToString,
    ToJSON: adt$2226.ToJSON,
    Curry: Curry$2227,
    Extractor: adt$2226.Extractor,
    Reflect: adt$2226.Reflect,
    Cata: adt$2226.Cata,
    LateDeriving: adt$2226.LateDeriving,
    Base: adt$2226.composeDeriving(Curry$2227, adt$2226.Base)
};
//# sourceMappingURL=adt-derivers.js.map