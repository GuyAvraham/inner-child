import { useFetchJson } from "./useFetchJson";

const REPLICATE_URL = "https://api.replicate.com/v1/predictions";

async function useReplicateApi(version: string, input: object) {

    const url = REPLICATE_URL;
    const token = "apiKey";
    const data = {
        version: version,
        input: input
    };

    const jsonStartResponse = await useFetchJson(url, 'POST',
        {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
        data
    )

    console.log(jsonStartResponse);

    if(jsonStartResponse.status === 402)
        return null;

    const replicateResponse: any = jsonStartResponse;
    const endpointUrl: string = replicateResponse.urls.get;

    let result = null;
        
    while(result == null) {

        console.log('polling for result...');

        const jsonFinalResponse = await useFetchJson(endpointUrl, 'GET', 
            {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            }
        );
        
        const replicateFinalResponse: any = jsonFinalResponse;

        if(replicateFinalResponse.status === 'succeeded')
            result = replicateFinalResponse.output;
        else if(replicateFinalResponse.status === 'failed')
        {
            console.log(replicateFinalResponse);
            break;
        }
        else
            await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return result;
}