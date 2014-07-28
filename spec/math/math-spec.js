{ plus, minus, times, div } := require("../../lib/math");

describe "Math" {
  describe "plus" {
    it "performs addition" {
      test "addition" { plus(4, 2) == 6 }
    }
  }

  describe "minus" {
    it "performs subtraction" {
      test "subtraction" { minus(4, 2) == 2 }
    }
  }

  describe "times" {
    it "performs multiplication" {
      test "multiplication" { times(4, 2) == 8 }
    }
  }

  describe "div" {
    it "performs division" {
      test "division" { div(4, 2) == 2 }
    }
  }
}