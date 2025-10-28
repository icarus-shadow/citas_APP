import React, { useEffect, useState } from 'react';
import {View, Alert, ScrollView} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";

import {useDispatch, useSelector} from "react-redux";
import {fetchPacientes, selectPacientes} from "../../../../../../utils/slices/data/PacientesSlice"
import {fetchPacientesCounter} from "../../../../../../utils/slices/counters/PacientesCounterSlice";


export default function TablePacientes() {
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);

    const dispatch = useDispatch();
    const pacientes = useSelector((state) => state.pacientes.pacientes);

    const updateData = () => {
        dispatch(fetchPacientes())
        dispatch(fetchPacientesCounter())
        dispatch(fetchPacientes())
    }

    useEffect(() => {
        updateData();
        setColumns(["nombres", "apellidos", "documento", "rh", "fecha_nacimiento"]);
    },[])

    const handleView = (item) => {
        setDataToEdit(item);
        setVisible(true);
    };

    const handleDelete = () => {
        const deletePaciente = async () => {
            try {
                const response = await ApiService.request(`/pacientes/${dataToEdit.id}`, {
                    method: 'DELETE',
                });
                if (response) {
                    Alert.alert("Éxito", "Paciente eliminado correctamente");
                    updateData();
                }
            } catch (error) {
                Alert.alert("Error", error.message || "Error al eliminar paciente");
            } finally {
                setVisible(false);
            }
        }
        deletePaciente();
    };

    const validatePaciente = (item) => {
        // Validación de nombres
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!item.nombres || !nameRegex.test(item.nombres)) {
            return { isValid: false, error: "Los nombres deben contener solo letras, espacios y acentos." };
        }

        // Validación de apellidos
        if (!item.apellidos || !nameRegex.test(item.apellidos)) {
            return { isValid: false, error: "Los apellidos deben contener solo letras, espacios y acentos." };
        }

        // Validación de documento
        const docRegex = /^\d+$/;
        if (!item.documento || !docRegex.test(item.documento)) {
            return { isValid: false, error: "El documento debe ser un número válido." };
        }

        // Validación de RH
        const rhRegex = /^(a|b|ab|o)(\+|\-)$/i;
        if (!item.rh || !rhRegex.test(item.rh)) {
            return { isValid: false, error: "El RH debe ser uno de los siguientes: a+, a-, b+, b-, ab+, ab-, o+, o-." };
        }

        // Validación de edad
        const ageRegex = /^\d+$/;
        if (!item.edad || !ageRegex.test(item.edad)) {
            return { isValid: false, error: "La edad debe ser un número válido." };
        }

        return { isValid: true, error: "" };
    };

    const handleSave = async (item) => {
        const validation = validatePaciente(item);
        if (!validation.isValid) {
            Alert.alert("Error de validación", validation.error);
            return false;
        }

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


            const response = await ApiService.request(`/pacientes/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify(body),
            });

            if (response) {
                Alert.alert("Éxito", "Paciente actualizado correctamente");
                updateData();
                return true;
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Error al actualizar paciente");
            return false;
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TableDinamic
                columns={columns}
                data={pacientes}
                onView={handleView}
            />

            {visible && dataToEdit && (
                    <InfoCard
                        data={dataToEdit}
                        visible={visible}
                        hiddenFields={["id", "updated_at", "created_at", "user_id"]}
                        fieldsToShow={["nombres", "apellidos", "documento", "rh", "fecha_nacimiento", "genero", "edad", "telefono", "alergias", "comentarios"]}
                        onClose={() => setVisible(false)}
                        onDelete={handleDelete}
                        onSave={handleSave}
                    />

            )}
        </View>
    );
}
