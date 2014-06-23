PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.PHONY: watch compile

watch:
	watchy -w lib,spec -- make build

build: lib/curry.js spec/curry-spec.js
	make compile
	make test

compile:
	@mkdir -p src/lib
	@mkdir -p src/spec
	@sjs -m sparkler/macros -m adt-simple/macros lib/curry.js -o src/lib/curry.js
	@sjs -m sparkler/macros -m adt-simple/macros -m ./lib/curry spec/curry-spec.js -o src/spec/curry-spec.js

test: src/spec/curry-spec.js
	@buster-test