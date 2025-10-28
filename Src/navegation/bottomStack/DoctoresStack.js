import React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InicioMain from "../../../screens/pages/doctores/bottomTab/inicio/InicioMain";
import CitasMain from "../../../screens/pages/doctores/bottomTab/citas/CitasMain";
import HorariosMain from "../../../screens/pages/doctores/bottomTab/horarios/HorariosMain";
import SoporteMain from "../../../screens/pages/commonPages/soporte/SoporteMain";
import ConfiguracionMain from "../../../screens/pages/commonPages/topTab/configuracion/ConfiguracionMain";
import PerfilMain from "../../../screens/pages/commonPages/topTab/perfil/PerfilMain";
import SlidingTopScreen from "../../../components/SlidingTopScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors, darkColors } from "../../../utils/desing/Colors";
import { useSelector, useDispatch } from "react-redux";
import ScreenWithTab from "../ScreenWithTab";
import {fetchPerfil} from "../../../utils/slices/data/PerfilSlice";

const Stack = createNativeStackNavigator();

export default function DoctoresStack() {
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPerfil());
    }, []);

    const tabs = [
        { key: "Inicio", icon: "home", label: "Inicio", route: "Inicio" },
        { key: "Citas", icon: "calendar", label: "Citas", route: "Citas" },
        { key: "Horarios", icon: "time", label: "Horarios", route: "Horarios" },
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
                            name="Horarios"
                            children={() => (
                                <ScreenWithTab tabs={tabs} initialTab="Horarios">
                                    <HorariosMain />
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
