# Setup
## Install Node.js on Raspian (Stretch)
```
sudo su -
cd /opt
wget https://nodejs.org/dist/v10.16.2/node-v10.16.2-linux-armv6l.tar.xz
tar xJvf node-v10.16.2-linux-armv6l.tar.xz
ls -s node-v10.16.2-linux-armv6l node
chmod a+rw /opt/node/lib/node_modules
chmod a+rw /opt/node/bin
echo 'PATH=$PATH:/opt/node/bin' > /etc/profile.d/node.sh
npm -g install forever
```

## Install Open-Garage
### Clone git repository
```
cd /opt
sudo mkdir open-garage
sudo chown pi:pi open-garage/
git clone https://github.com/open-garage/server.git open-garage/
```

### Setup init script
```
cd /opt/open-garage/tools/
sudo cp open-garage /etc/init.d/
sudo update-rc.d open-garage defaults
```

### Install Node.js modules
```
cd /opt/open-garage/
npm install
```

If there a problems installing the onoff npm, you should install a newer version of gcc.
https://github.com/fivdi/onoff/wiki/Node.js-v4-and-native-addons

### Create SSL Certs
#### Self-Signed

```
cd /opt/open-garage/
openssl genrsa -des3 -out ca.key 1024
openssl req -new -key ca.key -out ca.csr
openssl x509 -req -days 365 -in ca.csr -out ca.crt -signkey ca.key

openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr

cp server.key server.key.org
openssl rsa -in server.key.org -out server.key

openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

Cert files server.key, server.crt (fullchain cert) needs to be in /opt/open-garage/

Detailed Infos are available at:
http://greengeckodesign.com/blog/2013/06/15/creating-an-ssl-certificate-for-node-dot-js/

#### Let's Encrypt

Use client from: https://github.com/Neilpang/acme.sh
See the ```README.md``` for installation informations.

### Create entrance keys
```
cd /opt/open-garage
cp keys.js.example keys.js
```

Now edit the keys.js file an add entrance key strings.

### Install wiringPi (Optional Step)
```
cd /opt
sudo mkdir wiringPi
sudo chown -R pi:pi wiringPi/
git clone git://git.drogon.net/wiringPi wiringPi/
cd wiringPi/
./build
```

Detailed Infos are available at:
http://wiringpi.com/download-and-install/

### iBeacon (Optional Step)
#### Install BlueZ
Install required libraries
```
sudo apt-get install libusb-dev 
sudo apt-get install libdbus-1-dev 
sudo apt-get install libglib2.0-dev --fix-missing
sudo apt-get install libudev-dev 
sudo apt-get install libical-dev
sudo apt-get install libreadline-dev
```

Compile BlueZ
```
cd /opt
sudo mkdir bluez
sudo chown -R pi:pi bluez/
cd bluez/
wget http://www.kernel.org/pub/linux/bluetooth/bluez-5.26.tar.xz
tar xf bluez-5.26.tar.xz
cd bluez-5.26
LDFLAGS=-lrt ./configure --prefix=/usr/local --sysconfdir=/etc --localstatedir=/var --enable-library
make
sudo make install
```

#### Set iBeacon UUID

Edit the UUID int the /opt/open-garage/ibeacon-controller.sh file.

#### Enable iBeacon
Edit the init script (/etc/init.d/open-garage)

Enable iBeacon support
```
STARTBEACON="1"
```

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

# API Calls
## Toggle garage (api/v1/toggle)
### Parameters:
* token: The authentication token
* debug: Send debug = on for debugging
* state: close, open, toggle

### Command
```
curl -X POST "https://192.168.0.165:8000/api/v1/toggle" --header "Content-Type: application/json" --data '{"token":"A", "state":"close", "debug":"on"}'
```

### Response
{ status: 0 }

Status Codes:
* 0  = Everthing is OK
* -1 = Wrong or missing access token
* -2 = Wrong or missing state value

## Garage door status (api/v1/status)
### Parameters:
* token: The authentication token

### Command
```
curl -X POST "https://192.168.0.165:8000/api/v1/status" --header "Content-Type: application/json" --data '{"token":"A"}'
```

### Response
{ status: 0 }

Status Codes:
* 0  = Door is closed
* 1  = Door is open
* -1 = Wrong or missing access token

## Get system infos
### Command
```
curl -X GET "https://192.168.0.165:8000/api/v1/"
```

# HomeKit Support
First you have to install HomeBridge see: https://homebridge.io
The HomeBridge plugin: `homebridge-garagedoor-command` is also required.

Example homebridge `.config`

```
"accessories": [{
    "accessory": "GarageCommand",
    "name": "Garage Door",
    "open": "/opt/open-garage/tools/homekit/garage-open.sh",
    "close": "/opt/open-garage/tools/homekit/garage-close.sh",
    "state": "/opt/open-garage/tools/homekit/garage-status.sh",
    "status_update_delay": 15,
    "poll_state_delay": 20
}]
```
