import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CountCard = ({ title, number }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.number}>{number}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 100,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        margin: 5,
    },
    title: {
        fontSize: 12,
        color: '#555',
        marginBottom: 4,
        fontWeight: '600',
    },
    number: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
    },
});

export default CountCard;
