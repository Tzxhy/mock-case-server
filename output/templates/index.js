"use strict";
var MockCaseServer = require('mock-case-server').default;
var case1 = require('./cases/case1');
var case2 = require('./cases/case2');
MockCaseServer.loadCases([case1, case2]); // must do this
