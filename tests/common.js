const {
    spawn,
    execSync,
} = require('child_process');
const path = require('path');

const resourceDir = path.resolve(__dirname, 'resource');

function initServerDir(argString = '') {
    execSync(`cd ${resourceDir} && mcs init ${argString}`);
    execSync(`cd ${resourceDir} && npm link mock-case-server`); // link
}

function clearServerDir() {
    execSync(`rm -fr ${resourceDir}/* ${resourceDir}/.[!.]*`);
}
function runCommand(cmd) {
    execSync(`cd ${resourceDir} && ${cmd}`);
}

let mcs;
function startServer(arg = []) {
    mcs = spawn('mcs', ['start', ...arg], {
        cwd: resourceDir,
        stdio: 'pipe',
    });
    
    return new Promise((res) => {
        mcs.stdout.on('data', (chunk) => {
            const data = chunk.toString();
            console.log('server say: ', data);
            
            if (data.includes('Start server') !== -1) {
                setTimeout(() => {
                    res(); // ok to start test
                }, 100); // wait for port to be able to use
            }
        });
    })
}
function killServer() {
    mcs.kill();
    return new Promise((res) => {
        setTimeout(() => {res()}, 100);
    })
}

module.exports = {
    startServer,
    killServer,

    clearServerDir,
    initServerDir,
    runCommand,
}
