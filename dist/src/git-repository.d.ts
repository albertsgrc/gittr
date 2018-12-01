export declare class GitRepository {
    static initialize(path: string): Promise<void>;
    static getRemoteInfo(): Promise<{
        hostname: string;
        project: string;
    }>;
    static getCurrentBranchName(): Promise<any>;
    private static simpleGit;
    private static path;
    private static check;
}
