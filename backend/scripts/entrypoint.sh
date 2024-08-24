#!/bin/sh

if ! grep -q "port 6379" /etc/redis/redis.conf; then
    echo "port 6379" >> /etc/redis/redis.conf
fi

if ! grep -q "daemonize yes" /etc/redis/redis.conf; then
    echo "daemonize yes" >> /etc/redis/redis.conf
fi

redis-server /etc/redis/redis.conf

python manage.py makemigrations chat notification astropong
python manage.py migrate

exec python manage.py runserver 0.0.0.0:8000