import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import AppNavegacion from "./Src/Navegation/appNavegacion";

export default function App() {
    return (
        <>
            <StatusBar style="auto"/>
            <AppNavegacion />
        </>
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
