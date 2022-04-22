import React, { ReactElement, useState, ChangeEvent } from 'react';
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
} from '@mui/material';

import { getPollsCreatePoll } from 'store/polls/pollsSelectors';
import { createPoll } from 'store/polls/pollsActions';
import { useTypedDispatch } from 'store/types';

type Form = {
    pollName: string;
    choiceName: string;
};

const initialForm = {
    pollName: '',
    choiceName: '',
};

export const HomePage = (): ReactElement => {
    const dispatch = useTypedDispatch();
    const { isLoading, error } = useSelector(getPollsCreatePoll);

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

    const isChoiceDuplicate = choices.includes(choiceName);
    const isChoiceNameValid = !!choiceName && !isChoiceDuplicate;

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
                label="Vote name*"
                name="pollName"
                onChange={onFormChange}
                sx={{ mb: 2 }}
                value={pollName}
            />
            <Box
                sx={{
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: 1,
                    padding: 2,
                }}
            >
                <Box
                    sx={{
                        mb: 2,
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
                <Typography sx={{ mb: 2, minWidth: 350 }} variant="body1">
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
                                    onClick={() => onRemoveChoice(choice)}
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
            </Box>
            <Button
                disabled={!choices.length || !pollName || isLoading}
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
        </Box>
    );
};

export default HomePage;
