import React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors, darkColors } from "../../../utils/desing/Colors";
import { useSelector } from "react-redux";
import BottomTab from "../../../components/BottomTab";
import SlidingTopScreen from "../../../components/SlidingTopScreen";

import InicioMain from "../../../screens/pages/administradores/bottomTab/inicio/InicioMain";
import CitasMain from "../../../screens/pages/administradores/bottomTab/citas/CitasMain";
import DoctoresMain from "../../../screens/pages/administradores/bottomTab/doctores/DoctoresMain";
import PacientesMain from "../../../screens/pages/administradores/bottomTab/pacientes/PacientesMain";
import HorariosMain from "../../../screens/pages/administradores/bottomTab/horarios/HorariosMain";

import ConfiguracionMain from "../../../screens/pages/commonPages/topTab/configuracion/ConfiguracionMain";
import PerfilMain from "../../../screens/pages/commonPages/topTab/perfil/PerfilMain";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;

    const tabs = [
        { key: "Inicio", icon: "home", label: "Inicio", route: "Inicio" },
        { key: "pacientes", icon: "person", label: "pacientes", route: "Pacientes" },
        { key: "Doctores", icon: "pulse", label: "Doctores", route: "Doctores" },
        { key: "Citas", icon: "alarm", label: "Citas", route: "Citas" },
        { key: "Horarios", icon: "calendar", label: "Horarios", route: "Horarios" },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: col.secondaryResalt }}>
                <View style={{ flex: 1, backgroundColor: col.background }}>
                    <Stack.Navigator id="stackPaciente" screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Inicio" component={InicioMain} />
                        <Stack.Screen name="Citas" component={CitasMain} />
                        <Stack.Screen name="Doctores" component={DoctoresMain} />
                        <Stack.Screen name="Pacientes" component={PacientesMain} />
                        <Stack.Screen name="Horarios" component={HorariosMain} />
                    </Stack.Navigator>

                    <BottomTab tabs={tabs} initialTab="Inicio" />

                    <SlidingTopScreen
                        screens={[
                            { key: "Configuracion", component: ConfiguracionMain, label: "Configuración" },
                            { key: "Perfil", component: PerfilMain, label: "Perfil" },
                        ]}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
