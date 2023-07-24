import type {ChatCompletionRequestMessage} from "openai";
import { Configuration, OpenAIApi} from "openai";
import { useEffect, useRef, useState } from "react";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

enum PreparedMessage {
    ComeBack = "I come back. Ask how do I feel.",
    TaskIsDone = "Task is done.",
    TaskIsNotDone = "Task isn't done. Ask how is it going.",
    Reject = "Reject.",
    EntryOldSettings = `Pretend that you are my inner 70 years old man. Here are the settings:
    1. Talk to me as if you know me very well.
    2. Reply with short messages like a human (no more than 2-3 sentences)!
    3. If I express my feelings and thoughts respond with positive affirmations and encouragement. 
    4. Talk to me like you are 70 years old
    5. If something's not related to inner 70-year-old man persona, you should kindly let me know that you don't understand
    6. Answer without emojis
    7. Firstly greet me.`,
    EntryChildSettings = `Pretend that you are my inner 10 years child. Here are the settings:
    1. Talk to me as if you know me very well.
    2. Reply with short messages like a human (no more than 2-3 sentences)!
    3. If I express my feelings and thoughts respond with positive affirmations and encouragement. 
    4. Talk to me like you are 10 years old
    5. If something's not related to inner 10-year-child persona, you should kindly let me know that you don't understand
    6. Answer without emojis
    7. Firstly greet me.`
}

export default function useChatGpt() {
    const allMessages = useRef<ChatCompletionRequestMessage[]>([]);
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

    useEffect(() => {
        // get previous messages from database
        
        if(allMessages.current.length > 0) return;

        void send(PreparedMessage.EntryOldSettings);
    }, []);

    useEffect(() => {
        if(messages.length <= 0) return;
        
        console.log(messages);
    }, [messages]);
    
    const send = async (message: string | PreparedMessage) => {

        allMessages.current.push({role: 'user', content: message});
        
        if(Object.values(PreparedMessage).includes(message as PreparedMessage) === false)
            setMessages((prev) => prev = [...prev, {role: "user", content: message}]);

        const res = await openai.createChatCompletion({
            'model': 'gpt-3.5-turbo',
            messages: allMessages.current
        });
    
        const result = res.data.choices[0]?.message?.content;
        if(!result) return "Failed to send message";

        allMessages.current.push({role: "assistant", content: result});
        setMessages((prev) => prev = [...prev, {role: "assistant", content: result}]);

        return result;
    };

    return { send, messages };
}