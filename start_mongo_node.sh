#!/bin/sh

MONGODBDIR="tmp/mongo-db/"
if [ ! -d "$MONGODBDIR" ]; then
  mkdir -p $MONGODBDIR
  echo "Directory $MONGODBDIR created."
fi

# start mongo server
MONGOPORT=27017
ISMONGORUNNING=$(ps -ax | grep [m]ongod | wc -l | tr -d ' ')

if [ "$ISMONGORUNNING" == 0 ]; then
	echo "Starting mongo daemon on port $MONGOPORT..."
	echo "===== MONGOD OUTPOUT ====="
	mongod --fork --syslog --dbpath $MONGODBDIR --port $MONGOPORT
	echo "=========================="
	echo "Mongo daemon started"
else
	echo "Mongo daemon alrady started"
fi

echo "Starting node server..."
node server.js
