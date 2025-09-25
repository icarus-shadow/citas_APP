import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';

// Stacks
import AuthNav from './AuthNav';
import PacientesStack from './bottomStack/PacientesStack';
import DoctoresStack from './bottomStack/DoctoresStack';
import AdminStack from './bottomStack/AdminStack';

export default function AppNavegacion() {
    const { user, token } = useSelector((state) => state.auth);
    const isAuthenticated = !!token && !!user;

    return (
        <NavigationContainer>
            {!isAuthenticated ? (
                <AuthNav />
            ) : user?.id_rol === 1 ? (
                <PacientesStack />
            ) : user?.id_rol === 2 ? (
                <DoctoresStack />
            ) : user?.id_rol === 3 ? (
                <AdminStack />
            ) : (
                <AuthNav /> // fallback
            )}
        </NavigationContainer>
    );
}
