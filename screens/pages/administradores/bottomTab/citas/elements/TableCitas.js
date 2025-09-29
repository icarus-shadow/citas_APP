import React, { useEffect, useState } from 'react';
import {View, Alert, ScrollView} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";

export default function TableCitas() {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [pacientes, setPacientes] = useState({});
    const [doctores, setDoctores] = useState({});

    const fetchPacientes = async () => {
        const response = await ApiService.request('/pacientes');
        const pacientesMap = {};
        response.forEach(pac => {
            pacientesMap[pac.id] = pac.apellidos;
        });
        setPacientes(pacientesMap);
    };

    const fetchDoctores = async () => {
        const response = await ApiService.request('/doctores');
        const doctoresMap = {};
        response.forEach(doc => {
            doctoresMap[doc.id] = doc.apellidos;
        });
        setDoctores(doctoresMap);
    };

    const fetchCitas = async () => {
        const response = await ApiService.request('/citas');
        const citasConNombres = response.map(cita => ({
            ...cita,
            apellidos_paciente: pacientes[cita.id_paciente] || cita.id_paciente,
            apellidos_doctor: doctores[cita.id_doctor] || cita.id_doctor
        }));
        setData(citasConNombres);
        setColumns(["fecha_cita", "hora_cita", "lugar", "apellidos_paciente", "apellidos_doctor"]);
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
                    Alert.alert("Éxito", "Cita eliminado correctamente");
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
                    "nombres": item.nombres,
                    "apellidos": item.apellidos,
                    "documento": item.documento,
                    "rh": item.rh,
                    "fecha_nacimiento": item.fecha_nacimiento,
                    "genero": item.genero,
                    "edad": item.edad,
                    "telefono": item.telefono,
                    "alergias": item.alergias,
                    "comentarios": item.comentarios
                };


                const response = await ApiService.request(`/citas/${item.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body)
                    ,
                });

                if (response) {
                    Alert.alert("Éxito", "Cita actualizado correctamente");
                    fetchCitas();
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Error al actualizar cita");
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
                />

            )}
        </View>
    );
}
