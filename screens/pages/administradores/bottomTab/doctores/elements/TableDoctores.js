import React, { useEffect, useState } from 'react';
import {View, Alert, ScrollView} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";

export default function TableDoctores() {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [especialidades, setEspecialidades] = useState({});

    const fetchEspecialidades = async () => {
        const response = await ApiService.request('/especialidades');
        const especialidadesMap = {};
        response.forEach(esp => {
            especialidadesMap[esp.id] = esp.nombre;
        });
        setEspecialidades(especialidadesMap);
    };

    const fetchDoctores = async () => {
        const response = await ApiService.request('/doctores');
        const doctoresConEspecialidad = response.map(doctor => ({
            ...doctor,
            especialidad: especialidades[doctor.id_especialidades] || doctor.id_especialidades
        }));
        setData(doctoresConEspecialidad);
        setColumns(["nombres", "apellidos", "cedula", "especialidad", "horario"]);
    };

    useEffect(() => {
        fetchEspecialidades();
    }, []);

    useEffect(() => {
        fetchDoctores();
    }, [especialidades]);

    const handleView = (item) => {
        setDataToEdit(item);
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
                    fetchDoctores();
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Error al eliminar paciente");
            } finally {
                setVisible(false);
            }
        }
        deleteDoctor();
    };

    const handleSave = (item) => {
        const updateDoctor = async () => {
            try {
                let body = {
                    "nombres": item.nombres,
                    "apellidos": item.apellidos,
                    "cedula": item.cedula,
                    "fecha_nacimiento": item.fecha_nacimiento,
                    "id_especialidades": item.id_especialidades
                };


                const response = await ApiService.request(`/doctor/${item.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body)
                    ,
                });

                if (response) {
                    Alert.alert("Éxito", "Doctor actualizado correctamente");
                    fetchDoctores();
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Error al actualizar paciente");
            }finally {
                setVisible(false);
            }
        }
        updateDoctor();
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
                />

            )}
        </View>
    );
}
