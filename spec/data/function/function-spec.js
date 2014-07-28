{ id, constant, unary, binary, ternary } := require("../../../lib/data/function");

describe "Data.Function" {
  describe "id" {
    it "returns it's argument unchanged" {
      test "identity" { id(23) == 23 }
    }
  }

  describe "constant" {
    it "returns a new function that always returns the argument" {
      test "constant" { constant(23)() == 23 }
    }
  }

  describe "unary" {
    it "it turns an n-arity function into a unary one" {
      test "unary" {
        unary(fun (x, y) -> [x, y])(1,2)(3) =>= [1,3]
      }
    }
  }

  describe "binary" {
    it "it turns a n-arity function into a binary one" {
      test "binary" {
        binary(fun (x, y, z) -> [x, y, z])(1,2,3)(4) =>= [1,2,4]
      }
    }
  }

  describe "ternary" {
    it "it turns a n-arity function into a ternary one" {
      test "ternary" {
        ternary(fun (x, y, z, w) -> [x, y, z, w])(1,2,3,4)(5) =>= [1,2,3,5]
      }
    }
  }
}