import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import ApiService from '../Src/services/api/Api';
import CustomAlert from './CustomAlert';

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function AppointmentSlotSelector({ formData, onSlotsSelected }) {
    console.log('[AppointmentSlotSelector] Re-render triggered');
    console.log('[AppointmentSlotSelector] Props:', { formData, onSlotsSelected });
    const selectedDoctor = formData?.id_doctor;
    const [slots, setSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDatePickerModal, setShowDatePickerModal] = useState(false);

    // Estados para la alerta personalizada
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('error');
    const [alertMessage, setAlertMessage] = useState('');

    const fetchSlots = async () => {
        console.log('[AppointmentSlotSelector] fetchSlots called with selectedDoctor:', selectedDoctor, 'selectedDate:', selectedDate);
        if (!selectedDoctor || !selectedDate) {
            console.log('[AppointmentSlotSelector] No hay doctor o fecha seleccionada');
            setSlots([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log(`[AppointmentSlotSelector] Obteniendo slots disponibles para doctor ${selectedDoctor} en fecha ${selectedDate.toISOString().split('T')[0]}`);

            // Formatear fecha para la API en formato YYYY-MM-DD sin zona horaria
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            const slotsResponse = await ApiService.getSlotsByDate(selectedDoctor, dateStr);
            console.log(`[AppointmentSlotSelector] Slots obtenidos:`, slotsResponse);

            // Validar que slotsResponse sea un array
            if (!Array.isArray(slotsResponse)) {
                console.error('[AppointmentSlotSelector] slotsResponse no es un array:', slotsResponse);
                setError('Error en la respuesta del servidor: formato de datos inválido');
                setSlots([]);
                return;
            }

            console.log(`[AppointmentSlotSelector] Slots obtenidos: ${slotsResponse.length}`);

            // Procesar slots disponibles
            const processedSlots = slotsResponse.map(slot => ({
                id: slot.id,
                fecha: slot.fecha || '',
                hora_inicio: slot.hora_inicio,
                hora_fin: slot.hora_fin,
                disponible: slot.disponible,
                ocupado: !slot.disponible,
                key: `${slot.fecha || ''}-${slot.hora_inicio}`
            }));

            // Ordenar por hora
            processedSlots.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

            setSlots(processedSlots);
            console.log('[AppointmentSlotSelector] Slots procesados correctamente');
        } catch (err) {
            console.error('[AppointmentSlotSelector] Error al obtener slots:', err.message);
            setError('Error al cargar los horarios disponibles');
            setAlertType('error');
            setAlertMessage('No se pudieron cargar los horarios disponibles');
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, [selectedDoctor, selectedDate]);

    // Limpiar slots seleccionados cuando cambia el doctor
    useEffect(() => {
        console.log('[AppointmentSlotSelector] selectedDoctor changed, resetting selectedSlots and selectedDate');
        setSelectedSlots([]);
        setSelectedDate(new Date());
    }, [selectedDoctor]);

    // Log selectedSlots changes
    useEffect(() => {
        console.log('[AppointmentSlotSelector] selectedSlots changed:', selectedSlots);
    }, [selectedSlots]);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        if (Platform.OS === 'android') {
            setShowDatePickerModal(false);
        } else {
            setShowDatePicker(Platform.OS === 'ios');
        }
        setSelectedDate(currentDate);
    };

    const showDatepicker = () => {
        if (Platform.OS === 'android') {
            setShowDatePickerModal(true);
        } else {
            setShowDatePicker(true);
        }
    };

    const handleSlotPress = async (slot) => {
        console.log('[AppointmentSlotSelector] handleSlotPress called with selectedDoctor:', selectedDoctor, 'slot:', slot);
        if (!slot.disponible) return;

        // Validar slot en tiempo real
        try {
            // Formatear fecha para la API en formato YYYY-MM-DD sin zona horaria
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            const validation = await ApiService.validateSlot(selectedDoctor, dateStr, slot.hora_inicio);
            if (!validation.available) {
                setAlertType('error');
                setAlertMessage('Este horario ya ha sido reservado. Por favor selecciona otro.');
                setAlertVisible(true);
                // Recargar slots para actualizar disponibilidad
                fetchSlots();
                return;
            }
        } catch (err) {
            console.error('[AppointmentSlotSelector] Error validando slot:', err.message);
            setAlertType('error');
            setAlertMessage('No se pudo validar la disponibilidad del horario');
            setAlertVisible(true);
            return;
        }
        if (!slot.disponible) return;

        const isSelected = selectedSlots.some(s => s.key === slot.key);

        if (isSelected) {
            // Deseleccionar
            const newSelected = selectedSlots.filter(s => s.key !== slot.key);
            setSelectedSlots(newSelected);
            onSlotsSelected && onSlotsSelected(newSelected);
        } else {
            // Validar selección consecutiva
            if (selectedSlots.length > 0) {
                const lastSelected = selectedSlots[selectedSlots.length - 1];
                const isConsecutive = checkConsecutive(slot, lastSelected);
                if (!isConsecutive) {
                    setAlertType('error');
                    setAlertMessage('Los slots deben ser consecutivos');
                    setAlertVisible(true);
                    return;
                }
            }

            const newSelected = [...selectedSlots, slot];
            setSelectedSlots(newSelected);
            onSlotsSelected && onSlotsSelected(newSelected);
        }
    };

    const checkConsecutive = (newSlot, lastSlot) => {
        // Solo permitir consecutivos en la misma fecha
        if (newSlot.fecha !== lastSlot.fecha) return false;

        const lastIndex = slots.findIndex(s => s.key === lastSlot.key);
        const newIndex = slots.findIndex(s => s.key === newSlot.key);

        return Math.abs(newIndex - lastIndex) === 1;
    };

    const getSlotStyle = (slot) => {
        const isSelected = selectedSlots.some(s => s.key === slot.key);

        if (slot.ocupado) {
            return { backgroundColor: '#ffcccc', borderColor: '#ff0000' };
        } else if (isSelected) {
            return { backgroundColor: '#cce5ff', borderColor: '#0066cc' };
        } else if (slot.disponible) {
            return { backgroundColor: '#e6f7ff', borderColor: '#00aaff' };
        } else {
            return { backgroundColor: '#f0f0f0', borderColor: '#cccccc' };
        }
    };

    if (!selectedDoctor) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>
                    Selecciona un doctor para ver los horarios disponibles
                </Text>
            </View>
        );
    }
    
    

    if (loading) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>
                    Cargando horarios...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#ff0000' }}>
                    {error}
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === 'android' && (
                <Modal
                    visible={showDatePickerModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowDatePickerModal(false)}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                minimumDate={new Date()} // No permitir fechas pasadas
                            />
                        </View>
                    </View>
                </Modal>
            )}
            {Platform.OS === 'ios' && showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()} // No permitir fechas pasadas
                />
            )}
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                    Seleccionar Fecha y Horario
                </Text>

                <Text style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
                    Selecciona slots consecutivos disponibles para la fecha seleccionada
                </Text>

                {/* Selector de Fecha */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                        Selecciona una fecha
                    </Text>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: '#007bff',
                            borderRadius: 5,
                            padding: 10,
                            backgroundColor: '#007bff'
                        }}
                        onPress={showDatepicker}
                    >
                        <Text style={{ fontSize: 16, color: '#fff' }}>
                            {selectedDate.toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
                <View style={{ padding: 10 }}>
                    {slots.length > 0 ? (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                                Horarios Disponibles - {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {slots.map(slot => (
                                    <TouchableOpacity
                                        key={slot.key}
                                        style={{
                                            width: 80,
                                            height: 40,
                                            margin: 2,
                                            borderWidth: 1,
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            ...getSlotStyle(slot)
                                        }}
                                        onPress={() => handleSlotPress(slot)}
                                        disabled={!slot.disponible}
                                    >
                                        <Text style={{ fontSize: 12, textAlign: 'center' }}>
                                            {slot.hora_inicio}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
                            No hay horarios disponibles para la fecha seleccionada
                        </Text>
                    )}


                    {selectedSlots.length > 0 && (
                        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f8ff', borderRadius: 5 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                Slots Seleccionados: {selectedSlots.length}
                            </Text>
                            {selectedSlots.map(slot => (
                                <Text key={slot.key} style={{ fontSize: 14 }}>
                                    {new Date(slot.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })} {slot.hora_inicio} - {slot.hora_fin}
                                </Text>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

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


const AppointmentSlotSelectorMemo = React.memo(AppointmentSlotSelector);
export default AppointmentSlotSelectorMemo;
