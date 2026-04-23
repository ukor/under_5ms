
.DEFAULT_GOAL := default

app ?= "backend"

install:
	pnpm --filter "./packages/**/**" install --no-frozen-lockfile
	pnpm --filter "./apps/**/**" install --no-frozen-lockfile
	pnpm install --no-frozen-lockfile

# --- Clean Targets ---
clean:
	@echo "Cleaning up..."
	$(RM) node_modules
	$(FIND) -name "pnpm-lock.yaml" -delete
	$(FIND) -type d -name ".turbo" -exec $(RM) {} +
	$(FIND) -type d -name "node_modules" -exec $(RM) {} +
	$(FIND) -type d -name "build" -exec $(RM) {} +
	$(FIND) -type d -name "dist" -exec $(RM) {} +
	@echo "Cleanup complete."


.PHONY: build_packages build_apps build
build_packages:
	pnpm run build:packages
build_apps:
	pnpm run build:apps
build:
	build_packages build_apps

.PHONY: start
start:
	pnpm --filter=$(app) --if-present run dev

.PHONY: start_backend
start_backend:
	@echo "Starting Backend"
	pnpm --filter="backend" run dev

.PHONY: start_frontend
start_frontend:
	@echo "Starting Frontend application"
	pnpm --filter="frontend" run dev
