import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableDoctoresPaciente from "./elements/TableDoctoresPaciente";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";
import AppointmentSlotSelector from "../../../../../components/AppointmentSlotSelector";

let col = colors;

/**
 * Pantalla de Doctores para Pacientes
 * Permite ver la lista de doctores disponibles y agendar citas
 */
export default function DoctoresMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    const [doctoresCount, setDoctoresCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [especialidades, setEspecialidades] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);

    // Formulario para agendar cita
    const formFields = [
        {
            name: 'fecha_cita',
            label: 'Fecha de Cita',
            type: 'date',
            required: true,
            min: new Date().toISOString().split('T')[0]
        },
        {
            type: 'custom',
            component: AppointmentSlotSelector,
            props: {
                selectedDoctor: selectedDoctor?.id,
                onSlotsSelected: setSelectedSlots
            }
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

    /**
     * Obtiene el conteo total de doctores disponibles
     */
    const fetchDoctoresCount = async () => {
        try {
            console.log('[Paciente - DoctoresMain] Obteniendo lista de doctores...');
            const response = await ApiService.getDoctores();
            if (Array.isArray(response)) {
                setDoctoresCount(response.length);
                console.log(`[Paciente - DoctoresMain] Total de doctores: ${response.length}`);
            } else {
                console.log('[Paciente - DoctoresMain] Respuesta no es un array');
                setDoctoresCount(0);
            }
        } catch (error) {
            console.error('[Paciente - DoctoresMain] Error obteniendo lista de doctores:', error);
        }
    };

    /**
     * Obtiene la lista de especialidades para filtrar doctores
     */
    const fetchEspecialidades = async () => {
        try {
            console.log('[Paciente - DoctoresMain] Obteniendo especialidades...');
            const response = await ApiService.request('/especialidades');
            setEspecialidades(response);
            console.log('[Paciente - DoctoresMain] Especialidades cargadas:', response);
        } catch (error) {
            console.error('[Paciente - DoctoresMain] Error obteniendo especialidades:', error);
        }
    };

    useEffect(() => {
        console.log('[Paciente - DoctoresMain] Inicializando pantalla de doctores');
        fetchDoctoresCount();
        fetchEspecialidades();
    }, []);

    /**
     * Maneja la selección de un doctor para agendar cita
     */
    const handleAgendarCita = (doctor) => {
        console.log('[Paciente - DoctoresMain] Agendando cita con doctor:', doctor);
        setSelectedDoctor(doctor);
        setModalVisible(true);
    };

    /**
      * Cancela el proceso de agendar cita
      */
     const handleCancel = () => {
         console.log('[Paciente - DoctoresMain] Cancelando agendamiento de cita');
         setModalVisible(false);
         setSelectedDoctor(null);
         setSelectedSlots([]);
     };

    /**
      * Procesa el envío del formulario de cita
      */
     const handleSubmit = async (formData) => {
         try {
             console.log('[Paciente - DoctoresMain] Enviando formulario de cita:', formData);

             // Validaciones
             if (!formData.fecha_cita) {
                 Alert.alert("Error", "Debe seleccionar una fecha para la cita");
                 return;
             }

             if (selectedSlots.length === 0) {
                 Alert.alert("Error", "Debe seleccionar al menos un slot de horario");
                 return;
             }

             // Validar que los slots correspondan al día de la semana de la fecha
             const selectedDate = new Date(formData.fecha_cita + 'T00:00:00');
             const dayOfWeek = selectedDate.getDay();
             if (selectedSlots.some(slot => slot.dia !== dayOfWeek)) {
                 Alert.alert("Error", "Los slots seleccionados no corresponden al día de la semana de la fecha elegida");
                 return;
             }

             // Usar la hora del primer slot seleccionado
             const hora_cita = selectedSlots[0].hora_inicio;

             const citaData = {
                 id_doctor: selectedDoctor.id,
                 fecha_cita: formData.fecha_cita,
                 hora_cita: hora_cita,
                 lugar: formData.lugar,
                 motivo: formData.motivo
             };

             console.log('[Paciente - DoctoresMain] Datos de cita a enviar:', citaData);

             const response = await ApiService.createCita(citaData);

             if (response) {
                 console.log('[Paciente - DoctoresMain] Cita agendada exitosamente');
                 setModalVisible(false);
                 setSelectedDoctor(null);
                 setSelectedSlots([]);
                 Alert.alert("¡Éxito!", "Su cita ha sido agendada correctamente");
             }
         } catch (error) {
             console.error('[Paciente - DoctoresMain] Error agendando cita:', error);
             Alert.alert("Error", error.message || "Error al agendar la cita");
         }
     };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>
            <View style={{ flex: 1, backgroundColor: col.background}}>
                <View style={styles.container(col)}>
                    <CountCard title="Doctores Disponibles" number={doctoresCount} />
                </View>

                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: col.text,
                    textAlign: 'center',
                    marginVertical: 15,
                    paddingHorizontal: 20
                }}>
                    Selecciona un doctor para agendar tu cita
                </Text>

                <TableDoctoresPaciente onAgendarCita={handleAgendarCita} />

                <DynamicFormModal
                    visible={modalVisible}
                    onCloses={handleCancel}
                    onSubmit={handleSubmit}
                    fields={formFields}
                    title={`Agendar Cita con Dr. ${selectedDoctor ? `${selectedDoctor.nombres} ${selectedDoctor.apellidos}` : ''}`}
                />
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