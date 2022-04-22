import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Replay as ReplayIcon } from '@mui/icons-material';
import {
    useTheme,
    Typography,
    ListItemText,
    ListItem,
    List,
    Box,
    Button,
    TextField,
    IconButton,
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import VoteItem from 'components/VoteItem';
import { makeGetPoll } from 'store/polls/pollsSelectors';
import { fetchPoll, vote } from 'store/polls/pollsActions';
import { useTypedDispatch } from 'store/types';

export const PollPage = (): ReactElement => {
    const dispatch = useTypedDispatch();
    const [selectedScores, setSelectedScores] = useState<
        Record<string, number>
    >({});
    const { pollId } = useParams();
    const poll = useSelector(makeGetPoll(pollId ?? ''));
    const { response, isLoading, error } = poll ?? {};
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
    const onSubmit = (): void => {};

    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Button
                disabled={isLoading}
                onClick={onReload}
                startIcon={<ReplayIcon />}
                sx={{ alignSelf: 'flex-end', m: 2 }}
                variant="outlined"
            >
                Refresh vote
            </Button>
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
                        <List>
                            {choices?.map((choiceName) => (
                                <VoteItem
                                    key={choiceName}
                                    choiceName={choiceName}
                                    onVote={onVote}
                                    selectedScore={selectedScores[choiceName]}
                                />
                            ))}
                        </List>
                        <Button onClick={onSubmit} variant="contained">
                            Submit votes
                        </Button>
                        <pre>{JSON.stringify(response, null, 4)}</pre>
                    </>
                );
            })()}
        </Box>
    );
};

export default PollPage;
