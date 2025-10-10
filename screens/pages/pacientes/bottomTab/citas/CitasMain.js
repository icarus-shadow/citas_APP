import {View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState, useMemo} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableCitasPaciente from "./elements/TableCitasPaciente";
import InfoCard from "../../../../../components/cards/InfoCard";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";
import AppointmentSlotSelector from "../../../../../components/AppointmentSlotSelector";

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
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [refreshTable, setRefreshTable] = useState(0);

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

     /**
      * Obtiene la lista de doctores disponibles
      */
     const fetchDoctores = async () => {
         try {
             console.log('[Paciente - CitasMain] Obteniendo lista de doctores...');
             const response = await ApiService.getDoctores();
             console.log('[Paciente - CitasMain] Respuesta de doctores:', response);
             if (Array.isArray(response)) {
                 setDoctores(response);
                 console.log(`[Paciente - CitasMain] Doctores cargados: ${response.length}`);
                 response.forEach(d => console.log(`Doctor: ${d.nombres} ${d.apellidos}`));
             } else {
                 console.log('[Paciente - CitasMain] Respuesta no es un array');
                 setDoctores([]);
             }
         } catch (error) {
             console.error('[Paciente - CitasMain] Error obteniendo doctores:', error);
             setDoctores([]);
         }
     };

    useEffect(() => {
        fetchCitasCount();
        fetchDoctores();
    }, []);

    // Opciones de doctores
    const doctorOptions = doctores.map(d => ({ label: `${d.nombres} ${d.apellidos}`.trim(), value: d.id }));

    // Formulario para agendar cita
    const formFields = useMemo(() => {
        return [
            {
                name: 'id_doctor',
                label: 'Seleccionar Doctor',
                type: 'select',
                options: doctorOptions,
                required: true
            },
            {
                type: 'custom',
                component: AppointmentSlotSelector,
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
    }, [doctores]);

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

     /**
       * Cancela el proceso de agendar cita
       */
      const handleCancel = () => {
         console.log('[Paciente - CitasMain] Cancelando agendamiento de cita');
         setModalVisible(false);
         setSelectedSlots([]);
     };

     /**
      * Maneja el guardado de cambios en una cita
      */
     const handleSaveCita = async (updatedData) => {
         try {
             console.log('[Paciente - CitasMain] Guardando cambios en cita:', updatedData);
             const dataToSend = {
                 id_doctor: updatedData.doctor,
                 fecha_cita: updatedData.fecha_cita,
                 hora_cita: updatedData.hora_cita,
                 lugar: updatedData.lugar,
                 motivo: updatedData.motivo || "Sin motivo"
             };
             await ApiService.updateCita(dataToEdit.id, dataToSend);
             console.log('[Paciente - CitasMain] Cita actualizada exitosamente');
             setVisible(false);
             setRefreshTable(prev => prev + 1); // Actualizar tabla
             fetchCitasCount(); // Actualizar conteo
             Alert.alert("¡Éxito!", "La cita ha sido actualizada correctamente");
         } catch (error) {
             console.error('[Paciente - CitasMain] Error actualizando cita:', error);
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
                             console.log('[Paciente - CitasMain] Eliminando cita:', dataToEdit.id);
                             await ApiService.deleteCitaPaciente(dataToEdit.id);
                             console.log('[Paciente - CitasMain] Cita eliminada exitosamente');
                             setVisible(false);
                             setRefreshTable(prev => prev + 1); // Actualizar tabla
                             fetchCitasCount(); // Actualizar conteo
                             Alert.alert("¡Éxito!", "La cita ha sido eliminada correctamente");
                         } catch (error) {
                             console.error('[Paciente - CitasMain] Error eliminando cita:', error);
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
              console.log('[Paciente - CitasMain] Enviando formulario de cita:', formData);

              // Validaciones
              if (selectedSlots.length === 0) {
                  Alert.alert("Error", "Debe seleccionar al menos un slot de horario");
                  return;
              }

              // Usar la fecha y hora del primer slot seleccionado
              const fecha_cita = selectedSlots[0].fecha;
              const hora_cita = selectedSlots[0].hora_inicio;

              const citaData = {
                  id_doctor: formData.id_doctor,
                  fecha_cita: fecha_cita,
                  hora_cita: hora_cita,
                  lugar: formData.lugar,
                  motivo: formData.motivo
              };

              console.log('[Paciente - CitasMain] Datos de cita a enviar:', citaData);

              const response = await ApiService.createCita(citaData);

              if (response) {
                  console.log('[Paciente - CitasMain] Cita agendada exitosamente');
                  setModalVisible(false);
                  setSelectedSlots([]);
                  fetchCitasCount(); // Actualizar conteo
                  Alert.alert("¡Éxito!", "Su cita ha sido agendada correctamente");
              }
          } catch (error) {
              console.error('[Paciente - CitasMain] Error agendando cita:', error);
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

                <TableCitasPaciente onView={handleView} refreshTrigger={refreshTable} />

                <DynamicFormModal
                    visible={modalVisible}
                    onCloses={handleCancel}
                    onSubmit={handleSubmit}
                    fields={formFields}
                    title="Agendar Nueva Cita"
                />

                {visible && dataToEdit && (
                    <InfoCard
                        data={{
                            ...dataToEdit,
                            paciente: dataToEdit.paciente ? `${dataToEdit.paciente.nombres} ${dataToEdit.paciente.apellidos}` : 'Sin paciente'
                        }}
                        visible={visible}
                        hiddenFields={["id", "updated_at", "created_at", "user_id", "id_paciente"]}
                        readOnlyFields={["paciente"]}
                        doctorOptions={doctores}
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
