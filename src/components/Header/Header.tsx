import React, { ReactElement } from 'react';
import { useTheme, Typography, Box } from '@mui/material';

export const Header = (): ReactElement => {
    const theme = useTheme();

    return (
        <Box
            component="header"
            sx={{ borderBottom: `1px solid ${theme.palette.text.primary}` }}
        >
            <Typography sx={{ m: 1 }} variant="h4">
                sealed.vote
            </Typography>
        </Box>
    );
};

export default Header;
