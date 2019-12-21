import React from 'react';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import groupBy from 'lodash/groupBy';
import omit from 'lodash/omit';
import take from 'lodash/take';
import { pipe } from '../../utils';

import useFetch from '../../hooks/useFetch';
import { Bill } from '../IssueBill';

interface Props {
    name: string;
    constituency: string;
}
interface CandidateFB {
    name: string;
    fbPage: string;
}

const CandidateCompareIssue = ({ list }: { list: Bill[] }) => {
    if (list.length === 0) {
        return null;
    }
    const issueCategories = pipe(
        list,
        (_: any) => groupBy(_, 'category'),
        (_: any) => omit(_, ['其他'])
    );
    return <span>{list.length} 項提案包含：</span>;
};

export default function CandidateCompareCardIssueBill({
    name,
    constituency
}: Props) {
    const { isLoading, responseData } = useFetch<Bill[] | null>(
        `/api/bills/${constituency}/${name}`,
        [],
        [name]
    );

    let child = null;
    if (!isLoading) {
        if (Array.isArray(responseData)) {
            // TypeScript Cannot find name 'Dictionary, I don't have any idea to fix it.'
            const groupObj: any = groupBy<Bill>(responseData, 'proposerType');
            const personIssues: Bill[] = groupObj['立委提案'] || [];
            const personIssueCategories = pipe(
                personIssues,
                (_: any) => groupBy(_, 'category'),
                (_: any) => omit(_, ['其他'])
            );
            if (process.env.NODE_ENV === 'development') {
                console.log(name, '立委提案Category', personIssueCategories);
            }
            const partyIssues: Bill[] = groupObj['黨團提案'] || [];
            const partyIssueCategories = pipe(
                partyIssues,
                (_: any) => groupBy(_, 'category'),
                (_: any) => omit(_, ['其他'])
            );
            if (process.env.NODE_ENV === 'development') {
                console.log(name, '黨團提案Category', partyIssueCategories);
            }
            child = (
                <>
                    <Typography variant="h5">
                        <div>
                            <CandidateCompareIssue list={personIssues} />
                        </div>
                        <div>
                            {partyIssues.length > 0 && (
                                <span>
                                    所屬黨團提案 {partyIssues.length} 項包含：
                                </span>
                            )}
                        </div>
                    </Typography>
                </>
            );
        } else {
            // 沒資料
            child = (
                <div className="candidate-compare-noinfo">
                    <Typography variant="h4" className="mb-2">
                        沒有提案資料
                    </Typography>
                    <Typography variant="h5">
                        可能是新立委挑戰者或是沒有提案過
                    </Typography>
                </div>
            );
        }
    }
    const elClass = clsx(
        'candidate-compare-col candidate-compare-issue-bill loading',
        {
            'is-show': isLoading
        }
    );
    return (
        <div className={elClass}>
            <Typography variant="h4" className="candidate-compare-col-title">
                提案
            </Typography>
            {child}
        </div>
    );
}
