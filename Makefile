PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.PHONY: watch compile

watch:
	watchy -w lib,macros,spec -- make build

build: lib/curry.js lib/adt-derivers.js macros/index.js spec/curry-spec.js
	make compile
	make test

compile:
	@mkdir -p src/lib
	@mkdir -p src/spec
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/curry.js -o src/lib/curry.js
	@sjs --sourcemap -m adt-simple/macros -m ./macros lib/adt-derivers.js -o src/lib/adt-derivers.js
	@sjs -m adt-simple/macros -m ./macros -m ./spec/spec-helpers.js spec/curry-spec.js -o src/spec/curry-spec.js

test: src/spec/curry-spec.js
	@buster-test