# Setup
## Install Node.js
http://raspberryalphaomega.org.uk/2014/06/11/installing-and-using-node-js-on-raspberry-pi/

## Create SSL Certs
http://greengeckodesign.com/blog/2013/06/15/creating-an-ssl-certificate-for-node-dot-js/


# Manage Node.js Server
## Start service
sudo service open-garage start

## Stop service
sudo service open-garage stop

## Restart service
sudo service open-garage restart

# Api Calls
## Toggle garage (api/v1/toggle)
### Command
curl -k -X POST "https://192.168.0.165:8000/api/v1/toggle" --header "Content-Type: application/json" --data '{"token":"A"}'

### Response
{ error: 0 }

Errorcodes:
* 0  = Everthing is OK
* -1 = Wrong or missing access token

## Get system infos
curl -k -X GET "https://192.168.0.165:8000/api/v1/"