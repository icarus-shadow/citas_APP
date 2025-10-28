import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { colors, darkColors } from "../../../../../utils/desing/Colors";
import ScheduleDisplay from './elements/ScheduleDisplay';
import NotificationList from './elements/NotificationList';
import DateMultiSlotSelectorModal from '../../../../../components/modals/DateMultiSlotSelectorModal';
import ApiService from '../../../../../Src/services/api/Api';
import CustomAlert from '../../../../../components/CustomAlert';

let col = colors;

export default function HorariosMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    col = isDark ? colors : darkColors;

    const [modalVisible, setModalVisible] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados para la alerta personalizada
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    const fetchAvailableSlots = async (date) => {
        try {
            const slots = await ApiService.getMisHorarios();
            const dayOfWeek = new Date(date).getDay(); // 0=Sunday, 1=Monday, etc.
            const availableSlots = slots.filter(slot => slot.dia === dayOfWeek && slot.disponible);
            return availableSlots;
        } catch (error) {
            console.error('Error fetching available slots:', error);
            throw error;
        }
    };

    const handleApartarFecha = () => {
        setModalVisible(true);
    };

    const handleSelectSlots = async (fecha, slots) => {
        setLoading(true);
        setStatusMessage('');

        try {
            // Enviar la hora como rango H:i-H:i
            const formattedSlots = slots.map(slot => ({
                ...slot,
                hora: slot.hora
            }));

            const data = {
                fecha_solicitada: fecha,
                slots: formattedSlots
            };

            await ApiService.createNotificacion(data);
            setStatusMessage('Solicitud enviada exitosamente al administrador');
            setAlertType('success');
            setAlertMessage('La solicitud ha sido enviada al administrador para su aprobación');
            setAlertVisible(true);
        } catch (error) {
            console.error('Error creating notification:', error);
            setStatusMessage('Error al enviar la solicitud');
            setAlertType('error');
            setAlertMessage('No se pudo enviar la solicitud. Intente nuevamente.');
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: col.background }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: "30%", paddingTop: "5%" }}>
                <ScheduleDisplay />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: col.primary }]}
                        onPress={handleApartarFecha}
                        disabled={loading}
                    >
                        <Text style={[styles.buttonText, { color: 'white' }]}>
                            {loading ? 'Enviando...' : 'Apartar Fecha'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {statusMessage ? (
                    <View style={styles.statusContainer}>
                        <Text style={[styles.statusText, { color: col.text }]}>
                            {statusMessage}
                        </Text>
                    </View>
                ) : null}

                <NotificationList />
            </ScrollView>

            <DateMultiSlotSelectorModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelectSlots={handleSelectSlots}
                fetchSlots={fetchAvailableSlots}
            />

            {/* Componente de alerta personalizada */}
            <CustomAlert
                visible={alertVisible}
                type={alertType}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    button: {
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusContainer: {
        padding: 15,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 16,
        textAlign: 'center',
    },
});