import React, { useEffect, useState } from 'react';
import {View, ScrollView} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";
import DynamicFormModal from "../../../../../../components/modals/DynamicFormModal";
import AppointmentSlotSelector from "../../../../../../components/AppointmentSlotSelector";
import CustomAlert from "../../../../../../components/CustomAlert";
import {useDispatch, useSelector} from "react-redux";

export default function TableCitasAdmin() {
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [pacientesOptions, setPacientesOptions] = useState([]);
    const [doctoresOptions, setDoctoresOptions] = useState([]);

    // Estados para la alerta personalizada
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    const doctores = useSelector((state) => state.doctores.doctores);
    const pacientes = useSelector((state) => state.pacientes.pacientes);
    const citas = useSelector((state) => state.citas.citas);

    const fetchPacientes = async () => {
        try {
            const response = await ApiService.request('/pacientes');
            const formattedOptions = response.map(p => ({
                value: p.id.toString(),
                label: `${p.nombres} ${p.apellidos}`
            }));
            setPacientesOptions(formattedOptions);
        } catch (error) {
            console.error('Error al obtener pacientes:', error);
        }
    };

    const fetchDoctores = async () => {
        try {
            const response = await ApiService.request('/doctores');
            const formattedOptions = response.map(d => ({
                value: d.id.toString(),
                label: `${d.nombres} ${d.apellidos}`
            }));
            setDoctoresOptions(formattedOptions);
        } catch (error) {
            console.error('Error al obtener doctores:', error);
        }
    };

    const completeCitas = async () => {
        const citasConNombres = citas.map(cita => ({
            ...cita,
            paciente: pacientes.find(p => p.id === cita.id_paciente)?.nombres || cita.id_paciente,
            doctor: doctores.find(d => d.id === cita.id_doctor)?.nombres || cita.id_doctor
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

    const actualizarInfo = () => {
        completeCitas()
    }

    useEffect(() => {
        fetchPacientes();
        fetchDoctores();
    }, []);

    useEffect(() => {
        completeCitas()
    }, [citas]);

    useEffect(() => {
        if (Object.keys(pacientes).length > 0 && Object.keys(doctores).length > 0) {
            actualizarInfo();
        }
    }, [pacientes, doctores]);


    const handleView = (item) => {
        // Crear objeto con IDs para InfoCard
        const dataForCard = {
            ...item,
            paciente: item.id_paciente,
            doctor: item.id_doctor,
        };
        setDataToEdit(dataForCard);
        setVisible(true);
    };

    const handleDelete = () => {
        const deleteCita = async () => {

            try {
                const response = await ApiService.request(`/admin/citas/${dataToEdit.id}`, {
                    method: 'DELETE',
                });
                if (response) {
                    setAlertType('success');
                    setAlertMessage('Cita eliminado correctamente');
                    setAlertVisible(true);
                    actualizarInfo();
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
                const response = await ApiService.request(`/admin/citas/${item.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body)
                    ,
                });

                if (response) {
                    setAlertType('success');
                    setAlertMessage('Cita actualizado correctamente');
                    setAlertVisible(true);
                    actualizarInfo();
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