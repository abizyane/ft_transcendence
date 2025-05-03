#!/bin/sh

echo "Starting PostgreSQL setup..."
if [ -z "$(ls -A "$PGDATA")" ]; then
    echo "Initializing PostgreSQL database..."    
    initdb -D $PGDATA
    
    echo "Configuring PostgreSQL..."
    echo 'host all all 0.0.0.0/0 md5' >> $PGDATA/pg_hba.conf
    echo "listen_addresses='*'" >> $PGDATA/postgresql.conf
    
    echo "Starting PostgreSQL for initial setup..."
    pg_ctl -D $PGDATA -w start
    
    echo "Creating database and user..."
    createuser $POSTGRES_USER
    createdb -O $POSTGRES_USER $POSTGRES_DB
    
    echo "Setting the password..."
    psql -c "ALTER USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"
    
    echo "Stopping temporary PostgreSQL instance..."
    pg_ctl -D $PGDATA -m fast -w stop
    
    echo "Initial PostgreSQL setup completed!"
fi

echo "Starting PostgreSQL server..."
exec postgres -D $PGDATA