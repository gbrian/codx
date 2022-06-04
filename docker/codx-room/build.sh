set -e
source ./.env
docker login -u $DOCKER_LOGIN_USER -p $DOCKER_LOGIN_PWD $DOCKER_DOMAIN
docker pull m1k1o/neko:firefox

docker build -t codx/room:latest .
docker image tag codx/room:latest $DOCKER_DOMAIN/gbrian/codx:latest

docker build -f desktop/Dockerfile -t codx/desktop:latest ./desktop
docker image tag codx/room:latest $DOCKER_DOMAIN/gbrian/desktop:latest
docker image push $DOCKER_DOMAIN/gbrian/codx