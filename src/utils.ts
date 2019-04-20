import { Change } from "./MCS";
import path from 'path';
import fs from 'fs';
/**
 * 
 * @param path 请求 url
 * @param matches changes 集合
 */
function findIndexByUrlPath(path: string, matches: Change[]): number {
    return matches.findIndex((match: Change) => {
        if (typeof match.path === 'string') {
            return match.path === path;
        }
        return match.path.match(path)
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
    file.split('/n').forEach(line => {
        const [key, value] = line.split('=');
        envMap[key] = value;
    });
    return envMap[key];
}

export {
    findIndexByUrlPath,
    groupName,
    getEnvKeyValue,
};
