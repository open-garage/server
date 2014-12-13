var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var spawn = require('child_process').spawn;
var keys = require('./keys');

var currentVersion = '0.2.1';
var currentName = 'Open Garage';
var capi = 'v1';
var httpsPort = 8000;

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
			// execute shell script
			spawn('./garage-controller.sh', ['toggle']);
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
 * 0: Door is open
 * 1: Door is closed
 * -1: Wrong or missing access token
 */

// api call: status
app.post('/api/' + capi + '/status', function(req, res) {
	var statuscode = -1;
	var token = req.body.token;
	
	if (isTokenValid(token)) {
		statuscode = 1;
		
		cmd = spawn('./garage-controller.sh', ['status']);
		
		cmd.stdout.on('data', function(data) {
			// convert return values to string and remove \n
			statuscode = data.toString().replace(/\n$/, '');
			logAPICall('Status', false, 'current status: ' + statuscode);
			
			// create response
			res.contentType('application/json');
			result = { status: statuscode };
	
			res.send(JSON.stringify(result));
		});
	}
});

// start the server
https.createServer(options, app).listen(httpsPort);

// check if auth token is valid
function isTokenValid(token) {
	if (permitedKeys.indexOf(token) > -1) {
		return true;
	} else {
		return false;
	}
}

function logAPICall(apiCall, error, message) {
	var apiTxt = 'API';
	
	if (error) {
		apiTxt = 'ERROR';
	}
	
	console.log(apiTxt + ': ' + apiCall + ' ' + message + ' Date: ' + Date().toString());
}
