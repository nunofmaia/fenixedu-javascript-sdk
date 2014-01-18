var express = require('express');
var http = require('http');
var path = require('path');
var fenix = require('../lib/fenix');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

fenix.config({
	clientId: 'YOUR APP ID',
	clientSecret: 'YOUR APP SECRET',
	callbackUrl: 'http://localhost:3000/auth/fenix/callback' // callbackUrl has to be the same specified in the app
});

app.get('/', function (req, res) {
	'use strict';
	res.send('<a href="/auth/fenix">Sign in with Fenix</a>');
});

app.get('/auth/fenix', function (req, res) {
	'use strict';
	res.redirect(fenix.authURL());
});
app.get('/auth/fenix/callback', function (req, res) {
	'use strict';
	var code = res.req.query.code;
	if (code) {
		fenix.authenticate(code, function () {
			res.redirect('/me');
		});
	}
});

app.get('/me', function (req, res) {
	'use strict';
	fenix.getPerson(function (e, r, b) {
		var person = JSON.parse(b);
		res.render('me', { user: person });
	});
});

app.get('/about', function (req, res) {
	'use strict';
	fenix.getAbout(function (e, r, b) {
		var about = JSON.parse(b);
		res.send(about);
	});
});

http.createServer(app).listen(app.get('port'), function(){
	'use strict';
	console.log('Express server listening on port ' + app.get('port'));
});
