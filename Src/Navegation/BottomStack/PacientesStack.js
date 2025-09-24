import React from "react";
import {View} from "react-native";
import BottomTab from "../../../components/BottomTab";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import CitasMain from "../../../screens/Pages/pacientes/bottomTab/citas/citasM";
import DoctoresMain from "../../../screens/Pages/pacientes/bottomTab/doctores/doctoresM";
import InicioMain from "../../../screens/Pages/pacientes/bottomTab/inicio/inicioM";
import SoporteMain from "../../../screens/Pages/pacientes/bottomTab/soporte/soporteM";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {colors, darkColors} from "../../../assets/colors";
import {useSelector} from "react-redux";

const Stack = createNativeStackNavigator();
let col = colors;


export default function PacientesStack() {
    const isDark = useSelector((state) => state.boolean.value);
    isDark ? col = colors : col = darkColors;

    const tabs = [
        {
            key: "Inicio",
            icon: "home",
            label: "Inicio",
            route: "Inicio"
        },
        {
            key: "citas",
            icon: "calendar",
            label: "citas",
            route: "Citas"
        },
        {
            key: "doctores",
            icon: "pulse",
            label: "doctores",
            route: "Doctores"
        },
        {
            key: "Soporte",
            icon: "call",
            label: "Soporte",
            route: "Soporte"
        },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1, backgroundColor: col.secondaryResalt}}>
                <View style={{flex: 1, backgroundColor: col.background}}>
                    <Stack.Navigator id="stackPaciente" screenOptions={{headerShown: false}}>
                        <Stack.Screen name="Inicio" component={InicioMain}/>
                        <Stack.Screen name="Citas" component={CitasMain}/>
                        <Stack.Screen name="Doctores" component={DoctoresMain}/>
                        <Stack.Screen name="Soporte" component={SoporteMain}/>
                    </Stack.Navigator>
                    <BottomTab tabs={tabs} initialTab="Inicio"/>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
