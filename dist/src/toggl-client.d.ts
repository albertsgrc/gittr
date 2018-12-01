export declare class TogglClient {
    static initialize(apiToken: string): void;
    static start(projectName: string, description: string): Promise<void>;
    static current(): Promise<any>;
    static stop(): Promise<number>;
    private static client;
    private static handleError;
}
