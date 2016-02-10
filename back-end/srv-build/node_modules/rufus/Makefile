REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	--check-leaks \
	--reporter $(REPORTER)

test-cov:
	@NODE_ENV=test ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- \
	--check-leaks \
	--reporter $(REPORTER)

jshint:
	./node_modules/.bin/jshint --show-non-errors lib test

.PHONY: test test-cov
