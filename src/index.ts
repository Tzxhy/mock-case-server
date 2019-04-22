import path = require('path');
import childProcess = require('child_process');
import chalk from 'chalk';
import fs from 'fs';


const  execSync = (command: string) => childProcess.execSync(command, {
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
async function initServer(port: number) {
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
import { getEnvKeyValue } from './utils';
import MockCaseServer, { MockCase } from './MCS';

function loadAllCases() {
    const oldIndex = `${cwd}/index.js`;
    try {
        fs.accessSync(oldIndex, fs.constants.F_OK);
        require(oldIndex);
        console.log(chalk.green('Load all cases defined in index.js!'));
        
    } catch (e) { // no exists of old version's entry index.js
        const requireAll = require('require-all');
        let casesObj = requireAll(path.join(cwd, 'cases'));

        let cases: MockCase[] = Object.values(casesObj);
        cases = cases.filter(item => item instanceof MockCase); // just load which export case
        MockCaseServer.loadCases(cases);
        console.log(chalk.green('Load all cases in ./cases!'));
    }
}

/** command: mcs start */
function startServer() {

    loadAllCases(); // 加载 case
    
    const port = getEnvKeyValue('port');
    server.listen(port);
    const logInfo = new Date() + ': Start server at http://localhost:' + port;
    log.info(logInfo);
    console.log(logInfo);
    console.log(chalk.blue.italic('You can look out the log.log file for detail...'));
    

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
