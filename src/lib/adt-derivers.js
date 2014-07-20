var adt$2271 = require('adt-simple');
var Curry$2272 = {
        derive: adt$2271.eachVariant(function (v$2274, adt$2275) {
            if (v$2274.fields && v$2274.fields.length) {
                var ctr$2276 = v$2274.constructor, curried$2277 = ctr$2276.curry(v$2274.fields.length);
                v$2274.constructor = curried$2277;
                v$2274.constructor.prototype = ctr$2276.prototype;
                v$2274.prototype.constructor = curried$2277;
                if (adt$2275.constructor === ctr$2276) {
                    adt$2275.constructor = v$2274.constructor;
                    for (var k$2278 in ctr$2276) {
                        if (ctr$2276.hasOwnProperty(k$2278)) {
                            adt$2275.constructor[k$2278] = ctr$2276[k$2278];
                        }
                    }
                }
            }
        })
    };
function unrollApply$2273(fn$2279, a$2280) {
    switch (a$2280.length) {
    case 0:
        return fn$2279();
    case 1:
        return fn$2279(a$2280[0]);
    case 2:
        return fn$2279(a$2280[0], a$2280[1]);
    case 3:
        return fn$2279(a$2280[0], a$2280[1], a$2280[2]);
    case 4:
        return fn$2279(a$2280[0], a$2280[1], a$2280[2], a$2280[3]);
    default:
        return fn$2279.apply(null, a$2280);
    }
}
module.exports = {
    Eq: adt$2271.Eq,
    Clone: adt$2271.Clone,
    Setter: adt$2271.Setter,
    ToString: adt$2271.ToString,
    ToJSON: adt$2271.ToJSON,
    Curry: Curry$2272,
    Extractor: adt$2271.Extractor,
    Reflect: adt$2271.Reflect,
    Cata: adt$2271.Cata,
    LateDeriving: adt$2271.LateDeriving,
    Base: adt$2271.composeDeriving(Curry$2272, adt$2271.Base)
};
//# sourceMappingURL=adt-derivers.js.map