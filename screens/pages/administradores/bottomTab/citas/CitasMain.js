import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Add from "../../../../../components/Buttons/Add";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableCitas from "./elements/TableCitas";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";

let col = colors;


export default function CitasMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    const [citasCount, setCitasCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorsResponse = await ApiService.request('/doctores');
                const patientsResponse = await ApiService.request('/pacientes');
                setDoctors(doctorsResponse);
                setPatients(patientsResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const formFields = [
        {
            name: 'id_paciente',
            label: 'Paciente',
            type: 'select',
            required: true,
            options: patients.map(patient => ({
                value: patient.id,
                label: `${patient.nombres} ${patient.apellidos}`
            }))
        },
        {
            name: 'id_doctor',
            label: 'Doctor',
            type: 'select',
            required: true,
            options: doctors.map(doctor => ({
                value: doctor.id,
                label: `${doctor.nombres} ${doctor.apellidos}`
            }))
        },
        {
            name: 'fecha_cita',
            label: 'Fecha de Cita',
            type: 'date',
            required: true,
            min: new Date().toISOString().split('T')[0]
        },
        {name: 'hora_cita', label: 'Hora de Cita', type: 'time', required: true},
        {name: 'lugar', label: 'Lugar', type: 'text', required: true, maxLength: 255},
        {name: 'motivo', label: 'Motivo', type: 'text', required: true, maxLength: 255},
    ];
    const fetchCitasCount = async () => {
        try {
            const response = await ApiService.request('/countCitas');
            if (response.total === undefined) {
                console.log(`no hay citas`);
                setCitasCount(0);
            } else {
                setCitasCount(response.total);
            }
        } catch (error) {
            console.error('Error fetching citas count:', error);
        }
    };
    useEffect(() => {
        fetchCitasCount();
    }, []);

    const handleNewCita = () => {
        setModalVisible(true);
    }

    const handleCancel = () => {
        setModalVisible(false);
        console.log("cancel");
    }

    const handleSubmit = async (formData) => {
        try {
            const citaData = {
                id_paciente: formData.id_paciente,
                id_doctor: formData.id_doctor,
                fecha_cita: formData.fecha_cita,
                hora_cita: formData.hora_cita,
                lugar: formData.lugar,
                motivo: formData.motivo
            };

            const response = await ApiService.request('/citas', {
                method: 'POST',
                body: JSON.stringify(citaData)
            });
            if (response) {
                setModalVisible(false);
                Alert.alert("Éxito", "Cita registrada correctamente");
                fetchCitasCount();
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Error al registrar cita");
        }
    }


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>

            <View style={{ flex: 1, backgroundColor: col.background}}>
                <View style={styles.container(col)}>
                    <Add onPressed={handleNewCita}/>
                    <CountCard title="Citas" number={citasCount} />
                </View>
                <TableCitas />
                <DynamicFormModal
                    visible={modalVisible}
                    onCloses={handleCancel}
                    onSubmit={handleSubmit}
                    fields={formFields}
                    title="Nuevo Cita"
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

