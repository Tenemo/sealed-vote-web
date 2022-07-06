import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    Replay as ReplayIcon,
    ContentCopy as CopyIcon,
} from '@mui/icons-material';
import {
    Typography,
    List,
    Box,
    Button,
    TextField,
    IconButton,
    Alert,
    CircularProgress,
    InputAdornment,
    FormControl,
    OutlinedInput,
    FormHelperText,
    Tooltip,
    Grid,
} from '@mui/material';
import copy from 'copy-to-clipboard';
import { Helmet } from 'react-helmet-async';

import VoteItem from 'components/VoteItem';
import VoteResults from 'components/VoteResults';
import { makeGetPoll } from 'store/polls/pollsSelectors';
import { fetchPoll, vote } from 'store/polls/pollsActions';
import { useTypedDispatch } from 'store/types';

export const PollPage = (): ReactElement => {
    const dispatch = useTypedDispatch();
    const [selectedScores, setSelectedScores] = useState<
        Record<string, number>
    >({});
    const [voterName, setVoterName] = useState('');
    const { pollId } = useParams();
    const poll = useSelector(makeGetPoll(pollId ?? ''));
    const { response, isLoading, error, vote: voteState } = poll ?? {};
    const {
        response: voteResponse,
        isLoading: voteIsLoading,
        error: voteError,
    } = voteState ?? {};
    const [isResultsVisible, setIsResultsVisible] = useState(!!voteResponse);
    const { choices, voters, results } = response ?? {};

    useEffect(() => {
        if (isLoading || !pollId) {
            return;
        }
        if (!response && !error) {
            void dispatch(fetchPoll(pollId));
        }
    }, [dispatch, error, isLoading, pollId, response]);

    const onVote = (choiceName: string, score: number): void => {
        setSelectedScores({ ...selectedScores, [choiceName]: score });
    };
    const onReload = (): void => {
        void dispatch(fetchPoll(pollId ?? ''));
    };
    const onSubmit = (): void => {
        void dispatch(vote(pollId ?? '', selectedScores, voterName));
    };

    const isSubmitEnabled =
        !!Object.keys(selectedScores).length &&
        !voteIsLoading &&
        !!voterName.trim();

    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Helmet>
                <title>
                    {response
                        ? response.pollName
                        : `Vote ${pollId?.split('-')?.[0] ?? ''}`}
                </title>
            </Helmet>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <Button
                    disabled={isLoading}
                    onClick={onReload}
                    startIcon={<ReplayIcon />}
                    sx={{ m: 2 }}
                    variant="outlined"
                >
                    Refresh vote
                </Button>
                {results && !isResultsVisible && (
                    <Button
                        onClick={() => setIsResultsVisible(true)}
                        sx={{ m: 2 }}
                        variant="outlined"
                    >
                        Show current results
                    </Button>
                )}
            </Box>
            {(() => {
                if ((!response && !error) || isLoading) {
                    return <CircularProgress sx={{ mt: 5 }} />;
                }

                if (error || !response) {
                    return (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error?.message ?? JSON.stringify(error)}
                        </Alert>
                    );
                }
                return (
                    <>
                        <Grid
                            container
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Grid
                                item
                                lg={6}
                                md={8}
                                sm={10}
                                sx={{ width: '100%', p: 2 }}
                                xl={4}
                            >
                                <FormControl
                                    sx={{
                                        alignSelf: 'flex-start',
                                        width: '100%',
                                    }}
                                    variant="filled"
                                >
                                    <OutlinedInput
                                        aria-describedby="copy-page-link-helper-text"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Tooltip title="Copy to clipboard">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        edge="end"
                                                        onClick={() =>
                                                            copy(
                                                                window.location
                                                                    .href,
                                                            )
                                                        }
                                                    >
                                                        <CopyIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        }
                                        size="small"
                                        value={window.location.href}
                                    />
                                    <FormHelperText id="copy-page-link-helper-text">
                                        Link to the vote to share with others
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Typography sx={{ py: 1, px: 2 }} variant="h5">
                            {response.pollName}
                        </Typography>

                        {voteResponse && (
                            <Typography
                                sx={{ py: 1, px: 2, fontWeight: 700 }}
                                variant="body1"
                            >
                                You have voted successfully.
                            </Typography>
                        )}
                        <Typography
                            sx={{ py: 1, px: 2, textAlign: 'center' }}
                            variant="body1"
                        >
                            {!voteResponse &&
                                'Rate choices from 1 to 10. You do not have to vote on every single item. The results will be ranked by geometric mean of all votes per item.'}{' '}
                            {!isResultsVisible &&
                                !results &&
                                'Voting results are available when at least two participants have voted.'}
                        </Typography>
                        {!!voters?.length && (
                            <Typography sx={{ py: 1, px: 2 }} variant="body1">
                                Voters who submitted their votes:{' '}
                                {voters?.join(', ')}.
                            </Typography>
                        )}
                        {/* Below is for without names, for the option later */}
                        {/* {!!voters?.length && (
                            <Typography sx={{ py: 1, px: 2 }} variant="body1">
                                {voters?.length === 1
                                    ? ' voter has '
                                    : ' voters have '}
                                submitted their
                                {voters?.length === 1 ? ' vote' : ' votes'}.
                            </Typography>
                        )} */}

                        {isResultsVisible && <VoteResults results={results} />}
                        {voteResponse || (
                            <>
                                <List>
                                    {choices?.map((choiceName) => (
                                        <VoteItem
                                            key={choiceName}
                                            choiceName={choiceName}
                                            onVote={onVote}
                                            selectedScore={
                                                selectedScores[choiceName]
                                            }
                                        />
                                    ))}
                                </List>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <TextField
                                        id="voterName"
                                        inputProps={{ maxLength: 32 }}
                                        label="Voter name*"
                                        name="voterName"
                                        onChange={({ target: { value } }) =>
                                            setVoterName(value)
                                        }
                                        sx={{ m: 2 }}
                                        value={voterName}
                                    />
                                    <Button
                                        disabled={!isSubmitEnabled}
                                        onClick={onSubmit}
                                        size="large"
                                        sx={{ m: 2 }}
                                        variant="contained"
                                    >
                                        Submit your choices
                                    </Button>
                                </Box>
                                {voteIsLoading && (
                                    <CircularProgress sx={{ m: 2 }} />
                                )}
                                {voteError && (
                                    <Alert severity="error" sx={{ m: 2 }}>
                                        {voteError?.message ?? voteError}
                                    </Alert>
                                )}
                            </>
                        )}
                    </>
                );
            })()}
        </Box>
    );
};

export default PollPage;
