import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';

const TableDinamic = ({ columns, data, onView }) => {
    return (
        <ScrollView horizontal>
            <View>
                <View style={styles.headerRow}>
                    {columns.map((col, index) => (
                        <View key={index} style={[styles.cell, styles.headerCell]}>
                            <Text style={styles.headerText}>{col}</Text>
                        </View>
                    ))}
                    <View style={[styles.cell, styles.headerCell]}>
                        <Text style={styles.headerText}>Acciones</Text>
                    </View>
                </View>
                <FlatList
                    data={data}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            {columns.map((col, index) => (
                                <View key={index} style={styles.cell}>
                                    <Text style={styles.cellText}>{item[col]}</Text>
                                </View>
                            ))}
                            <View style={[styles.cell, styles.actionsCell]}>
                                <TouchableOpacity style={[styles.button, styles.viewBtn]} onPress={() => onView(item)}>
                                    <Text style={styles.buttonText}>Ver</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cell: {
        minWidth: 110,
        padding: 10,
        justifyContent: 'center',
    },
    headerCell: {
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
    },
    headerText: {
        fontWeight: 'bold',
        color: '#333',
    },
    cellText: {
        color: '#555',
        textAlign: 'flex-start',
    },
    actionsCell: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        minWidth: 240,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginHorizontal: 3,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    viewBtn: {
        backgroundColor: '#17a2b8',
    },
});

export default TableDinamic;
