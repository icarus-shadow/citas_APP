import React, {useEffect} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store} from './utils/store/Store';
import {StatusBar} from 'expo-status-bar';
import {ActivityIndicator, Text, View} from 'react-native';
import {checkAuthState} from './utils/slices/AuthSlice';
import AppNavegacion from './Src/navegation/AppNavegacion';
import {colors, darkColors} from "./utils/desing/Colors";
import { usePushNotifications } from './components/usePushNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Main = () => {

    let col = colors;
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? col = colors : col = darkColors;

    const dispatch = useDispatch();
    const {isLoading} = useSelector((state) => state.auth);
    const { expoPushToken } = usePushNotifications();

    useEffect(() => {
        dispatch(checkAuthState());
    }, [dispatch]);

    useEffect(() => {
        if (expoPushToken) {
            AsyncStorage.setItem('push_token', expoPushToken);
            console.log('[App] Push token guardado:', expoPushToken);
        }
    }, [expoPushToken]);



    if (isLoading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background,}}>
                <ActivityIndicator size="large" color={col.accent}/>
                <Text style={{color: col.text,}}>Cargando...</Text>
            </View>
        );
    }

    return (
        <>
            <StatusBar style="auto"/>
            <AppNavegacion/>
        </>
    );
};

export default function App() {
    usePushNotifications()
    return (
        <Provider store={store}>
            <StatusBar style="auto"/>
            <Main/>
        </Provider>
    );
}
