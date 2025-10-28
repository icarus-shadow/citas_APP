import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useSelector, useDispatch} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Add from "../../../../../components/Buttons/Add";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableHorarios from "./elements/TableHorarios";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";
import {fetchHorarios} from "../../../../../utils/slices/data/HorariosSlice";
import {fetchHorariosCounter} from "../../../../../utils/slices/counters/HorariosCounterSlice";
import CustomAlert from "../../../../../components/CustomAlert";

let col = colors;


export default function HorariosMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);
    const dispatch = useDispatch();

    const horariosCount = useSelector((state) => state.horariosCounter.horariosCount);
    const [modalVisible, setModalVisible] = useState(false);

    // Estados para la alerta personalizada
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const formFields = [
        {name: 'nombre', label: 'Nombre del Horario', type: 'text', required: true},
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

    const actualizarInfo = () => {
      dispatch(fetchHorarios());
      dispatch(fetchHorariosCounter());
    }

    const handleNewHorario = () => {
        setModalVisible(true);
    }

    const handleCancel = () => {
        setModalVisible(false);
    }

    const handleSubmit = async (formData) => {
        try {
            const horarioData = {
                nombre: formData.nombre,
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
                setAlertType('success');
                setAlertMessage('Plantilla de horario registrada correctamente');
                setAlertVisible(true);
                actualizarInfo();
            }
        } catch (error) {
            setAlertType('error');
            setAlertMessage(error.message || 'Error al registrar plantilla de horario');
            setAlertVisible(true);
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
