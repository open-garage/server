# Setup
## Install Node.js
```
sudo su -
cd /opt
wget http://nodejs.org/dist/v0.10.28/node-v0.10.28-linux-arm-pi.tar.gz
tar xvzf node-v0.10.25-linux-arm-pi.tar.gz
ln -s node-v0.10.25-linux-arm-pi node
chmod a+rw /opt/node/lib/node_modules
chmod a+rw /opt/node/bin
echo 'PATH=$PATH:/opt/node/bin' > /etc/profile.d/node.sh
npm -g install forever
```

Detailed Infos are available at:
http://raspberryalphaomega.org.uk/2014/06/11/installing-and-using-node-js-on-raspberry-pi/

## Install Open-Garage
### Clone git repository
```
cd /opt
sudo mkdir open-garage
sudo chown pi:pi open-garage/
git clone https://github.com/open-garage/server.git open-garage/
´´´

### Setup init script
```
cd /opt/open-garage/
sudo cp open-garage /etc/init.d/
sudo update-rc.d open-garage defaults
´´´

### Install Node.js modules
```
cd /opt/open-garage/
npm install express
npm install body-parser
´´´

### Create SSL Certs
Cert files (server.key, server.crt and ca.crt) needs to be in /opt/open-garage/

Detailed Infos are available at:
http://greengeckodesign.com/blog/2013/06/15/creating-an-ssl-certificate-for-node-dot-js/

### Create entrance keys
```
cd /opt/open-garage
cp keys.js.example keys.js
´´´

Now edit the keys.js file an add entrance key strings.

### Install wiringPi
```
cd /opt
sudo mkdir wiringPi
sudo chown -R pi:pi wiringPi/
git clone git://git.drogon.net/wiringPi wiringPi/
cd wiringPi/
./build
´´´

Detailed Infos are available at:
http://wiringpi.com/download-and-install/ 

# Manage Open-Garage Server
## Start service
```
sudo service open-garage start
```

## Stop service
```
sudo service open-garage stop
```

## Restart service
```
sudo service open-garage restart
```

# Api Calls
## Toggle garage (api/v1/toggle)
### Command
```
curl -k -X POST "https://192.168.0.165:8000/api/v1/toggle" --header "Content-Type: application/json" --data '{"token":"A"}'
```

### Response
{ status: 0 }

Status Codes:
* 0  = Everthing is OK
* -1 = Wrong or missing access token

## Garage door status (api/v1/status)
### Command
```
curl -k -X POST "https://192.168.0.165:8000/api/v1/status" --header "Content-Type: application/json" --data '{"token":"A"}'
```

### Response
{ status: 0 }

Status Codes:
* 0  = Door is open
* 1  = Door is closed
* -1 = Wrong or missing access token

## Get system infos
### Command
```
curl -k -X GET "https://192.168.0.165:8000/api/v1/"
```