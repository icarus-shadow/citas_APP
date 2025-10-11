import React, { useEffect, useState } from 'react';
import {View, Alert} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCardDoctor from "./InfoCardDoctor";

export default function TableCitasDoctor({ onView, refreshTrigger }) {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [pacientes, setPacientes] = useState([]);

    const fetchPacientes = async () => {
        try {
            console.log('[TableCitasDoctor] Obteniendo lista de pacientes...');
            const response = await ApiService.request('/doctorPacientes', { method: 'GET' });
            console.log('[TableCitasDoctor] Respuesta de pacientes:', response);
            if (Array.isArray(response)) {
                setPacientes(response);
                console.log(`[TableCitasDoctor] Pacientes cargados: ${response.length}`);
                response.forEach(p => console.log(`Paciente: ${p.nombres} ${p.apellidos}`));
            } else {
                console.log('[TableCitasDoctor] Respuesta no es un array');
                setPacientes([]);
            }
        } catch (error) {
            console.error('[TableCitasDoctor] Error obteniendo pacientes:', error);
            setPacientes([]);
        }
    };

    const fetchCitas = async () => {
        try {
            console.log('[TableCitasDoctor] Obteniendo citas del doctor...');
            const response = await ApiService.request('/doctorCitas', { method: 'GET' });
            console.log('[TableCitasDoctor] Respuesta de citas:', response);
            if (Array.isArray(response)) {
                const citasConNombres = response.map(cita => ({
                    ...cita,
                    Paciente: `${cita.paciente.nombres} ${cita.paciente.apellidos}`
                }));
                setData(citasConNombres);
                setColumns(["fecha_cita", "hora_cita", "lugar", "Paciente"]);
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
        fetchPacientes();
        fetchCitas();
    }, []);

    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchCitas();
        }
    }, [refreshTrigger]);

    const handleView = (item) => {
        console.log('[TableCitasDoctor] Mostrando detalles de cita:', item);
        console.log('[TableCitasDoctor] Estado de pacientes:', pacientes);
        setDataToEdit(item);
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
                    "id_paciente": item.paciente,
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
                    fetchPacientes();
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
                        ...dataToEdit,
                        doctor: dataToEdit.doctor ? `${dataToEdit.doctor.nombres} ${dataToEdit.doctor.apellidos}` : 'Sin doctor',
                        paciente: dataToEdit.paciente ? `${dataToEdit.paciente.nombres} ${dataToEdit.paciente.apellidos}` : 'Sin paciente'
                    }}
                    visible={visible}
                    hiddenFields={["id", "updated_at", "created_at", "user_id", "id_doctor"]}
                    readOnlyFields={["doctor"]}
                    pacienteOptions={pacientes.map(p => ({ label: `${p.nombres} ${p.apellidos}`.trim(), value: p.id }))}
                    onClose={() => setVisible(false)}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    title="Detalles de la Cita"
                />
            )}
        </View>
    );
}