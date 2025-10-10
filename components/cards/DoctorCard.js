import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, darkColors } from '../../utils/desing/Colors';

const DoctorCard = ({ doctor, onAgendarCita }) => {
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ?  colors : darkColors;

    return (
        <View style={[styles.card, { backgroundColor: col.background }]}>
            <View style={styles.infoContainer}>
                <Text style={[styles.name, { color: col.text }]}>
                    {doctor.nombres} {doctor.apellidos}
                </Text>
                <Text style={[styles.detail, { color: col.textResalt }]}>
                    Cédula: {doctor.cedula}
                </Text>
                <Text style={[styles.detail, { color: col.textResalt }]}>
                    Especialidad: {doctor.especialidad}
                </Text>
            </View>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: col.primary }]}
                onPress={() => onAgendarCita(doctor)}
            >
                <Text style={[styles.buttonText, { color: col.background }]}>
                    Apartar Cita
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        padding: 16,
        margin: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    detail: {
        fontSize: 14,
        marginBottom: 4,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default DoctorCard;