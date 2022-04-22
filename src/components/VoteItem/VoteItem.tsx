import React, { ReactElement } from 'react';
// import { HowToVote as VoteIcon } from '@mui/icons-material';
import { ListItem, Button } from '@mui/material';

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
        <ListItem sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {choiceName}{' '}
            {scoreChoices.map((scoreChoice) => (
                <Button
                    onClick={() => onVote(choiceName, scoreChoice)}
                    sx={{ m: 1, padding: '3px 5px' }}
                    variant={
                        scoreChoice === selectedScore ? 'contained' : 'outlined'
                    }
                >
                    {scoreChoice}
                </Button>
            ))}
        </ListItem>
    );
};

export default VoteItem;
