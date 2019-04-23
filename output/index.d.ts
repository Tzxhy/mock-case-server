/**
 * command: mcs init
 * @param port http mock server port
 */
declare function initServer({ port, host, }: {
    port: number;
    host: string;
}): Promise<void>;
/** command: mcs start */
declare function startServer(): any;
declare function newCase(name: string): void;
export { initServer, startServer, newCase, };
