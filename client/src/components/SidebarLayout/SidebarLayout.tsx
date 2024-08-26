import React from 'react';
import { Box, List, ListItem, ListItemText, Divider, Typography, Button } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const SidebarLayout: React.FC = () => {
    const navigate = useNavigate();

    //API that manages User Logout
    const handleUserLogout = async () => {
        try {
            const userLogout = await fetch(`${'http://localhost:5000'}/users/logout`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });
            const userLogoutJson = await userLogout.json();

            if (userLogoutJson?.title === 'Logged Out') {
                toast.success(`${userLogoutJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => navigate('/signin'), 2000);
            }
            else {
                toast.error(`${userLogoutJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
        catch (e) {
            const error = e as Error;
            console.log(error);
            toast.error(`Error Logging Out`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                // pauseOnHover
                theme="dark"
            // transition: Bounce
            />
            <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <Box
                    sx={{
                        width: 250,
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <List>
                        {/* Deprecated button prop just for UI purposes */}
                        <ListItem button component={Link} to="/dashboard">
                            <ListItemText primary="Dashboard" sx={{ color: '#fff' }} />
                        </ListItem>
                        <Divider sx={{ backgroundColor: '#444' }} />
                        <ListItem button component={Link} to="/explore">
                            <ListItemText primary="Explore" sx={{ color: '#fff' }} />
                        </ListItem>
                        <Divider sx={{ backgroundColor: '#444' }} />
                        <ListItem button component={Link} to="/profile">
                            <ListItemText primary="Profile" sx={{ color: '#fff' }} />
                        </ListItem>
                        <ListItem button component={Button} onClick={() => handleUserLogout()}>
                            <ListItemText primary="Log Out" sx={{ color: '#fff', textTransform: 'capitalize' }} />
                        </ListItem>
                    </List>
                    <Typography variant="body2" align="center" sx={{ color: '#bbb', mt: 2 }}>
                        Musicle Playlist Manager © 2024
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </>
    );
};

export default SidebarLayout;