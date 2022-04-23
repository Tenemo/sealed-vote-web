import React, {
    ReactElement,
    useState,
    ChangeEvent,
    KeyboardEvent,
} from 'react';
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
    Grid,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

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
    const theme = useTheme();

    const { isLoading, error, response } = useSelector(getPollsCreatePoll);

    const [choices, setChoices] = useState<string[]>([]);
    const [form, setForm] = useState<Form>(initialForm);
    const { pollName, choiceName } = form;

    const onFormChange = ({
        target: { id, value },
    }: ChangeEvent<HTMLInputElement>): void =>
        setForm({ ...form, [id]: value });

    const onAddChoice = (): void => {
        if (!form.choiceName.trim()) return;
        setChoices([...choices, form.choiceName]);
        setForm({ ...form, choiceName: '' });
    };

    const onChoiceKeyDown = ({
        key,
    }: KeyboardEvent<HTMLInputElement>): void => {
        if (key === 'Enter') onAddChoice();
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
            <Helmet>
                <title>Vote creation</title>
            </Helmet>
            <Typography
                sx={{
                    mb: 2,
                    mt: 4,
                }}
                variant="h5"
            >
                Create a new vote
            </Typography>
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
                    sx={{ width: '100%', p: 1 }}
                    xl={4}
                >
                    <TextField
                        autoComplete="off"
                        helperText={
                            pollName ? '' : 'What would you like to vote on?'
                        }
                        id="pollName"
                        inputProps={{ maxLength: 64 }}
                        label="Vote name"
                        name="pollName"
                        onChange={onFormChange}
                        required
                        sx={{ mb: 1, minHeight: 80, width: '100%' }}
                        value={pollName}
                    />
                </Grid>
            </Grid>
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
                    sx={{
                        width: '100%',
                        p: 1,
                        backgroundColor: theme.palette.action.hover,
                        borderRadius: 1,
                    }}
                    xl={4}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            minHeight: 100,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <TextField
                            autoComplete="off"
                            error={isChoiceDuplicate}
                            helperText={
                                isChoiceDuplicate
                                    ? 'This choice already exists'
                                    : undefined
                            }
                            id="choiceName"
                            inputProps={{ maxLength: 64 }}
                            label="Choice to vote for"
                            onChange={onFormChange}
                            onKeyDown={onChoiceKeyDown}
                            sx={{ m: 1, alignSelf: 'flex-start' }}
                            value={choiceName}
                        />
                        <Button
                            disabled={!isChoiceNameValid}
                            onClick={onAddChoice}
                            startIcon={<AddIcon />}
                            sx={{ m: 1, mb: 2 }}
                            variant="outlined"
                        >
                            Add new choice
                        </Button>
                    </Box>
                    {choices.length === 0 && (
                        <Typography sx={{ m: 1 }} variant="body1">
                            To create a vote, add choices that each participant
                            will be able to rank from 1 to 10.
                        </Typography>
                    )}
                    {!!choices.length && (
                        <>
                            <Typography sx={{ m: 1 }} variant="body1">
                                Choices currently in the vote:
                            </Typography>
                            <List sx={{ px: 2, py: 1 }}>
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
                                        }}
                                    >
                                        <ListItemText primary={choice} />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                    {choices.length === 1 && (
                        <Typography sx={{ m: 1 }} variant="body1">
                            There need to be at least two possible choices in a
                            vote.
                        </Typography>
                    )}
                </Grid>
            </Grid>
            <Button
                disabled={!isFormValid}
                onClick={onCreatePoll}
                size="large"
                sx={{ m: 2 }}
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
