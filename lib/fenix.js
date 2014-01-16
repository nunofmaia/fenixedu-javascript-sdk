var req = require('request');

var clientId = '';
var clientSecret = '';
var callbackUrl = '';

var baseUrl = 'https://fenix.tecnico.ulisboa.pt/';
var apiEndpoint = 'api/fenix/';
var apiVersion = '1';

var oauthEndpoint = 'oauth/';
var accessTokenEndpoint = 'access_token';
var refreshAccessTokenEndpoint = 'refresh_token';
var accessToken = '';
var refreshToken = '';
var authCode = '';
var expirationTime = 0;

var endpoints = {
    person: 'person',
    about: 'about',
    courses: 'courses',
    evaluations: 'evaluations',
    schedule: 'schedule',
    groups: 'groups',
    students: 'students',
    degrees: 'degrees',
    calendar: 'calendar',
    payments: 'payments',
    spaces: 'spaces',
    classes: 'classes',
    curriculum: 'curriculum'
};

var requests = {
    GET: req.get,
    POST: req.post,
    PUT: req.put,
    DELETE: req.del
};

function getApiUrl() {
    'use strict';
    return baseUrl + apiEndpoint + 'v' + apiVersion;
}

function request(method, url, params, headers, callback) {
    'use strict';
    var options = {
        uri: url,
        qs: params || {},
        headers: headers || {}
    };
    console.log('API request:', url, params);
    method(options, callback);
}

function apiPrivateRequest(method, endpoint, params, headers, callback) {
    'use strict';
    var url = getApiUrl() + '/' + endpoint,
        reqParams = params || {};

    reqParams.access_token = getAccessToken();

    request(method, url, reqParams, headers, callback);
}

function apiPublicRequest(method, endpoint, params, headers, callback) {
    'use strict';
    var url = getApiUrl() + '/' + endpoint;
    request(method, url, params, headers, callback);
}

function getAuthUrl() {
    'use strict';
    return baseUrl + oauthEndpoint + 'userdialog?client_id=' + clientId + '&redirect_uri=' + callbackUrl;
}

function getAccessToken() {
    'use strict';
    var currentTime = new Date().getTime();
    if (expirationTime <= currentTime) {
        refreshAccessToken(function (err, res, body) {
            var result = JSON.parse(body);
            if (!result.error_key) {
                accessToken = result.access_token;
                expirationTime = result.expires_in;
            }
        });
    }

    return accessToken;
}

function requestAccessToken(callback) {
    'use strict';
    var url = baseUrl + oauthEndpoint + accessTokenEndpoint,
        params = {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: callbackUrl,
            code: authCode,
            grant_type: 'authorization_code'
        },
        headers = {
            'content-type': 'application/x-www-form-urlencoded'
        };

    request(requests.POST, url, params, headers, callback);
}

function refreshAccessToken(callback) {
    'use strict';
    var url = baseUrl + oauthEndpoint + refreshAccessTokenEndpoint,
        params = {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            redirect_uri: callbackUrl,
            code: authCode,
            grant_type: 'authorization_code'
        },
        headers = {
            'content-type': 'application/x-www-form-urlencoded'
        };

    request(requests.POST, url, params, headers, callback);
}

var Api = {
    authURL: getAuthUrl(),
    config: function (configs) {
        'use strict';
        clientId = configs.clientId;
        clientSecret = configs.clientSecret;
        callbackUrl = configs.callbackUrl;
    },
    authenticate: function (code, done) {
        'use strict';
        authCode = code;
        requestAccessToken(function (err, res, body) {
            var result = JSON.parse(body);
            var currentTime = new Date().getTime();
            if (!result.error_key) {
                accessToken = result.access_token;
                refreshToken = result.refresh_token;
                expirationTime = currentTime + result.expires_in;
            }

            done();
        });
    },
    getAbout: function (callback) {
        'use strict';
        apiPublicRequest(requests.GET, endpoints.about, null, null, callback);
    },
    getCourse: function (id, callback) {
        'use strict';
        var endpoint = endpoints.courses + '/' + id;
        apiPublicRequest(requests.GET, endpoint, null, null, callback);
    },
    getCourseEvaluations: function (id, callback) {
        'use strict';
        var endpoint = endpoints.courses + '/' + id + '/' + endpoints.evaluations;
        apiPublicRequest(requests.GET, endpoint, null, null, callback);
    },
    getCourseGroups: function (id, callback) {
        'use strict';
        var endpoint = endpoints.courses + '/' + id + '/' + endpoints.groups;
        apiPublicRequest(requests.GET, endpoint, null, null, callback);
    },
    getCourseSchedule: function (id, callback) {
        'use strict';
        var endpoint = endpoints.courses + '/' + id + '/' + endpoints.schedule;
        apiPublicRequest(requests.GET, endpoint, null, null, callback);
    },
    getCourseStudents: function (id, callback) {
        'use strict';
        var endpoint = endpoints.courses + '/' + id + '/' + endpoints.students;
        apiPublicRequest(requests.GET, endpoint, null, null, callback);
    },
    getDegree: function (id, year, callback) {
        'use strict';
        var endpoint = endpoints.degrees + '/' + id,
            params = { year: year || {} };
        apiPublicRequest(requests.GET, endpoint, params, null, callback);
    },
    getDegreeCourses: function (id, year, callback) {
        'use strict';
        var endpoint = endpoints.degrees + '/' + id + '/' + endpoints.courses,
            params = { year: year || '' };
        apiPublicRequest(requests.GET, endpoint, params, null, callback);
    },
    getSpaces: function (callback) {
        'use strict';
        apiPublicRequest(requests.GET, endpoints.spaces, null, null, callback);
    },
    getSpace: function (id, day, callback) {
        'use strict';
        var endpoint = endpoints.spaces + '/' + id,
            params = { day: day || '' };
        apiPublicRequest(requests.GET, endpoint, params, null, callback);
    },
    getPerson: function (callback) {
        'use strict';
        apiPrivateRequest(requests.GET, endpoints.person, null, null, callback);
    },
    getClassesCalendar: function (format, callback) {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.calendar + '/' + endpoints.classes,
            params = {
                format: format || 'json'
            };

        apiPrivateRequest(requests.GET, endpoint, params, null, callback);
    },
    getEvaluationCalendar: function (format, callback) {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.calendar + '/' + endpoints.evaluations,
            params = {
                format: format || 'json'
            };

        apiPrivateRequest(requests.GET, endpoint, params, null, callback);
    },
    getEvaluations: function (callback) {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.evaluations;
        apiPrivateRequest(requests.GET, endpoint, null, null, callback);
    },
    getEvaluation: function (id, callback) {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.evaluations + '/' + id;
        apiPrivateRequest(requests.GET, endpoint, null, null, callback);
    },
    enrolInEvaluation: function (id, action, callback) {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.evaluations + '/' + id,
            params = {
                enrol: action || ''
            };

        apiPrivateRequest(requests.PUT, endpoint, params, null, callback);

    },
    getCurriculum: function (callback) {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.curriculum;
        apiPrivateRequest(requests.GET, endpoint, null, null, callback);
    },
    getCourses: function (semester, year, callback) {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.courses,
            params = {
                semester: semester || '',
                year: year || ''
            };

        apiPrivateRequest(requests.GET, endpoint, params, null, callback);
    },
    getPayments: function (callback) {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.payments;
        apiPrivateRequest(requests.GET, endpoint, null, null, callback);
    }
};

module.exports = Api;