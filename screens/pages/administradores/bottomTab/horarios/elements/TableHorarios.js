import React, { useEffect, useState } from 'react';
import {View, Alert, ScrollView} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";

export default function TableHorarios() {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState(["dias", "hora_inicio", "hora_fin"]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);

    const fetchHorarios = async () => {
        try {
            const response = await ApiService.request('/horarios');
            
            if (Array.isArray(response)) {
                // Filter out invalid horarios (those without id or required fields)
                const validHorarios = response.filter(item => {
                    return item &&
                           item.id &&
                           item.dias &&
                           item.hora_inicio &&
                           item.hora_fin;
                });
                
                if (validHorarios.length !== response.length) {
                    console.warn(`Filtered out ${response.length - validHorarios.length} invalid horarios`);
                }
                
                setData(validHorarios);
            } else {
                setData([]);
            }
            
            setColumns(["dias", "hora_inicio", "hora_fin"]);
        } catch (error) {
            console.error('Error fetching horarios:', error);
            setData([]);
        }
    };
    useEffect(() => {
        fetchHorarios();
    }, []);

    const handleView = (item) => {
        if (!item || !item.id) {
            Alert.alert("Error", "No se puede mostrar: datos inválidos");
            return;
        }
        
        setDataToEdit(item);
        setVisible(true);
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
                    fetchHorarios();
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
                
                let body = {
                    "dias": item.dias,
                    "hora_inicio": item.hora_inicio,
                    "hora_fin": item.hora_fin
                };

                const response = await ApiService.request(`/horarios/${item.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body),
                });

                if (response) {
                    Alert.alert("Éxito", "Horario actualizado correctamente");
                    fetchHorarios();
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Error al actualizar horario");
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
