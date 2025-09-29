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
        width: 200,
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        margin: 10,
    },
    title: {
        fontSize: 18,
        color: '#555',
        marginBottom: 8,
        fontWeight: '600',
    },
    number: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#222',
    },
});

export default CountCard;
