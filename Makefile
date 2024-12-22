C_RED = \033[1;31m
C_GREEN = \033[1;32m
C_YELLOW = \033[1;33m
C_RESET = \033[0m

DC_CMD = @docker compose -f infrastructure/docker-compose.yml
DATA_PATH = ./infrastructure/database/data
ELK_PATH = ./infrastructure/

all: build up

build:
	@echo "${C_GREEN}Starting Building...${C_RESET}"
	@mkdir -p $(DATA_PATH)
	@mkdir -p $(ELK_PATH)elasticsearch/data
	@mkdir -p $(ELK_PATH)kibana/data
	@mkdir -p $(ELK_PATH)logstash/data
	@mkdir -p $(ELK_PATH)filebeat/data
	@mkdir -p $(ELK_PATH)elk_setup/certs
	$(DC_CMD) build

up:
	@echo "${C_GREEN}Starting up services...${C_RESET}"
	$(DC_CMD) up -d
	@echo "${C_GREEN}Done!${C_RESET}"

down: 
	@echo "${C_RED}Stopping services...${C_RESET}"
	$(DC_CMD) down

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
	@rm -rf $(ELK_PATH)elasticsearch/data
	@rm -rf $(ELK_PATH)kibana/data
	@rm -rf $(ELK_PATH)logstash/data
	@rm -rf $(ELK_PATH)filebeat/data
	@rm -rf $(ELK_PATH)elk_setup/certs
	@echo "${C_RED}ELK Data Removed!${C_RESET}"
	@rm -rf $(DATA_PATH)
	@echo "${C_RED}Postgres data Removed!${C_RESET}"

help: 
	@echo "Usage: make [command]"
	@echo "Commands:"
	@echo "  build: Build the services"
	@echo "  up: Start the services"
	@echo "  down: Stop the services"
	@echo "  state: Check the state of the services"
	@echo "  restart: Restart the services"
	@echo "  logs: Show the logs of the services"
	@echo "  clean: Stops and remove the services"
	@echo "  fclean: Clean and remove docker cache and volumes"
	@echo "  dclean: Fclean and remove the database and elk data"
	@echo "  help: Show this help message"

re: fclean all
