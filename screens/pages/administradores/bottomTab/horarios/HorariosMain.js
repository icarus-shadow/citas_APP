import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Add from "../../../../../components/Buttons/Add";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableHorarios from "./elements/TableHorarios";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";

let col = colors;


export default function HorariosMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    const [horariosCount, setHorariosCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const formFields = [
        {
            name: 'id_doctor',
            label: 'Doctor',
            type: 'select',
            required: true,
            options: doctors.filter(doctor => doctor && doctor.id && doctor.nombres && doctor.apellidos).map(doctor => {
                console.log('[DEBUG] Mapping doctor:', doctor);
                return {
                    label: doctor.nombres + " " + doctor.apellidos,
                    value: doctor.id
                };
            })
        },
        {
            name: 'dias',
            label: 'Días',
            type: 'select',
            required: true,
            multiple: true,
            options: [
                {label: 'Lunes', value: 1},
                {label: 'Martes', value: 2},
                {label: 'Miércoles', value: 3},
                {label: 'Jueves', value: 4},
                {label: 'Viernes', value: 5},
                {label: 'Sábado', value: 6},
                {label: 'Domingo', value: 7}
            ]
        },
        {name: 'hora_inicio', label: 'Hora Inicio', type: 'time', required: true},
        {name: 'hora_fin', label: 'Hora Fin', type: 'time', required: true},
    ];
    const fetchHorariosCount = async () => {
        try {
            const response = await ApiService.request('/countHorarios');
            if (response.total === undefined) {
                console.log(`no hay horarios`);
                setHorariosCount(0);
            } else {
                setHorariosCount(response.total);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const fetchDoctors = async () => {
        try {
            const response = await ApiService.request('/doctores');
            console.log('[DEBUG] fetchDoctors response:', response);
            console.log('[DEBUG] fetchDoctors response type:', typeof response);
            console.log('[DEBUG] fetchDoctors is array:', Array.isArray(response));
            
            if (Array.isArray(response)) {
                response.forEach((doctor, index) => {
                    console.log(`[DEBUG] Doctor ${index}:`, doctor);
                    console.log(`[DEBUG] Doctor ${index} has id:`, doctor && doctor.id);
                    console.log(`[DEBUG] Doctor ${index} has nombres:`, doctor && doctor.nombres);
                    console.log(`[DEBUG] Doctor ${index} has apellidos:`, doctor && doctor.apellidos);
                });
            }
            
            setDoctors(response || []);
        } catch (error) {
            console.error('[DEBUG] Error fetching doctors:', error);
            setDoctors([]);
        }
    };

    useEffect(() => {
        fetchHorariosCount();
        fetchDoctors();
    }, []);

    const handleNewHorario = () => {
        setModalVisible(true);
    }

    const handleCancel = () => {
        setModalVisible(false);
        console.log("cancel");
    }

    const handleSubmit = async (formData) => {
        console.log('[DEBUG] handleSubmit formData:', formData);
        try {
            const horarioData = {
                id_doctor: formData.id,
                dias: formData.dias,
                hora_inicio: formData.hora_inicio,
                hora_fin: formData.hora_fin
            };

            const response = await ApiService.request('/horarios', {
                method: 'POST',
                body: JSON.stringify(horarioData)
            });
            if (response) {
                setModalVisible(false);
                Alert.alert("Éxito", "Horario registrado correctamente");
                fetchHorariosCount();
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Error al registrar horario");
        }
    }


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>

            <View style={{ flex: 1, backgroundColor: col.background}}>
                <View style={styles.container(col)}>
                    <Add onPressed={handleNewHorario}/>
                    <CountCard title="Horarios" number={horariosCount} />
                </View>
                <TableHorarios />
                <DynamicFormModal
                    visible={modalVisible}
                    onCloses={handleCancel}
                    onSubmit={handleSubmit}
                    fields={formFields}
                    title="Nuevo Horario"
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
