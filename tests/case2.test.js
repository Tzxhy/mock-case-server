const {startServer, killServer} = require('./common');
const assert = require('assert');
const axios = require('axios');


describe('test case persist and change', function() {
    before(() => {
        return startServer();
    });
    
    describe('test cases persist', function() {
        
        it('#should get right data', async function() {
            await axios.get('http://localhost:8080/changeCase?caseId=case1');
            let {data} = await axios.get('http://localhost:8080/changeLogin');
            assert.equal(data.login, true);
            ({data} = await axios.get('http://localhost:8080/changeLogin'));
            assert.equal(data.login, false);
            ({data} = await axios.get('http://localhost:8080/addMoney/10'));
            assert.equal(data.money, 10);
            ({data} = await axios.get('http://localhost:8080/addMoney/100'));
            assert.equal(data.money, 110);
        });

        it('#should get right data', async function() {
            await axios.get('http://localhost:8080/changeCase?caseId=case2');
            let {data} = await axios.get('http://localhost:8080/getName');
            assert.equal(data.name, 'test');
            assert.equal(data.shouldTip, false);
            ({data} = await axios.get('http://localhost:8080/getName'));
            assert.equal(data.name, 'test');
            assert.equal(data.shouldTip, false);
            ({data} = await axios.get('http://localhost:8080/getName'));
            assert.equal(data.name, 'test');
            assert.equal(data.shouldTip, true);

            ({data} = await axios.get('http://localhost:8080/sub'));
            assert.deepEqual(data, {
                name: 'test',
                money: 0,
                shouldTip: true,
                msg: 'please tell me money.',
            });

            ({data} = await axios.get('http://localhost:8080/sub/10'));
            assert.deepEqual(data, {
                name: 'test',
                money: -10,
                shouldTip: true,
            });
        });
    });

    describe('test case change', () => {
        it('#change case2 to case1, should get default state', async function() {
            await axios.get('http://localhost:8080/changeCase?caseId=case1');
            let {data} = await axios.get('http://localhost:8080/addMoney/20');
            assert.equal(data.money, 20);
        });
    });

    after(() => {
        killServer();
    })
    
    
});