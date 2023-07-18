import { useState, useRef } from "react";
import useFetchJson from "./useFetchJson";

const REPLICATE_URL = "https://api.replicate.com/v1/predictions";
const token = process.env.REPLICATE_API_TOKEN;

export default function useReplicateApi(version: string) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const result = useRef<any>(null);

    const sendRequest = async (input: object) => {
        setIsLoading(prev => prev = true);
        const data = {
            version: version,
            input: input
        };

        const jsonStartResponse = await useFetchJson(REPLICATE_URL, 'POST',
            {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            data
        );
        
        if(jsonStartResponse.status === 402){
            setIsLoading(prev => prev = false);
            return;
        }

        const replicateResponse: any = jsonStartResponse;
        const endpointUrl: string = replicateResponse.urls.get;

        let output = null;
            
        while(output == null) {

            console.log('polling for result...');

            const jsonFinalResponse = await useFetchJson(endpointUrl, 'GET', 
                {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            );
            
            const replicateFinalResponse: any = jsonFinalResponse;

            if(replicateFinalResponse.status === 'succeeded')
                output = replicateFinalResponse.output;
            else if(replicateFinalResponse.status === 'failed')
            {
                break;
            }
            else
                await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        result.current = output;
        setIsLoading(prev => prev = false);
    };

    return {sendRequest, isLoading, replicateResult: result.current};
}