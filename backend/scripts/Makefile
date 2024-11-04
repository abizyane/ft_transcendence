all:
	bash -c 'source ./script.sh'
	docker compose up -d
migrate:
	python3 ../app/manage.py makemigrations game chat notification astropong
	python3 ../app/manage.py migrate