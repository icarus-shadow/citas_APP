import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import { colors, darkColors } from '../../utils/desing/Colors';
import ApiService from '../../Src/services/api/Api';

const DateSlotSelectorModal = ({ visible, onClose, doctorId, onSelectSlot }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;

    useEffect(() => {
        if (selectedDate && doctorId) {
            fetchSlots();
        }
    }, [selectedDate, doctorId]);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const slots = await ApiService.getAvailableSlots(doctorId, selectedDate, selectedDate);
            setAvailableSlots(slots);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los slots disponibles');
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setDatePickerVisible(false);
        if (selectedDate) {
            setTempDate(selectedDate);
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setSelectedDate(formattedDate);
            setAvailableSlots([]);
        }
    };

    const handleSlotSelect = (slot) => {
        onSelectSlot(selectedDate, slot.hora_inicio);
        onClose();
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
                            <Text style={[styles.title, { color: col.text }]}>Seleccionar Fecha y Hora</Text>
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
                                                style={[styles.slotItem, { backgroundColor: col.backgroundResalt }]}
                                                onPress={() => handleSlotSelect(slot)}
                                            >
                                                <Text style={[styles.slotText, { color: col.text }]}>
                                                    {slot.hora_inicio} - {slot.hora_fin}
                                                </Text>
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
                    </View>
                </View>
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
    slotText: {
        fontSize: 16,
        textAlign: 'center',
    },
    noSlotsText: {
        textAlign: 'center',
        fontSize: 16,
        fontStyle: 'italic',
    },
});

export default DateSlotSelectorModal;