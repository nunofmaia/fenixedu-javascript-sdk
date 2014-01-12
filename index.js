var req = require('request');

var clientId = '';
var clientSecret = '';
var callbackUrl = '';

var baseUrl = 'https://fenix.ist.utl.pt/';
var apiEndpoint = 'api/fenix/';
var apiVersion = '1';

var oauthEndpoint = 'oauth/';
var accessTokenEndpoint = 'access_token';
var refreshAccessTokenEndpoint = 'refresh_token';
var accessToken = '';
var refreshToken = '';
var errorKey = 'error';

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

function apiPrivateRequest(method, endpoint, params, headers) {
    'use strict';
    var url = getApiUrl() + '/' + endpoint;
    request(method, url, params, headers);
}

function apiPublicRequest(method, endpoint, params, headers, callback) {
    'use strict';
    var url = getApiUrl() + '/' + endpoint;
    request(method, url, params, headers, callback);
}

function refreshAccessToken() {
    'use strict';
}

function getAuthUrl() {
    'use strict';
    return baseUrl() + oauthEndpoint + '/userdialog?client_id=' + clientId + '&redirect_uri=' + callbackUrl;
}

function setCode() {
    'use strict';
}

function setAccessToken(token) {
    'use strict';
    accessToken = token;
}

function getAccessToken() {
    'use strict';
    return accessToken;
}

function getRefreshToken() {
    'use strict';
    return refreshToken;
}

function getTokenExpires() {
    'use strict';
}

var Api = {
    config: function (configs) {
        'use strict';
        clientId = configs.clientId;
        clientSecret = configs.clientSecret;
        callbackUrl = configs.callbackUrl;

        console.log(clientId, clientSecret, callbackUrl);
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
    getPerson: function () {
        'use strict';
        apiPrivateRequest(endpoints.person);
    },
    getClassesCalendar: function (format) {
        'use strict';
    },
    getEvaluationCalendar: function (format) {
        'use strict';
    },
    getEvaluations: function () {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.evaluations;
        apiPrivateRequest(endpoint);
    },
    getEvaluation: function (id) {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.evaluations + '/' + id;
        apiPrivateRequest(endpoint);
    },
    enrolInEvaluation: function (id, action) {
        'use strict';
    },
    getCurriculum: function () {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.curriculum;
        apiPrivateRequest(endpoint);
    },
    getCourses: function (semester, year) {
        'use strict';
    },
    getPayments: function () {
        'use strict';
        var endpoint = endpoints.person + '/' + endpoints.payments;
        apiPrivateRequest(endpoint);
    }
};

module.exports = Api;