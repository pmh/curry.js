var adt$2481 = require('adt-simple');
var Curry$2482 = {
        derive: adt$2481.eachVariant(function (v$2484, adt$2485) {
            if (v$2484.fields && v$2484.fields.length) {
                var ctr$2486 = v$2484.constructor, curried$2487 = ctr$2486.curry(v$2484.fields.length);
                v$2484.constructor = curried$2487;
                v$2484.constructor.prototype = ctr$2486.prototype;
                v$2484.prototype.constructor = curried$2487;
                if (adt$2485.constructor === ctr$2486) {
                    adt$2485.constructor = v$2484.constructor;
                    for (var k$2488 in ctr$2486) {
                        if (ctr$2486.hasOwnProperty(k$2488)) {
                            adt$2485.constructor[k$2488] = ctr$2486[k$2488];
                        }
                    }
                }
            }
        })
    };
function unrollApply$2483(fn$2489, a$2490) {
    switch (a$2490.length) {
    case 0:
        return fn$2489();
    case 1:
        return fn$2489(a$2490[0]);
    case 2:
        return fn$2489(a$2490[0], a$2490[1]);
    case 3:
        return fn$2489(a$2490[0], a$2490[1], a$2490[2]);
    case 4:
        return fn$2489(a$2490[0], a$2490[1], a$2490[2], a$2490[3]);
    default:
        return fn$2489.apply(null, a$2490);
    }
}
module.exports = {
    Eq: adt$2481.Eq,
    Clone: adt$2481.Clone,
    Setter: adt$2481.Setter,
    ToString: adt$2481.ToString,
    ToJSON: adt$2481.ToJSON,
    Curry: Curry$2482,
    Extractor: adt$2481.Extractor,
    Reflect: adt$2481.Reflect,
    Cata: adt$2481.Cata,
    LateDeriving: adt$2481.LateDeriving,
    Base: adt$2481.composeDeriving(Curry$2482, adt$2481.Base)
};
//# sourceMappingURL=adt-derivers.js.map