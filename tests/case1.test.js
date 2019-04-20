const {
    spawn,
    // execSync,
} = require('child_process');
const path = require('path');

const resourceDir = path.resolve(__dirname, 'resource');

let mcs;
function startServer() {
    mcs = spawn('mcs', ['start'], {
        cwd: resourceDir,
        stdio: 'pipe',
    });
    console.log('start server___');
    
    return new Promise((res) => {
        mcs.stdout.on('data', (chunk) => {
            const data = chunk.toString();
            console.log('start');
            if (data.includes('Start server') !== -1) {
                setTimeout(() => {
                    res(); // ok to start test
                }, 50); // wait for port to be able to use
            }
        });
    })
}
function killServer() {
    mcs.kill();
    return new Promise((res) => {
        setTimeout(() => {res()}, 300);
    })
}


const assert = require('assert');
const axios = require('axios');
describe('Start', function () {
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

    describe('#request get data after set caseId', function () {
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
    beforeEach(async function() {
        return startServer();
    });
    afterEach(function() {
        return killServer();
    });
    // after(function () {
    //     // runs after all tests in this block, kill mcs
    //     mcs.kill();
    // });
});

