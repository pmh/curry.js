var adt$2221 = require('adt-simple');
var Curry$2222 = {
        derive: adt$2221.eachVariant(function (v$2224, adt$2225) {
            if (v$2224.fields && v$2224.fields.length) {
                var ctr$2226 = v$2224.constructor, curried$2227 = ctr$2226.curry(v$2224.fields.length);
                v$2224.constructor = curried$2227;
                v$2224.constructor.prototype = ctr$2226.prototype;
                v$2224.prototype.constructor = curried$2227;
                v$2224.prototype.of = function (x$2228) {
                    return adt$2225.constructor.of(x$2228);
                };
                if (adt$2225.constructor === ctr$2226) {
                    adt$2225.constructor = v$2224.constructor;
                    for (var k$2229 in ctr$2226) {
                        if (ctr$2226.hasOwnProperty(k$2229)) {
                            adt$2225.constructor[k$2229] = ctr$2226[k$2229];
                        }
                    }
                }
            }
        })
    };
function unrollApply$2223(fn$2230, a$2231) {
    switch (a$2231.length) {
    case 0:
        return fn$2230();
    case 1:
        return fn$2230(a$2231[0]);
    case 2:
        return fn$2230(a$2231[0], a$2231[1]);
    case 3:
        return fn$2230(a$2231[0], a$2231[1], a$2231[2]);
    case 4:
        return fn$2230(a$2231[0], a$2231[1], a$2231[2], a$2231[3]);
    default:
        return fn$2230.apply(null, a$2231);
    }
}
module.exports = {
    Eq: adt$2221.Eq,
    Clone: adt$2221.Clone,
    Setter: adt$2221.Setter,
    ToString: adt$2221.ToString,
    ToJSON: adt$2221.ToJSON,
    Curry: Curry$2222,
    Extractor: adt$2221.Extractor,
    Reflect: adt$2221.Reflect,
    Cata: adt$2221.Cata,
    LateDeriving: adt$2221.LateDeriving,
    Base: adt$2221.composeDeriving(Curry$2222, adt$2221.Base)
};
//# sourceMappingURL=adt-derivers.js.map