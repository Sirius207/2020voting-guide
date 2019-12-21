import { useEffect, useState, DependencyList } from 'react';

export default function useFetch<T>(
    apiPath: string,
    initState: any,
    deps: DependencyList = []
) {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [responseData, setResponseData] = useState<T>(initState);
    useEffect(() => {
        fetch(apiPath)
            .then(res => res.json())
            .then(setResponseData)
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, deps);
    return {
        isLoading,
        responseData
    };
}
