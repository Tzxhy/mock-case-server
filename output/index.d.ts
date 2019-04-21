/**
 * command: mcs init
 * @param port http mock server port
 */
declare function initServer(port: number): Promise<void>;
/** command: mcs start */
declare function startServer(): void;
declare function newCase(name: string): void;
export { initServer, startServer, newCase, };
