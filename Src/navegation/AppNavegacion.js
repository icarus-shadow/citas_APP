import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { navigationRef} from "../services/navigation/NavigationService";

import AuthNav from './AuthNav';
import PacientesStack from './bottomStack/PacientesStack';
import DoctoresStack from './bottomStack/DoctoresStack';
import AdminStack from './bottomStack/AdminStack';

const RootStack = createNativeStackNavigator();

export default function AppNavegacion() {
    const { user, token } = useSelector((state) => state.auth);
    const isAuthenticated = !!token && !!user;

    useEffect(() => {
        if (navigationRef.isReady()) {
            if (!isAuthenticated) {
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: 'AuthNav' }],
                });
            } else if (user?.id_rol === 1) {
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: 'PacientesStack' }],
                });
            } else if (user?.id_rol === 2) {
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: 'DoctoresStack' }],
                });
            } else if (user?.id_rol === 3) {
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: 'AdminStack' }],
                });
            } else {
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: 'AuthNav' }],
                });
            }
        }
    }, [isAuthenticated, user]);

    return (
        <NavigationContainer ref={navigationRef}>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="AuthNav" component={AuthNav} />
                <RootStack.Screen name="PacientesStack" component={PacientesStack} />
                <RootStack.Screen name="DoctoresStack" component={DoctoresStack} />
                <RootStack.Screen name="AdminStack" component={AdminStack} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}
