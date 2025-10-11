import {View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState, useMemo} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableCitasDoctor from "./elements/TableCitasDoctor";
import InfoCardDoctor from "./elements/InfoCardDoctor";
import DynamicFormModalDoctor from "./elements/DynamicFormModalDoctor";
import AppointmentSlotSelectorDoctor from "./elements/AppointmentSlotSelectorDoctor";

let col = colors;

/**
 * Pantalla de Citas para Doctores
 * Permite ver y gestionar las citas del doctor autenticado
 */
export default function CitasMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    const user = useSelector((state) => state.auth.user);
    isDark ? (col = colors) : (col = darkColors);

    const [citasCount, setCitasCount] = useState(0);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [refreshTable, setRefreshTable] = useState(0);

    /**
     * Obtiene el conteo de citas del doctor
     */
    const fetchCitasCount = async () => {
        try {
            console.log('[Doctor - CitasMain] Obteniendo conteo de citas del doctor...');
            const response = await ApiService.request('/doctor/citas', { method: 'GET' });
            if (Array.isArray(response)) {
                setCitasCount(response.length);
                console.log(`[Doctor - CitasMain] Total de citas del doctor: ${response.length}`);
            } else {
                console.log('[Doctor - CitasMain] No hay citas o respuesta inválida');
                setCitasCount(0);
            }
        } catch (error) {
            console.error('[Doctor - CitasMain] Error obteniendo conteo de citas:', error);
            setCitasCount(0);
        }
    };

    /**
     * Obtiene la lista de pacientes disponibles
     */
    const fetchPacientes = async () => {
        try {
            console.log('[Doctor - CitasMain] Obteniendo lista de pacientes...');
            const response = await ApiService.request('/doctor/pacientes-disponibles', { method: 'GET' });
            console.log('[Doctor - CitasMain] Respuesta de pacientes:', response);
            if (Array.isArray(response)) {
                setPacientes(response);
                console.log(`[Doctor - CitasMain] Pacientes cargados: ${response.length}`);
                response.forEach(p => console.log(`Paciente: ${p.nombres} ${p.apellidos}`));
            } else {
                console.log('[Doctor - CitasMain] Respuesta no es un array');
                setPacientes([]);
            }
        } catch (error) {
            console.error('[Doctor - CitasMain] Error obteniendo pacientes:', error);
            setPacientes([]);
        }
    };

    useEffect(() => {
        fetchCitasCount();
        fetchPacientes();
    }, []);

    // Opciones de pacientes
    const pacienteOptions = pacientes.map(p => ({ label: `${p.nombres} ${p.apellidos}`.trim(), value: p.id }));

    // Formulario para agendar cita
    const formFields = useMemo(() => {
        return [
            {
                name: 'id_paciente',
                label: 'Seleccionar Paciente',
                type: 'select',
                options: pacienteOptions,
                required: true
            },
            {
                type: 'custom',
                component: AppointmentSlotSelectorDoctor,
                props: (formData) => ({
                    onSlotsSelected: setSelectedSlots
                })
            },
            {
                name: 'lugar',
                label: 'Lugar',
                type: 'text',
                required: true,
                placeholder: 'Consultorio 101'
            },
            {
                name: 'motivo',
                label: 'Motivo de la Consulta',
                type: 'textarea',
                required: true,
                placeholder: 'Describa brevemente el motivo de su consulta'
            }
        ];
    }, [pacientes]);

    /**
     * Maneja la visualización de detalles de una cita
     */
    const handleView = (cita) => {
        console.log('[Doctor - CitasMain] Mostrando detalles de cita:', cita);
        if (!cita || !cita.id) {
            Alert.alert("Error", "No se puede mostrar: datos inválidos");
            return;
        }
        setDataToEdit(cita);
        setVisible(true);
    };

    /**
     * Cancela el proceso de agendar cita
     */
    const handleCancel = () => {
        console.log('[Doctor - CitasMain] Cancelando agendamiento de cita');
        setModalVisible(false);
        setSelectedSlots([]);
    };

    /**
     * Maneja el guardado de cambios en una cita
     */
    const handleSaveCita = async (updatedData) => {
        try {
            console.log('[Doctor - CitasMain] Guardando cambios en cita:', updatedData);
            const dataToSend = {
                id_paciente: updatedData.paciente,
                fecha_cita: updatedData.fecha_cita,
                hora_cita: updatedData.hora_cita,
                lugar: updatedData.lugar,
                motivo: updatedData.motivo || "Sin motivo"
            };
            await ApiService.request(`/doctor/citas/${dataToEdit.id}`, { method: 'PUT', body: JSON.stringify(dataToSend) });
            console.log('[Doctor - CitasMain] Cita actualizada exitosamente');
            setVisible(false);
            setRefreshTable(prev => prev + 1); // Actualizar tabla
            fetchCitasCount(); // Actualizar conteo
            Alert.alert("¡Éxito!", "La cita ha sido actualizada correctamente");
        } catch (error) {
            console.error('[Doctor - CitasMain] Error actualizando cita:', error);
            Alert.alert("Error", error.message || "Error al actualizar la cita");
        }
    };

    /**
     * Maneja la eliminación de una cita
     */
    const handleDeleteCita = async () => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que quieres eliminar esta cita?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            console.log('[Doctor - CitasMain] Eliminando cita:', dataToEdit.id);
                            await ApiService.request(`/doctor/citas/${dataToEdit.id}`, { method: 'DELETE' });
                            console.log('[Doctor - CitasMain] Cita eliminada exitosamente');
                            setVisible(false);
                            setRefreshTable(prev => prev + 1); // Actualizar tabla
                            fetchCitasCount(); // Actualizar conteo
                            Alert.alert("¡Éxito!", "La cita ha sido eliminada correctamente");
                        } catch (error) {
                            console.error('[Doctor - CitasMain] Error eliminando cita:', error);
                            Alert.alert("Error", error.message || "Error al eliminar la cita");
                        }
                    }
                }
            ]
        );
    };

    /**
     * Procesa el envío del formulario de cita
     */
    const handleSubmit = async (formData) => {
        try {
            console.log('[Doctor - CitasMain] Enviando formulario de cita:', formData);

            // Validaciones
            if (selectedSlots.length === 0) {
                Alert.alert("Error", "Debe seleccionar al menos un slot de horario");
                return;
            }

            // Usar la fecha y hora del primer slot seleccionado
            const fecha_cita = selectedSlots[0].fecha;
            const hora_cita = selectedSlots[0].hora_inicio;

            const citaData = {
                id_doctor: user.doctor.id, // Doctor fijo del usuario logueado
                id_paciente: formData.id_paciente,
                fecha_cita: fecha_cita,
                hora_cita: hora_cita,
                lugar: formData.lugar,
                motivo: formData.motivo
            };

            console.log('[Doctor - CitasMain] Datos de cita a enviar:', citaData);

            const response = await ApiService.request('/doctor/citas', { method: 'POST', body: JSON.stringify(citaData) });

            if (response) {
                console.log('[Doctor - CitasMain] Cita agendada exitosamente');
                setModalVisible(false);
                setSelectedSlots([]);
                fetchCitasCount(); // Actualizar conteo
                Alert.alert("¡Éxito!", "Su cita ha sido agendada correctamente");
            }
        } catch (error) {
            console.error('[Doctor - CitasMain] Error agendando cita:', error);
            Alert.alert("Error", error.message || "Error al agendar la cita");
        }
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

                <TouchableOpacity
                    style={{
                        backgroundColor: col.primary,
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderRadius: 8,
                        alignSelf: 'center',
                        marginBottom: 20
                    }}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={{ color: col.background, fontWeight: 'bold', fontSize: 16 }}>
                        Agendar Nueva Cita
                    </Text>
                </TouchableOpacity>

                <TableCitasDoctor onView={handleView} refreshTrigger={refreshTable} />

                <DynamicFormModalDoctor
                    visible={modalVisible}
                    onCloses={handleCancel}
                    onSubmit={handleSubmit}
                    fields={formFields}
                    title="Agendar Nueva Cita"
                />

                {visible && dataToEdit && (
                    <InfoCardDoctor
                        data={{
                            ...dataToEdit,
                            doctor: dataToEdit.doctor ? `${dataToEdit.doctor.nombres} ${dataToEdit.doctor.apellidos}` : 'Sin doctor',
                            paciente: dataToEdit.paciente ? `${dataToEdit.paciente.nombres} ${dataToEdit.paciente.apellidos}` : 'Sin paciente'
                        }}
                        visible={visible}
                        hiddenFields={["id", "updated_at", "created_at", "user_id", "id_doctor"]}
                        readOnlyFields={["doctor"]}
                        pacienteOptions={pacientes}
                        onSave={handleSaveCita}
                        onDelete={handleDeleteCita}
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