import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, darkColors } from '../../../../../../utils/desing/Colors';
import ApiService from '../../../../../../Src/services/api/Api';
import AppointmentSlotSelector from '../../../../../../components/AppointmentSlotSelector';

export default function AppointmentSlotModal({
    visible,
    onClose,
    selectedDoctor,
    onSubmit
}) {
    const isDark = useSelector((state) => state.darkMode.value);
    const user = useSelector((state) => state.auth.user);
    const col = isDark ? colors : darkColors;

    const [selectedSlots, setSelectedSlots] = useState([]);
    const [doctorName, setDoctorName] = useState('');
    const [loading, setLoading] = useState(false);
    const [lugar, setLugar] = useState('');
    const [motivo, setMotivo] = useState('');

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
            const doctor = doctors.find(d => d.id === selectedDoctor.id);
            if (doctor) {
                setDoctorName(`${doctor.nombres} ${doctor.apellidos}`);
            } else {
                setDoctorName('Doctor no encontrado');
            }
        } catch (error) {
            console.error('[AppointmentSlotModal] Error obteniendo nombre del doctor:', error);
            setDoctorName('Error al cargar doctor');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (selectedSlots.length === 0) {
            Alert.alert('Selección requerida', 'Por favor, selecciona al menos un horario antes de confirmar.');
            return;
        }
        if (!lugar.trim()) {
            Alert.alert('Error', 'Por favor ingresa el lugar de la cita.');
            return;
        }
        if (!motivo.trim()) {
            Alert.alert('Error', 'Por favor ingresa el motivo de la cita.');
            return;
        }

        try {
            if (!user || !user.id) {
                Alert.alert("Error", "Usuario no autenticado");
                return;
            }

            // Usar la fecha y hora del primer slot seleccionado
            const slot = selectedSlots[0];
            const fecha_cita = slot.fecha;
            const hora_cita = slot.hora_inicio;

            const citaData = {
                id_doctor: selectedDoctor.id,
                fecha_cita: fecha_cita,
                hora_cita: hora_cita,
                lugar: lugar.trim(),
                motivo: motivo.trim()
            };

            const response = await ApiService.createCita(citaData);

            if (response) {
                Alert.alert("¡Éxito!", "Su cita ha sido agendada correctamente");
                handleClose();
            }
        } catch (error) {
            console.error('[AppointmentSlotModal] Error agendando cita:', error);
            Alert.alert("Error", error.message || "Error al agendar la cita");
        }
    };

    const handleClose = () => {
        setSelectedSlots([]);
        setLugar('');
        setMotivo('');
        onClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: col.background }]}>
                    <Text style={[styles.title, { color: col.text }]}>
                        Agendar Cita con Dr. {doctorName}
                    </Text>

                    <ScrollView style={{ flex: 1 }}>
                        <AppointmentSlotSelector
                            formData={{ id_doctor: selectedDoctor?.id }}
                            onSlotsSelected={setSelectedSlots}
                        />

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
                            <Text style={[styles.btnText, { color: col.background }]}>
                                Agendar Cita ({selectedSlots.length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
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
