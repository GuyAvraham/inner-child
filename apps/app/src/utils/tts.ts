import { useRef, useState } from "react";
import useErrorsHandler from "~/hooks/useErrorsHandler";

export default function useTextToSpeech() {
    const[audioUri, setAudioUri] = useState<string>();
    const isLoading = useRef<boolean>(false);
    const { handleError } = useErrorsHandler();

    const sendTTSRequest = async (text: string) => {
        if(text === "") return;
        
        const language = "en-us";

        const url = `http://api.voicerss.org/?key=${process.env.TTS_API_KEY}&hl=${language}&src=${text}`;
        const options = {
          method: 'POST'
        };

        try{
            const response = await fetch(url, options)
            const blob = await response.blob();
            const reader = new FileReader();
    
            reader.onloadend = () => {        
                const audioUri: string = reader.result as any;
                setAudioUri(audioUri);
            }
    
            reader.readAsDataURL(blob);
        }
        catch(error) {
            handleError(error);
        }
    };

    return { audioUri, sendTTSRequest, isLoading: isLoading.current};
}