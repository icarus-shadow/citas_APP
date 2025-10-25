import React, { useEffect, useState } from 'react';
import {View, Alert, ScrollView} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";

import {useSelector, useDispatch} from "react-redux";
import {fetchDoctoresCounter} from "../../../../../../utils/slices/counters/DoctoresCounterSlice";
import {fetchDoctores} from "../../../../../../utils/slices/data/DoctoresSlice";
import {selectDoctoresLoading} from "../../../../../../utils/slices/data/DoctoresSlice";

export default function TableDoctores() {
    const dispatch = useDispatch();

    const doctores = useSelector((state) => state.doctores.doctores);
    const especialidades = useSelector((state) => state.especialidades.especialidades);
    const horarios = useSelector((state) => state.horarios.horarios);
    const isLoadingDoctores = useSelector(selectDoctoresLoading);
    const isLoadingDoctoresCounter = useSelector((state) => state.doctoresCounter.isLoading);

    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [data, setData] = useState([]);

    const actualizarInfo = async () => {
        try {
            await dispatch(fetchDoctoresCounter());
            await dispatch(fetchDoctores());
        } catch (error) {
            console.error('Error en actualizarInfo:', error);
        }
    }

    const completeDoctores = async () => {
        // Crear mapa de especialidades usando reduce para acceso rápido por ID
        const especialidadesMap = especialidades.reduce((acc, esp) => {
            acc[esp.id] = esp.nombre;
            return acc;
        }, {});
        

        const doctoresConEspecialidad = doctores.map(doctor => {
            const horariosAsignadosArray = doctor.horarios_asignados && doctor.horarios_asignados.length > 0
                ? doctor.horarios_asignados.map(nombre => {
                    const horario = horarios.find(h => h.nombre === nombre);
                    return horario ? { id: horario.id, nombre: horario.nombre } : null;
                }).filter(h => h !== null)
                : [];
            return {
                ...doctor,
                especialidad: especialidadesMap[doctor.id_especialidades] || String(doctor.id_especialidades),
                horarios_asignados: horariosAsignadosArray,
                horarios_asignados_display: horariosAsignadosArray.length > 0
                    ? horariosAsignadosArray.map(h => h.nombre).join(', ')
                    : 'Sin horarios asignados',
                // Campos que se convierten en selects al editar (usar nombres diferentes para evitar conflicto)
                especialidad_select: doctor.id_especialidades || '',
            };
        });
        setData(doctoresConEspecialidad);
    };

    useEffect(() => {
        setColumns(["nombres", "apellidos", "cedula", "especialidad", "horarios_asignados_display"]);
    }, []);

    useEffect(() => {
        if (Object.keys(especialidades).length > 0 && horarios.length > 0 && !isLoadingDoctores && !isLoadingDoctoresCounter) {
            completeDoctores();
        }
    }, [especialidades, horarios, isLoadingDoctores, doctores]);

    const handleView = (item) => {
        setDataToEdit({ ...item, especialidad: item.id_especialidades });
        setVisible(true);
    };

    const handleDelete = () => {
        const deleteDoctor = async () => {
            try {
                const response = await ApiService.request(`/doctor/${dataToEdit.id}`, {
                    method: 'DELETE',
                });
                if (response) {
                    Alert.alert("Éxito", "Doctor eliminado correctamente");
                    actualizarInfo();
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Error al eliminar paciente");
            } finally {
                setVisible(false);
            }
        }
        deleteDoctor();
    };

    const handleSave = async (item) => {
        try {
            let body = {};

            // Solo incluir campos que cambiaron
            if (item.nombres !== dataToEdit.nombres) body.nombres = item.nombres;
            if (item.apellidos !== dataToEdit.apellidos) body.apellidos = item.apellidos;
            if (item.documento !== dataToEdit.cedula) body.cedula = item.documento;
            if (item.lugar_trabajo !== dataToEdit.lugar_trabajo) body.lugar_trabajo = item.lugar_trabajo;

            // Solo incluir especialidad si se cambió
            if (item.especialidad !== undefined && item.especialidad !== dataToEdit.id_especialidades) {
                body.especialidad = item.especialidad;
            }

            // Si no hay cambios, no enviar petición
            if (Object.keys(body).length === 0) {
                actualizarInfo();
                setVisible(false);
                return;
            }

            const response = await ApiService.request(`/doctor/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify(body)
            });

            if (response) {
                Alert.alert("Éxito", "Doctor actualizado correctamente");
                actualizarInfo();
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
                    `No se puede asignar el horario porque hay un conflicto el ${diasMap[conflicto.dia]}.`
                );
            } else {
                Alert.alert("Error", error.message || "Error al actualizar doctor");
            }
        } finally {
            setVisible(false);
        }
    };

    // Crear opciones para los selects
    const selectFields = {
        especialidad: {
            options: especialidades.map(esp => ({
                value: esp.id,
                label: esp.nombre
            }))
        },
        horario: {
            options: [
                { value: '', label: 'Sin horario asignado' },
                ...horarios.map(h => ({ value: h.id, label: h.nombre }))
            ]
        }
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
                    hiddenFields={["id", "updated_at", "created_at", "user_id", "horarios_asignados", "id_especialidades", "id_horario", "especialidad_display", "horario", "especialidad_select", "horarios_asignados_display"]}
                    selectFields={selectFields}
                    availableHorarios={horarios}
                    showHorarios={true}
                    fieldsToShow={["nombres", "apellidos", "documento", "especialidad"]}
                    onClose={() => setVisible(false)}
                    onDelete={handleDelete}
                    onSave={handleSave}
                />

            )}
        </View>
    );
}
