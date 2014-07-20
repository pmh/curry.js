var adt$2251 = require('adt-simple');
var Curry$2252 = {
        derive: adt$2251.eachVariant(function (v$2254, adt$2255) {
            if (v$2254.fields && v$2254.fields.length) {
                var ctr$2256 = v$2254.constructor, curried$2257 = ctr$2256.curry(v$2254.fields.length);
                v$2254.constructor = curried$2257;
                v$2254.constructor.prototype = ctr$2256.prototype;
                v$2254.prototype.constructor = curried$2257;
                if (adt$2255.constructor === ctr$2256) {
                    adt$2255.constructor = v$2254.constructor;
                    for (var k$2258 in ctr$2256) {
                        if (ctr$2256.hasOwnProperty(k$2258)) {
                            adt$2255.constructor[k$2258] = ctr$2256[k$2258];
                        }
                    }
                }
            }
        })
    };
function unrollApply$2253(fn$2259, a$2260) {
    switch (a$2260.length) {
    case 0:
        return fn$2259();
    case 1:
        return fn$2259(a$2260[0]);
    case 2:
        return fn$2259(a$2260[0], a$2260[1]);
    case 3:
        return fn$2259(a$2260[0], a$2260[1], a$2260[2]);
    case 4:
        return fn$2259(a$2260[0], a$2260[1], a$2260[2], a$2260[3]);
    default:
        return fn$2259.apply(null, a$2260);
    }
}
module.exports = {
    Eq: adt$2251.Eq,
    Clone: adt$2251.Clone,
    Setter: adt$2251.Setter,
    ToString: adt$2251.ToString,
    ToJSON: adt$2251.ToJSON,
    Curry: Curry$2252,
    Extractor: adt$2251.Extractor,
    Reflect: adt$2251.Reflect,
    Cata: adt$2251.Cata,
    LateDeriving: adt$2251.LateDeriving,
    Base: adt$2251.composeDeriving(Curry$2252, adt$2251.Base)
};
//# sourceMappingURL=adt-derivers.js.map