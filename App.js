import React, {useEffect} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store} from './utils/store/Store';
import {StatusBar} from 'expo-status-bar';
import {ActivityIndicator, Text, View} from 'react-native';
import {checkAuthState} from './utils/slices/AuthSlice';
import AppNavegacion from './Src/navegation/AppNavegacion';
import {colors, darkColors} from "./utils/desing/Colors";
import * as Notifications from 'expo-notifications';


const Main = () => {

    let col = colors;
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? col = colors : col = darkColors;

    const dispatch = useDispatch();
    const {isLoading} = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(checkAuthState());
    }, [dispatch]);

    useEffect(() => {
        Notifications.setNotificationHandler({

            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldShowBanner: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            })
        })
        const getPermisos = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('se requieren permisos \n esto para poder enviar notificaciones')
            }
        }
        getPermisos();
    }, []);



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
    return (
        <Provider store={store}>
            <StatusBar style="auto"/>
            <Main/>
        </Provider>
    );
}
