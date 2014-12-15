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
```

### Setup init script
```
cd /opt/open-garage/
sudo cp open-garage /etc/init.d/
sudo update-rc.d open-garage defaults
```

### Install Node.js modules
```
cd /opt/open-garage/
npm install
```

### Create SSL Certs
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

Cert files (server.key, server.crt and ca.crt) needs to be in /opt/open-garage/

Detailed Infos are available at:
http://greengeckodesign.com/blog/2013/06/15/creating-an-ssl-certificate-for-node-dot-js/

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
####Install BlueZ
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
### Parameters:
* token: The authentication token
* debug: Send debug = 1 for debugging

### Command
```
curl -k -X POST "https://192.168.0.165:8000/api/v1/toggle" --header "Content-Type: application/json" --data '{"token":"A", "debug":"1"}'
```

### Response
{ status: 0 }

Status Codes:
* 0  = Everthing is OK
* -1 = Wrong or missing access token

## Garage door status (api/v1/status)
### Parameters:
* token: The authentication token

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