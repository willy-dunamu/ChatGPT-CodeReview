// import { ChatGPTAPI } from 'chatgpt';
import { OpenAIChat } from "langchain/llms/openai";
// import { AzureOpenAI } from 'openai';

export class Chat {
  // private chatAPI: ChatGPTAPI;
  private openAiChat: OpenAIChat;
  // private client: AzureOpenAI;

  constructor(apikey: string) {
    // this.chatAPI = new ChatGPTAPI({
    //   apiKey: apikey,
    //   apiBaseUrl:
    //     process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1',
    //   completionParams: {
    //     model: process.env.MODEL || 'gpt-4o',
    //     temperature: +(process.env.temperature || 0) || 1,
    //     top_p: +(process.env.top_p || 0) || 1,
    //     max_tokens: process.env.max_tokens
    //       ? +process.env.max_tokens
    //       : undefined,
    //   },
    // });
    this.openAiChat = new OpenAIChat({
      modelName: process.env.MODEL || 'gpt-4o',
      temperature: +(process.env.temperature || 0) || 1,
      azureOpenAIApiVersion: '2024-04-01-preview',
      azureOpenAIApiKey: apikey,
      azureOpenAIApiDeploymentName: 'D-OAI-model-deploy',
      azureOpenAIBasePath: process.env.OPENAI_API_ENDPOINT || 'https://d-oai-dev.openai.azure.com',
    });


  }

  private generatePrompt = (patch: string) => {
    const answerLanguage = process.env.LANGUAGE
      ? `Answer me in ${process.env.LANGUAGE},`
      : '';

    const prompt =
      process.env.PROMPT ||
      'Below is a code patch, please help me do a brief code review on it. Any bug risks and/or improvement suggestions are welcome:';

    return `${prompt}, ${answerLanguage}:
    ${patch}
    `;
  };

  public codeReview = async (patch: string) => {
    if (!patch) {
      return '';
    }

    console.time('code-review cost');
    const prompt = this.generatePrompt(patch);

    // const res = await this.chatAPI.sendMessage(prompt);
    const result = await this.openAiChat.call(prompt);

    console.timeEnd('code-review cost');
    // return res.text;
    return result;
  };
}
