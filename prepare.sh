#Building and Starting Docker images
./prepare_kafka.sh
echo "Building Docker images..."
docker-compose build

echo "WAIT.."
sleep 3

echo " "
echo "Now Starting Docker images !"
docker-compose up -d
