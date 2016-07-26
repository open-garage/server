var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var keys = require('./keys');

var currentVersion = '0.5.2';
var currentName = 'Open Garage';
var capi = 'v1';
var httpsPort = 8000;

// GPIO setup
var Gpio = require('onoff').Gpio,
	//door status GPIO
	doorStatus = new Gpio(4, 'out', 'both'),
	// door relay GPIO
	doorRelay = new Gpio(17, 'high');

var currentDoorStatus = 0;

// watch the door status
doorStatus.watch(function(err, value) {
	if (err) {
		logAPICall('Door status changed', true, garageStateToString(currentDoorStatus));
		return;
	}
	
	if (currentDoorStatus != value) {
		currentDoorStatus = value;
		logAPICall('Door status changed', false, garageStateToString(currentDoorStatus));
	}
});

// permited keys
var permitedKeys = keys.permitedKeys;

// SSL key / cert
var options = {
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.crt')
};

var app = express();

// default route
app.get('/', function (req, res) {
	res.send(currentName + ' ' + currentVersion);
});

app.use(bodyParser.json());

// standard html site
app.get(['/', '/api/' + capi], function(req, res) {
	result = { name: currentName, version: currentVersion }

	res.contentType('application/json');
	res.send(JSON.stringify(result));
});

/**
 * API TOGGLE RETURN CODES:
 *  0: Everything is OK
 * -1: Wrong or missing access token
 * -2: Wrong or missing state value
 */
// api call: toggle
app.post('/api/' + capi + '/toggle', function (req, res) {
	var statuscode = 0;
	var token = req.body.token;
	var debug = req.body.debug;
	var doorState = req.body.state;

	if (isTokenValid(token)) {
		currentStatus = doorStatus.readSync();
		
		switch (doorState) {
		case 'close': // close
			if (currentStatus != 0) {
				if (debug == 'on') {
					logAPICall('DEBUG Close', false, 'token: ' + token + ' state: ' + doorState);
				} else {
					logAPICall('Close', false, 'token: ' + token + ' state: ' + doorState);
					toggleDoor();
				}
			}
			break;
		case 'open': // open
			if (currentStatus != 1) {
				if (debug == 'on') {
					logAPICall('DEBUG Open', false, 'token: ' + token + ' state: ' + doorState);
				} else {
					logAPICall('Open', false, 'token: ' + token + ' state: ' + doorState);
					toggleDoor();
				}
			}
			break;
		case 'toggle': // toggle
			if (debug == 'on') {
				logAPICall('DEBUG Toggle', false, 'token: ' + token + ' state: ' + doorState);
			} else {
				logAPICall('Toggle Open', false, 'token: ' + token + ' state: ' + doorState);
				toggleDoor();
			}
			break;
		default:
			statuscode = -2;
			logAPICall('Toggle', true, 'token: ' + token + ' state: ' + doorState);
			break;
		}
	} else {
		statuscode = -1;
		logAPICall('Toggle', true, 'token: ' + token + ' state: ' + doorState);
	}
	
	// create response
	res.contentType('application/json');
	result = { status: statuscode };
	
	res.send(JSON.stringify(result));
});

/**
 * API STATUS CODES:
 * 0: Door is closed
 * 1: Door is open
 * -1: Wrong or missing access token
 */

// api call: status
app.post('/api/' + capi + '/status', function(req, res) {
	var statuscode = -1;
	var token = req.body.token;
	
	if (isTokenValid(token)) {
		statuscode = doorStatus.readSync();
	}
	
	// create response
	res.contentType('application/json');
	result = { status: statuscode };

	res.send(JSON.stringify(result));
});

// start the server
https.createServer(options, app).listen(httpsPort);

// toggle the relay for the garage door
function toggleDoor() {
	doorRelay.writeSync(0);
	
	// wait 1 second
	setTimeout(function() {
		doorRelay.writeSync(1);
	}, 1000);
}

// check if auth token is valid
function isTokenValid(token) {
	if (permitedKeys.indexOf(token) > -1) {
		return true;
	} else {
		return false;
	}
}

// write into log file
function logAPICall(apiCall, error, message) {
	var apiTxt = 'API';
	
	if (error) {
		apiTxt = 'ERROR';
	}
	
	console.log(apiTxt + ': ' + apiCall + ' ' + message + ' Date: ' + Date().toString());
}

function garageStateToString(doorState) {
	var stateString = 'ERROR';
	
	switch (doorState) {
	case 0:
		stateString = 'CLOSED';
		break;
	case 1:
		stateString = 'OPEN';
		break;
	}
	
	return stateString;
}
