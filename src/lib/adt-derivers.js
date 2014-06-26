var adt$2143 = require('adt-simple');
var Curry$2144 = {
        derive: adt$2143.eachVariant(function (v$2146, adt$2147) {
            if (v$2146.fields && v$2146.fields.length) {
                var ctr$2148 = v$2146.constructor, curried$2149 = ctr$2148.curry(v$2146.fields.length);
                v$2146.constructor = curried$2149;
                v$2146.constructor.prototype = ctr$2148.prototype;
                v$2146.prototype.constructor = curried$2149;
                if (adt$2147.constructor === ctr$2148) {
                    adt$2147.constructor = v$2146.constructor;
                    for (var k$2150 in ctr$2148) {
                        if (ctr$2148.hasOwnProperty(k$2150)) {
                            adt$2147.constructor[k$2150] = ctr$2148[k$2150];
                        }
                    }
                }
            }
        })
    };
function unrollApply$2145(fn$2151, a$2152) {
    switch (a$2152.length) {
    case 0:
        return fn$2151();
    case 1:
        return fn$2151(a$2152[0]);
    case 2:
        return fn$2151(a$2152[0], a$2152[1]);
    case 3:
        return fn$2151(a$2152[0], a$2152[1], a$2152[2]);
    case 4:
        return fn$2151(a$2152[0], a$2152[1], a$2152[2], a$2152[3]);
    default:
        return fn$2151.apply(null, a$2152);
    }
}
module.exports = {
    Eq: adt$2143.Eq,
    Clone: adt$2143.Clone,
    Setter: adt$2143.Setter,
    ToString: adt$2143.ToString,
    ToJSON: adt$2143.ToJSON,
    Curry: Curry$2144,
    Extractor: adt$2143.Extractor,
    Reflect: adt$2143.Reflect,
    Cata: adt$2143.Cata,
    LateDeriving: adt$2143.LateDeriving,
    Base: adt$2143.composeDeriving(Curry$2144, adt$2143.Base)
};
//# sourceMappingURL=adt-derivers.js.map