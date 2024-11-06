#!/bin/sh

if ! grep -q "port 6379" /etc/redis.conf; then
    echo "port 6379" >> /etc/redis.conf
fi

if ! grep -q "daemonize yes" /etc/redis.conf; then
    echo "daemonize yes" >> /etc/redis.conf
fi

cd ..
redis-server /etc/redis.conf
cd /app

until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER
do
    echo "Waiting for postgres..."
    sleep 2
done

python manage.py makemigrations chat notification astropong game
python manage.py migrate

exec python manage.py runserver 0.0.0.0:8000
