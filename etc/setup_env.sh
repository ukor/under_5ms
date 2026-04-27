#!/bin/bash

ENV_FILE=".env"

# Create or overwrite the .env file
cat <<EOF > $ENV_FILE
# --- PostGreSQL Configuration ---
PG_USER=under_5ms_user
PG_PASSWORD=under_5ms_password
PG_DB=under_5ms_db
PG_HOST=postgres
DATABASE_URL=postgres://under_5ms_user:under_5ms_password@localhost:5432/under_5ms_db

# --- MongoDB Configuration ---
MONGO_NAME=under_5ms_db
MONGO_USER=root
MONGO_PASSWORD=passwordRoot
MONGO_HOST=mongodb

# --- JWT Configuration ---
JWT_ALGORITHM=HS256
JWT_SECRET=what_what_what_kendrick_lama_j_cole_mopad

environment=development
app_name=under5ms_backend
APP_NAME=under5ms_backend

# --- Port Configuration ---
PORT=3012

PORT_BACKEND=3012
PORT_FRONTEND=3013
PORT_DOCUMENTATION=3014

HOST=0.0.0.0

EOF

if [ -f "$ENV_FILE" ]; then
    echo "Successfully generated $ENV_FILE for docket"
		cp $ENV_FILE ./apps/backend

		echo "Copied .env to the ./apps/backend"
else
    echo "Failed to create $ENV_FILE"
    exit 1
fi


FRONTEND_ENV_FILE="./apps/frontend/.env"
cat <<EOF > $FRONTEND_ENV_FILE

VITE_ENVIRONMENT=development
VITE_APP_NAME=under5ms_frontend
VITE_BASE_URL=http://localhost/api

# --- Port Configuration ---
VITE_PORT=3013
HOST=0.0.0.0

EOF

if [ -f "$ENV_FILE" ]; then
    echo "Successfully generated $FRONTEND_ENV_FILE for docker"
		cp $FRONTEND_ENV_FILE ./apps/frontend

		echo "Copied .env to the ./apps/frontend"
else
    echo "Failed to create $FRONTEND_ENV_FILE"
    exit 1
fi


