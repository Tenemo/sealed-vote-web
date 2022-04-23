import React, { ReactElement } from 'react';
import {
    EmojiEvents as CupIcon,
    MilitaryTech as MedalIcon,
} from '@mui/icons-material';
import {
    useTheme,
    ListItemText,
    ListItem,
    ListItemIcon,
    List,
    Typography,
    Box,
} from '@mui/material';

type Props = {
    results?: Record<string, number>;
};

export const VoteResults = ({ results }: Props): ReactElement => {
    const theme = useTheme();
    const sortedResults = Object.entries(results ?? {}).sort(
        (a, b) => b[1] - a[1],
    );
    return (
        <Box
            sx={{
                backgroundColor: theme.palette.action.hover,
                borderRadius: 1,
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography sx={{ py: 1, px: 2 }} variant="h5">
                Results
            </Typography>
            <List>
                {sortedResults.map(([choiceName, score], index) => (
                    <ListItem>
                        <ListItemIcon>
                            {index === 0 && <CupIcon />}
                            {(index === 1 || index === 2) && <MedalIcon />}
                        </ListItemIcon>
                        <ListItemText
                            primary={choiceName}
                            secondary={`Score: ${score}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
VoteResults.defaultProps = {
    results: null,
};

export default VoteResults;
