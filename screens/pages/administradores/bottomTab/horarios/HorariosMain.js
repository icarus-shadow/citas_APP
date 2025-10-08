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
    useEffect(() => {
        fetchHorariosCount();
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
                Alert.alert("Éxito", "Plantilla de horario registrada correctamente");
                fetchHorariosCount();
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Error al registrar plantilla de horario");
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
