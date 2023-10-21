#!/bin/bash

dbdocs="dbdocs"
dbml2sql="dbml2sql"
DBFILE="database_schema.dbml"
PROJECT_NAME="370 Binary Bandits"
MYSQL_SCHEMA_FILE="mysql_schema.sql"
POSTGRES_SCHEMA_FILE="postgres_schema.sql"

if ! command -v "$dbdocs" &>/dev/null; then
    echo "$dbdocs not found on PATH! Can't update! Exiting..."
    exit 1
elif ! command -v "$dbml2sql" &>/dev/null; then
    echo "$dbml2sql not found on PATH! Can't update! Exiting..."
    exit 1
fi


dbdocs build "$DBFILE" --project="$PROJECT_NAME"
dbml2sql "$DBFILE" --mysql -o "scripts/generate_data/$MYSQL_SCHEMA_FILE"
dbml2sql "$DBFILE" --postgres -o "scripts/generate_data/$POSTGRES_SCHEMA_FILE"

