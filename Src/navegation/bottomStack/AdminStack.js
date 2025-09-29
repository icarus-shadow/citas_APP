import React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors, darkColors } from "../../../utils/desing/Colors";
import { useSelector } from "react-redux";
import SlidingTopScreen from "../../../components/SlidingTopScreen";

import InicioMain from "../../../screens/pages/administradores/bottomTab/inicio/InicioMain";
import CitasMain from "../../../screens/pages/administradores/bottomTab/citas/CitasMain";
import DoctoresMain from "../../../screens/pages/administradores/bottomTab/doctores/DoctoresMain";
import PacientesMain from "../../../screens/pages/administradores/bottomTab/pacientes/PacientesMain";
import HorariosMain from "../../../screens/pages/administradores/bottomTab/horarios/HorariosMain";

import ConfiguracionMain from "../../../screens/pages/commonPages/topTab/configuracion/ConfiguracionMain";
import PerfilMain from "../../../screens/pages/commonPages/topTab/perfil/PerfilMain";

import ScreenWithTab from "../ScreenWithTab";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;

    const tabs = [
        { key: "Inicio", icon: "home", label: "Inicio", route: "Inicio" },
        { key: "Pacientes", icon: "person-outline", label: "Pacientes", route: "Pacientes" },
        { key: "Doctores", icon: "pulse", label: "Doctores", route: "Doctores" },
        { key: "Citas", icon: "alarm", label: "Citas", route: "Citas" },
        { key: "Horarios", icon: "calendar", label: "Horarios", route: "Horarios" },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: col.secondaryResalt }}>
                <View style={{ flex: 1, backgroundColor: col.background }}>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen
                            name="Inicio"
                            children={() => (
                                <ScreenWithTab tabs={tabs} initialTab="Inicio">
                                    <InicioMain />
                                </ScreenWithTab>
                            )}
                        />
                        <Stack.Screen
                            name="Citas"
                            children={() => (
                                <ScreenWithTab tabs={tabs} initialTab="Citas">
                                    <CitasMain />
                                </ScreenWithTab>
                            )}
                        />
                        <Stack.Screen
                            name="Doctores"
                            children={() => (
                                <ScreenWithTab tabs={tabs} initialTab="Doctores">
                                    <DoctoresMain />
                                </ScreenWithTab>
                            )}
                        />
                        <Stack.Screen
                            name="Pacientes"
                            children={() => (
                                <ScreenWithTab tabs={tabs} initialTab="Pacientes">
                                    <PacientesMain />
                                </ScreenWithTab>
                            )}
                        />
                        <Stack.Screen
                            name="Horarios"
                            children={() => (
                                <ScreenWithTab tabs={tabs} initialTab="Horarios">
                                    <HorariosMain />
                                </ScreenWithTab>
                            )}
                        />
                    </Stack.Navigator>
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
