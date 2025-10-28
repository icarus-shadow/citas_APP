import React, { useEffect, useState } from 'react';
import {View, ScrollView, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";
import DynamicFormModal from "../../../../../../components/modals/DynamicFormModal";
import CustomAlert from "../../../../../../components/CustomAlert";
import {fetchHorarios} from "../../../../../../utils/slices/data/HorariosSlice";
import {fetchDoctores} from "../../../../../../utils/slices/data/DoctoresSlice";

export default function TableHorarios() {
    const dispatch = useDispatch();
    const horarios = useSelector((state) => state.horarios.horarios);
    const [columns, setColumns] = useState(["nombre", "hora_inicio", "hora_fin", "dias"]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [data, setData] = useState([]);

    // Estados para la alerta personalizada
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    const doctors = useSelector((state) => state.doctores.doctores);

    const completeHorarios = () => {
        const diasMap = {
            1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue',
            5: 'Vie', 6: 'Sáb', 7: 'Dom'
        };

        const horariosCompletos = horarios.map(horario => ({
            ...horario,
            dias: Array.isArray(horario.dias)
                ? horario.dias.map(dia => diasMap[dia]).join(', ')
                : horario.dias
        }));
        setData(horariosCompletos);
    };

    useEffect(() => {
        completeHorarios();
    }, [horarios]);

    const handleView = (item) => {
        if (!item || !item.id) {
            setAlertType('error');
            setAlertMessage('No se puede mostrar: datos inválidos');
            setAlertVisible(true);
            return;
        }
        setDataToEdit(item);
        setVisible(true);
    };

    const handleAssign = (item) => {
        setSelectedHorario(item);
        setAssignModalVisible(true);
    };

    const handleAssignSubmit = async (formData) => {
        try {
            const assignData = {
                id_horario: selectedHorario.id,
                id_doctor: formData.id_doctor
            };

            const response = await ApiService.request('/asignar-horario', {
                method: 'POST',
                body: JSON.stringify(assignData)
            });
            if (response) {
                setAssignModalVisible(false);
                setAlertType('success');
                setAlertMessage('Horario asignado correctamente al doctor');
                setAlertVisible(true);
                dispatch(fetchHorarios());
                dispatch(fetchDoctores());
            }
        } catch (error) {
            if (error.conflictos && error.conflictos.length > 0) {
                // Mostrar detalles del conflicto
                const conflicto = error.conflictos[0];
                const diasMap = {
                    1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves',
                    5: 'Viernes', 6: 'Sábado', 7: 'Domingo'
                };
                setAlertType('error');
                setAlertMessage(`No se puede asignar el horario "${selectedHorario.nombre}" porque hay un conflicto el ${diasMap[conflicto.dia]} con el horario "${conflicto.horario_conflictivo.horario_template}" (${conflicto.horario_conflictivo.hora_inicio} - ${conflicto.horario_conflictivo.hora_fin}).`);
                setAlertVisible(true);
            } else {
                setAlertType('error');
                setAlertMessage(error.message || 'Error al asignar horario');
                setAlertVisible(true);
            }
        }
    };

    const handleDelete = () => {
        const deleteHorario = async () => {
            try {
                if (!dataToEdit || !dataToEdit.id) {
                    setAlertType('error');
                    setAlertMessage('No se puede eliminar: datos inválidos');
                    setAlertVisible(true);
                    return;
                }

                const response = await ApiService.request(`/horarios/${dataToEdit.id}`, {
                    method: 'DELETE',
                });
                if (response) {
                    setAlertType('success');
                    setAlertMessage('Horario eliminado correctamente');
                    setAlertVisible(true);
                    dispatch(fetchHorarios());
                }
            } catch (error) {
                setAlertType('error');
                setAlertMessage(error.message || 'Error al eliminar horario');
                setAlertVisible(true);
            } finally {
                setVisible(false);
            }
        }
        deleteHorario();
    };

    const handleSave = (item) => {
        const updateHorario = async () => {
            try {
                if (!item || !item.id) {
                    setAlertType('error');
                    setAlertMessage('No se puede actualizar: datos inválidos');
                    setAlertVisible(true);
                    return;
                }

                // Convert dias string back to array for API
                let diasArray = [];
                if (typeof item.dias === 'string') {
                    // Convert "Lun, Mar, Mié" back to [1, 2, 3]
                    const diasMap = {
                        'Lun': 1, 'Mar': 2, 'Mié': 3, 'Jue': 4,
                        'Vie': 5, 'Sáb': 6, 'Dom': 7
                    };
                    diasArray = item.dias.split(', ').map(dia => diasMap[dia.trim()] || dia);
                } else {
                    diasArray = item.dias;
                }

                let body = {
                    "nombre": item.nombre,
                    "dias": diasArray,
                    "hora_inicio": item.hora_inicio,
                    "hora_fin": item.hora_fin
                };

                const response = await ApiService.request(`/horarios/${item.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body),
                });

                if (response) {
                    setAlertType('success');
                    setAlertMessage('Plantilla de horario actualizada correctamente');
                    setAlertVisible(true);
                    dispatch(fetchHorarios());
                }
            } catch (error) {
                setAlertType('error');
                setAlertMessage(error.message || 'Error al actualizar plantilla de horario');
                setAlertVisible(true);
            } finally {
                setVisible(false);
            }
        }
        updateHorario();
    };

    // Crear opciones para los selects
    const selectFields = {
        dias: {
            options: [
                { value: 1, label: 'Lunes' },
                { value: 2, label: 'Martes' },
                { value: 3, label: 'Miércoles' },
                { value: 4, label: 'Jueves' },
                { value: 5, label: 'Viernes' },
                { value: 6, label: 'Sábado' },
                { value: 7, label: 'Domingo' }
            ]
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TableDinamic
                columns={columns}
                data={data}
                onView={handleView}
                onAssign={handleAssign}
            />

            {visible && dataToEdit && (
                <InfoCard
                    data={dataToEdit}
                    visible={visible}
                    fieldsToShow={["nombre", "hora_inicio", "hora_fin", "dias"]}
                    hiddenFields={["id", "updated_at", "created_at", "user_id"]}
                    readOnlyFields={["id", "created_at", "updated_at"]}
                    selectFields={selectFields}
                    onClose={() => setVisible(false)}
                    onDelete={handleDelete}
                    onSave={handleSave}
                />

            )}

            <DynamicFormModal
                visible={assignModalVisible}
                onCloses={() => setAssignModalVisible(false)}
                onSubmit={handleAssignSubmit}
                fields={[
                    {
                        name: 'id_doctor',
                        label: 'Doctor',
                        type: 'select',
                        required: true,
                        options: doctors.filter(doctor => doctor && doctor.id && doctor.nombres && doctor.apellidos).map(doctor => ({
                            label: doctor.nombres + " " + doctor.apellidos,
                            value: doctor.id
                        }))
                    }
                ]}
                title="Asignar Horario a Doctor"
            />

            {/* Componente de alerta personalizada */}
            <CustomAlert
                visible={alertVisible}
                type={alertType}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
};

