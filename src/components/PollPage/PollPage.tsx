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
} from '@mui/material';
import copy from 'copy-to-clipboard';

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
    const [isResultsVisible, setIsResultsVisible] = useState(false);
    const [voterName, setVoterName] = useState('');
    const { pollId } = useParams();
    const poll = useSelector(makeGetPoll(pollId ?? ''));
    const { response, isLoading, error, vote: voteState } = poll ?? {};
    const {
        response: voteResponse,
        isLoading: voteIsLoading,
        error: voteError,
    } = voteState ?? {};
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
        !!voterName.trim() &&
        Object.keys(selectedScores).length === choices?.length &&
        !voteIsLoading;

    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
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
                        <FormControl
                            sx={{
                                alignSelf: 'flex-start',
                                m: 2,
                                minWidth: 400,
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
                                                    copy(window.location.href)
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

                        <Typography sx={{ mt: 2 }} variant="h6">
                            {response.pollName}
                        </Typography>
                        <Typography sx={{ m: 2 }} variant="body1">
                            {!voteResponse &&
                                'Rate each choice from 1 to 10. The results will be ranked by geometric mean of all votes.'}{' '}
                            {!isResultsVisible &&
                                !results &&
                                'Voting results are available when at least two participants have voted.'}
                        </Typography>
                        {!!voters?.length && (
                            <Typography variant="body1">
                                Voters who submitted their votes already:{' '}
                                {voters?.join(', ')}
                            </Typography>
                        )}
                        {isResultsVisible && <VoteResults results={results} />}
                        {voteResponse ? (
                            <Typography sx={{ mt: 3 }} variant="body1">
                                You have voted successfully.
                            </Typography>
                        ) : (
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
                                        alignItems: 'flex-start',
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
                                        sx={{ mb: 2 }}
                                        value={voterName}
                                    />
                                    <Button
                                        disabled={!isSubmitEnabled}
                                        onClick={onSubmit}
                                        size="large"
                                        sx={{ mt: 1, ml: 1 }}
                                        variant="contained"
                                    >
                                        Submit your choices
                                    </Button>
                                </Box>
                                {voteIsLoading && (
                                    <CircularProgress sx={{ mt: 2 }} />
                                )}
                                {voteError && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
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
