import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            p={3}
        >
            <Typography variant="h3" gutterBottom>
                Welcome to Musicle.
            </Typography>
            <Typography variant="h5" gutterBottom>
                A simple yet powerful Playlist Management Platform.
            </Typography>
            <Typography variant="h6" color="textSecondary">
                Please sign in or register to continue.
            </Typography>
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/signin')}
                    style={{ marginRight: '16px' }}
                >
                    Sign In
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/register')}
                >
                    Register
                </Button>
            </Box>
        </Box>
    );
};

export default Home;