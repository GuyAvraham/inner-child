import type {ChatCompletionRequestMessage} from "openai";
import { Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    apiKey: "apiKey"
});
const openai = new OpenAIApi(configuration);

export default function useChatGpt() {

    const messages: ChatCompletionRequestMessage[] = [];
    
    const send = async (message: string) => {

        messages.push({role: 'user', content: message});

        const res = await openai.createChatCompletion({
            'model': 'gpt-3.5-turbo',
            messages
        });
    
        const result = res.data.choices[0]?.message?.content;
        messages.push({role: "assistant", content: result});

        return result ? result : "Failed to send message";
    };

    return { send };
}