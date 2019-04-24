import { Change, MockCase } from "./MCS";
import path from 'path';
import fs from 'fs';
import chalk from "chalk";
/**
 * 
 * @param path 请求 url
 * @param matches changes 集合
 */
function findIndexByUrlPath(path: string, caseItem: MockCase): number {
    const matches = caseItem.matches;
    return matches.findIndex((match: Change) => {
        if (typeof match.path === 'string') {
            return !match.transferTo && match.path === path;
        }
        return !match.transferTo && match.path.match(path)
    });
}

/** 将数组中出现的字符串进行分组 */
function groupName(arr: string[]): object {
    const map: {[propName: string]: number} = {};
    arr.forEach(i => {
        if (!map[i]) {
            map[i] = 1;
        } else {
            map[i] += 1;
        }
    });
    return map;
}
let envMap: any = null;
function getEnvKeyValue(key: string): string {
    if (envMap) {
        return envMap[key] || '';
    } else {
        envMap = {};
    }
    const configPath = path.resolve('.mcs.config');
    const file = fs.readFileSync(configPath, {
        encoding: 'utf8',
    });
    file.split('\n').forEach(line => {
        
        const [key, value] = line.split('=');
        envMap[key] = value;
    });
    return envMap[key] || '';
}


const stateObjPath = path.resolve('.db.state');
function recordState(caseId: string, state: object) {
    const data = JSON.stringify({ data: state, caseId });
    fs.writeFileSync(stateObjPath, data);
}

function getRecordedState(): object {
    let data: any = fs.readFileSync(stateObjPath, {
        encoding: 'utf8',
    });
    try {
        data = JSON.parse(data);
        return data;
    } catch (err) {
        console.log(chalk.red('Last state record file damaged...'));
        console.log('err: ', err);
    }
    return {};
}

function clear() {
    process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
}


export {
    findIndexByUrlPath,
    groupName,
    getEnvKeyValue,
    
    recordState,
    getRecordedState,

    clear,
};
