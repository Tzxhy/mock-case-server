const {startServer, killServer} = require('./common');


const assert = require('assert');
const axios = require('axios');
describe('normal test', function () {
    describe('#request without set caseId', function () {
        it('#1: should return 500', async function () {
            const { data } = await axios.get('http://localhost:8080/wiredAPI');

            assert.deepEqual(data, {
                code: 500,
                msg: 'Please set caseId before start case!'
            }, '返回code不为500');
        });
        it('#2: should return 500', async function () {
            const { data } = await axios.get('http://localhost:8080/changeLogin');

            assert.deepEqual(data, {
                code: 500,
                msg: 'Please set caseId before start case!'
            }, '返回code不为500');
        });
    });

    describe('#request changeCase', function () {
        it('#should change succeed', async function () {
            const { data } = await axios.get('http://localhost:8080/changeCase?caseId=case1');

            assert.deepEqual(data, {"code":0,"msg":"Ok, now use case1 for coming tests..."}, '成功');
        });
        it('#should change failed', async function () {
            const randomStr = Math.random().toString(16).slice(2);
            const { data } = await axios.get(`http://localhost:8080/changeCase?caseId=${randomStr}`);
            assert.deepEqual(data, {"code":404,"msg":`Not found caseId ${randomStr}.`}, '失败提示');
        });
    });
    beforeEach(async function() {
        return startServer();
    });
    afterEach(function() {
        return killServer();
    });
});




