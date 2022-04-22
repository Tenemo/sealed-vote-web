import React, { ReactElement } from 'react';
import { ListItem, Button, Typography, Box } from '@mui/material';

type Props = {
    choiceName: string;
    onVote: (choiceName: string, score: number) => void;
    selectedScore: number;
};

const scoreChoices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const VoteItem = ({
    choiceName,
    onVote,
    selectedScore,
}: Props): ReactElement => {
    return (
        <ListItem sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
            <Typography sx={{ display: 'block' }} variant="h6">
                {choiceName}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {scoreChoices.map((scoreChoice) => (
                    <Button
                        key={scoreChoice}
                        onClick={() => onVote(choiceName, scoreChoice)}
                        sx={{ m: 1, padding: '3px 5px' }}
                        variant={
                            scoreChoice === selectedScore
                                ? 'contained'
                                : 'outlined'
                        }
                    >
                        {scoreChoice}
                    </Button>
                ))}
            </Box>
        </ListItem>
    );
};

export default VoteItem;
