import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, darkColors } from '../../../../../../utils/desing/Colors';
import ApiService from '../../../../../../Src/services/api/Api';

const ScheduleDisplay = () => {
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;

    const diasSemana = [
        { numero: 1, nombre: 'Lunes' },
        { numero: 2, nombre: 'Martes' },
        { numero: 3, nombre: 'Miércoles' },
        { numero: 4, nombre: 'Jueves' },
        { numero: 5, nombre: 'Viernes' },
        { numero: 6, nombre: 'Sábado' },
        { numero: 0, nombre: 'Domingo' },
    ];

    useEffect(() => {
        fetchHorarios();
    }, []);

    const fetchHorarios = async () => {
        try {
            const data = await ApiService.getMisHorarios();
            setHorarios(data);
        } catch (error) {
            console.error('Error fetching horarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupByDia = () => {
        const grouped = {};
        diasSemana.forEach(dia => {
            grouped[dia.numero] = horarios.filter(h => h.dia === dia.numero);
        });
        return grouped;
    };

    const groupedHorarios = groupByDia();

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: col.background }]}>
                <Text style={[styles.loadingText, { color: col.text }]}>Cargando horarios...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: col.background }]}>
            <Text style={[styles.title, { color: col.text }]}>Mi Horario Semanal</Text>

            {diasSemana.map(dia => (
                <View key={dia.numero} style={[styles.diaContainer, { backgroundColor: col.backgroundResalt }]}>
                    <Text style={[styles.diaTitle, { color: col.text }]}>{dia.nombre}</Text>

                    {groupedHorarios[dia.numero].length > 0 ? (
                        <View style={styles.slotsContainer}>
                            {groupedHorarios[dia.numero].map((slot, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.slotItem,
                                        {
                                            backgroundColor: slot.disponible ? col.primary : col.error,
                                            opacity: slot.disponible ? 1 : 0.7
                                        }
                                    ]}
                                >
                                    <Text style={[styles.slotText, { color: 'white' }]}>
                                        {slot.hora_inicio} - {slot.hora_fin}
                                    </Text>
                                    <Text style={[styles.statusText, { color: 'white' }]}>
                                        {slot.disponible ? 'Disponible' : 'Ocupado'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={[styles.noSlotsText, { color: col.textResalt }]}>
                            No hay horarios asignados
                        </Text>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 50,
    },
    diaContainer: {
        marginBottom: 15,
        borderRadius: 10,
        padding: 15,
    },
    diaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    slotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    slotItem: {
        padding: 8,
        borderRadius: 6,
        margin: 2,
        minWidth: 100,
        alignItems: 'center',
    },
    slotText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusText: {
        fontSize: 12,
    },
    noSlotsText: {
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 10,
    },
});

export default ScheduleDisplay;