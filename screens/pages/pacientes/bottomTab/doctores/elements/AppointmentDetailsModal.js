import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, darkColors } from '../../../../../../utils/desing/Colors';
import ApiService from '../../../../../../Src/services/api/Api';
import CustomAlert from '../../../../../../components/CustomAlert';

export default function AppointmentDetailsModal({
    visible,
    onClose,
    selectedSlots,
    selectedDoctor,
    onChangeDate,
    onSubmit
}) {
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;

    const [lugar, setLugar] = useState('');
    const [motivo, setMotivo] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados para la alerta personalizada
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('error');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (visible && selectedDoctor) {
            fetchDoctorName();
        }
    }, [visible, selectedDoctor]);

    const fetchDoctorName = async () => {
        if (!selectedDoctor) return;

        setLoading(true);
        try {
            const doctors = await ApiService.getDoctores();
            const doctor = doctors.find(d => d.id === selectedDoctor);
            if (doctor) {
                setDoctorName(`${doctor.nombres} ${doctor.apellidos}`);
            } else {
                setDoctorName('Doctor no encontrado');
            }
        } catch (error) {
            console.error('[AppointmentDetailsModal] Error obteniendo nombre del doctor:', error);
            setDoctorName('Error al cargar doctor');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!lugar.trim()) {
            setAlertType('error');
            setAlertMessage('Por favor ingresa el lugar de la cita.');
            setAlertVisible(true);
            return;
        }
        if (!motivo.trim()) {
            setAlertType('error');
            setAlertMessage('Por favor ingresa el motivo de la cita.');
            setAlertVisible(true);
            return;
        }
        onSubmit({ lugar: lugar.trim(), motivo: motivo.trim() });
        onClose();
    };

    const handleClose = () => {
        setLugar('');
        setMotivo('');
        onClose();
    };

    const formatDateTime = () => {
        if (!selectedSlots || selectedSlots.length === 0) return 'No seleccionado';
        const slot = selectedSlots[0];
        const date = new Date(slot.fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const time = `${slot.hora_inicio} - ${slot.hora_fin}`;
        return `${date}, ${time}`;
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: 'white' }]}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: col.text }]}>
                                Detalles de la Cita con Dr. {doctorName}
                            </Text>
                            <TouchableOpacity
                                style={[styles.changeDateBtn, { backgroundColor: col.secondary }]}
                                onPress={onChangeDate}
                            >
                                <Text style={[styles.changeDateText, { color: col.background }]}>Cambiar Fecha</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ flex: 1 }}>
                            <View style={styles.dateTimeContainer}>
                                <Text style={[styles.dateTimeLabel, { color: col.text }]}>Fecha y Hora Seleccionada:</Text>
                                <Text style={[styles.dateTimeValue, { color: col.text }]}>{formatDateTime()}</Text>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputLabel, { color: col.text }]}>Lugar *</Text>
                                <TextInput
                                    style={[styles.textInput, { borderColor: col.secondary, color: col.text }]}
                                    placeholder="Ingresa el lugar de la cita"
                                    placeholderTextColor={col.textResalt}
                                    value={lugar}
                                    onChangeText={setLugar}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputLabel, { color: col.text }]}>Motivo *</Text>
                                <TextInput
                                    style={[styles.textArea, { borderColor: col.secondary, color: col.text }]}
                                    placeholder="Ingresa el motivo de la cita"
                                    placeholderTextColor={col.textResalt}
                                    value={motivo}
                                    onChangeText={setMotivo}
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: col.secondary }]}
                            onPress={handleClose}
                        >
                            <Text style={[styles.btnText, { color: col.background }]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: col.primary }]}
                            onPress={handleSubmit}
                        >
                            <Text style={[styles.btnText, { color: col.background }]}>Confirmar Cita</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Componente de alerta personalizada */}
                <CustomAlert
                    visible={alertVisible}
                    type={alertType}
                    message={alertMessage}
                    onClose={() => setAlertVisible(false)}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    changeDateBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    changeDateText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    dateTimeContainer: {
        marginBottom: 20,
    },
    dateTimeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dateTimeValue: {
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        height: 80,
        textAlignVertical: 'top',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginLeft: 10,
    },
    btnText: {
        fontWeight: 'bold',
    },
});
