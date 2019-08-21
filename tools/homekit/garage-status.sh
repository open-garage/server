#!/bin/bash

source /opt/open-garage/tools/homekit/garage.config

STATUS=`curl -s "https://${HOST}:8000/api/v1/status" --header "Content-Type: application/json" --data "{\"token\":\"${TOKEN}\"}" | jq '.["status"]'`

if [ "$STATUS" -eq "0" ]; then
	echo "CLOSED"
elif [ "$STATUS" -eq "1" ]; then
	echo "OPEN"
fi
