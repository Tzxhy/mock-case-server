const {startServer, killServer, initServerDir, clearServerDir} = require('./common');


const assert = require('assert');
const axios = require('axios');
describe('初始状态下测试(just one case)', function () {
    before(() => {
        initServerDir();
        return startServer();
    });
    after(() => {
        clearServerDir();
        return killServer();
    });
    
    it('请求不存在的 api，code 应该是404', async function () {
        const { data } = await axios.get('http://localhost:8080/wiredAPI');

        assert.equal(data.code, 404, '返回code应该为404');
    });
    it('状态为真', async function () {
        const { data } = await axios.get('http://localhost:8080/changeLogin');
        assert.equal(data.login, true, '返回login应该为true');
    });

    it('#添加10', async function () {
        const { data } = await axios.get('http://localhost:8080/addMoney/10');

        assert.equal(data.money, 10, '应该是10');
    });
    it('#再添加120', async function () {
        const { data } = await axios.get('http://localhost:8080/addMoney/120');
        assert.equal(data.money, 130, '应该是130');
    });
    it('状态为假', async function () {
        const { data } = await axios.get('http://localhost:8080/changeLogin');
        assert.equal(data.login, false, '返回login应该为 false');
    });

    it('不带参请求增加票子，应该404', async function () {
        const { data } = await axios.get('http://localhost:8080/addMoney');
        assert.equal(data.code, 404, '返回code 应该404');
    });
    it('不带参请求增加票子，应该404', async function () {
        const { data } = await axios.get('http://localhost:8080/addMoney/');
        assert.equal(data.code, 404, '返回code 应该404');
    });
});


