export declare class Chat {
    private client;
    constructor(apikey: string);
    private generatePrompt;
    codeReview: (patch: string) => Promise<string>;
}
