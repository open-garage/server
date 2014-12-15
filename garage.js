var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var keys = require('./keys');

var currentVersion = '0.2.1';
var currentName = 'Open Garage';
var capi = 'v1';
var httpsPort = 8000;

// GPIO setup
var Gpio = require('onoff').Gpio,
	//door status GPIO
	doorStatus = new Gpio(4, 'in', 'both'),
	// door relay GPIO
	doorRelay = new Gpio(17, 'high');

var currentDoorStatus = 1;

// watch the door status
doorStatus.watch(function(err, value) {
	if (err) return;
	
	if (currentDoorStatus != value) {
		logAPICall('Door status changed', false, garageStatusToString());
		
		currentDoorStatus = value;
	}
});

// permited keys
var permitedKeys = keys.permitedKeys;

// SSL key / cert
var options = {
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.crt'),
	ca: fs.readFileSync('ca.crt'),
	requestCert: true,
	rejectUnauthorized: false
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
 * API TOGGLE CODES:
 *  0: Everything is OK
 * -1: Wrong or missing access token
 */
// api call: toggle
app.post('/api/' + capi + '/toggle', function (req, res) {
	var statuscode = 0;
	var token = req.body.token;
	var debug = req.body.debug;

	if (isTokenValid(token)) {
		if (debug == 1) {
			logAPICall('DEBUG Toggle', false, 'token: ' + token)
		} else {
			toggleDoor();
			logAPICall('Toggle', false, 'token: ' + token)
		}
	} else {
		statuscode = -1;
		logAPICall('Toggle', true, 'token: ' + token)
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
		statuscode = currentDoorStatus;
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

function garageStatusToString() {
	var statusString = "ERROR";
	
	switch (currentDoorStatus) {
	case 0:
		statusString = "CLOSED";
		break;
	case 1:
		statusString = "OPEN";
		break;
	}
	
	return statusString;
}