import React, { ReactElement } from 'react';
import { useTheme, Typography, Box, Link } from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const Header = (): ReactElement => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            alignItems="center"
            component="header"
            display="flex"
            justifyContent="space-between"
            sx={{
                borderBottom: `1px solid ${theme.palette.text.primary}`,
                p: 1,
            }}
        >
            <Typography
                onClick={() => {
                    navigate('/');
                }}
                sx={{
                    cursor: 'pointer',
                }}
                variant="h4"
            >
                sealed.vote
            </Typography>
            <Link
                href="https://github.com/Tenemo"
                sx={{
                    pt: '6px',
                    cursor: 'pointer',
                }}
            >
                <GitHubIcon />
            </Link>
        </Box>
    );
};

export default Header;
