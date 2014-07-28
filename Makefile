PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.PHONY: build test

watch:
	watchy -w lib,macros,spec -- make -s build

build:
	@clear

	echo "- expanding macros"

	@make src/lib/adt-derivers.js

	@make src/lib/core/index.js
	@make src/spec/core/core-spec.js

	@make src/lib/predicate/index.js
	@make src/spec/predicate/predicate-spec.js

	@make src/lib/math/index.js
	@make src/spec/math/math-spec.js

	@make src/lib/control/functor/index.js
	@make src/spec/control/functor/functor-spec.js

	@make src/lib/control/applicative/index.js
	@make src/spec/control/applicative/applicative-spec.js

	@make src/lib/control/monad/index.js
	@make src/spec/control/monad/monad-spec.js

	@make src/lib/control/monoid/index.js
	@make src/spec/control/monoid/monoid-spec.js

	@make src/lib/data/function/index.js
	@make src/spec/data/function/function-spec.js

	@make src/lib/data/number/sum/index.js
	@make src/spec/data/number/sum/sum-spec.js

	@make src/lib/data/number/product/index.js
	@make src/spec/data/number/product/product-spec.js

	@make src/lib/data/number/min/index.js
	@make src/spec/data/number/min/min-spec.js

	@make src/lib/data/number/max/index.js
	@make src/spec/data/number/max/max-spec.js

	@make src/lib/data/option/index.js
	@make src/spec/data/option/option-spec.js

	@make src/lib/data/either/index.js
	@make src/spec/data/either/either-spec.js

	@make src/lib/data/collection/array/index.js
	@make src/spec/data/collection/array/array-spec.js

	@make src/lib/data/collection/object/index.js
	@make src/spec/data/collection/object/object-spec.js

	@make src/lib/data/collection/index.js
	@make src/spec/data/collection/collection-spec.js
	
	@make src/lib/prelude/index.js

	make test


src/lib/adt-derivers.js: lib/adt-derivers.js
	@mkdir -p src/lib
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/adt-derivers.js -o src/lib/adt-derivers.js


src/lib/core/index.js: lib/core/index.js
	@mkdir -p src/lib/core
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/core/index.js -o src/lib/core/index.js

src/spec/core/core-spec.js: spec/core/core-spec.js
	@mkdir -p src/spec/core
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/core/core-spec.js -o src/spec/core/core-spec.js


src/lib/predicate/index.js: lib/predicate/index.js
	@mkdir -p src/lib/predicate
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/predicate/index.js -o src/lib/predicate/index.js

src/spec/predicate/predicate-spec.js: spec/predicate/predicate-spec.js
	@mkdir -p src/spec/predicate
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/predicate/predicate-spec.js -o src/spec/predicate/predicate-spec.js


src/lib/math/index.js: lib/math/index.js
	@mkdir -p src/lib/math
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/math/index.js -o src/lib/math/index.js

src/spec/math/math-spec.js: spec/math/math-spec.js
	@mkdir -p src/spec/math
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/math/math-spec.js -o src/spec/math/math-spec.js


src/lib/control/functor/index.js: lib/control/functor/index.js
	@mkdir -p src/lib/control/functor
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/control/functor/index.js -o src/lib/control/functor/index.js

src/spec/control/functor/functor-spec.js: spec/control/functor/functor-spec.js
	@mkdir -p src/spec/control/functor
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/control/functor/functor-spec.js -o src/spec/control/functor/functor-spec.js


src/lib/control/applicative/index.js: lib/control/applicative/index.js
	@mkdir -p src/lib/control/applicative
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/control/applicative/index.js -o src/lib/control/applicative/index.js

src/spec/control/applicative/applicative-spec.js: spec/control/applicative/applicative-spec.js
	@mkdir -p src/spec/control/applicative
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/control/applicative/applicative-spec.js -o src/spec/control/applicative/applicative-spec.js


src/lib/control/monad/index.js: lib/control/monad/index.js
	@mkdir -p src/lib/control/monad
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/control/monad/index.js -o src/lib/control/monad/index.js

src/spec/control/monad/monad-spec.js: spec/control/monad/monad-spec.js
	@mkdir -p src/spec/control/monad
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/control/monad/monad-spec.js -o src/spec/control/monad/monad-spec.js


src/lib/control/monoid/index.js: lib/control/monoid/index.js
	@mkdir -p src/lib/control/monoid
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/control/monoid/index.js -o src/lib/control/monoid/index.js

