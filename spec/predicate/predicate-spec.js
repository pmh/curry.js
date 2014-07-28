{ not
, and
, or
, isObject
, isArray
, isNumber
, isRegExp
, isString
, isNull
, isUndef
, exists
} := require("../../lib/predicate");

describe "Predicate" {
  describe "not" {
    it "returns the boolean inverse of it's arguments" {
      test "not(true)"  { not(true)  === false }
      test "not(false)" { not(false) === true  }
    }
  }

  describe "and" {
    it "returns true if all the elements of a list are truthy" {
      test "and([true,  true ]) => true " { and([true,  true ]) === true  }
      test "and([true,  false]) => false" { and([true,  false]) === false }
      test "and([false, true ]) => false" { and([false, true ]) === false }
      test "and([false, false]) => false" { and([false, false]) === false }
      test "and(['',    true ]) => false" { and(['',    true ]) === false }
      test "and(['x',   true ]) => true " { and(['x',   true ]) === true  }
      test "and([0,     true ]) => false" { and([0,     true ]) === false }
      test "and([1,     true ]) => true " { and([1,     true ]) === true  }
    }
  }

  describe "or" {
    it "returns true if any of the elements of a list are truthy" {
      test "or([true,  true ]) => true " { or([true,  true ]) === true  }
      test "or([true,  false]) => true " { or([true,  false]) === true  }
      test "or([false, true ]) => true " { or([false, true ]) === true  }
      test "or([false, false]) => false" { or([false, false]) === false }
      test "or(['',    true ]) => true " { or(['',    true ]) === true  }
      test "or(['',    false]) => false" { or(['',    false]) === false }
      test "or(['x',   true ]) => true " { or(['x',   true ]) === true  }
      test "or([0,     true ]) => true " { or([0,     true ]) === true }
      test "or([0,     false]) => false" { or([0,     false]) === false }
      test "or([1,     true ]) => true " { or([1,     true ]) === true  }
      test "or([1,     false]) => true " { or([1,     false]) === true  }
    }
  }

  describe "isObject" {
    it "returns true if it's argument is an object" {
      test "isObject({})  => true " { isObject({})  === true  }
      test "isObject([])  => false" { isObject([])  === false }
      test "isObject(0)   => false" { isObject(0)   === false }
      test "isObject(/x/) => false" { isObject(/x/) === false }
      test "isObject('0') => false" { isObject('x') === false }
      test "isObject(0)   => false" { isObject(0)   === false }
    }
  }

  describe "isArray" {
    it "returns true if it's argument is an array" {
      test "isArray([])  => true " { isArray([])  === true  }
      test "isArray({})  => false" { isArray({})  === false }
      test "isArray(0)   => false" { isArray(0)   === false }
      test "isArray(/x/) => false" { isArray(/x/) === false }
      test "isArray('x') => false" { isArray('x') === false }
    }
  }

  describe "isNumber" {
    it "returns true if it's argument is a number" {
      test "isNumber(0)   => true " { isNumber(0)   === true  }
      test "isNumber([])  => false" { isNumber([])  === false }
      test "isNumber({})  => false" { isNumber({})  === false }
      test "isNumber(/x/) => false" { isNumber(/x/) === false }
      test "isNumber('x') => false" { isNumber('x') === false }
    }
  }

  describe "isRegExp" {
    it "returns true if it's argument is a regular expression" {
      test "isRegExp(/x/) => true " { isRegExp(/x/) === true  }
      test "isRegExp(0)   => false" { isRegExp(0)   === false }
      test "isRegExp([])  => false" { isRegExp([])  === false }
      test "isRegExp({})  => false" { isRegExp({})  === false }
      test "isRegExp('x') => false" { isRegExp('x') === false }
    }
  }

  describe "isString" {
    it "returns true if it's argument is a string" {
      test "isString('x') => true " { isString('x') === true  }
      test "isString(/x/) => false" { isString(/x/) === false }
      test "isString(0)   => false" { isString(0)   === false }
      test "isString([])  => false" { isString([])  === false }
      test "isString({})  => false" { isString({})  === false }
    }
  }

  describe "isNull" {
    it "returns true if it's argument is null" {
      test "isNull(null)    => true " { isNull(null)    === true  }
      test "isNull(void(0)) => false" { isNull(void(0)) === false }
      test "isNull('x')     => false" { isNull('x')     === false }
      test "isNull(/x/)     => false" { isNull(/x/)     === false }
      test "isNull(0)       => false" { isNull(0)       === false }
      test "isNull([])      => false" { isNull([])      === false }
      test "isNull({})      => false" { isNull({})      === false }
    }
  }

  describe "isUndef" {
    it "returns true if it's argument is undefined" {
      test "isUndef(undefined)  => true " { isUndef(undefined)  === true  }
      test "isUndef(null)       => false" { isUndef(null)       === false }
      test "isUndef('x')        => false" { isUndef('x')        === false }
      test "isUndef(/x/)        => false" { isUndef(/x/)        === false }
      test "isUndef(0)          => false" { isUndef(0)          === false }
      test "isUndef([])         => false" { isUndef([])         === false }
      test "isUndef({})         => false" { isUndef({})         === false }
    }
  }

  describe "exists" {
    it "returns true if it's argument isn't null or undefined" {
      test "exists(undefined)  => false" { exists(undefined)  === false }
      test "exists(null)       => false" { exists(null)       === false }
      test "exists('x')        => true " { exists('x')        === true  }
      test "exists(/x/)        => true " { exists(/x/)        === true  }
      test "exists(0)          => true " { exists(0)          === true  }
      test "exists([])         => true " { exists([])         === true  }
      test "exists({})         => true " { exists({})         === true  }
    }
  }
}
