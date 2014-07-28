{ Product, getProduct } := require("../../../../lib/data/number/product");

describe "Data.Number.Product" {
  describe "empty" {
    it "returns Product(1)" {
      test "empty" { Product.empty() =>= Product(1) }
    }
  }

  describe "getProduct" {
    it "returns the wrapped number" {
      test "getProduct" { getProduct(Product(2)) == 2 }
    }
  }

  describe "concat" {
    it "returns a Product containing the product of the values" {
      test "concat" { Product(2).concat(Product(4)) =>= Product(8) }
    }

    it "satisfies the monoid laws" {
      test "associativity" {
        Product(1).concat(Product(2)).concat(Product(3)) =>=
          Product(1).concat(Product(2).concat(Product(3)))
      }

      test "right identity" {
        Product(1).concat(Product.empty()) =>= Product(1)
      }

      test "left identity" {
        Product.empty().concat(Product(1)) =>= Product(1)
      }
    }
  }
}
