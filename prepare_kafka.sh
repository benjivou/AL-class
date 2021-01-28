#Building and Starting Docker images
cd docker-kafka
echo "Building docker-kafka image..."
docker-compose build

echo "WAIT.."
sleep 3

echo " "
echo "Now Starting docker-kafka image!"
docker-compose up -d
