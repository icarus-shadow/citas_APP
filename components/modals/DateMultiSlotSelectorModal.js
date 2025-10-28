import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import { colors, darkColors } from '../../utils/desing/Colors';
import ApiService from '../../Src/services/api/Api';
import CustomAlert from '../CustomAlert';

const DateMultiSlotSelectorModal = ({ visible, onClose, onSelectSlots, fetchSlots: externalFetchSlots, doctorId }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;

    // Estados para la alerta personalizada
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('error');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (selectedDate) {
            fetchSlots();
        }
    }, [selectedDate]);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            let daySlots;
            if (externalFetchSlots) {
                // Use external fetch function if provided
                daySlots = await externalFetchSlots(selectedDate);
            } else if (doctorId) {
                // Use new endpoint with doctor ID
                daySlots = await ApiService.getSlotsByDate(doctorId, selectedDate);
            } else {
                // Fallback to internal implementation
                const slots = await ApiService.getMisHorarios();
                // Filter slots for the selected date
                const dayOfWeek = new Date(selectedDate).getDay(); // 0=Sunday, 1=Monday, etc.
                daySlots = slots.filter(slot => slot.dia === dayOfWeek && slot.disponible);
            }
            setAvailableSlots(daySlots);
        } catch (error) {
            setAlertType('error');
            setAlertMessage('No se pudieron cargar los slots disponibles');
            setAlertVisible(true);
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setDatePickerVisible(false);
        if (selectedDate) {
            setTempDate(selectedDate);
            // Formatear fecha en formato YYYY-MM-DD sin zona horaria
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setSelectedDate(formattedDate);
            setSelectedSlots([]); // Reset selected slots when date changes
            setAvailableSlots([]);
        }
    };

    const toggleSlotSelection = async (slot) => {
        const slotKey = `${slot.hora_inicio}-${slot.hora_fin}`;
        const isSelected = selectedSlots.some(s => `${s.hora_inicio}-${s.hora_fin}` === slotKey);

        if (isSelected) {
            // Deseleccionar
            setSelectedSlots(prev => prev.filter(s => `${s.hora_inicio}-${s.hora_fin}` !== slotKey));
        } else {
            // Validar slot antes de seleccionar
            if (doctorId) {
                try {
                    const validation = await ApiService.validateSlot(doctorId, selectedDate || '', slot.hora_inicio);
                    if (!validation.available) {
                        setAlertType('error');
                        setAlertMessage('Este horario ya ha sido reservado. Por favor selecciona otro.');
                        setAlertVisible(true);
                        // Recargar slots para actualizar disponibilidad
                        fetchSlots();
                        return;
                    }
                } catch (error) {
                    console.error('[DateMultiSlotSelectorModal] Error validando slot:', error.message);
                    setAlertType('error');
                    setAlertMessage('No se pudo validar la disponibilidad del horario');
                    setAlertVisible(true);
                    return;
                }
            }
            setSelectedSlots(prev => [...prev, slot]);
        }
    };

    const handleAccept = () => {
        if (selectedSlots.length === 0) {
            setAlertType('error');
            setAlertMessage('Debe seleccionar al menos un slot');
            setAlertVisible(true);
            return;
        }

        const slotsData = selectedSlots.map(slot => ({
            fecha: selectedDate || '',
            hora: `${slot.hora_inicio}-${slot.hora_fin}`
        }));

        onSelectSlots(selectedDate || '', slotsData);
        onClose();
    };

    const isSlotSelected = (slot) => {
        const slotKey = `${slot.hora_inicio}-${slot.hora_fin}`;
        return selectedSlots.some(s => `${s.hora_inicio}-${s.hora_fin}` === slotKey);
    };

    return (
        <View style={{ flex: 1 }}>
            {datePickerVisible && (
                <DateTimePicker
                    mode="date"
                    value={tempDate}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}
            <Modal visible={visible} animationType="slide" transparent>
                <View style={styles.overlay}>
                    <View style={[styles.modalContainer, { backgroundColor: col.background }]}>
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: col.text }]}>Seleccionar Fecha y Slots</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={col.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.dateSelectorContainer}>
                            <Text style={[styles.subtitle, { color: col.text }]}>Seleccionar Fecha</Text>
                            <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={[styles.dateButton, { backgroundColor: col.backgroundResalt }]}>
                                <Text style={[styles.dateButtonText, { color: col.text }]}>
                                    {selectedDate ? `Fecha seleccionada: ${selectedDate}` : 'Seleccionar fecha'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {selectedDate && (
                            <View style={styles.slotsContainer}>
                                <Text style={[styles.subtitle, { color: col.text }]}>
                                    Slots disponibles para {selectedDate}
                                </Text>
                                {loading ? (
                                    <Text style={[styles.loadingText, { color: col.textResalt }]}>Cargando...</Text>
                                ) : availableSlots.length > 0 ? (
                                    <ScrollView style={styles.slotsList}>
                                        {availableSlots.map((slot, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.slotItem,
                                                    { backgroundColor: col.backgroundResalt },
                                                    isSlotSelected(slot) && { backgroundColor: col.primary }
                                                ]}
                                                onPress={() => toggleSlotSelection(slot)}
                                            >
                                                <View style={styles.slotContent}>
                                                    <Text style={[styles.slotText, { color: isSlotSelected(slot) ? 'white' : col.text }]}>
                                                        {slot.hora_inicio} - {slot.hora_fin}
                                                    </Text>
                                                    {isSlotSelected(slot) && (
                                                        <Ionicons name="checkmark" size={20} color="white" />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <Text style={[styles.noSlotsText, { color: col.textResalt }]}>
                                        No hay slots disponibles para esta fecha
                                    </Text>
                                )}
                            </View>
                        )}

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[styles.cancelButton, { backgroundColor: col.backgroundResalt }]}
                                onPress={onClose}
                            >
                                <Text style={[styles.cancelButtonText, { color: col.text }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.acceptButton, { backgroundColor: col.primary }]}
                                onPress={handleAccept}
                            >
                                <Text style={[styles.acceptButtonText, { color: 'white' }]}>
                                    Aceptar ({selectedSlots.length} slots)
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Componente de alerta personalizada */}
                <CustomAlert
                    visible={alertVisible}
                    type={alertType}
                    message={alertMessage}
                    onClose={() => setAlertVisible(false)}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        height: '80%',
        borderRadius: 20,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    dateSelectorContainer: {
        marginBottom: 20,
    },
    dateButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    dateButtonText: {
        fontSize: 16,
    },
    slotsContainer: {
        flex: 1,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
    },
    slotsList: {
        flex: 1,
    },
    slotItem: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 8,
    },
    slotContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    slotText: {
        fontSize: 16,
    },
    noSlotsText: {
        textAlign: 'center',
        fontSize: 16,
        fontStyle: 'italic',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
    },
    acceptButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        marginLeft: 10,
        alignItems: 'center',
    },
    acceptButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DateMultiSlotSelectorModal;