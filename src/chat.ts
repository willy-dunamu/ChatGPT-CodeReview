import { AzureOpenAI } from 'openai';

export class Chat {
  private chatAPI: AzureOpenAI;

  constructor(apikey: string) {
    this.chatAPI = new AzureOpenAI({
      apiKey: apikey,
      endpoint: 'https://d-oai-dev.openai.azure.com',
      deployment: 'D-OAI-model-deploy',
      apiVersion: '2024-04-01-preview',
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

    const events = await this.chatAPI.chat.completions.create({
      stream: false,
      messages: [
        {
          role: 'assistant',
          content: prompt,
        },
      ],
      model: 'gpt-4o',
      temperature: 0.0,
    });

    let result = '';

    for (const choice of events.choices) {
      if (choice.message?.content) {
        result += choice.message?.content;
      }
    }

    return result;
  };
}
