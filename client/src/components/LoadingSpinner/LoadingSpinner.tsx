import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

interface LoadingSpinnerProps {
    open: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ open }) => {
    const theme = useTheme();

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: theme.zIndex.drawer + 1,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
            open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingSpinner;
