import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import { useAuth } from '../hooks/useAuth';

const AppRouter: React.FC = () => {

    const { isAuthenticated } = useAuth();


    return (
    <BrowserRouter>
        <Routes>
            {isAuthenticated ? (
                <>
                    <Route path="/" element={<Home />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<Auth />} />
                </>
            )}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
    );

}

export default AppRouter;