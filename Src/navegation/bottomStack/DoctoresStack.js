import React from "react";
import { View } from "react-native";
import BottomTab from "../../../components/BottomTab";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CitasMain from "../../../screens/pages/pacientes/bottomTab/citas/CitasMain";
import DoctoresMain from "../../../screens/pages/pacientes/bottomTab/doctores/DoctoresMain";
import InicioMain from "../../../screens/pages/pacientes/bottomTab/inicio/InicioMain";
import SoporteMain from "../../../screens/pages/commonPages/soporte/SoporteMain";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors, darkColors } from "../../../utils/desing/Colors";
import { useSelector } from "react-redux";
import ScreenWithTab from "../ScreenWithTab";

const Stack = createNativeStackNavigator();
let col = colors;

export default function DoctoresStack() {
    const isDark = useSelector((state) => state.boolean.value);
    isDark ? (col = colors) : (col = darkColors);

    const tabs = [
        { key: "Inicio", icon: "home", label: "Inicio", route: "Inicio" },
        { key: "citas", icon: "calendar", label: "citas", route: "Citas" },
        { key: "doctores", icon: "pulse", label: "doctores", route: "Doctores" },
        { key: "Soporte", icon: "call", label: "Soporte", route: "Soporte" },
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
                            name="Soporte"
                            children={() => (
                                <ScreenWithTab tabs={tabs} initialTab="Soporte">
                                    <SoporteMain />
                                </ScreenWithTab>
                            )}
                        />
                    </Stack.Navigator>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
