import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Add from "../../../../../components/Buttons/Add";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TablePacientes from "./elements/TablePacientes";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";

let col = colors;


export default function PacientesMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    const [pacientesCount, setPacientesCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const formFields = [
        {name: 'email', label: 'Email', type: 'email', required: true},
        {name: 'password', label: 'Contraseña', type: 'password', required: true, minLength: 6},
        {name: 'nombres', label: 'Nombres', type: 'text', required: true},
        {name: 'apellidos', label: 'Apellidos', type: 'text', required: true},
        {name: 'documento', label: 'Documento', type: 'text', required: true},
        {name: 'rh', label: 'RH', type: 'text', required: true},
        {name: 'fecha_nacimiento', label: 'Fecha de Nacimiento', type: 'date', required: true},
        {
            name: 'genero', label: 'Género', type: 'select', required: true, options: [
                {label: 'Masculino', value: 'M'},
                {label: 'Femenino', value: 'F'}
            ]
        },
        {name: 'edad', label: 'Edad', type: 'text', required: true},
        {name: 'telefono', label: 'Teléfono', type: 'text'},
        {name: 'alergias', label: 'Alergias', type: 'text'},
        {name: 'comentarios', label: 'Comentarios', type: 'text'},
    ];
    const fetchPacientesCount = async () => {
        try {
            const response = await ApiService.request('/countPacientes');
            if (response.total === undefined) {
                console.log(`no hay pacientes`);
                setPacientesCount(0);
            } else {
                setPacientesCount(response.total);
            }
        } catch (error) {
            console.error('Error fetching pacientes count:', error);
        }
    };
    useEffect(() => {
        fetchPacientesCount();
    }, []);

    const handleNewPaciente = () => {
        setModalVisible(true);
    }

    const handleCancel = () => {
        setModalVisible(false);
        console.log("cancel");
    }

    const handleSubmit = async (formData) => {
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

            const response = await ApiService.register(userData);
            if (response.paciente) {
                setModalVisible(false);
                Alert.alert("Éxito", "Paciente registrado correctamente");
                fetchPacientesCount();
            }
        } catch (error) {
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
});
