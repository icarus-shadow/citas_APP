import {View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableDinamic from "../../../../../components/TableDinamic";

let col = colors;

export default function NotificacionesMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    const [activeTab, setActiveTab] = useState('activas');
    const [counters, setCounters] = useState({pendientes: 0, aprobadas: 0, rechazadas: 0});
    const [activeData, setActiveData] = useState([]);
    const [historyData, setHistoryData] = useState([]);

    const fetchCounters = async () => {
        try {
            const response = await ApiService.request('/notificaciones/contadores');
            setCounters(response);
        } catch (error) {
            console.error('Error fetching counters:', error);
        }
    };

    const fetchActive = async () => {
        try {
            const response = await ApiService.request('/notificaciones/activas');
            const processed = response.data.map(item => ({
                ...item,
                doctor_name: item.doctor ? `${item.doctor.nombres} ${item.doctor.apellidos}` : 'Desconocido',
                slots_compacted: compactSlots(item.slots)
            }));
            setActiveData(processed);
        } catch (error) {
            console.error('Error fetching active notifications:', error);
            setActiveData([]);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await ApiService.request('/notificaciones/historial');
            const processed = response.data.map(item => ({
                ...item,
                doctor_name: item.doctor ? `${item.doctor.nombres} ${item.doctor.apellidos}` : 'Desconocido',
                slots_compacted: compactSlots(item.slots)
            }));
            setHistoryData(processed);
        } catch (error) {
            console.error('Error fetching history notifications:', error);
            setHistoryData([]);
        }
    };

    const compactSlots = (slots) => {
        if (typeof slots === 'string') {
            try {
                slots = JSON.parse(slots);
            } catch {
                return '';
            }
        }
        if (!slots || slots.length === 0) return '';
        const times = slots.map(slot => slot.hora).filter(t => t);
        const uniqueTimes = [...new Set(times)].sort();
        return uniqueTimes.join(', ');
    };


    useEffect(() => {
        fetchCounters();
        fetchActive();
        fetchHistory();
    }, []);

    const handleApprove = async (item) => {
        try {
            await ApiService.request(`/notificaciones/${item.id}/aprobar`, {method: 'POST'});
            Alert.alert("Éxito", "Notificación aprobada");
            fetchCounters();
            fetchActive();
            fetchHistory();
        } catch (error) {
            Alert.alert("Error", error.message || "Error al aprobar");
        }
    };

    const handleReject = async (item) => {
        try {
            await ApiService.request(`/notificaciones/${item.id}/rechazar`, {method: 'POST'});
            Alert.alert("Éxito", "Notificación rechazada");
            fetchCounters();
            fetchActive();
            fetchHistory();
        } catch (error) {
            Alert.alert("Error", error.message || "Error al rechazar");
        }
    };

    const handleDeleteHistory = async () => {
        Alert.alert(
            "Confirmar",
            "¿Está seguro de eliminar todo el historial?",
            [
                {text: "Cancelar", style: "cancel"},
                {text: "Eliminar", onPress: async () => {
                    try {
                        await ApiService.request('/notificaciones/historial', {method: 'DELETE'});
                        Alert.alert("Éxito", "Historial eliminado");
                        fetchCounters();
                        fetchHistory();
                    } catch (error) {
                        Alert.alert("Error", error.message || "Error al eliminar historial");
                    }
                }}
            ]
        );
    };

    const renderActiveActions = (item) => (
        <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleApprove(item)}>
                <Text style={styles.actionText}>Aprobar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleReject(item)}>
                <Text style={styles.actionText}>Rechazar</Text>
            </TouchableOpacity>
        </View>
    );

    const columns = ['doctor_name', 'fecha_solicitada', 'slots_compacted'];

    const columnLabels = {
        'doctor_name': 'Nombre Doctor',
        'fecha_solicitada': 'Fecha Solicitada',
        'slots_compacted': 'Horarios Apartados'
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: "30%", paddingTop: "15%", backgroundColor: col.background}}>
            <View style={{flex: 1, backgroundColor: col.background}}>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab(col), activeTab === 'activas' && styles.activeTab(col)]}
                        onPress={() => setActiveTab('activas')}
                    >
                        <Text style={[styles.tabText(col), activeTab === 'activas' && styles.activeTabText]}>Activas ({counters.pendientes})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab(col), activeTab === 'historial' && styles.activeTab(col)]}
                        onPress={() => setActiveTab('historial')}
                    >
                        <Text style={[styles.tabText(col), activeTab === 'historial' && styles.activeTabText]}>Historial ({counters.aprobadas + counters.rechazadas})</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.counters}>
                    <CountCard title="Pendientes" number={counters.pendientes} />
                    <CountCard title="Aprobadas" number={counters.aprobadas} />
                    <CountCard title="Rechazadas" number={counters.rechazadas} />
                </View>
                {activeTab === 'activas' ? (
                    <TableDinamic
                        columns={columns}
                        data={activeData}
                        renderActions={renderActiveActions}
                        columnLabels={columnLabels}
                    />
                ) : (
                    <View>
                        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteHistory}>
                            <Text style={styles.deleteText}>Eliminar Historial</Text>
                        </TouchableOpacity>
                        <TableDinamic
                            columns={columns}
                            data={historyData}
                            columnLabels={columnLabels}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    tab: (col) => ({
        flex: 1,
        padding: 10,
        alignItems: 'center',
        backgroundColor: col.surface || '#f0f0f0',
        marginHorizontal: 5,
        borderRadius: 5,
    }),
    activeTab: (col) => ({
        backgroundColor: col.primary || '#007bff',
    }),
    tabText: (col) => ({
        fontSize: 16,
        color: col.text || '#333',
    }),
    activeTabText: {
        color: '#fff',
    },
    counters: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    actionBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginHorizontal: 3,
    },
    approveBtn: {
        backgroundColor: '#28a745',
    },
    rejectBtn: {
        backgroundColor: '#dc3545',
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
    },
    deleteBtn: {
        backgroundColor: '#dc3545',
        padding: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});