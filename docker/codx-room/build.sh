CWD=$PWD
# Build neko
export BUILD_IMAGE=codx/neko
export NODE_ENV=production
cd ../../neko/.docker

bash build base
bash build firefox

cd $CWD

set -e
source ./.env
docker login -u $DOCKER_LOGIN_USER -p $DOCKER_LOGIN_PWD $DOCKER_DOMAIN

docker build -t codx/room:latest .
docker image tag codx/room:latest $DOCKER_DOMAIN/gbrian/codx:latest

docker build -f desktop/Dockerfile -t codx/desktop:latest ./desktop
docker image tag codx/room:latest $DOCKER_DOMAIN/gbrian/desktop:latest
docker image push $DOCKER_DOMAIN/gbrian/codx