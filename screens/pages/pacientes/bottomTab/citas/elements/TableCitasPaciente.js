import React, { useEffect, useState } from 'react';
import {View} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";

export default function TableCitasPaciente({ onView, refreshTrigger }) {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [doctores, setDoctores] = useState([]);

    const fetchPacientes = async () => {
        const response = await ApiService.request('/pacientes');
        setPacientes(response);
    };

    const fetchDoctores = async () => {
        try {
            console.log('[TableCitasPaciente] Obteniendo lista de doctores...');
            const response = await ApiService.getDoctores();
            console.log('[TableCitasPaciente] Respuesta de doctores:', response);
            if (Array.isArray(response)) {
                setDoctores(response);
                console.log(`[TableCitasPaciente] Doctores cargados: ${response.length}`);
                response.forEach(d => console.log(`Doctor: ${d.nombres} ${d.apellidos}`));
            } else {
                console.log('[TableCitasPaciente] Respuesta no es un array');
                setDoctores([]);
            }
        } catch (error) {
            console.error('[TableCitasPaciente] Error obteniendo doctores:', error);
            setDoctores([]);
        }
    };

    const fetchCitas = async () => {
        const response = await ApiService.getMisCitas();
        const citasConNombres = response.map(cita => ({
            ...cita,
            Doctor: `${cita.doctor.nombres} ${cita.doctor.apellidos}`
        }));
        setData(citasConNombres);
        setColumns(["fecha_cita", "hora_cita", "lugar", "Doctor"]);
    };

    useEffect(() => {
        fetchPacientes();
        fetchDoctores();
        fetchCitas();
    }, []);

    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchCitas();
        }
    }, [refreshTrigger]);

    const handleView = (item) => {
        console.log('[TableCitasPaciente] Mostrando detalles de cita:', item);
        console.log('[TableCitasPaciente] Estado de doctores:', doctores);
        setDataToEdit(item);
        setVisible(true);
        if (onView) onView(item);
    };

    const handleDelete = () => {
        const deleteCita = async () => {
            try {
                const response = await ApiService.request(`/citas/${dataToEdit.id}`, {
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
                    "id_doctor": item.doctor,
                    "fecha_cita": item.fecha_cita,
                    "hora_cita": item.hora_cita,
                    "lugar": item.lugar,
                    "motivo": item.motivo,
                };
                const response = await ApiService.request(`/citas/${item.id}`, {
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
                <InfoCard
                    data={{
                        ...dataToEdit,
                        paciente: dataToEdit.paciente ? `${dataToEdit.paciente.nombres} ${dataToEdit.paciente.apellidos}` : 'Sin paciente'
                    }}
                    visible={visible}
                    hiddenFields={["id", "updated_at", "created_at", "user_id", "id_paciente", "id_doctor"]}
                    readOnlyFields={["paciente"]}
                    doctorOptions={doctores.map(d => ({ label: `${d.nombres} ${d.apellidos}`.trim(), value: d.id }))}
                    onClose={() => setVisible(false)}
                    onDelete={handleDelete}
                    onSave={handleSave}
                />
            )}
        </View>
    );
}