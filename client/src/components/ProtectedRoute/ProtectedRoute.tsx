import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);

    const verifyUserAPI = async () => {
        try {
            const userAuthVerify = await fetch(`${'http://localhost:5000'}/verify-token`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const userAuthVerifyJson = await userAuthVerify.json();

            if (userAuthVerifyJson?.title === 'User Authenticated' && userAuthVerifyJson?.authenticated) {
                console.log('Verified------------>');
                setIsUserAuthenticated(true);
            }
            else {
                setIsUserAuthenticated(false);
            }

        } catch (e) {
            console.log(e);
            setIsUserAuthenticated(false);
        }
    }

    useEffect(() => {
        verifyUserAPI();
    }, [])

    return isUserAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;