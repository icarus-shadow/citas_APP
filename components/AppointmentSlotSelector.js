import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ApiService from '../Src/services/api/Api';

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function AppointmentSlotSelector({ formData, onSlotsSelected, selectedDoctor: propSelectedDoctor }) {
    console.log('[AppointmentSlotSelector] Re-render triggered');
    console.log('[AppointmentSlotSelector] Props:', { formData, onSlotsSelected, propSelectedDoctor });
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Mantener selectedDoctor estable
    useEffect(() => {
        const newDoctor = propSelectedDoctor || formData?.id_doctor;
        console.log('[AppointmentSlotSelector] Checking selectedDoctor update, newDoctor:', newDoctor, 'current:', selectedDoctor);
        if (newDoctor && newDoctor !== selectedDoctor) {
            console.log('[AppointmentSlotSelector] Updating selectedDoctor to:', newDoctor);
            setSelectedDoctor(newDoctor);
        }
    }, [propSelectedDoctor, formData?.id_doctor]);

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

            // Formatear fecha para la API
            const dateStr = selectedDate.toISOString().split('T')[0];
            const slotsResponse = await ApiService.getAvailableSlots(selectedDoctor, dateStr, dateStr);
            console.log(`[AppointmentSlotSelector] Slots obtenidos: ${slotsResponse.length}`);

            // Procesar slots disponibles
            const processedSlots = slotsResponse.map(slot => ({
                id: slot.id,
                fecha: slot.fecha,
                hora_inicio: slot.hora_inicio,
                hora_fin: slot.hora_fin,
                disponible: slot.disponible,
                ocupado: !slot.disponible,
                key: `${slot.fecha}-${slot.hora_inicio}`
            }));

            // Ordenar por hora
            processedSlots.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

            setSlots(processedSlots);
            console.log('[AppointmentSlotSelector] Slots procesados correctamente');
        } catch (err) {
            console.error('[AppointmentSlotSelector] Error al obtener slots:', err.message);
            setError('Error al cargar los horarios disponibles');
            Alert.alert('Error', 'No se pudieron cargar los horarios disponibles');
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
        setShowDatePicker(Platform.OS === 'ios');
        setSelectedDate(currentDate);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const handleSlotPress = async (slot) => {
        console.log('[AppointmentSlotSelector] handleSlotPress called with selectedDoctor:', selectedDoctor, 'slot:', slot);
        if (!slot.disponible) return;

        // Validar slot en tiempo real
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const validation = await ApiService.validateSlot(selectedDoctor, dateStr, slot.hora_inicio);
            if (!validation.available) {
                Alert.alert('Slot no disponible', 'Este horario ya ha sido reservado. Por favor selecciona otro.');
                // Recargar slots para actualizar disponibilidad
                fetchSlots();
                return;
            }
        } catch (err) {
            console.error('[AppointmentSlotSelector] Error validando slot:', err.message);
            Alert.alert('Error', 'No se pudo validar la disponibilidad del horario');
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
                    Alert.alert('Selección inválida', 'Los slots deben ser consecutivos');
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
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                    Seleccionar Fecha y Horario
                </Text>

                {/* Selector de Fecha */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                        Selecciona una fecha
                    </Text>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 5,
                            padding: 10,
                            backgroundColor: '#f9f9f9'
                        }}
                        onPress={showDatepicker}
                    >
                        <Text style={{ fontSize: 16 }}>
                            {selectedDate.toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            minimumDate={new Date()} // No permitir fechas pasadas
                        />
                    )}
                </View>

                <Text style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
                    Selecciona slots consecutivos disponibles para la fecha seleccionada
                </Text>

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
    );
}


const AppointmentSlotSelectorMemo = React.memo(AppointmentSlotSelector);
export default AppointmentSlotSelectorMemo;
