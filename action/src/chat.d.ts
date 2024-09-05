export declare class Chat {
    private openAiChat;
    constructor(apikey: string);
    private generatePrompt;
    codeReview: (patch: string) => Promise<string>;
}
