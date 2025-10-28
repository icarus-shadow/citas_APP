import React, { useEffect, useState } from 'react';
import {View, ScrollView} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";
import DynamicFormModal from "../../../../../../components/modals/DynamicFormModal";
import AppointmentSlotSelector from "../../../../../../components/AppointmentSlotSelector";
import CustomAlert from "../../../../../../components/CustomAlert";

export default function TableCitas() {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [pacientes, setPacientes] = useState({});
    const [doctores, setDoctores] = useState({});
    const [pacientesOptions, setPacientesOptions] = useState([]);
    const [doctoresOptions, setDoctoresOptions] = useState([]);

    // Estados para la alerta personalizada
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    const fetchPacientes = async () => {
        const response = await ApiService.request('/pacientes');
        const pacientesMap = {};
        response.forEach(pac => {
            pacientesMap[pac.id] = `${pac.nombres} ${pac.apellidos}`;
        });
        setPacientes(pacientesMap);
        setPacientesOptions(response);
    };

    const fetchDoctores = async () => {
        const response = await ApiService.request('/doctores');
        const doctoresMap = {};
        response.forEach(doc => {
            doctoresMap[doc.id] = `${doc.nombres} ${doc.apellidos}`;
        });
        setDoctores(doctoresMap);
        setDoctoresOptions(response);
    };

    const fetchCitas = async () => {
        const response = await ApiService.request('/citas');
        const citasConNombres = response.map(cita => ({
            ...cita,
            paciente: pacientes[cita.id_paciente] || cita.id_paciente,
            doctor: doctores[cita.id_doctor] || cita.id_doctor
        }));
        setData(citasConNombres);
        setColumns(["fecha_cita", "hora_cita", "lugar", "paciente", "doctor"]);

        const columnLabels = {
            'fecha_cita': 'Fecha Cita',
            'hora_cita': 'Hora Cita',
            'lugar': 'Lugar',
            'paciente': 'Paciente',
            'doctor': 'Doctor'
        };
    };

    useEffect(() => {
        fetchPacientes();
        fetchDoctores();
    }, []);

    useEffect(() => {
        if (Object.keys(pacientes).length > 0 && Object.keys(doctores).length > 0) {
            fetchCitas();
        }
    }, [pacientes, doctores]);

    const handleView = (item) => {
        setDataToEdit(item);
        setVisible(true);
    };

    const handleDelete = () => {
        const deleteCita = async () => {

            try {
                const response = await ApiService.request(`/citas/${dataToEdit.id}`, {
                    method: 'DELETE',
                });
                if (response) {
                    setAlertType('success');
                    setAlertMessage('Cita eliminado correctamente');
                    setAlertVisible(true);
                    fetchCitas();
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
                    "id_doctor": item.doctor,
                    "id_paciente": item.paciente,
                    "fecha_cita": item.fecha_cita,
                    "hora_cita": item.hora_cita,
                    "lugar": item.lugar,
                    "motivo": " ",
                };
                const response = await ApiService.request(`/citas/${item.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body)
                    ,
                });

                if (response) {
                    setAlertType('success');
                    setAlertMessage('Cita actualizado correctamente');
                    setAlertVisible(true);
                    fetchCitas();
                }
            } catch (error) {
                setAlertType('error');
                setAlertMessage(error.message || 'Error al actualizar cita');
                setAlertVisible(true);
            }finally {
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
                    data={dataToEdit}
                    visible={visible}
                    hiddenFields={["id", "updated_at", "created_at", "user_id"]}
                    onClose={() => setVisible(false)}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    pacienteOptions={pacientesOptions}
                    doctorOptions={doctoresOptions}
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
