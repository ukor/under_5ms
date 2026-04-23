#!/bin/bash

# Colors for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE} Starting...${NC}"

echo $PWD

docker compose -f docker-compose.dev.yaml up -d

echo -e "${BLUE} Waiting for MongoDB to be healthy...${NC}"

# Poll the healthcheck defined in docker-compose
until [ "$(docker inspect -f {{.State.Health.Status}} mongo-server)" == "healthy" ]; do
    printf '.'
    sleep 2
done

echo -e "\n${GREEN} MongoDB is up! Seeding data...${NC}"

pnpm tsx etc/seed.ts

echo -e "${GREEN} Environment is ready!${NC}"
echo -e "${BLUE}GateWay: http://localhost:3012${NC}"

# Show logs for all services
docker compose logs -f
