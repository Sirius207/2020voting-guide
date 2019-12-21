import React from 'react';
import { Link, Box, Card } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import CandidateCompareCardHeader from './CandidateCompareCardHeader';
import CandidateCompareCardFB from './CandidateCompareCardFB';
import CandidateCompareCardIssueBill from './CandidateCompareCardIssueBill';

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
        document.body.classList.add('body-page-candidate-compare');
        const swiper = new window.Swiper(swiperContainer.current, {
            slidesPerView: 'auto',
            freeMode: true,
            // autoHeight: true,
            scrollbar: {
                el: '.swiper-scrollbar'
            },
            mousewheel: true
        });
        swiperRef.current = swiper;
        /* setTimeout(function() {
            swiper.update();
        }, 1500); */
        return () => {
            document.body.classList.remove('body-page-candidate-compare');
            swiper.destroy();
        };
    }, []);

    React.useLayoutEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.update();
        }
    }, [candidateNames]);

    const onDelete = React.useCallback((name: string) => {
        setCandidateNames((prev: string[]) => {
            const indexOf: number = prev.indexOf(name);
            prev.splice(indexOf, 1);
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
                    <div className="swiper-slide candidate-compare-row">
                        {candidateNames.map((name: string) => {
                            return (
                                <div
                                    className="canidate-compare-card"
                                    key={name}
                                >
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
                                            <div className="divider style-gray my-3"></div>
                                            <CandidateCompareCardIssueBill
                                                name={name}
                                                constituency={constituency}
                                            />
                                            <div className="divider style-gray my-3"></div>
                                            <CandidateCompareCardFB
                                                name={name}
                                                constituency={constituency}
                                            />
                                        </Box>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                    <div className="swiper-scrollbar"></div>
                </div>
            </div>
        </div>
        // page-candidate-compare end
    );
};
export default CandidateCompare;
