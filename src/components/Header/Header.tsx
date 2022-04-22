import React, { ReactElement } from 'react';
import { useTheme, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Header = (): ReactElement => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            component="header"
            sx={{ borderBottom: `1px solid ${theme.palette.text.primary}` }}
        >
            <Typography
                onClick={() => {
                    navigate('/');
                }}
                sx={{
                    m: 1,
                    cursor: 'pointer',
                }}
                variant="h4"
            >
                sealed.vote
            </Typography>
        </Box>
    );
};

export default Header;
