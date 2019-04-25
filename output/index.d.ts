/**
 * command: mcs init
 * @param port http mock server port
 */
declare function initServer(arg: {
    port: number;
    host: string;
    target: string;
}): Promise<void>;
/** command: mcs start */
declare function startServer(): any;
declare function newCase(name: string): void;
export { initServer, startServer, newCase, };
