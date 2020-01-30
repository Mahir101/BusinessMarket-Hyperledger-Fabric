cd ../first-network/
./byfn.sh down

docker rm -f $(docker ps -aq)

docker rmi -f $(docker images | grep bebshabazar | awk '{print $3}')
