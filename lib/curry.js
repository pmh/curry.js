(function () {
  "use strict";

  var __slice = [].slice;

  /* CurryJS.Core */
  
  var __ = function noop () {};

  var extendNative = function (native, prop, f) {
    return Object.defineProperty(native, prop, { value: f });
  };

  var withMeta = function (f, meta) {
    var keys = Object.keys(meta);

    keys.forEach(function (name) {
      Object.defineProperty(f, '__' + name, { value: meta[name] });
    });

    return f;
  }

 /*
  * curry :: (a ... -> b) -> (a1 -> (a2 -> (aN -> b)))
  *
  * Given any fixed arity function it returns a new function that can be partially applied.
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
  var curry = function (f) {
    var arity = typeof(f.__arity) === "undefined" ? f.length : f.__arity
    , name  = f.name || f.__name;

    var curriedFn = withMeta(function () {
      var args      = [].slice.call(arguments, 0, arity)
      ,   realArity = args.filter(function (x) { return x !== __ }).length
      ,   self      = this;

      if (realArity >= arity)
        return f.apply(self, arguments);
      else {
        var g = withMeta(function () {
          var partialArgs = [].slice.call(arguments)
          , newArgs     = [];

          for (var i = 0; i < args.length; i++)
            newArgs[i] = args[i] === __ ? (partialArgs.length === 0 ? undefined : partialArgs.shift()) : args[i];

          return curriedFn.apply(self, newArgs.concat(partialArgs));
        }, { name: name, arity : arity - realArity, curried: true });

        g.toString  = curriedFn.toString.bind(curriedFn);

        return g;
      }
    }, { name: name, arity: arity, curried: true });

    curriedFn.toString = f.toString.bind(f);

    return curriedFn;

  };
  
  extendNative(Function.prototype, "curry", function () { return curry(this); });

 /*
  * compose :: ((a -> b) -> (b -> c)) ... -> (a -> c)
  *
  * compose takes any number of functions and invokes them right to left
  * passing the value of the previous function to the next.
  *
  * compose(f,g)(x) === f(g(x))
  *
  * Usage:
  *
  * var even = compose(eq (0), mod(__, 2));
  * var odd  = compose(not, even);
  *
  * even (0) => true
  * odd  (0) => false
  * even (1) => false
  * odd  (1) => true
  *
  */
  var compose = function () {
    var fns = __slice.call(arguments), self = this;

    return fns.reduce(function (f, g) {
      return function () {
        return f.call(self, g.apply(self, arguments));
      }
    });
  };

  module.exports = {
    Core : {
      __      : __,
      curry   : curry,
      compose : compose
    }
  }
})()