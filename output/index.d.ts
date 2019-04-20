/**
 * command: mcs init
 * @param port http mock server port
 */
declare function initServer(port: number): Promise<void>;
/** command: mcs start */
declare function startServer(): void;
export { initServer, startServer, };
