export declare class GitlabClient {
    static initialize(url: string, token: string): void;
    static logTime(time: number): Promise<void>;
    private static url;
    private static token;
}
