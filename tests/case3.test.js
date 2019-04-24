const {startServer, killServer, initServerDir, clearServerDir, runCommand} = require('./common');


const assert = require('assert');
const axios = require('axios');
describe('单 case 测试状态保存。 one case', function () {
    before(() => {
        initServerDir();
        return startServer();
    });
    after(async () => {
        await killServer();
        clearServerDir();
    });
    it('#改变状态', async function () {
        const { data } = await axios.get('http://localhost:8080/changeLogin');

        assert.equal(data.login, true, '应该是true');
    });
    it('#添加10，并关闭服务器', async function () {
        const { data } = await axios.get('http://localhost:8080/addMoney/10');

        assert.equal(data.money, 10, '应该是10');
        return killServer();
    });
    it('# 以-c 参数开启服务器，再添加120', async function () {
        await startServer(['-c']);
        const { data } = await axios.get('http://localhost:8080/addMoney/120');
        assert.equal(data.money, 130, '应该是130');
    });
    it('#改变状态', async function () {
        const { data } = await axios.get('http://localhost:8080/changeLogin');

        assert.equal(data.login, false, '应该是false');
    });
});


