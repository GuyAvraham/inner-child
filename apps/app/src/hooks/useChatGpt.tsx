import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export async function useChatGpt(message: string) {

    const res = await openai.createChatCompletion({
        'model': 'gpt-3.5-turbo',
        messages: [{role: 'user', content: message}]
    });

    return "";
    //const result = res.data.choices[0].message.content;
}

