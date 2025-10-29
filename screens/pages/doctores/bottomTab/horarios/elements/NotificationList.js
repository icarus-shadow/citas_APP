import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, darkColors } from '../../../../../../utils/desing/Colors';
import { selectNotificacionesDoctorActiveData, selectNotificacionesDoctorHistoryData } from '../../../../../../utils/slices/data/NotificacionesDoctorSlice';

let col = colors;

export default function NotificationList() {
    const isDark = useSelector((state) => state.darkMode.value);
    col = isDark ? colors : darkColors;

    const activeData = useSelector(selectNotificacionesDoctorActiveData);
    const historyData = useSelector(selectNotificacionesDoctorHistoryData);

    // Combinar datos activos e históricos para mostrar todas las notificaciones
    const notificaciones = [...activeData, ...historyData];
    const loading = useSelector((state) => state.notificacionesDoctor.isLoading);

    const formatSlots = (slots) => {
        if (!Array.isArray(slots)) return 'Sin slots';
        return slots.map(slot => slot.hora).join(', ');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'pendiente':
                return '#FFA500'; // Orange
            case 'aprobada':
                return '#4CAF50'; // Green
            case 'rechazada':
                return '#F44336'; // Red
            default:
                return col.text;
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, { color: col.text }]}>Mis Solicitudes de Horarios</Text>
                <Text style={[styles.loadingText, { color: col.text }]}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: col.text }]}>Mis Solicitudes de Horarios</Text>
            {notificaciones.length === 0 ? (
                <Text style={[styles.emptyText, { color: col.text }]}>No tienes solicitudes de horarios.</Text>
            ) : (
                <ScrollView style={styles.listContainer}>
                    {notificaciones.map((notif) => (
                        <View key={notif.id} style={[styles.notificationItem, { backgroundColor: col.cardBackground }]}>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: col.text }]}>Fecha solicitada:</Text>
                                <Text style={[styles.value, { color: col.text }]}>{formatDate(notif.fecha_solicitada)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: col.text }]}>Slots:</Text>
                                <Text style={[styles.value, { color: col.text }]}>{formatSlots(notif.slots)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: col.text }]}>Estado:</Text>
                                <Text style={[styles.statusValue, { color: getEstadoColor(notif.estado) }]}>
                                    {notif.estado.charAt(0).toUpperCase() + notif.estado.slice(1)}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: col.text }]}>Fecha de creación:</Text>
                                <Text style={[styles.value, { color: col.text }]}>{formatDate(notif.created_at)}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    listContainer: {
        flex: 1,
    },
    notificationItem: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
    },
    value: {
        fontSize: 14,
        flex: 2,
        textAlign: 'right',
    },
    statusValue: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 2,
        textAlign: 'right',
    },
});