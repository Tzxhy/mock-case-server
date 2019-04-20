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
        console.log('error: ', e)
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

/** command: mcs start */
function startServer() {

    require(`${cwd}/index`); // 加载 case
    
    const port = getEnvKeyValue('port');
    const logInfo = new Date() + ': Start server at http://localhost:' + port;
    log.info(logInfo);
    console.log(logInfo);
    server.listen(port);
}

export {
    initServer,
    startServer,
};
