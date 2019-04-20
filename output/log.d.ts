/// <reference types="node" />
declare const log: Console;
/** record when case changed */
declare function changeCase(caseId: string): void;
/** record one change's all data */
declare function logChange(path: string, description: string, query: object, returnData: object): void;
/** record after one change's state */
declare function logNowState(state: object): void;
export { changeCase, log, logChange, logNowState, };
