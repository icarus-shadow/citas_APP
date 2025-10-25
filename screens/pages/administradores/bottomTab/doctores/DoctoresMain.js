import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import {useSelector, useDispatch} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Add from "../../../../../components/Buttons/Add";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import TableDoctores from "./elements/TableDoctores";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";
import {fetchDoctores} from "../../../../../utils/slices/data/DoctoresSlice";
import {fetchDoctoresCounter} from "../../../../../utils/slices/counters/DoctoresCounterSlice";

let col = colors;


export default function DoctoresMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);
    const dispatch = useDispatch();
    const doctoresCount  = useSelector((state) => state.doctoresCounter.doctoresCount);
    const especialidades = useSelector((state) => state.especialidades.especialidades);
    const horarios       = useSelector((state) => state.horarios.horarios);

    const [modalVisible, setModalVisible] = useState(false);
    const [formFields, setFormFields] = useState([]);

    const actualizarInfo = () => {
      dispatch(fetchDoctores());
      dispatch(fetchDoctoresCounter());
      dispatch(fetchDoctores());
    }

    useEffect(() => {
        setFormFields([
            {name: 'email', label: 'Email', type: 'email', required: true},
            {name: 'password', label: 'Contraseña', type: 'text', secure: true, required: true, minLength: 6},
            {name: 'nombres', label: 'Nombres', type: 'text', required: true},
            {name: 'apellidos', label: 'Apellidos', type: 'text', required: true},
            {name: 'cedula', label: 'Cédula', type: 'number', required: true},
            {
                name: 'id_especialidades',
                label: 'Especialidad',
                type: 'select',
                required: true,
                options: especialidades.map(esp => ({value: esp.id, label: esp.nombre}))
            },
            {
                name: 'id_horario',
                label: 'Horario (Opcional)',
                type: 'select',
                required: false,
                options: [
                    {value: '', label: 'Sin horario'},
                    ...horarios.map(h => ({value: h.id, label: h.nombre}))
                ]
            },
            {name: 'lugar_trabajo', label: 'Lugar de Trabajo', type: 'text'},
        ]);
    }, [especialidades, horarios]);
    const handleNewDoctor = () => {
        setModalVisible(true);
    }
    const handleCancel = () => {
        setModalVisible(false);
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
                lugar_trabajo: formData.lugar_trabajo
            };

            // Solo incluir id_horario si se seleccionó uno
            if (formData.id_horario && formData.id_horario !== '') {
                userData.id_horario = formData.id_horario;
            }

            const response = await ApiService.request('/registrar-doctor', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            if (response.doctor) {
                setModalVisible(false);
                Alert.alert("Éxito", "Doctor registrado correctamente");
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
                Alert.alert("Error", error.message || "Error al registrar doctor");
            }
        }
    }


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>

            <View style={{ flex: 1, backgroundColor: col.background}}>
                <View style={styles.container(col)}>
                    <Add onPressed={handleNewDoctor}/>
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
