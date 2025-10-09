import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Add from "../../../../../components/Buttons/Add";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableDinamic from "../../../../../components/TableDinamic";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";

let col = colors;


export default function NotificacionesMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    const [notificacionesCount, setNotificacionesCount] = useState(0);
    const [notificaciones, setNotificaciones] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const formFields = [
        {name: 'titulo', label: 'Título', type: 'text', required: true},
        {name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true},
        {
            name: 'tipo', label: 'Tipo', type: 'select', required: true, options: [
                {label: 'Información', value: 'info'},
                {label: 'Advertencia', value: 'warning'},
                {label: 'Error', value: 'error'}
            ]
        },
        {name: 'destinatario', label: 'Destinatario', type: 'text', placeholder: 'Todos o ID específico'},
    ];
    const fetchNotificacionesCount = async () => {
        try {
            // Placeholder API call
            const response = await ApiService.request('/countNotificaciones');
            if (response.total === undefined) {
                console.log(`no hay notificaciones`);
                setNotificacionesCount(0);
            } else {
                setNotificacionesCount(response.total);
            }
        } catch (error) {
            console.error('Error fetching notificaciones count:', error);
        }
    };
    const fetchNotificaciones = async () => {
        try {
            // Placeholder API call
            const response = await ApiService.request('/notificaciones');
            setNotificaciones(response.data || []);
        } catch (error) {
            console.error('Error fetching notificaciones:', error);
            setNotificaciones([]);
        }
    };
    useEffect(() => {
        fetchNotificacionesCount();
        fetchNotificaciones();
    }, []);

    const handleNewNotificacion = () => {
        setModalVisible(true);
    }

    const handleCancel = () => {
        setModalVisible(false);
        console.log("cancel");
    }

    const handleSubmit = async (formData) => {
        try {
            const notificacionData = {
                titulo: formData.titulo,
                mensaje: formData.mensaje,
                tipo: formData.tipo,
                destinatario: formData.destinatario
            };

            // Placeholder API call
            const response = await ApiService.request('/notificaciones', {
                method: 'POST',
                body: JSON.stringify(notificacionData)
            });
            if (response) {
                setModalVisible(false);
                Alert.alert("Éxito", "Notificación enviada correctamente");
                fetchNotificacionesCount();
                fetchNotificaciones();
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Error al enviar notificación");
        }
    }

    const handleView = (item) => {
        // Placeholder for view action
        Alert.alert("Ver Notificación", `Título: ${item.titulo}\nMensaje: ${item.mensaje}`);
    };

    const handleAssign = (item) => {
        // Placeholder for assign action
        Alert.alert("Asignar", "Funcionalidad no implementada");
    };

    const columns = ['titulo', 'mensaje', 'tipo', 'destinatario'];

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>

            <View style={{ flex: 1, backgroundColor: col.background}}>
                <View style={styles.container(col)}>
                    <Add onPressed={handleNewNotificacion}/>
                    <CountCard title="Notificaciones" number={notificacionesCount} />
                </View>
                <TableDinamic
                    columns={columns}
                    data={notificaciones}
                    onView={handleView}
                    onAssign={handleAssign}
                />
                <DynamicFormModal
                    visible={modalVisible}
                    onCloses={handleCancel}
                    onSubmit={handleSubmit}
                    fields={formFields}
                    title="Nueva Notificación"
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