import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    phone: string;
    password: string;
    conPassword: string;
}

const Register: React.FC = () => {
    //Register Comp Control Variables
    const { control, handleSubmit, reset, formState: { errors } } = useForm<User>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    //API that Manages User Registration
    const userRegisterAPI = async (reqBody: User) => {
        try {
            setIsLoading(true);
            const userSubmit = await fetch(`${'http://localhost:5000'}/users/register`, {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });

            const userSubmitParsed = await userSubmit.json();

            if (userSubmitParsed?.title === 'User Registered') {
                toast.success(`${userSubmitParsed?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                reset();
                setIsLoading(false);
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            }
            else {
                toast.success(`${userSubmitParsed?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setIsLoading(false);
            }
        } catch (e: unknown) {
            console.log(e);
            console.log(e);
            const error = e as Error;
            console.log(error);
            toast.error(`${error?.message}`, {
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

    //Handles Register Form Submission
    const onSubmit = (data: User) => {
        if (data.password !== data.conPassword) {
            toast.success(`Password & Confirm Password do not match!`, {
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
        else {
            userRegisterAPI(data);
        }
    };

    return (
        <>
            <LoadingSpinner open={isLoading} />
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
            <Box sx={{ width: 600, margin: 'auto', mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{
                                    required: "First name is required",
                                    pattern: {
                                        value: /^[A-Za-z]+$/,
                                        message: "First name should contain only letters"
                                    }
                                }}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        label="First Name"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.firstName}
                                        helperText={errors.firstName ? errors.firstName.message : ""}
                                    />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="lastName"
                                control={control}
                                rules={{
                                    required: "Last name is required",
                                    pattern: {
                                        value: /^[A-Za-z]+$/,
                                        message: "Last name should contain only letters"
                                    }
                                }}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        label="Last Name"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.lastName}
                                        helperText={errors.lastName ? errors.lastName.message : ""}
                                    />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Enter a valid email"
                                    }
                                }}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.email}
                                        helperText={errors.email ? errors.email.message : ""}
                                    />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "Enter a valid 10-digit phone number"
                                    }
                                }}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        label="Phone"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.phone}
                                        helperText={errors.phone ? errors.phone.message : ""}
                                    />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: "Password is required",
                                    pattern: {
                                        value: /^[ A-Za-z0-9_@./#&+-]*$/,
                                        message: "Password contains invalid characters"
                                    }
                                }}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.password}
                                        helperText={errors.password ? errors.password.message : ""}
                                    />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="conPassword"
                                control={control}
                                rules={{
                                    required: "Confirm password is required",
                                    pattern: {
                                        value: /^[ A-Za-z0-9_@./#&+-]*$/,
                                        message: "Confirm password contains invalid characters"
                                    }
                                }}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        label="Confirm Password"
                                        type="password"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.conPassword}
                                        helperText={errors.conPassword ? errors.conPassword.message : ""}
                                    />}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} style={{ marginInline: '4px', padding: '5px', background: '#333333', color: '#F5F5F5', borderRadius: '5px' }}>
                        Register
                    </Button>
                </form>
                <Typography variant="body2" align="left" sx={{ mt: 2 }}>
                    Already have an account?
                    <Button variant="text" color="primary" onClick={() => navigate('/signin')} sx={{ textTransform: 'none' }}>
                        SignIn Here.
                    </Button>
                </Typography>
            </Box>
        </>
    );
};

export default Register;