import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface SignInForm {
    email: string;
    password: string;
}

const Signin: React.FC = () => {
    //SignIn Comp Control Variables
    const { control, handleSubmit, formState: { errors } } = useForm<SignInForm>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    //API to manages User Auth
    const userAuthAPI = async (reqBody: SignInForm) => {
        try {
            setIsLoading(true);
            const userAuth = await fetch(`${'http://localhost:5000'}/users/signin`, {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const userAuthParsed = await userAuth.json();

            if (userAuthParsed?.title === 'Authentication Successful') {
                toast.success(`${userAuthParsed?.msg}`, {
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
                setTimeout(() => navigate('/dashboard'), 2000);
            }
            else {
                toast.error(`${userAuthParsed?.msg}`, {
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
        }
        catch (e: unknown) {
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

    //Form Submission Handler
    const onSubmit = (data: SignInForm) => {
        userAuthAPI(data);
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
            <Box sx={{ width: 400, margin: 'auto', mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} style={{ marginInline: '4px', padding: '5px', background: '#333333', color: '#F5F5F5', borderRadius: '5px' }}>
                        Sign In
                    </Button>
                </form>
                <Typography variant="body2" align="left" sx={{ mt: 2 }}>
                    Don't have an account?
                    <Button variant="text" color="primary" onClick={() => navigate('/register')} sx={{ textTransform: 'none' }}>
                        Register Here.
                    </Button>
                </Typography>
            </Box>
        </>
    );
};

export default Signin;