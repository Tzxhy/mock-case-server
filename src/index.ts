import path = require('path');
import childProcess = require('child_process');
import chalk from 'chalk';
import fs from 'fs';
import URL from 'url';

const execSync = (command: string) => childProcess.execSync(command, {
    stdio: 'inherit',
});

const cwd = process.cwd();
function cpTemplates() {
    execSync(`cp -r ${__dirname}/templates/. ${cwd}`); // 使用/. 不要/*，后者不拷贝隐藏文件、夹
}
async function chooseCpTemplates() {
    const dir = `${cwd}/`;
    try {
        fs.accessSync(path.join(dir, '.mcs.config'), fs.constants.F_OK);
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise(res => {
            rl.question(chalk.red('You\'re already inititialized this project. Override? [y or n]: '), (answer: string) => {
                if (answer === 'y' || answer === 'Y') {
                    cpTemplates();
                    res(true);
                } else {
                    console.log('Try use \'mcs start\' to start mock server, or clear the dir and run \'mcs init\'');

                    res(false);
                }
                rl.close();
            });
        })
    } catch (e) {
        cpTemplates();
        return true;
    }

}
/**
 * command: mcs init
 * @param port http mock server port
 */
async function initServer({
    port,
    host,
}: {
    port: number,
    host: string,
}) {
    // make cases dir
    console.log(chalk.blue('Prepare to init some dirs...'));

    const result = await chooseCpTemplates();
    if (!result) {
        return;
    }
    console.log(chalk.green(`Now init a npm project...`));


    execSync(`npm init -y  > /dev/null`);

    console.log(chalk.bgCyan.black('Init mock-case-server finished. Now you can write your own cases and then run \'mcs start\'!'));

    // 写配置文件
    writeConfig({
        port,
        host,
    });
}

function writeConfig(config: any) {
    const configPath = path.resolve('.mcs.config');
    let file = fs.readFileSync(configPath, {
        encoding: 'utf8',
    });
    const keys = Object.keys(config);
    keys.forEach(key => {
        file = file.replace(`{{${key}}}`, config[key]);
    });
    fs.writeFileSync(configPath, file);
}

import server from './server';
import { log } from './log';
import { getEnvKeyValue, getRecordedState, clear } from './utils';
import MockCaseServer, { MockCase, Change } from './MCS';

function loadAllCases() {
    const oldIndex = `${cwd}/index.js`;
    try {
        fs.accessSync(oldIndex, fs.constants.F_OK);
        require(oldIndex);
        console.log(chalk.green('Load all cases defined in index.js!'));

    } catch (e) { // no exists of old version's entry index.js
        const requireAll = require('require-all');
        const casesPath = path.join(cwd, 'cases');
        const cachedKeys = Object.keys(require.cache);
        cachedKeys.forEach(key => {
            if (key.indexOf(casesPath) !== -1) { // 用户 cases 目录
                delete require.cache[key]; // 删除引用，方便重复加载
            }
        });
        let casesObj = requireAll(casesPath);
        let cases: MockCase[] = Object.values(casesObj);
        cases = cases.filter(item => item instanceof MockCase); // just load which export case
        MockCaseServer.loadCases(cases);
        console.log(chalk.green('Load all cases in ./cases!'));
    }
}

let hasWatched = false;
let netServer: any = null;
/** command: mcs start */
function startServer() {
    loadAllCases(); // 加载 case

    const port = getEnvKeyValue('port');
    if (process.env.continue) { // 加载上次 case 状态
        const data: any = getRecordedState();
        MockCaseServer.findCaseByName(data.caseId);
        MockCaseServer.setState({
            ...MockCaseServer.state,
            ...data.data,
        });
        console.log(chalk.bgGreen.black('Load last state successful!'));
    }
    netServer = server.listen(port);
    const logInfo = new Date() + ': Start server at http://localhost:' + port;
    log.info(logInfo);
    console.log(logInfo);
    console.log(chalk.blue.italic('You can look out the log.log file for detail...'));
    generageCharlesMap(); // 生成charles map文件
    if (process.env.watch && !hasWatched) { // 监听 cases 目录
        watchCases();
    }
    process.removeAllListeners('SIGINT');
    process.on('SIGINT', function() { // 重新添加
        server.emit('close');
        netServer.close();
        process.exit(0);
    });
    return netServer;
}

function watchCases() {
    hasWatched = true;
    const watch = require('watch');
    const restart = () => {
        console.log(chalk.blue('Now restart server...\n\n'));
        netServer.close((err: any) => {
            if (err) {
                console.log('close server error: ', err);
            }
            setTimeout(() => {
                clear();
                startServer();
            }, 100);
        });
    }
    watch.createMonitor(path.resolve('cases'), function (monitor: any) {
        monitor.on("created", function () {
            restart();
        });
        monitor.on("changed", function () {
            restart();
        });
        monitor.on("removed", function () {
            restart();
        });
    });
}

function generageCharlesMap() {
    const host = getEnvKeyValue('host');
    const port = getEnvKeyValue('port');
    if (!host) {
        return;
    }
    const xml = require('xml');
    const xmlArray: any = [];
    (MockCaseServer.cases || []).forEach((caseItem: MockCase) => {
        caseItem.matches.forEach((change: Change) => {
            let path;
            if (typeof change.path === 'string') {
                path = change.path;
            } else {
                const urlPattern: any = change.path;
                urlPattern.ast.every((tag: any) => {
                    if (tag.tag === 'static') {
                        path = tag.value;
                        return false;
                    }
                });
            }
            const data: any = {
                mapMapping: [
                    {
                        sourceLocation: [{
                            host,
                        }, {
                            path,
                        }],
                    },
                    {
                        destLocation: [{
                            protocol: 'http',
                        }, {
                            host: 'localhost',
                        }, {
                            port,
                        }],
                    },
                    {
                        preserveHostHeader: true,
                    },
                    {
                        enabled: true,
                    }
                ]
            };
            if (change.transferTo) {
                
                const {
                    protocol,
                    hostname,
                    port,
                    path,
                } = URL.parse(change.transferTo);
                data.mapMapping[1].destLocation = [{
                    protocol: (protocol || 'http').replace(':', ''),
                }, {
                    host: hostname,
                }, {
                    port,
                }, {
                    path,
                }];
            }

            xmlArray[xmlArray.length] = data;
        })
    });

    let xmlString = xml({
        map: [
            {
                toolEnabled: true,
            },
            {
                mappings: xmlArray,
            }
        ]
    }, { declaration: true });
    xmlString = xmlString.replace(
        '<?xml version="1.0" encoding="UTF-8"?>',
        `<?xml version="1.0" encoding="UTF-8"?><?charles serialisation-version='2.0' ?>`
    );
    fs.writeFileSync(path.resolve('map.xml'), xmlString, {
        encoding: 'utf8',
    });
}

function newCase(name: string) {
    const caseDir = path.resolve('cases');
    let file = fs.readFileSync(path.resolve(__dirname, 'file-templates', 'case.template.js'), {
        encoding: 'utf8',
    });
    file = file.replace('{{caseName}}', name);
    const casePath = path.join(caseDir, name + '.js');
    try {
        fs.writeFileSync(casePath, file, {
            encoding: 'utf8',
            flag: 'wx',
        });
        console.log(`Create ${casePath} OK!`);
    } catch (err) {
        if (err.code === 'EEXIST') {
            console.log(chalk.red(`Error: ${casePath} exists!`));
            return;
        }
    }
}

export {
    initServer,
    startServer,
    newCase,
};
