import UrlPattern from 'url-pattern';
export interface Change {
    path: string | UrlPattern;
    change(query: object, originState: object): object;
    data(query: object, changedState: object): object;
}
interface CaseDefaultObj {
    defaultState: object;
    description: string;
}
export declare class MockCase {
    name: string;
    /** 匹配该case的所有路径 */
    matches: Change[];
    description: string;
    /** 默认的 **state** 对象 */
    defaultState: object;
    /** case的唯一名称 */
    constructor(name: string, defaultObj?: CaseDefaultObj);
    /** 添加一条匹配规则 */
    addChange(change: Change): MockCase;
}
declare class MockCaseServer {
    static createCase: (name: string, defaultObj: CaseDefaultObj) => MockCase;
    /** 匹配该case的所有路径 */
    static cases: MockCase[] | undefined;
    static loadCases: (cases: MockCase[]) => void;
    static currentCase: MockCase;
    static setCurrentCase: (c: MockCase) => MockCase;
    static findCaseByName: (name: string) => MockCase | undefined;
    static state: object;
    static setState: (state: object) => void;
}
export { UrlPattern };
export default MockCaseServer;
