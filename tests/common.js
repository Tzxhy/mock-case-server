const {
    spawn,
} = require('child_process');
const path = require('path');

const resourceDir = path.resolve(__dirname, 'resource', 'test1');

let mcs;
function startServer() {
    mcs = spawn('mcs', ['start'], {
        cwd: resourceDir,
        stdio: 'pipe',
    });
    
    return new Promise((res) => {
        mcs.stdout.on('data', (chunk) => {
            const data = chunk.toString();
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
        setTimeout(() => {res()}, 100);
    })
}

module.exports = {
    startServer,
    killServer,
}
