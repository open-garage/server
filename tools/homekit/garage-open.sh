#!/bin/bash

source /opt/open-garage/tools/homekit/garage.config

curl -s "https://${HOST}:8000/api/v1/toggle" --header "Content-Type: application/json" --data "{\"token\":\"${TOKEN}\", \"state\":\"open\"}" > /dev/null

echo "OPEN"
