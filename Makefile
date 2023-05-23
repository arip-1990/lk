init: init-ci client-ready
init-ci: docker-down-clear \
	api-clear client-clear \
	docker-pull docker-build docker-up \
	api-init client-init
up: docker-up
down: docker-down
restart: down up

rebuild: docker-down  api-clear client-clear \
	docker-pull docker-build docker-up \
	api-init client-init client-ready

update-deps: api-composer-update client-yarn-upgrade restart

docker-up:
	docker compose up -d

docker-down:
	docker compose down --remove-orphans

docker-down-clear:
	docker compose down -v --remove-orphans

docker-pull:
	docker compose pull

docker-build:
	docker compose build --pull


api-clear:
	docker run --rm -v ${PWD}/api:/app -w /app alpine sh -c 'rm -rf storage/framework/cache/data/* storage/framework/sessions/* storage/framework/testing/* storage/framework/views/* storage/logs/*'

api-init: api-permissions api-composer-install api-wait-db api-migrations

api-permissions:
	docker run --rm -v ${PWD}/api:/app -w /app alpine chmod 777 -R storage bootstrap/cache

api-composer-install:
	docker compose run --rm api-php-cli composer install

api-composer-update:
	docker compose run --rm api-php-cli composer update

api-wait-db:
	docker compose run --rm api-php-cli wait-for-it api-db:3306 -t 30

api-migrations:
	docker compose run --rm api-php-cli php artisan migrate --force

api-optimize:
	docker compose run --rm api-php-cli php artisan optimize:clear


client-clear:
	docker run --rm -v ${PWD}/client:/app -w /app alpine sh -c 'rm -rf .ready build'

client-init: client-yarn-install

client-yarn-install:
	docker compose run --rm client-node-cli yarn install

client-yarn-upgrade:
	docker compose run --rm client-node-cli yarn upgrade

client-ready:
	docker run --rm -v ${PWD}/client:/app -w /app alpine touch .ready


build: build-gateway build-client build-api

build-gateway:
	docker --log-level=debug build --pull --file=gateway/docker/prod/nginx/Dockerfile --tag=${REGISTRY}/lk-social-gateway:${IMAGE_TAG} gateway/docker

build-client:
	docker --log-level=debug build --pull --file=client/docker/prod/nginx/Dockerfile --tag=${REGISTRY}/lk-social-client:${IMAGE_TAG} client

build-api:
	docker --log-level=debug build --pull --file=api/docker/prod/nginx/Dockerfile --tag=${REGISTRY}/lk-social-api:${IMAGE_TAG} api
	docker --log-level=debug build --pull --file=api/docker/prod/php-fpm/Dockerfile --tag=${REGISTRY}/lk-social-api-php-fpm:${IMAGE_TAG} api
	docker --log-level=debug build --pull --file=api/docker/prod/php-cli/Dockerfile --tag=${REGISTRY}/lk-social-api-php-cli:${IMAGE_TAG} api

try-build:
	REGISTRY=localhost IMAGE_TAG=0 make build

push: push-gateway push-client push-api

push-gateway:
	docker push ${REGISTRY}/lk-social-gateway:${IMAGE_TAG}

push-client:
	docker push ${REGISTRY}/lk-social-client:${IMAGE_TAG}

push-api:
	docker push ${REGISTRY}/lk-social-api:${IMAGE_TAG}
	docker push ${REGISTRY}/lk-social-api-php-fpm:${IMAGE_TAG}
	docker push ${REGISTRY}/lk-social-api-php-cli:${IMAGE_TAG}

deploy:
	ssh -o StrictHostKeyChecking=no fox@192.168.2.19 'rm -rf lk_${BUILD_NUMBER} && mkdir lk_${BUILD_NUMBER}'

	envsubst < docker-compose-prod.yml > docker-compose-prod-env.yml
	scp -o StrictHostKeyChecking=no docker-compose-prod-env.yml fox@192.168.2.19:lk_${BUILD_NUMBER}/docker-compose.yml
	rm -f docker-compose-prod-env.yml

	ssh -o StrictHostKeyChecking=no fox@192.168.2.19 'cd lk_${BUILD_NUMBER} && docker stack deploy --compose-file docker-compose.yml lk --with-registry-auth --prune'

rollback:
	ssh -o StrictHostKeyChecking=no fox@192.168.2.19 'cd lk_${BUILD_NUMBER} && docker stack deploy --compose-file docker-compose.yml lk --with-registry-auth --prune'
