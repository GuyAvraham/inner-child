export default function useFetchJson(url: string, method: string, headers: HeadersInit, body?: object): Promise<Response> {

    let promise: Promise<Response>;

    if(method === 'POST')
        promise = fetch(url, {
            method,
            headers: headers,
            body: JSON.stringify(body)
        })
    else if(method === 'GET') 
        promise = fetch(url, {
            method,
            headers: headers
        })
    else {
        return new Promise((resolve, reject) => {

            reject('unrecognized method');
        });
    }

    return new Promise((resolve, reject) => {

        promise.then(result => result.json())
        .then(json => resolve(json))
        .catch(e => reject(e));
    });
}