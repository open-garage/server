var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var spawn = require('child_process').spawn;
var keys = require('./keys');

var currentVersion = 0.2;
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
* API ERROR CODES:
*  0: Everything is OK
* -1: Wrong or missing access token
*/
// api call: toggle
app.post('/api/' + capi + '/toggle', function (req, res) {
	var errorcode = 0;
	//var token = req.param('token');
	var token = req.body.token;

	if (permitedKeys.indexOf(token) > -1) {
		console.log('API: Toggle token: ' + token + ' Date: ' + Date().toString());
		// execute shell script
		spawn('./toggle.sh');
	} else {
		console.log('ERROR: Toggle token: ' + token + ' Date: ' + Date().toString());
		errorcode = -1;
	}
	
	// create response
	res.contentType('application/json');
	result = { error: errorcode };
	
	res.send(JSON.stringify(result));
});

// start the server
https.createServer(options, app).listen(httpsPort);
