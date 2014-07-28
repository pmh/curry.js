(function () {
  "use strict";

  require("../core")

  // not :: Truthy -> Bool
  fun not (x)  -> !x

  // and :: [Truthy] -> Bool
  fun and (xs) -> xs.every(fun (x) -> !!x)

  // and :: [Truthy] -> Bool
  fun or  (xs) -> xs.some(fun (x) -> !!x)

  // isObject :: a -> Bool
  fun isObject (x) -> match { Object  => true, * => false }

  // isArray :: a -> Bool
  fun isArray  (x) -> match { Array   => true, * => false }

  // isNumber :: a -> Bool
  fun isNumber (x) -> match { Number  => true, * => false }

  // isRegExp :: a -> Bool
  fun isRegExp (x) -> match { RegExp  => true, * => false }

  // isString :: a -> Bool
  fun isString (x) -> match { String  => true, * => false }

  // isNull :: a -> Bool
  fun isNull   (x) -> match { null    => true, * => false }

  // isUndef :: a -> Bool
  fun isUndef  (x) -> match { void(0) => true, * => false }

  // exists :: a -> Bool
  fun exists   (x) -> not .. or $ [isNull(x), isUndef(x)]
  
  module.exports = { not       : not
                   , and       : and
                   , or        : or
                   , isObject  : isObject
                   , isArray   : isArray
                   , isNumber  : isNumber
                   , isRegExp  : isRegExp
                   , isString  : isString
                   , isNull    : isNull
                   , isUndef   : isUndef
                   , exists    : exists
                   }

}());