import { NavigationContainer } from '@react-navigation/native';
import AuthNav from './authNav';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useState,useEffect,useRef, use} from "react";
import {AppState} from "react-native";
import PrincipalNav from "./PrincipalNav";
import PacientesStack from "./BottomStack/PacientesStack";


export default function AppNavegacion() {

    const  [loading, setLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const appState = useRef(AppState.currentState);

    const loadToken = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("userToken");
            setUserToken(token)
        } catch (error) {
            console.error("Error al cargar el Token desde AsyncStorage: ". error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadToken();
    }, [])

    useEffect(() => {
        const  handleAppStateChange = (nextAppState) => {
            if (appState.current.match(/inactive | background/)  && nextAppState === "active") {
                console.log("verificando token | nueva entrada");
                loadToken();
            }
            appState.current = nextAppState;
        };
        const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () => subscription.remove()
    },[]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (AppState.currentState === "active"){
                loadToken()
            }
        }, 2000);
        return () => clearInterval(interval)
    },[]);
    return (
        <NavigationContainer>
            <PacientesStack />
        </NavigationContainer>
    );
}