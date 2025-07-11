import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import Simulador from '../pages/Simulador';
import Alertas from '../pages/Alertas';
import Vehiculos from '../pages/Vehiculos';
import Ingesta from '../pages/Ingesta';

const AppRouter: React.FC = () => {

    const { isAuthenticated } = useAuth();


    return (
    <BrowserRouter>
        <Routes>
            {isAuthenticated ? (
                <>
                    <Route path="/" element={<Layout><Home /></Layout>} />
                    <Route path="/simulador" element={<Layout><Simulador /></Layout>} />
                    <Route path="/alertas" element={<Layout><Alertas /></Layout>} />
                    <Route path="/vehiculos" element={<Layout><Vehiculos /></Layout>} />
                    <Route path="/ingesta" element={<Layout><Ingesta /></Layout>} />
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