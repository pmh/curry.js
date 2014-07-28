{ __, curry, compose, Protocol, instance } := require("../../lib/core");

describe "Core" {
  describe "curry" {
    it "should return a curried version of the function" {
      addMany := curry(function (a, b, c, d) { return a + b + c + d });
      nums    := curry(function (a, b)       { return [a, b]        });
      
      test "single argument application" { addMany(1)(2)(3)(4) === 10     }
      test "multi argument application"  { addMany(1, 2)(3, 4) === 10     }
      test "full application"            { addMany(1, 2, 3, 4) === 10     }
      test "flipped application"         { nums(__, 2)(1)      =>= [1, 2] }
    };

    it "should accept an optional arity argument" {
      curried := curry(function () { return [].slice.call(arguments) }, 3);

      test "partial application" {
        curried(1)(2)(3) =>= [1,2,3]
      }
    }

    it "should be installed on Function.prototype" {
      add := (function (a, b) { return a + b; }).curry();

      test "single argument application" { add(2)(4) === (6) }
    };
  }

  describe "compose" {
    it "should compose multiple functions" {
      split  := curry (function (sep, s ) { return s.split(sep);   });
      map    := curry (function (f, xs  ) { return xs.map(f);      });
      upcase := curry (function (s      ) { return s.toUpperCase() });
      join   := curry (function (sep, xs) { return xs.join(sep);   });

      test "function composition" {
        compose(join("-"), map(upcase), split(" "))("foo bar baz") === "FOO-BAR-BAZ"
      }
    }
  }

  describe "Protocol" {
    it "should create a protocol with correct fields" {
      specObj                  := { foo: 'bar' }
      { name, spec, instance } := Protocol("MyProtocol", specObj);

      test "name field" {
        name == "MyProtocol"
      }

      test "spec field" {
        spec == specObj
      }

      test "instance field" {
        typeof(instance) == "function"
      }
    }
  }

  describe "instance" {
    it "should should not overwrite existing fields" {
      protocol = Protocol("MyProtocol", { constructor: { foo: fun () -> "bar2" }, prototype: { bar: fun () -> "baz2" } });
      type     = { foo: fun () -> "bar1", prototype: { bar: fun () -> "baz1" } }

      instance(protocol, type, {});

      { foo } := type;
      { bar } := type.prototype;

      test "existing constructor fields" {
        foo() == "bar1"
      }

      test "existing prototype fields" {
        bar() == "baz1"
      }
    }

    it "should copy over default implementations" {
      protocol = Protocol("MyProtocol", { constructor: { foo: fun () -> "bar" }, prototype: { bar: fun () -> "baz" } });
      type     = { prototype: { } }

      instance(protocol, type, {});

      { foo } := type;
      { bar } := type.prototype;

      test "default constructor implementations" {
        foo() == "bar"
      }

      test "default prototype implementations" {
        bar() == "baz"
      }
    }

    it "should throw an error on missing implementations" {
      protocol = Protocol("MyProtocol", { constructor: { foo: Protocol.required } });
      type     = {}

      test "missing constructor implementation" {
        instance(protocol, type, {}) =!= "Error"
      }

      protocol = Protocol("MyProtocol", { prototype: { foo: Protocol.required } });
      type     = { prototype: { } }

      test "missing prototype implementation" {
        instance(protocol, type, {}) =!= "Error"
      }
    }
  }
}
