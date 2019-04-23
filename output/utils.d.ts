import { MockCase } from "./MCS";
/**
 *
 * @param path 请求 url
 * @param matches changes 集合
 */
declare function findIndexByUrlPath(path: string, caseItem: MockCase): number;
/** 将数组中出现的字符串进行分组 */
declare function groupName(arr: string[]): object;
declare function getEnvKeyValue(key: string): string;
declare function recordState(caseId: string, state: object): void;
declare function getRecordedState(): object;
declare function clear(): void;
export { findIndexByUrlPath, groupName, getEnvKeyValue, recordState, getRecordedState, clear, };
