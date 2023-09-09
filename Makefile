all: out

out:
	@./node_modules/.bin/next build

clean:
	@rm -rf out


