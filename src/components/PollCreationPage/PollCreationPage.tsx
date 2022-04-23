import React, { ReactElement, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
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
    Link,
} from '@mui/material';

import { getPollsCreatePoll } from 'store/polls/pollsSelectors';
import { createPoll, createPollClear } from 'store/polls/pollsActions';
import { useTypedDispatch } from 'store/types';

type Form = {
    pollName: string;
    choiceName: string;
};

const initialForm = {
    pollName: '',
    choiceName: '',
};

export const PollCreationPage = (): ReactElement => {
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();
    const { isLoading, error, response } = useSelector(getPollsCreatePoll);

    const [choices, setChoices] = useState<string[]>([]);
    const [form, setForm] = useState<Form>(initialForm);
    const theme = useTheme();

    const { pollName, choiceName } = form;

    const onFormChange = ({
        target: { id, value },
    }: ChangeEvent<HTMLInputElement>): void =>
        setForm({ ...form, [id]: value });

    const onAddChoice = (): void => {
        setChoices([...choices, form.choiceName]);
        setForm({ ...form, choiceName: '' });
    };

    const onRemoveChoice = (choice: string): void =>
        setChoices(choices.filter((currentChoice) => currentChoice !== choice));

    const onCreatePoll = (): void => {
        void dispatch(createPoll({ choices, pollName: form.pollName }));
    };

    const onClear = (): void => {
        setChoices([]);
        setForm(initialForm);
        dispatch(createPollClear());
    };

    const isChoiceDuplicate = choices.includes(choiceName);
    const isChoiceNameValid = !!choiceName.trim() && !isChoiceDuplicate;
    const isFormValid = pollName.trim() && choices.length > 1 && !isLoading;

    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography
                sx={{
                    mb: 2,
                    mt: 4,
                }}
                variant="h5"
            >
                Create a new vote
            </Typography>
            <TextField
                id="pollName"
                inputProps={{ maxLength: 32 }}
                label="Vote name"
                name="pollName"
                onChange={onFormChange}
                required
                sx={{ mb: 2, width: 458 }}
                value={pollName}
            />
            <Box
                sx={{
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: 1,
                    padding: 2,
                    minWidth: 400,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        minHeight: 80,
                    }}
                >
                    <TextField
                        error={isChoiceDuplicate}
                        helperText={
                            isChoiceDuplicate
                                ? 'This choice already exists'
                                : undefined
                        }
                        id="choiceName"
                        inputProps={{ maxLength: 32 }}
                        label="Choice to vote for"
                        onChange={onFormChange}
                        value={choiceName}
                    />
                    <Button
                        disabled={!isChoiceNameValid}
                        onClick={onAddChoice}
                        startIcon={<AddIcon />}
                        sx={{ ml: 2, mt: 1.5, alignSelf: 'flex-start' }}
                        variant="outlined"
                    >
                        Add new choice
                    </Button>
                </Box>
                {choices.length === 0 && (
                    <Typography sx={{ m: 1, maxWidth: 390 }} variant="body1">
                        To create a vote, add choices that each participant will
                        be able to rank from 1 to 10 later.
                    </Typography>
                )}
                {!!choices.length && (
                    <>
                        <Typography
                            sx={{ mb: 1, minWidth: 350 }}
                            variant="body1"
                        >
                            Choices currently in the vote:
                        </Typography>
                        <List>
                            {choices.map((choice) => (
                                <ListItem
                                    key={choice}
                                    secondaryAction={
                                        <IconButton
                                            aria-label="delete"
                                            edge="end"
                                            onClick={() =>
                                                onRemoveChoice(choice)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                    sx={{
                                        border: `1px solid ${theme.palette.secondary.main}`,
                                        borderRadius: 1,
                                        my: 1,
                                        minWidth: 300,
                                    }}
                                >
                                    <ListItemText primary={choice} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
                {choices.length === 1 && (
                    <Typography sx={{ my: 1, minWidth: 350 }} variant="body1">
                        There need to be at least two possible choices in a
                        vote.
                    </Typography>
                )}
            </Box>
            <Button
                disabled={!isFormValid}
                onClick={onCreatePoll}
                size="large"
                sx={{ mt: 4 }}
                variant="contained"
            >
                Create vote
            </Button>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error?.message ?? error}
                </Alert>
            )}
            {isLoading && <CircularProgress sx={{ mt: 2 }} />}
            <Dialog
                aria-describedby="alert-course-created"
                aria-labelledby="alert-course-created"
                open={!!response}
            >
                <DialogTitle id="alert-course-created">
                    Vote successfully created!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-course-created">
                        Your vote link:{' '}
                        {(() => {
                            const {
                                location: { protocol, host },
                            } = window;
                            const pollPath = `/votes/${response?.id ?? ''}`;
                            const href = `${protocol}//${host}${pollPath}`;
                            return (
                                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                <Link
                                    onClick={() => {
                                        navigate(pollPath);
                                        onClear();
                                    }}
                                    sx={{ cursor: 'pointer' }}
                                    target="_blank"
                                >
                                    {href}
                                </Link>
                            );
                        })()}
                        {'. '}
                        Would you like to go to the newly created vote?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClear()}>
                        Back to vote creation
                    </Button>
                    <Button
                        autoFocus
                        onClick={() => {
                            onClear();
                            navigate(`/votes/${response?.id ?? ''}`);
                        }}
                    >
                        Go to vote
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PollCreationPage;
