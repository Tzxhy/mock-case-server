const {startServer, killServer, initServerDir, clearServerDir, runCommand} = require('./common');


const assert = require('assert');
const axios = require('axios');
describe('多个测试 multi case', function () {
    before(() => {
        initServerDir('-p 9999 -h mp.toutiao.com');
        runCommand(`mcs new case2`);
        return startServer();
    });
    after(() => {
        clearServerDir();
        return killServer();
    });

    it('未设置 caseId，应该返回code 500', async function () {
        const { data } = await axios.get('http://localhost:9999/wiredAPI');

        assert.equal(data.code, 500, '返回code应该为500');
    });
    it('未设置 caseId，应该返回code 500', async function () {
        const { data } = await axios.get('http://localhost:9999/changeLogin');

        assert.equal(data.code, 500, '返回code应该为500');
    });
    it('设置不存在的caseId，应该返回code 404', async function () {
        const uniqStr = Math.random().toString(16).slice(2);
        const { data } = await axios.get('http://localhost:9999/changeCase?caseId=' + uniqStr);
        assert.equal(data.code, 404, '返回code应该为404');
    });

    it('设置存在的caseId case1，应该返回code 0', async function () {
        const { data } = await axios.get('http://localhost:9999/changeCase?caseId=case1');
        assert.equal(data.code, 0, '返回code应该为0');
    });

    it('请求 changeLogin 设置 case1, 应该返回 true', async function () {
        const { data } = await axios.get('http://localhost:9999/changeLogin');
        assert.equal(data.login, true, '返回 login 应该为true');
    });
    it('再次请求 changeLogin, 应该返回 false', async function () {
        const { data } = await axios.get('http://localhost:9999/changeLogin');
        assert.equal(data.login, false, '返回 login 应该为false');
    });
    
    it('请求/addMoney/20, 应该返回 20', async function () {
        const { data } = await axios.get('http://localhost:9999/addMoney/20');
        assert.equal(data.money, 20, '返回 money 应该为 20');
    });
    it('再请求/addMoney/10, 应该返回 30', async function () {
        const { data } = await axios.get('http://localhost:9999/addMoney/10');
        assert.equal(data.money, 30, '返回 money 应该为 30');
    });

    it('设置存在的caseId case2，应该返回code 0', async function () {
        const { data } = await axios.get('http://localhost:9999/changeCase?caseId=case2');
        assert.equal(data.code, 0, '返回code应该为0');
    });
    
    it('请求/change1?name=ttt, name应该返回 ttt', async function () {
        const { data } = await axios.get('http://localhost:9999/change1?name=ttt');
        assert.equal(data.name, 'ttt', '返回 name 应该为 ttt');
    });
    it('请求/makeMoney, money应该返回 0', async function () {
        const { data } = await axios.get('http://localhost:9999/makeMoney');
        assert.equal(data.money, 0, '返回 money 应该为 0');
    });
    it('再请求/makeMoney/10, money应该返回 10', async function () {
        const { data } = await axios.get('http://localhost:9999/makeMoney/10');
        assert.equal(data.money, 10, '返回 money 应该为 10');
    });


    it('设置存在的caseId case1，应该返回code 0', async function () {
        const { data } = await axios.get('http://localhost:9999/changeCase?caseId=case1');
        assert.equal(data.code, 0, '返回code应该为0');
    });


    it('再请求/addMoney/10, 应该返回 10', async function () {
        const { data } = await axios.get('http://localhost:9999/addMoney/10');
        assert.equal(data.money, 10, '返回 money 应该为 10');
    });
});


