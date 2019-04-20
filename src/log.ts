/*
 * @Author: tanzhixuan 
 * @Date: 2019-04-19 16:14:19 
 * @Last Modified by: tanzhixuan
 * @Last Modified time: 2019-04-20 13:33:51
 */

import fs from 'fs';
import path from 'path';

const logFilePath = path.resolve('log.log');
let flags = 'a';
let logFileExists = true;
try {
    fs.accessSync(logFilePath, fs.constants.F_OK);
} catch (e) {
    logFileExists = false;
}

if (logFileExists && fs.statSync(logFilePath).size > 1024 * 1024 * 5) { // 5M
    flags = 'w';
}
const outputFile = fs.createWriteStream(logFilePath, {
    flags,
});
const log = new console.Console(outputFile);

function nowDate() {
    return `(${new Date().toLocaleString()}) `;
}
/** record when case changed */
function changeCase(caseId: string): void {
    log.info(nowDate(), 'changed case with ', caseId);
}

/** record one change's all data */
function logChange(path: string, description: string, query: object, returnData: object) {
    log.info(nowDate(), 'request URL: ', path, '. description: ', description, '. queryData: ', JSON.stringify(query), '. ReturnData: ', JSON.stringify(returnData))
}

/** record after one change's state */
function logNowState(state: object) {
    log.info(nowDate(), 'now State: ', JSON.stringify(state));

}

export {
    changeCase,
    log,
    logChange,
    logNowState,
};

