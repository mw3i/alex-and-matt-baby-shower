.PHONY: install dev build deploy push

# Optional: make build BASE_PATH=/your-repo-name
BASE_PATH ?=

install:
	npm install

dev:
	npm run dev

build:
	BASE_PATH=$(BASE_PATH) npm run build

# Stage static export for GitHub Pages (uses /out from next export)
deploy: build
	@echo "Built static site in out/"
	@echo "Commit and push to trigger Pages, or: make push"

push:
	git add -A
	@echo "Review staged changes, then: git commit && git push"
