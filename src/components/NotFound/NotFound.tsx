import React, { ReactElement } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = (): ReactElement => {
    const navigate = useNavigate();
    const onClick = (): void => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography>
                    Path <strong>{window.location.pathname}</strong> not found.
                </Typography>
                <Button onClick={onClick} sx={{ mt: 2 }} variant="outlined">
                    Go back to vote creation
                </Button>
            </Box>
        </Box>
    );
};

export default NotFound;
