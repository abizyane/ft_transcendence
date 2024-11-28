C_RED = \033[1;31m
C_GREEN = \033[1;32m
C_YELLOW = \033[1;33m
C_RESET = \033[0m

DC_CMD = @docker compose -f infrastructure/docker-compose.yml
DATA_PATH = ./infrastructure/database/data

all: build up

build:
	@echo "${C_GREEN}Starting Building...${C_RESET}"
	@mkdir -p $(DATA_PATH)
	$(DC_CMD) build

up:
	@echo "${C_GREEN}Starting up services...${C_RESET}"
	$(DC_CMD) up -d
	@echo "${C_GREEN}Done!${C_RESET}"
# @if ! docker network inspect astropong > /dev/null 2>&1; then \
#     echo "${C_GREEN}Starting up services...${C_RESET}"; \
#     $(DC_CMD) up -d; \
#     echo "${C_GREEN}Done!${C_RESET}"; \
# else \
#     echo "${C_GREEN}Services are already up.${C_RESET}"; \
# fi

down: 
	@echo "${C_RED}Stopping services...${C_RESET}"
	$(DC_CMD) down
# @if docker network inspect astropong > /dev/null 2>&1; then \
#     echo "${C_RED}Stopping services...${C_RESET}"; \
#     $(DC_CMD) down; \
# else \
#     echo "${C_RED}Services are already down.${C_RESET}"; \
# fi

test:
	@echo "${C_YELLOW}Running tests...${C_RESET}"
	$(DC_CMD) run --rm app go test ./...

state:
	@echo "${C_YELLOW}Checking state...${C_RESET}"
	$(DC_CMD) ps

restart:
	@echo "${C_YELLOW}Restarting services...${C_RESET}"
	$(DC_CMD) restart

logs:
	@echo "${C_YELLOW}Showing logs...${C_RESET}"
	$(DC_CMD) logs -f

clean: down
	@echo "${C_RED}Cleaning...${C_RESET}"
	@docker rm $$(docker ps -a -q) 2> /dev/null || true
	@docker rmi $$(docker images -q) 2> /dev/null || true
	@docker network prune -f > /dev/null 2>&1
	@echo "${C_RED}Cleaning Done!${C_RESET}"

fclean: clean
	@echo "${C_RED}Full cleaning...${C_RESET}"
	@rm -rf ./frontend/app/node_modules
	@rm -rf ./frontend/app/.next
	@rm -rf ./frontend/app/package-lock.json
	@rm -rf ./frontend/app/components.json
	@rm -rf ./frontend/app/yarn.lock
	@find ./backend/app/ -name 'migrations' -type d -depth -exec rm -rf {} \;
	@find ./backend/app -name '__pycache__' -type d -depth -exec rm -rf {} \;
	@find . -name ".DS_Store" -delete
	@docker system prune -af --volumes > /dev/null 2>&1
	@echo "${C_RED}Full cleaning Done!${C_RESET}"

dclean: fclean
	@rm -rf $(DATA_PATH)
	@echo "${C_RED}Postgres data Removed!${C_RESET}"

re: fclean all
