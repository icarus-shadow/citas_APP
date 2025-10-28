import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Add from "../../../../../components/Buttons/Add";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState, useMemo} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableCitasAdmin from "./elements/TableCitasAdmin";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";
import AppointmentSlotSelector from "../../../../../components/AppointmentSlotSelector";
import {fetchCitas} from "../../../../../utils/slices/data/CitasSlice";
import {fetchCitasCounter} from "../../../../../utils/slices/counters/CitasCounterSlice";
import CustomAlert from "../../../../../components/CustomAlert";

let col = colors;


export default function CitasMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);
    const dispatch = useDispatch();

    const doctors = useSelector((state) => state.doctores.doctores);
    const patients = useSelector((state) => state.pacientes.pacientes);
    const citasCount = useSelector((state) => state.citasCounter.citasCount)

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);

    // Estados para la alerta personalizada
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    // Opciones de pacientes memoizadas
    const patientOptions = useMemo(() => {
        return patients.map(patient => ({
            value: patient.id,
            label: `${patient.nombres} ${patient.apellidos}`
        }));
    }, [patients]);

    const actualizarIfo = () => {
      dispatch(fetchCitas());
      dispatch(fetchCitasCounter());
    }

    // Opciones de doctores memoizadas
    const doctorOptions = useMemo(() => {
        console.log('[Admin - CitasMain] Memoizando opciones de doctores');
        return doctors.map(doctor => ({
            value: doctor.id,
            label: `${doctor.nombres} ${doctor.apellidos}`
        }));
    }, [doctors]);

    // Formulario memoizado para evitar recreaciones
    const formFields = useMemo(() => [
        {
            name: 'id_paciente',
            label: 'Paciente',
            type: 'select',
            required: true,
            options: patientOptions
        },
        {
            name: 'id_doctor',
            label: 'Doctor',
            type: 'select',
            required: true,
            options: doctorOptions
        },
        {
            type: 'custom',
            component: AppointmentSlotSelector,
            props: (formData) => ({
                formData,
                onSlotsSelected: setSelectedSlots
            })
        },
        {name: 'lugar', label: 'Lugar', type: 'text', required: true, maxLength: 255},
        {name: 'motivo', label: 'Motivo', type: 'text', required: true, maxLength: 255},
    ], [patientOptions, doctorOptions]);


    const handleNewCita = () => {
        setModalVisible(true);
    }

    const handleCancel = () => {
        setModalVisible(false);
        setSelectedSlots([]);
        console.log("cancel");
    }

    const handleSubmit = async (formData) => {
        try {
            console.log("formData recibido:", formData);
            console.log("selectedSlots:", selectedSlots);
            // Validaciones
            if (selectedSlots.length === 0) {
                setAlertType('error');
                setAlertMessage('Debe seleccionar al menos un slot de horario');
                setAlertVisible(true);
                return;
            }

            // Validar campos requeridos
            if (!formData.id_paciente || formData.id_paciente === "") {
                setAlertType('error');
                setAlertMessage('Debe seleccionar un paciente');
                setAlertVisible(true);
                return;
            }
            if (!formData.id_doctor || formData.id_doctor === "") {
                setAlertType('error');
                setAlertMessage('Debe seleccionar un doctor');
                setAlertVisible(true);
                return;
            }
            if (!formData.lugar || formData.lugar.trim() === "") {
                setAlertType('error');
                setAlertMessage('El campo lugar es requerido');
                setAlertVisible(true);
                return;
            }
            if (!formData.motivo || formData.motivo.trim() === "") {
                setAlertType('error');
                setAlertMessage('El campo motivo es requerido');
                setAlertVisible(true);
                return;
            }

            // Usar la fecha y hora del primer slot seleccionado
            const fecha_cita = selectedSlots[0].fecha;
            const hora_cita = selectedSlots[0].hora_inicio;

            const citaData = {
                id_paciente: formData.id_paciente,
                id_doctor: formData.id_doctor,
                fecha_cita: fecha_cita,
                hora_cita: hora_cita,
                lugar: formData.lugar,
                motivo: formData.motivo
            };

            const response = await ApiService.request('/citas', {
                method: 'POST',
                body: JSON.stringify(citaData)
            });
            if (response) {
                setModalVisible(false);
                setSelectedSlots([]);
                setAlertType('success');
                setAlertMessage('Cita registrada correctamente');
                setAlertVisible(true);
                actualizarIfo();
            }
        } catch (error) {
            setAlertType('error');
            setAlertMessage(error.message || 'Error al registrar cita');
            setAlertVisible(true);
        }
    }


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>

            <View style={{ flex: 1, backgroundColor: col.background}}>
                <View style={styles.container(col)}>
                    <Add onPressed={handleNewCita}/>
                    <CountCard title="Citas" number={citasCount} />
                </View>
                <TableCitasAdmin />
                <DynamicFormModal
                    visible={modalVisible}
                    onCloses={handleCancel}
                    onSubmit={handleSubmit}
                    fields={formFields}
                    title="Nuevo Cita"
                />

                {/* Componente de alerta personalizada */}
                <CustomAlert
                    visible={alertVisible}
                    type={alertType}
                    message={alertMessage}
                    onClose={() => setAlertVisible(false)}
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

