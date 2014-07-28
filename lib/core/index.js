(function () {
  "use strict";

  __slice     := [].slice;
  __toString  := {}.toString;

  // __ :: () -> ()
  var __ = function noop () {};

  var extendNative = function (native, prop, f) {
    return Object.defineProperty(native, prop, {
      value: function () { return f.apply(this, [this].concat(__slice.call(arguments))); },
      configurable: true,
      writable : true
    });
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
  *   times    := curry(fun (a, b) -> a * b);
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
  var curry = function (f, n) {
    var arity = typeof (n) !== "undefined" ? n : (typeof(f.__arity) !== "undefined" ? f.__arity : f.length)
      , name  = f.name || f.__name;

    if (arity < 2) return f;

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
  
  extendNative(Function.prototype, "curry", function (self, n) { return curry(self, n); });

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

  // Protocol :: String -> Object -> { String, String, (ADT -> Object -> undefined) }
  Protocol := function (name, spec) {
    return {
      name     : name,
      spec     : spec,
      instance : function (type, impl) {
        var name        = this.name
          , spec        = this.spec
          , constructor = spec.constructor
          , proto       = spec.prototype
          , k;

        Object.keys(constructor || {}).map(function (field) {
          if (constructor[field] === Protocol.required && !impl.hasOwnProperty(field) && !type.hasOwnProperty(field))
            throw Protocol.required(name, field);
          else if (!type.hasOwnProperty(field) && !impl.hasOwnProperty(field))
            type[field] = function () { return constructor[field].curry().apply(this, [this].concat(__slice.call(arguments))); }
          else if (impl.hasOwnProperty(field))
            type[field] = function () { return impl[field].curry().apply(this, [this].concat(__slice.call(arguments))); }
        });

        Object.keys(proto || {}).map(function (field) {
          if (proto[field] === Protocol.required && !impl.hasOwnProperty(field) && !type.prototype.hasOwnProperty(field))
            throw Protocol.required(name, field);
          else if (!type.prototype.hasOwnProperty(field) && !impl.hasOwnProperty(field))
            type.prototype[field] = function () { return proto[field].curry().apply(this, [this].concat(__slice.call(arguments))); }
          else if (impl.hasOwnProperty(field))
            type.prototype[field] = function () { return impl[field].curry().apply(this, [this].concat(__slice.call(arguments))); }
        });
      }
    }
  }

  Protocol.required = fun (name, field) ->
    new Error(name + " expected required field: '" + field + "' to be defined!")

  // instance :: Protocol -> ADT -> Object -> undefined
  fun instance (protocol, type, impl) ->
    protocol.instance(type, impl);

  
  module.exports = { __           : __
                   , extendNative : extendNative
                   , curry        : curry
                   , compose      : compose
                   , Protocol     : Protocol
                   , instance     : instance
                   }

}());