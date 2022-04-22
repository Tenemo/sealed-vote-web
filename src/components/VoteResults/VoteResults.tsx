import React, { ReactElement } from 'react';
import {
    EmojiEvents as CupIcon,
    MilitaryTech as MedalIcon,
} from '@mui/icons-material';
import { ListItemText, ListItem, ListItemIcon, List } from '@mui/material';

type Props = {
    results?: Record<string, number>;
};

export const VoteResults = ({ results }: Props): ReactElement => {
    const sortedResults = Object.entries(results ?? {}).sort(
        (a, b) => b[1] - a[1],
    );
    return (
        <List>
            {sortedResults.map(([choiceName, score], index) => (
                <ListItem>
                    <ListItemIcon>
                        {index === 0 && <CupIcon />}
                        {(index === 1 || index === 2) && <MedalIcon />}
                    </ListItemIcon>
                    <ListItemText primary={choiceName} secondary={score} />
                </ListItem>
            ))}
        </List>
    );
};
VoteResults.defaultProps = {
    results: null,
};

export default VoteResults;