src/spec/control/monoid/monoid-spec.js: spec/control/monoid/monoid-spec.js
	@mkdir -p src/spec/control/monoid
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/control/monoid/monoid-spec.js -o src/spec/control/monoid/monoid-spec.js


src/lib/data/function/index.js: lib/data/function/index.js
	@mkdir -p src/lib/data/function
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/function/index.js -o src/lib/data/function/index.js

src/spec/data/function/function-spec.js: spec/data/function/function-spec.js
	@mkdir -p src/spec/data/function
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/data/function/function-spec.js -o src/spec/data/function/function-spec.js


src/lib/data/number/sum/index.js: lib/data/number/sum/index.js
	@mkdir -p src/lib/data/number/sum
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/number/sum/index.js -o src/lib/data/number/sum/index.js

src/spec/data/number/sum/sum-spec.js: spec/data/number/sum/sum-spec.js
	@mkdir -p src/spec/data/number/sum
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/data/number/sum/sum-spec.js -o src/spec/data/number/sum/sum-spec.js


src/lib/data/number/product/index.js: lib/data/number/product/index.js
	@mkdir -p src/lib/data/number/product
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/number/product/index.js -o src/lib/data/number/product/index.js

src/spec/data/number/product/product-spec.js: spec/data/number/product/product-spec.js
	@mkdir -p src/spec/data/number/product
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/data/number/product/product-spec.js -o src/spec/data/number/product/product-spec.js


src/lib/data/number/min/index.js: lib/data/number/min/index.js
	@mkdir -p src/lib/data/number/min
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/number/min/index.js -o src/lib/data/number/min/index.js

src/spec/data/number/min/min-spec.js: spec/data/number/min/min-spec.js
	@mkdir -p src/spec/data/number/min
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/data/number/min/min-spec.js -o src/spec/data/number/min/min-spec.js


src/lib/data/number/max/index.js: lib/data/number/max/index.js
	@mkdir -p src/lib/data/number/max
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/number/max/index.js -o src/lib/data/number/max/index.js

src/spec/data/number/max/max-spec.js: spec/data/number/max/max-spec.js
	@mkdir -p src/spec/data/number/max
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/data/number/max/max-spec.js -o src/spec/data/number/max/max-spec.js


src/lib/data/option/index.js: lib/data/option/index.js
	@mkdir -p src/lib/data/option
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/option/index.js -o src/lib/data/option/index.js

src/spec/data/option/option-spec.js: spec/data/option/option-spec.js
	@mkdir -p src/spec/data/option
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/data/option/option-spec.js -o src/spec/data/option/option-spec.js


src/lib/data/either/index.js: lib/data/either/index.js
	@mkdir -p src/lib/data/either
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/either/index.js -o src/lib/data/either/index.js

src/spec/data/either/either-spec.js: spec/data/either/either-spec.js
	@mkdir -p src/spec/data/either
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/data/either/either-spec.js -o src/spec/data/either/either-spec.js


src/lib/data/collection/array/index.js: lib/data/collection/array/index.js
	@mkdir -p src/lib/data/collection/array
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/collection/array/index.js -o src/lib/data/collection/array/index.js

src/spec/data/collection/array/array-spec.js: spec/data/collection/array/array-spec.js
	@mkdir -p src/spec/data/collection/array
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/data/collection/array/array-spec.js -o src/spec/data/collection/array/array-spec.js


src/lib/data/collection/string/index.js: lib/data/collection/string/index.js
	@mkdir -p src/lib/data/collection/string/
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/collection/string/index.js -o src/lib/data/collection/string/index.js


src/lib/data/collection/object/index.js: lib/data/collection/object/index.js
	@mkdir -p src/lib/data/collection/object
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/collection/object/index.js -o src/lib/data/collection/object/index.js

src/spec/data/collection/object/object-spec.js: spec/data/collection/object/object-spec.js
	@mkdir -p src/spec/data/collection/object
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/data/collection/object/object-spec.js -o src/spec/data/collection/object/object-spec.js


src/lib/data/collection/index.js: lib/data/collection/index.js
	@mkdir -p src/lib/data/collection
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/data/collection/index.js -o src/lib/data/collection/index.js

src/spec/data/collection/collection-spec.js: spec/data/collection/collection-spec.js
	@mkdir -p src/spec/data/collection
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/data/collection/collection-spec.js -o src/spec/data/collection/collection-spec.js


src/lib/prelude/index.js: lib/prelude/index.js
	@mkdir -p src/lib/prelude
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/prelude/index.js -o src/lib/prelude/index.js


test:
	echo "- running test suite"

	@buster-test --reporter specification