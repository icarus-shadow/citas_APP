import {View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity} from 'react-native';
import {useEffect, useState} from "react";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import ApiService from "../../../../../Src/services/api/Api";

// comonentes
import Add from "../../../../../components/Buttons/Add";
import CountCard from "../../../../../components/cards/CountCard";
import TablePacientes from "./elements/TablePacientes";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";
import DatePickerComponent from "../../../../../components/DatePickerComponent";

// slices
import {useDispatch, useSelector} from "react-redux";
import {fetchPacientesCounter} from "../../../../../utils/slices/counters/PacientesCounterSlice";
import {fetchPacientes} from "../../../../../utils/slices/data/PacientesSlice"

let col = colors;
export default function PacientesMain() {
    const dispatch = useDispatch();
    const pacientesCount = useSelector((state) => state.pacientesCounter.pacientesCount);

    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({});

    const formFields = [
        {name: 'email', label: 'Email', type: 'email', required: true},
        {name: 'password', label: 'Contraseña', type: 'text', secure: true, required: true, minLength: 6},
        {name: 'nombres', label: 'Nombres', type: 'text', required: true},
        {name: 'apellidos', label: 'Apellidos', type: 'text', required: true},
        {name: 'documento', label: 'Documento', type: 'number', required: true},
        {name: 'rh', label: 'RH', type: 'text', required: true},
        {
            name: 'fecha_nacimiento',
            label: 'Fecha de Nacimiento',
            type: 'custom',
            required: true,
            component: DatePickerComponent
        },
        {
            name: 'genero', label: 'Género', type: 'select', required: true, options: [
                {label: 'Masculino', value: 'M'},
                {label: 'Femenino', value: 'F'}
            ]
        },
        {name: 'edad', label: 'Edad', type: 'number', required: true},
        {name: 'telefono', label: 'Teléfono', type: 'text', keyboard: 'phone-pad'},
        {name: 'alergias', label: 'Alergias', type: 'textarea'},
        {name: 'comentarios', label: 'Comentarios', type: 'textarea'},
    ];

    const actualizarInformacion = () => {
        dispatch(fetchPacientesCounter());
        dispatch(fetchPacientes())
    }

    const handleNewPaciente = () => {
        setModalVisible(true);
    }

    const handleCancel = () => {
        setModalVisible(false);
        setFormData({}); // Reset form data on cancel
        console.log('Form cancelled and data reset');
    }



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

    const handleSubmit = async (formData) => {
        console.log('Submitting form data:', formData);

        // Validar campos con regex
        const validation = validatePaciente(formData);
        if (!validation.isValid) {
            Alert.alert("Error de validación", validation.error);
            return;
        }

        // Validate fecha_nacimiento
        if (!formData.fecha_nacimiento) {
            Alert.alert("Error", "La fecha de nacimiento es requerida");
            return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.fecha_nacimiento)) {
            Alert.alert("Error", "La fecha de nacimiento debe estar en formato YYYY-MM-DD");
            return;
        }
        try {
            const userData = {
                email: formData.email,
                password: formData.password,
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                documento: formData.documento,
                rh: formData.rh,
                fecha_nacimiento: formData.fecha_nacimiento,
                genero: formData.genero,
                edad: formData.edad,
                telefono: formData.telefono,
                alergias: formData.alergias,
                comentarios: formData.comentarios
            };
            console.log('Sending userData to API:', userData);
            const response = await ApiService.register(userData);
            if (response.paciente) {
                setModalVisible(false);
                setFormData({}); // Reset form data on success
                Alert.alert("Éxito", "Paciente registrado correctamente");
                actualizarInformacion();
            }
        } catch (error) {
            console.error('Error registering patient:', error);
            Alert.alert("Error", error.message || "Error al registrar paciente");
        }
    }


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>

            <View style={{ flex: 1, backgroundColor: col.background}}>
                <View style={styles.container(col)}>
                    <Add onPressed={handleNewPaciente}/>
                    <CountCard title="Pacientes" number={pacientesCount} />
                </View>
                <TablePacientes />
                <DynamicFormModal
                    visible={modalVisible}
                    onCloses={handleCancel}
                    onSubmit={handleSubmit}
                    fields={formFields}
                    title="Nuevo Paciente"
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:(col) => ({
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
    }),
    input: (col) => ({
        borderWidth: 1,
        borderColor: col.textResalt,
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        backgroundColor: col.background,
        color: col.text,
    }),
    selectContainer: {
        justifyContent: "center",
    },
});
