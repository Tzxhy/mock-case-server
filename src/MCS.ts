interface Change {
    path: string | RegExp,
    change(query: object, originState: object): void;
    data(query: object, changedState: object): object;
}
export class MockCase {
    /** 默认的 **state** 对象 */
    default: object | undefined;

    /** 匹配该case的所有路径 */
    matches: Change[] | undefined;

    /** case的唯一名称 */
    constructor(public name: string) {}

    /** 添加一条匹配规则 */
    addChange(change: Change) {
        if (this.matches) {
            this.matches.push(change);
        } else {
            this.matches = [change];
        }
    }
}
class MockCaseServer extends MockCase {
    static default: object;

    static Case: (name: string) => MockCase = function(n) {
        return new MockCase(n);
    }

    /** 匹配该case的所有路径 */
    static matches: MockCase[] | undefined;

    static loadCases: (cases: MockCase[]) => void = (cases) => {
        MockCaseServer.matches = cases;
    }
    static currentCase: MockCase;
    static setCurrentCase: (c: MockCase) => MockCase = (c) => {
        return MockCaseServer.currentCase = c;
    }

    static findCaseByName: (name: string) => MockCase | void = (n) => {
        if (!MockCaseServer.matches || !MockCaseServer.matches.length) {
            return;
        }
        const re = MockCaseServer.matches.find((item: MockCase) => item.name === n);
        if (re) {
            return MockCaseServer.setCurrentCase(re);
        }
    }
}

export default MockCaseServer;