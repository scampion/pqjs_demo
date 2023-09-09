all: docs

docs:
	@./node_modules/.bin/next build
	@mv out docs

clean:
	@rm -rf out docs


