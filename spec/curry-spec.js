var buster = require("buster")
  , expect = buster.expect;

buster.spec.expose();

var C    = require("../lib/curry")
  , Core = C.Core;

describe ("Curry.Core", function () {

  describe ("curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))", function () {

    it ("returns a new function that can be partially applied", function () {
      var addMany = Core.curry(function (a, b, c, d) { return a + b + c + d });

      expect(addMany(1)(2)(3)(4)).toEqual(10);
      expect(addMany(1, 2)(3, 4)).toEqual(10);
      expect(addMany(1, 2, 3, 4)).toEqual(10);
    });

    it ("returns a new function that can be partially applied with argument holes", function () {
      var mod  = Core.curry(function (a, b) { return a % b });
      var mod2 = mod(Core.__, 2);

      expect(mod2(2)).toEqual(0);
      expect(mod2(3)).toEqual(1);
    });
  });

  describe ("compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)", function () {

    it ("returns the composition of multiple functions", function () {
      var split  = Core.curry (function (sep, s ) { return s.split(sep);   })
        , map    = Core.curry (function (f, xs  ) { return xs.map(f);      })
        , upcase = Core.curry (function (s      ) { return s.toUpperCase() })
        , join   = Core.curry (function (sep, xs) { return xs.join(sep);   });

      expect(Core.compose(join("-"), map(upcase), split(" "))("foo bar baz")).
        toEqual("FOO-BAR-BAZ");
    });
  })
});