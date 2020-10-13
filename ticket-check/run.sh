#!/usr/bin/env bash


#run the image docker after building it
#sh build.sh
winpty docker run -it -p 3003:3003  ticket-check-service

read enter
exit

