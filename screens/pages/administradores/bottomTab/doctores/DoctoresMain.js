import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Add from "../../../../../components/Buttons/Add";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableDoctores from "./elements/TableDoctores";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";

let col = colors;


export default function DoctoresMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    const [doctoresCount, setDoctoresCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [especialidades, setEspecialidades] = useState([]);
    const [formFields, setFormFields] = useState([]);

    useEffect(() => {
        setFormFields([
            {name: 'email', label: 'Email', type: 'email', required: true},
            {name: 'password', label: 'Contraseña', type: 'password', required: true, minLength: 6},
            {name: 'nombres', label: 'Nombres', type: 'text', required: true},
            {name: 'apellidos', label: 'Apellidos', type: 'text', required: true},
            {name: 'cedula', label: 'Cédula', type: 'text', required: true},
            {
                name: 'id_especialidades',
                label: 'Especialidad',
                type: 'select',
                required: true,
                options: especialidades.map(esp => ({value: esp.id, label: esp.nombre}))
            },
            {name: 'horario', label: 'Horario', type: 'text'},
            {name: 'lugar_trabajo', label: 'Lugar de Trabajo', type: 'text'},
        ]);
    }, [especialidades]);
    const fetchDoctoresCount = async () => {
        try {
            const response = await ApiService.request('/countDoctores');
            if (response.total === undefined) {
                console.log(`no hay doctores`);
                setDoctoresCount(0);
            } else {
                setDoctoresCount(response.total);
            }
        } catch (error) {
            console.error('Error fetching doctores count:', error);
        }
    };

    const fetchEspecialidades = async () => {
        try {
            const response = await ApiService.request('/especialidades');
            setEspecialidades(response);
        } catch (error) {
            console.error('Error fetching especialidades:', error);
        }
    };

    useEffect(() => {
        fetchDoctoresCount();
        fetchEspecialidades();
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
                cedula: formData.cedula,
                id_especialidades: formData.id_especialidades,
                horario: formData.horario,
                lugar_trabajo: formData.lugar_trabajo
            };

            const response = await ApiService.request('/registrar-doctor', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            if (response.doctor) {
                setModalVisible(false);
                Alert.alert("Éxito", "Doctor registrado correctamente");
                fetchDoctoresCount();
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Error al registrar doctor");
        }
    }


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>

            <View style={{ flex: 1, backgroundColor: col.background}}>
                <View style={styles.container(col)}>
                    <Add onPressed={handleNewPaciente}/>
                    <CountCard title="Doctores" number={doctoresCount} />
                </View>
                <TableDoctores />
                <DynamicFormModal
                    visible={modalVisible}
                    onCloses={handleCancel}
                    onSubmit={handleSubmit}
                    fields={formFields}
                    title="Nuevo Doctor"
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
