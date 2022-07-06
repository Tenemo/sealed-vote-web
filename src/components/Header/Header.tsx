import React, { ReactElement } from 'react';
import { useTheme, Box, Link } from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';

export const Header = (): ReactElement => {
    const theme = useTheme();

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
            <Link href="/" underline="none" variant="h4">
                sealed.vote
            </Link>
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
