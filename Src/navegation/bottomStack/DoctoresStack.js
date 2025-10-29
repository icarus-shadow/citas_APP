import React, {useEffect, useState} from "react";
import { View, ActivityIndicator, Text } from "react-native";
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
import {fetchCitasDoctor} from "../../../utils/slices/data/CitasDoctorSlice";
import {fetchHorariosDoctor} from "../../../utils/slices/data/HorariosDoctorSlice";
import {fetchNotificacionesDoctor} from "../../../utils/slices/data/NotificacionesDoctorSlice";
import {fetchCitasAsignadasCounter} from "../../../utils/slices/counters/CitasAsignadasCounterSlice";
import {fetchCitasProximasCounter} from "../../../utils/slices/counters/CitasProximasCounterSlice";
import {fetchPacientesAtendidosCounter} from "../../../utils/slices/counters/PacientesAtendidosCounterSlice";
import {fetchPacientes} from "../../../utils/slices/data/PacientesSlice";

const Stack = createNativeStackNavigator();

export default function DoctoresStack() {
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;
    const dispatch = useDispatch();
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Loading states from all slices
    const isLoadingCitasDoctor = useSelector((state) => state.citasDoctor.isLoading);
    const isLoadingHorariosDoctor = useSelector((state) => state.horariosDoctor.isLoading);
    const isLoadingNotificacionesDoctor = useSelector((state) => state.notificacionesDoctor.isLoading);
    const isLoadingPerfil = useSelector((state) => state.perfil.isLoading);
    const isLoadingCitasAsignadasCounter = useSelector((state) => state.citasAsignadasCounter.isLoading);
    const isLoadingCitasProximasCounter = useSelector((state) => state.citasProximasCounter.isLoading);
    const isLoadingPacientesAtendidosCounter = useSelector((state) => state.pacientesAtendidosCounter.isLoading);

    // Check if any slice is loading
    const isAnyLoading = isLoadingCitasDoctor || isLoadingHorariosDoctor || isLoadingNotificacionesDoctor || isLoadingPerfil || isLoadingCitasAsignadasCounter || isLoadingCitasProximasCounter || isLoadingPacientesAtendidosCounter;
// Get doctorId from auth state
const doctorId = useSelector((state) => state.auth.user?.id);

useEffect(() => {
    if (doctorId) {
        dispatch(fetchCitasDoctor());
        dispatch(fetchHorariosDoctor());
        dispatch(fetchNotificacionesDoctor());
        dispatch(fetchCitasAsignadasCounter(doctorId));
        dispatch(fetchCitasProximasCounter(doctorId));
        dispatch(fetchPacientes())
    }
    dispatch(fetchPerfil());
}, [doctorId]);

useEffect(() => {
    if (isAnyLoading && isInitialLoad) {
        // Still loading on initial load
    } else if (!isAnyLoading && isInitialLoad) {
        setIsInitialLoad(false);
    }
}, [isAnyLoading, isInitialLoad]);

// Loading component
const LoadingComponent = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background }}>
        <ActivityIndicator size="large" color={col.primary} />
        <Text style={{ marginTop: 20, fontSize: 16, color: col.text, textAlign: 'center' }}>
            Cargando datos del doctor...
        </Text>
    </View>
);

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
                    {isAnyLoading && isInitialLoad ? (
                        <LoadingComponent />
                    ) : (
                        <>
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
                        </>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )};

