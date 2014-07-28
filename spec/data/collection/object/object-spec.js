{ merge,set } := require ('../../../../lib/data/collection/object')
{ map       } := require ('../../../../lib/control/functor')

describe "Data.Collection.Object" {
  describe "merge" {
    it "merges two objects" {
      test "different keys" {
        merge({a: 'b'}, {c: 'd'}) =>= { a: 'b', c: 'd' }
      }
      test "same keys" {
        merge({a: 'b'}, {a: 'd'}) =>= { a: 'b' }
      }
    }
  }

  describe "set" {
    it "returns a new object with the new key present" {
      test "set new key" {
        set({a: 'b'}, 'c', 'd') =>= { a: 'b', c: 'd' }
      }
    }
  }

  describe "map" {
    it "applies a function to every value of an object" {
      test "inc" {
        map(fun (x) -> x + 1, { a: 1, b: 2, c: 3 }) =>= { a: 2, b: 3, c: 4 }
      }
    }
  }
}