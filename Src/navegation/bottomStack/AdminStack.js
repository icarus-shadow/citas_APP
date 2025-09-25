import React from "react";
import {View} from "react-native";
import BottomTab from "../../../components/BottomTab";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {colors, darkColors} from "../../../utils/desing/Colors";
import {useSelector} from "react-redux";


// Screens Admin
import InicioMain from "../../../screens/pages/administradores/bottomTab/inicio/InicioMain";
import CitasMain from "../../../screens/pages/administradores/bottomTab/citas/CitasMain";
import DoctoresMain from "../../../screens/pages/administradores/bottomTab/doctores/DoctoresMain";
import PacientesMain from "../../../screens/pages/administradores/bottomTab/pacientes/PacientesMain";
import HorariosMain from "../../../screens/pages/administradores/bottomTab/horarios/HorariosMain";

const Stack = createNativeStackNavigator();
let col = colors;


export default function AdminStack() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? col = colors : col = darkColors;

    const tabs = [
        {
            key: "Inicio",
            icon: "home",
            label: "Inicio",
            route: "Inicio"
        },
        {
            key: "pacientes",
            icon: "calendar",
            label: "pacientes",
            route: "Pacientes"
        },
        {
            key: "Doctores",
            icon: "pulse",
            label: "Doctores",
            route: "Doctores"
        },
        {
            key: "Citas",
            icon: "calendar",
            label: "Citas",
            route: "Citas"
        },
        {
            key: "Horarios",
            icon: "calendar",
            label: "Horarios",
            route: "Horarios"
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
                        <Stack.Screen name="Pacientes" component={PacientesMain}/>
                        <Stack.Screen name="Horarios" component={HorariosMain}/>
                    </Stack.Navigator>
                    <BottomTab tabs={tabs} initialTab="Inicio"/>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
