const MockCaseServer = require('mock-case-server').default;

const case1 = require('./cases/case1');
const case2 = require('./cases/case2');

MockCaseServer.loadCases([case1, case2]); // must do this
