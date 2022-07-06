## USAGE: curl -sL https://api-codx.meetnav.com/neko-rooms/installer.sh | bash -s -- ip user passsword API_TOKEN

NEKO_ROOMS_NAT1TO1=$1
USERNAME=$2
PASSWORD=$3
NEKO_ROOMS_PORT=9080
echo "Installing neko-rooms with IP: $IP USER: $USERNAME PWD: $PASSWORD"
echo "# Istall docker"

if [ ! "$(docker --version)" ]; then
  curl -sSL https://get.docker.com/ | CHANNEL=stable bash
  echo "Docker: $(docker --version)"
fi

if [ ! "$(docker-compose --version)" ]; then
  sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

sudo apt-get update
sudo apt-get install -y apache2-utils git

echo "# Create neko-rooms folder"
[ -d "neko-rooms" ] && rm -rf neko-rooms
mkdir -p neko-rooms
NEKO_ROOMS_DIR=$PWD/neko-rooms
cd $NEKO_ROOMS_DIR

echo "Create neko-rooms folders"
mkdir rooms
mkdir templates

echo "# Create env file"
export NEKO_ROOMS_USER=$(echo "$(htpasswd -nb $USERNAME $PASSWORD)")
echo "
NEKO_ROOMS_NEKO_IMAGES=codx/room:latest
NEKO_ROOMS_USER=$NEKO_ROOMS_USER
NEKO_ROOMS_INSTANCE_URL=http://$NEKO_ROOMS_NAT1TO1:$NEKO_ROOMS_PORT/
NEKO_ROOMS_PORT=$NEKO_ROOMS_PORT
" > .env

curl -sSL https://api-codx.meetnav.com/neko-rooms/docker-compose.yaml > docker-compose.yaml

echo "# Building codx-images"
git clone https://github.com/gbrian/codx.git
cd codx
git checkout dev
cd docker
sudo build-rooms.sh

echo "# Running neko-rooms"
cd $NEKO_ROOMS_DIR
sudo docker-compose up -d


