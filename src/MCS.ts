import UrlPattern from 'url-pattern';
import { groupName } from './utils';

export interface Change {
    path: string | UrlPattern,
    change?(query: object, originState: object): object;
    data(query: object, changedState: object): object;
    transferTo?: string; // For charles to map
}

export interface Route {
    path: string,
    transferTo: string,
}
interface CaseDefaultObj {
    defaultState: object;
    description: string;
}

export class MockCase {

    /** 匹配该case的所有路径 */
    matches: Change[];
    routes: Route[];
    description: string;
    /** 默认的 **state** 对象 */
    defaultState: object;

    /** case的唯一名称 */
    constructor(public name: string, defaultObj: CaseDefaultObj = {
        defaultState: {},
        description: '',
    }) {
        this.defaultState = defaultObj.defaultState;
        this.description = defaultObj.description;
        this.matches = [];
        this.routes = [];
    }

    /** 添加一条匹配规则 */
    addChange(change: Change): MockCase {
        if (this.matches) {
            this.matches.push(change);
        }
        return this;
    }

    /** 添加一条转发规则 */
    addRoute(route: Route): MockCase {
        if (this.matches) {
            this.routes.push(route);
        }
        return this;
    }
}


class MockCaseServer {
    // static default: object = {};

    static createCase: (name: string, defaultObj: CaseDefaultObj) => MockCase = function(n, defaultObj) {
        return new MockCase(n, defaultObj);
    }

    /** 匹配该case的所有路径 */
    static cases: MockCase[] | undefined;

    static loadCases: (cases: MockCase[]) => void = (cases) => {
        // check
        const caseIds: any = [];
        cases.forEach(caseItem => caseIds.push(caseItem.name));
        const map: any = groupName(caseIds);
        for (const key in map) {
            if (map[key] !== 1) {
                throw new Error(`Found no uniq caseId: ${key}!`);
            }
        }
        MockCaseServer.cases = cases;
        if (cases.length === 1) { // if only one case, sets it as currentCase
            MockCaseServer.setCurrentCase(cases[0]);
            MockCaseServer.setState(cases[0].defaultState);
        }
    }
    static currentCase: MockCase;
    static setCurrentCase: (c: MockCase) => MockCase = (c) => {
        MockCaseServer.currentCase = c;
        return c;
    }

    // static matchs: Change[];
    // static addChange: (change: Change) => void = (c) => {
    //     if (MockCaseServer.matchs) {
    //         MockCaseServer.matchs.push(c);
    //     } else {
    //         MockCaseServer.matchs = [c];
    //     }
    // }

    static findCaseByName: (name: string) => MockCase | undefined = (n) => {
        if (!MockCaseServer.cases || !MockCaseServer.cases.length) {
            return;
        }
        const re = MockCaseServer.cases.find((item: MockCase) => item.name === n);
        if (re) {
            return MockCaseServer.setCurrentCase(re);
        }
        return;
    }

    static state: object;
    static setState: (state: object) => void = (s) => {
        MockCaseServer.state = s;
    }

}
export {
    UrlPattern
}


export default MockCaseServer;