import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {View, Alert, ScrollView, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { useDispatch } from 'react-redux';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";
import DynamicFormModal from "../../../../../../components/modals/DynamicFormModal";

const TableHorarios = forwardRef(function TableHorarios({ horarios, refreshHorarios }, ref) {
    useImperativeHandle(ref, () => ({
        refreshHorarios
    }));
    const dispatch = useDispatch();
    const [columns, setColumns] = useState(["nombre", "hora_inicio", "hora_fin", "dias"]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [selectedHorario, setSelectedHorario] = useState(null);


    const fetchDoctors = async () => {
        try {
            const response = await ApiService.request('/doctores');
            setDoctors(response || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([]);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleView = (item) => {
        if (!item || !item.id) {
            Alert.alert("Error", "No se puede mostrar: datos inválidos");
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
                Alert.alert("Éxito", "Horario asignado correctamente al doctor");
                refreshHorarios();
            }
        } catch (error) {
            if (error.conflictos && error.conflictos.length > 0) {
                // Mostrar detalles del conflicto
                const conflicto = error.conflictos[0];
                const diasMap = {
                    1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves',
                    5: 'Viernes', 6: 'Sábado', 7: 'Domingo'
                };
                Alert.alert(
                    "Conflicto de Horarios",
                    `No se puede asignar el horario "${selectedHorario.nombre}" porque hay un conflicto el ${diasMap[conflicto.dia]} con el horario "${conflicto.horario_conflictivo.horario_template}" (${conflicto.horario_conflictivo.hora_inicio} - ${conflicto.horario_conflictivo.hora_fin}).`
                );
            } else {
                Alert.alert("Error", error.message || "Error al asignar horario");
            }
        }
    };

    const handleDelete = () => {
        const deleteHorario = async () => {
            try {
                if (!dataToEdit || !dataToEdit.id) {
                    Alert.alert("Error", "No se puede eliminar: datos inválidos");
                    return;
                }
                
                const response = await ApiService.request(`/horarios/${dataToEdit.id}`, {
                    method: 'DELETE',
                });
                if (response) {
                    Alert.alert("Éxito", "Horario eliminado correctamente");
                    refreshHorarios();
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Error al eliminar horario");
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
                    Alert.alert("Error", "No se puede actualizar: datos inválidos");
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
                    Alert.alert("Éxito", "Plantilla de horario actualizada correctamente");
                    refreshHorarios();
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Error al actualizar plantilla de horario");
            } finally {
                setVisible(false);
            }
        }
        updateHorario();
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TableDinamic
                columns={columns}
                data={horarios}
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
        </View>
    );
});

export default TableHorarios;
