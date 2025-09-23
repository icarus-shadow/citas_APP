import {StatusBar} from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import AppNavegacion from "./Src/Navegation/appNavegacion";
import {Provider} from "react-redux";
import {store} from "./store/store";
import SwitchDark from "./components/SwitchDark";

export default function App() {
    return (
        <Provider store={store}>
            <StatusBar style="auto"/>
            <SwitchDark />
            <AppNavegacion />
        </Provider>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
