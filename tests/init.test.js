const fs = require('fs');
const os = require('os');
const path = require('path');

const {
    execSync
} = require('child_process');
const tmpPath = path.join(os.tmpdir(), Math.random().toString(16).slice(2));
fs.mkdirSync(tmpPath);

execSync(`cd ${tmpPath} && mcs init`);
const files = fs.readdirSync(tmpPath);

execSync(`rm -rf ${tmpPath}`);

const assert = require('assert');
describe('Init', function() {
    it('should create files and dirs', function() {
        assert.ok(files.length > 0, 'no files found.');
    });
});
