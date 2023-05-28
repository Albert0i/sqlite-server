#
# Import and expose environment variables
#
cnf ?= .env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

#
# Main
#
.PHONY: help prune config my-ciapp

help:
	@echo
	@echo "Usage: make TARGET"
	@echo
	@echo "SQLite server dockerize project automation helper for Linux version 1.0"
	@echo
	@echo "Targets:"
	@echo "	build		build custom image"
	@echo "	up  		start the server"
	@echo "	down 		stop the server"
	@echo "	ps 		show running containers"
	@echo "	logs		server logs"
	@echo "	config		edit configuration"

#
# build custom image
#
build:
	docker-compose build

#
# start the server
#
up:
	docker-compose up -d --remove-orphans --scale sqlite-server=2

#
# stop the server
#
down:
	docker-compose down -v

#
# show running containers 
#
ps:
	docker-compose ps

#
# server logs
#
logs:
	docker-compose logs

#
# edit configuration
#
config:
	nano .env

#
# EOF (2023/05/28)
#