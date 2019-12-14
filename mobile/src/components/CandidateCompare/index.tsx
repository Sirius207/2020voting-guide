import React from 'react';
import { Link, Box, Card } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import CandidateCompareCardHeader from './CandidateCompareCardHeader';
import CandidateCompareCardContent from './CandidateCompareCardContent';
import CandidateCompareCardFB from './CandidateCompareCardFB';

import './CandidateCompare.scss';

declare let window: any;

interface Route {
    match: {
        params: {
            constituency: string;
            names: string;
        };
    };
}

/**
 * 不分區候選人比較
 */
const CandidateCompare = ({ match }: Route) => {
    const { constituency, names } = match.params;
    const [candidateNames, setCandidateNames] = React.useState<string[]>(
        names.split(',')
    );
    const swiperContainer = React.useRef<HTMLDivElement>(null);
    const swiperRef = React.useRef<any>(null);
    React.useLayoutEffect(() => {
        const swiper = new window.Swiper(swiperContainer.current, {
            slidesPerView: 'auto'
        });
        swiperRef.current = swiper;
        return () => swiper.destroy();
    }, []);

    const onDelete = React.useCallback((name: string) => {
        setCandidateNames((prev: string[]) => {
            const indexOf: number = prev.indexOf(name);
            prev.splice(indexOf, 1);
            swiperRef.current.update();
            return [...prev];
        });
    }, []);

    return (
        <div className="page-candidate-compare">
            <Box m={1}>
                <Box display="flex" alignItems="center" my={1}>
                    <Link
                        href={`/regional/台北市/${constituency}?select=${names}`}
                    >
                        <KeyboardArrowLeft fontSize="large" />
                    </Link>
                    <Box>
                        <Typography variant="h3" display="inline">
                            比較立委
                        </Typography>
                        <Typography
                            variant="h5"
                            display="inline"
                            color="textSecondary"
                        >
                            {constituency}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <div className="swiper-container" ref={swiperContainer}>
                <div className="swiper-wrapper">
                    {candidateNames.map((name: string) => {
                        return (
                            <div className="swiper-slide" key={name}>
                                <div className="canidate-compare-card">
                                    <Card>
                                        <Box px={2} py={2}>
                                            <CandidateCompareCardHeader
                                                name={name}
                                                constituency={constituency}
                                                currentCandidateCount={
                                                    candidateNames.length
                                                }
                                                onDelete={onDelete}
                                            />
                                            <CandidateCompareCardContent
                                                name={name}
                                                constituency={constituency}
                                            />
                                            <CandidateCompareCardFB
                                                name={name}
                                                constituency={constituency}
                                            />
                                        </Box>
                                    </Card>
                                </div>
                            </div>
                            // swiper-slide end
                        );
                    })}
                </div>
                {/* swiper-wrapper end */}
            </div>
            {/* swiper-container end */}
        </div>
        // page-candidate-compare end
    );
};
export default CandidateCompare;
