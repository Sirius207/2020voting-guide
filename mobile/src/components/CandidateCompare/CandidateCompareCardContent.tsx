import React from 'react';
import useFetch from '../../hooks/useFetch';

interface Props {
    name: string;
    constituency: string;
}

const CandidateCompareCardContent = ({ name, constituency }: Props) => {
    const { isLoading, responseData } = useFetch<any>(
        `/api/bills/${constituency}/${name}`,
        {},
        [name]
    );

    if (isLoading) {
        return null;
    }
    return (
        <div className="canidate-compare-card__content">
            {/* <p>{JSON.stringify(responseData)}</p> */}
        </div>
    );
};

export default CandidateCompareCardContent;
