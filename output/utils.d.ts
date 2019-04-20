import { Change } from "./MCS";
/**
 *
 * @param path 请求 url
 * @param matches changes 集合
 */
declare function findIndexByUrlPath(path: string, matches: Change[]): number;
/** 将数组中出现的字符串进行分组 */
declare function groupName(arr: string[]): object;
declare function getEnvKeyValue(key: string): string;
export { findIndexByUrlPath, groupName, getEnvKeyValue, };
