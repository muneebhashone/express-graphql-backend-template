up-prod:
	docker compose -f docker-compose-prod.yml up -d --build api
prod-api-logs:
	docker compose -f docker-compose-prod.yml logs api --tail 50 -f
prod-exec-api:
	docker compose -f docker-compose-prod.yml exec -it api sh