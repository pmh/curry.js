(function () {
    'use strict';
    var __$2043 = function noop() {
    };
    var withMeta$2045 = function (f$2048, meta$2049) {
        var keys$2050 = Object.keys(meta$2049);
        keys$2050.forEach(function (name$2052) {
            Object.defineProperty(f$2048, '__' + name$2052, { value: meta$2049[name$2052] });
        });
        return f$2048;
    };
    /*
  * Accepts a variable argument function it returns a curried version.
  *
  * Usage:
  *
  *   times    := curry(fun (a, b) a * b);
  *   timesTwo := times(2);
  *   mod2     := mod(__, 2); // __ can be used as a placeholder for partial application
  *
  *   times(2, 4) //=> 8
  *   times(2)(4) //=> 8
  *   timesTwo(4) //=> 8
  *
  *   mod2(2)     //=> 0
  *   mod2(3)     //=> 1
  */
    var curry$2047 = function (f$2053) {
        var arity$2054 = typeof f$2053.__arity === 'undefined' ? f$2053.length : f$2053.__arity, name$2055 = f$2053.name || f$2053.__name;
        var curriedFn$2057 = withMeta$2045(function () {
                var args$2059 = [].slice.call(arguments, 0, arity$2054), realArity$2060 = args$2059.filter(function (x$2062) {
                        return x$2062 !== __$2043;
                    }).length, self$2061 = this;
                if (realArity$2060 >= arity$2054)
                    return f$2053.apply(self$2061, arguments);
                else {
                    var g$2064 = withMeta$2045(function () {
                            var partialArgs$2065 = [].slice.call(arguments), newArgs$2066 = [];
                            for (var i$2067 = 0; i$2067 < args$2059.length; i$2067++)
                                newArgs$2066[i$2067] = args$2059[i$2067] === __$2043 ? partialArgs$2065.length === 0 ? undefined : partialArgs$2065.shift() : args$2059[i$2067];
                            return curriedFn$2057.apply(self$2061, newArgs$2066.concat(partialArgs$2065));
                        }, {
                            name: name$2055,
                            arity: arity$2054 - realArity$2060,
                            curried: true
                        });
                    g$2064.toString = curriedFn$2057.toString.bind(curriedFn$2057);
                    return g$2064;
                }
            }, {
                name: name$2055,
                arity: arity$2054,
                curried: true
            });
        curriedFn$2057.toString = f$2053.toString.bind(f$2053);
        return curriedFn$2057;
    };
    module.exports = {
        Core: {
            __: __$2043,
            curry: curry$2047
        }
    };
}());