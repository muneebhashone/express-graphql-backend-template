serve-dev:
	docker compose -d --build api
logs-api:
	docker compose logs api -f
serve-prod:
	docker compose -f docker-compose-prod.yml up -d --build api
prod-api-logs:
	docker compose -f docker-compose-prod.yml logs api --tail 50 -f
prod-exec-api:
	docker compose -f docker-compose-prod.yml exec -it api sh
