var adt$2510 = require('adt-simple');
var Curry$2511 = {
        derive: adt$2510.eachVariant(function (v$2513, adt$2514) {
            if (v$2513.fields && v$2513.fields.length) {
                var ctr$2515 = v$2513.constructor, curried$2516 = ctr$2515.curry(v$2513.fields.length);
                v$2513.constructor = curried$2516;
                v$2513.constructor.prototype = ctr$2515.prototype;
                v$2513.prototype.constructor = curried$2516;
                if (adt$2514.constructor === ctr$2515) {
                    adt$2514.constructor = v$2513.constructor;
                    for (var k$2517 in ctr$2515) {
                        if (ctr$2515.hasOwnProperty(k$2517)) {
                            adt$2514.constructor[k$2517] = ctr$2515[k$2517];
                        }
                    }
                }
            }
        })
    };
function unrollApply$2512(fn$2518, a$2519) {
    switch (a$2519.length) {
    case 0:
        return fn$2518();
    case 1:
        return fn$2518(a$2519[0]);
    case 2:
        return fn$2518(a$2519[0], a$2519[1]);
    case 3:
        return fn$2518(a$2519[0], a$2519[1], a$2519[2]);
    case 4:
        return fn$2518(a$2519[0], a$2519[1], a$2519[2], a$2519[3]);
    default:
        return fn$2518.apply(null, a$2519);
    }
}
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