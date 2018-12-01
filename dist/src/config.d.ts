export declare class Config {
    static readonly gitlabToken: any;
    static readonly togglToken: any;
    static gitRepositoryPath: string;
    static load(forceInitialize?: boolean): Promise<void>;
    static reset(): void;
    private static configStore;
    private static v;
    private static justInitialized;
    private static initialize;
    private static isConfigEmpty;
    private static validate;
}
