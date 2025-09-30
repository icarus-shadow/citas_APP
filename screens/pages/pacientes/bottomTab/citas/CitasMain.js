import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableCitasPaciente from "./elements/TableCitasPaciente";
import InfoCard from "../../../../../components/cards/InfoCard";

let col = colors;

/**
 * Pantalla de Citas para Pacientes
 * Permite ver y gestionar las citas del paciente autenticado
 */
export default function CitasMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    const [citasCount, setCitasCount] = useState(0);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);

    /**
     * Obtiene el conteo de citas del paciente
     */
    const fetchCitasCount = async () => {
        try {
            console.log('[Paciente - CitasMain] Obteniendo conteo de citas del paciente...');
            const response = await ApiService.getMisCitas();
            if (Array.isArray(response)) {
                setCitasCount(response.length);
                console.log(`[Paciente - CitasMain] Total de citas del paciente: ${response.length}`);
            } else {
                console.log('[Paciente - CitasMain] No hay citas o respuesta inválida');
                setCitasCount(0);
            }
        } catch (error) {
            console.error('[Paciente - CitasMain] Error obteniendo conteo de citas:', error);
            setCitasCount(0);
        }
    };

    useEffect(() => {
        console.log('[Paciente - CitasMain] Inicializando pantalla de citas del paciente');
        fetchCitasCount();
    }, []);

    /**
     * Maneja la visualización de detalles de una cita
     */
    const handleView = (cita) => {
        console.log('[Paciente - CitasMain] Mostrando detalles de cita:', cita);
        if (!cita || !cita.id) {
            Alert.alert("Error", "No se puede mostrar: datos inválidos");
            return;
        }
        setDataToEdit(cita);
        setVisible(true);
    };


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>
            <View style={{ flex: 1, backgroundColor: col.background}}>
                <View style={styles.container(col)}>
                    <CountCard title="Mis Citas" number={citasCount} />
                </View>

                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: col.text,
                    textAlign: 'center',
                    marginVertical: 15,
                    paddingHorizontal: 20
                }}>
                    Gestiona tus citas médicas
                </Text>

                <TableCitasPaciente onView={handleView} />

                {visible && dataToEdit && (
                    <InfoCard
                        data={dataToEdit}
                        visible={visible}
                        hiddenFields={["id", "updated_at", "created_at", "user_id", "id_paciente"]}
                        onClose={() => setVisible(false)}
                        title="Detalles de la Cita"
                    />
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:(col) => ({
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
    }),
});
