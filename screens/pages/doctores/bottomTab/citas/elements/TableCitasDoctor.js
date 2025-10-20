import React, { useEffect, useState } from 'react';
import {View, Alert} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCardDoctor from "./InfoCardDoctor";

export default function TableCitasDoctor({ onView, refreshTrigger, pacienteOptions = [] }) {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);

    const fetchCitas = async () => {
        try {
            console.log('[TableCitasDoctor] Obteniendo citas del doctor...');
            const response = await ApiService.request('/doctorCitas', { method: 'GET' });
            console.log('[TableCitasDoctor] Respuesta de citas:', response);
            if (Array.isArray(response)) {
                setData(response);
                setColumns(["fecha_cita", "hora_cita", "lugar", "paciente"]);
                console.log(`[TableCitasDoctor] Citas cargadas: ${response.length}`);
            } else {
                console.log('[TableCitasDoctor] Respuesta no es un array');
                setData([]);
            }
        } catch (error) {
            console.error('[TableCitasDoctor] Error obteniendo citas:', error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchCitas();
    }, []);

    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchCitas();
        }
    }, [refreshTrigger]);

    const handleView = (item) => {
        console.log('[TableCitasDoctor] Mostrando detalles de cita:', item);
        console.log('[TableCitasDoctor] item keys:', Object.keys(item), 'item.paciente:', item.paciente, 'item.doctor:', item.doctor);
        console.log('[TableCitasDoctor] dataToEdit antes de set:', dataToEdit);
        setDataToEdit(item);
        console.log('[TableCitasDoctor] dataToEdit después de set:', item);
        setVisible(true);
        if (onView) onView(item);
    };

    const handleDelete = () => {
        const deleteCita = async () => {
            try {
                const response = await ApiService.request(`/doctorCitas/${dataToEdit.id}`, {
                    method: 'DELETE',
                });
                if (response) {
                    Alert.alert("Éxito", "Cita eliminada correctamente");
                    fetchCitas();
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Error al eliminar cita");
            } finally {
                setVisible(false);
            }
        }
        deleteCita();
    };

    const handleSave = (item) => {
        const updateCita = async () => {
            try {
                let body = {
                    "fecha_cita": item.fecha_cita,
                    "hora_cita": item.hora_cita,
                    "lugar": item.lugar,
                    "motivo": item.motivo,
                };
                const response = await ApiService.request(`/doctorCitas/${item.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body)
                });

                if (response) {
                    Alert.alert("Éxito", "Cita actualizada correctamente");
                    fetchCitas();
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Error al actualizar cita");
            } finally {
                setVisible(false);
            }
        }
        updateCita();
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TableDinamic
                columns={columns}
                data={data}
                onView={handleView}
            />

            {visible && dataToEdit && (
                <InfoCardDoctor
                    data={{
                        ...dataToEdit
                    }}
                    visible={visible}
                    hiddenFields={["id", "updated_at", "created_at", "user_id", "id_doctor"]}
                    readOnlyFields={["doctor", "paciente", "hora_cita"]}
                    showHorarios={true}
                    pacienteOptions={pacienteOptions}
                    onClose={() => setVisible(false)}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    title="Detalles de la Cita"
                />
            )}
        </View>
    );
}