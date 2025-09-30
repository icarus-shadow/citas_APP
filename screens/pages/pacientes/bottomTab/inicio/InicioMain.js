import {ScrollView, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import React, { useEffect } from "react";
import ApiService from "../../../../../Src/services/api/Api";

import MisCitasCount from "./elements/MisCitasCount";
import ProximasCitasCount from "./elements/ProximasCitasCount";
import DoctoresDisponiblesCount from "./elements/DoctoresDisponiblesCount";

let col = colors;

/**
 * Pantalla principal del paciente - Dashboard
 * Muestra estadísticas relevantes para el paciente como:
 * - Total de citas agendadas
 * - Citas próximas
 * - Doctores disponibles
 */
export default function InicioMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    const { user, token } = useSelector((state) => state.auth);
    isDark ? (col = colors) : (col = darkColors);

    console.log('[Paciente - InicioMain] Renderizando pantalla de inicio del paciente');
    console.log('[Paciente - InicioMain] Auth state - User:', user, 'Token exists:', !!token);

    useEffect(() => {
        const debugAuth = async () => {
            try {
                const authStatus = await ApiService.checkAuthStatus();
                console.log('[Paciente - InicioMain] Auth status check:', authStatus);
            } catch (error) {
                console.error('[Paciente - InicioMain] Error checking auth:', error);
            }
        };
        debugAuth();
    }, []);

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>

                <MisCitasCount />
                <ProximasCitasCount />
                <DoctoresDisponiblesCount />
            </View>
        </ScrollView>
    )
}