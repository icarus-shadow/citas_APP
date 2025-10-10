import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';

const TableDinamic = ({ columns, data, onView, onAssign, renderActions, columnLabels = {}, columnTypes = {} }) => {
    const renderCell = (value, type) => {
        if (type === 'date') {
            if (!value) return '';
            return new Date(value).toLocaleDateString();
        }
        return value;
    };

    const hasActions = renderActions || onView || onAssign;

    return (
        <ScrollView horizontal>
            <View>
                <View style={styles.headerRow}>
                    {columns.map((col, index) => (
                        <View key={index} style={[styles.cell, styles.headerCell]}>
                            <Text style={styles.headerText}>{columnLabels[col] || col}</Text>
                        </View>
                    ))}
                    {hasActions && (
                        <View style={[styles.cell, styles.headerCell]}>
                            <Text style={styles.headerText}>Acciones</Text>
                        </View>
                    )}
                </View>
                <FlatList
                    data={data}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            {columns.map((col, index) => (
                                <View key={index} style={styles.cell}>
                                    <Text style={styles.cellText}>{renderCell(item[col], columnTypes[col])}</Text>
                                </View>
                            ))}
                            {hasActions && (
                                <View style={[styles.cell, styles.actionsCell]}>
                                    {renderActions ? renderActions(item) : (
                                        <>
                                            <TouchableOpacity style={[styles.button, styles.viewBtn]} onPress={() => onView(item)}>
                                                <Text style={styles.buttonText}>Ver</Text>
                                            </TouchableOpacity>
                                            {onAssign && (
                                                <TouchableOpacity style={[styles.button, styles.assignBtn]} onPress={() => onAssign(item)}>
                                                    <Text style={styles.buttonText}>Asignar</Text>
                                                </TouchableOpacity>
                                            )}
                                        </>
                                    )}
                                </View>
                            )}
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
    assignBtn: {
        backgroundColor: '#28a745',
    },
});

export default TableDinamic;
