{ Option
, Some
, None
} := require("../../../lib/data/option");

{ foldl
, foldl1
, foldr
, foldr1
, filter
, head
, tail
, flatten
} := require("../../../lib/data/collection");

describe "Data.Collection" {
  describe "foldl" {
    it "should fold a list from the left" {
      test "concat" { foldl(fun (acc, x) -> acc.concat(x), [], [6, 4, 2]) =>= [6, 4, 2] }
    }
  }

  describe "foldl1" {
    it "should fold a list from the left using the first element as accumulator" {
      test "concat" {
        foldl1(fun (acc, x) -> acc.concat([x]), [[], [6], [4], [2]]) =>= [[6], [4], [2]]
      }
    }
  }

  describe "foldr" {
    it "should fold a list from the right" {
      test "concat" {
        foldr(fun (acc, x) -> acc.concat(x), [], [6, 4, 2]) =>= [2, 4, 6]
      }
    }
  }

  describe "foldr1" {
    it "should fold a list from the left using the last element as accumulator" {
      test "concat" { 
        foldr1(fun (acc, x) -> acc.concat([x]), [[6], [4], [2], []]) =>= [[2], [4], [6]] 
      }
    }
  }

  describe "filter" {
    it "filters a list according to a predicate function" {
      test "filter" {
        filter(fun (x) -> x > 3, [1,2,3,4,5]) =>= [4, 5]
      }
    }
  }

  describe "head" {
    it "returns the first element wrapped in a some for non-empty arrays" {
      test "head non-empty" {
        head([1,2,3,4,5]) =>= Some(1)
      }
    }

    it "returns none for empty arrays" {
      test "head empty" {
        head([]) =>= None
      }
    }
  }

  describe "tail" {
    it "returns a list with all but the first element for non-empty arrays" {
      test "tail non-empty" {
        tail([1,2,3,4,5]) =>= [2,3,4,5]
      }
    }

    it "returns an empty list for empty arrays" {
      test "tail empty" {
        tail([]) =>= []
      }
    }
  }

  describe "flatten" {
    it "flattens a list of monoid values" {
      test "list of lists" {
        flatten([[1,2,3], [4,5,6]]) =>= [1,2,3,4,5,6]
      }
      test "list of options" {
        flatten([Some([1]), Some([2])]) =>= Some([1,2])
      }
    }
  }
}