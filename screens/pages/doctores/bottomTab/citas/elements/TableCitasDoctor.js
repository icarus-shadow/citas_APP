 import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {View} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCardDoctor from "./InfoCardDoctor";
import CustomAlert from "../../../../../../components/CustomAlert";
import {fetchCitasDoctor} from "../../../../../../utils/slices/data/CitasDoctorSlice";
import {fetchCitasAsignadasCounter} from "../../../../../../utils/slices/counters/CitasAsignadasCounterSlice";

export default function TableCitasDoctor({ onView, refreshTrigger, pacienteOptions = [] }) {
    const dispatch = useDispatch();
    const citasDoctor = useSelector((state) => state.citasDoctor.citasDoctor);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);

    // Estados para la alerta personalizada
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        console.log('[TableCitasDoctor] useEffect - citasDoctor recibido:', citasDoctor);
        console.log('[TableCitasDoctor] citasDoctor es array?', Array.isArray(citasDoctor));
        if (citasDoctor) {
            console.log('[TableCitasDoctor] Total de citas antes de filtrar:', citasDoctor.length);
            console.log('[TableCitasDoctor] Citas sin filtrar:', citasDoctor.map(c => ({ id: c.id, tipo: c.tipo, estado: c.estado, fecha: c.fecha_cita, hora: c.hora_cita })));
            // Filtrar citas para mostrar solo citas de tipo "appointment"
            const filteredCitas = citasDoctor.filter(cita => cita.tipo === "appointment");
            console.log('[TableCitasDoctor] Citas después de filtrar (solo tipo appointment):', filteredCitas.length);
            console.log('[TableCitasDoctor] Citas filtradas:', filteredCitas.map(c => ({ id: c.id, tipo: c.tipo, estado: c.estado, fecha: c.fecha_cita, hora: c.hora_cita })));
            console.log('[TableCitasDoctor] Filtros aplicados en frontend: tipo === "appointment" (sin filtro por estado)');
            setData(filteredCitas);
            setColumns(["fecha_cita", "hora_cita", "lugar", "paciente"]);
        } else {
            console.log('[TableCitasDoctor] citasDoctor es null o undefined');
            setData([]);
        }
    }, [citasDoctor]);

    useEffect(() => {
        if (refreshTrigger > 0) {
            dispatch(fetchCitasDoctor());
        }
    }, [refreshTrigger, dispatch]);

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
                    setAlertType('success');
                    setAlertMessage('Cita eliminada correctamente');
                    setAlertVisible(true);
                    dispatch(fetchCitasDoctor());
                    console.log('[TableCitasDoctor] Despachando fetchCitasAsignadasCounter después de eliminar cita');
                    const doctorId = useSelector((state) => state.auth.user?.id);
                    if (doctorId) {
                        dispatch(fetchCitasAsignadasCounter(doctorId));
                    }
                }
            } catch (error) {
                setAlertType('error');
                setAlertMessage(error.message || 'Error al eliminar cita');
                setAlertVisible(true);
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
                    setAlertType('success');
                    setAlertMessage('Cita actualizada correctamente');
                    setAlertVisible(true);
                    dispatch(fetchCitasDoctor());
                    console.log('[TableCitasDoctor] Despachando fetchCitasAsignadasCounter después de actualizar cita');
                    const doctorId = useSelector((state) => state.auth.user?.id);
                    if (doctorId) {
                        dispatch(fetchCitasAsignadasCounter(doctorId));
                    }
                }
            } catch (error) {
                setAlertType('error');
                setAlertMessage(error.message || 'Error al actualizar cita');
                setAlertVisible(true);
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

            {/* Componente de alerta personalizada */}
            <CustomAlert
                visible={alertVisible}
                type={alertType}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
}