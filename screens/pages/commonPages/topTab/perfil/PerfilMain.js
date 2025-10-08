
import React, {useState, useEffect} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../../../../Src/services/api/Api";
import CustomAlert from "../../../../../components/CustomAlert";
import DynamicFormModal from "../../../../../components/modals/DynamicFormModal";
import {View, Text, StyleSheet, ScrollView, ActivityIndicator, Modal, TextInput, TouchableOpacity} from "react-native";
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import {goToLogin} from "../../../../../Src/services/navigation/NavigationService";



export default function PerfilMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");

    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [formData, setFormData] = useState({});

    const {user} = useSelector(state => state.auth);

    const showAlert = (type, message) => {
        setAlertType(type);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const [usuario, setUsuario] = useState(null);
    const [email, setEmail] = useState("");
    const [especialidades, setEspecialidades] = useState([]);

    const rol = user.id_rol;

    const cargarPerfil = async () => {
        try{
            const token = await Api.getToken();
            if (!token){
                showAlert("error", "No hay token de usuario");
                return;
            }
            let response;
            const userA = await Api.getCurrentUser("/user");
            setEmail(userA.email);

            console.log(rol);
            if (rol === 1) {
                response = await Api.getPaciente("/mi-perfil");
            } else if (rol === 2) {
                response = await Api.getDoctor("/mi-perfil-doctor");
                const espResponse = await Api.getEspecialidades();
                setEspecialidades(espResponse);
            } else if (rol === 3) {
                response = await Api.getAdmin("/mi-perfil-admin");
            } else {
                console.error("[perfilMain] Rol no valido");
                return;
            }

            setUsuario(response);

        } catch (error) {
            console.error("[perfilMain] Error al cargar el perfil", error);
            if (error.isAuthError || error.shouldRedirectToLogin) {
                console.log("[perfilMain] Error de autenticacion manejado por el interceptor, redirigiendo al login")
                return;
            }
            if (error.response) {
                showAlert("error", error.response.data.message);
            }
        }
    }
    useEffect(() => {
        cargarPerfil();
    }, [])

    return (
        <ScrollView style={styles.container(col)}>
            <CustomAlert
                visible={alertVisible}
                type={alertType}
                message={alertMessage}
                durationInSec={2}
                onClose={() => setAlertVisible(false)}
            />
            {!usuario ? (
                <ActivityIndicator size="large" color={col.primary}/>
            ) : (
                <View style={styles.profileContainer(col)}>
                    <Text style={styles.title(col)}>Perfil de Usuario</Text>
                    <Text style={styles.label(col)}>Email:</Text>
                    <Text style={styles.text(col)}>{email}</Text>
                    <Text style={styles.label(col)}>Nombres:</Text>
                    <Text style={styles.text(col)}>{usuario.nombres}</Text>
                    <Text style={styles.label(col)}>Apellidos:</Text>
                    <Text style={styles.text(col)}>{usuario.apellidos}</Text>
                    <Text style={styles.label(col)}>Documento:</Text>
                    <Text style={styles.text(col)}>{usuario.cedula}</Text>
                    <Text style={styles.label(col)}>Teléfono:</Text>
                    <Text style={styles.text(col)}>{usuario.telefono}</Text>
                    {usuario.especialidades && (
                        <>
                            <Text style={styles.label(col)}>Especialidades:</Text>
                            <Text style={styles.text(col)}>{usuario.especialidades}</Text>
                        </>
                    )}
                </View>
            )}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button(col), styles.buttonHalf]}
                                  onPress={() => setIsEditModalVisible(true)}>
                    <Text style={styles.buttonText(col)}>Editar Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button(col), styles.buttonHalf]}
                                  onPress={() => setIsLogoutModalVisible(true)}>
                    <Text style={styles.buttonText(col)}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={isLogoutModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer(col)}>
                    <View style={styles.modalContent(col)}>
                        <Text style={styles.modalText(col)}>¿Está seguro que desea cerrar sesión?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton(col)} onPress={async () => {
                                await Api.request('/logout', {method: 'POST'});
                                goToLogin()
                                setIsLogoutModalVisible(false);
                            }}>
                                <Text style={styles.buttonText(col)}>Confirmar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton(col)}
                                              onPress={() => setIsLogoutModalVisible(false)}>
                                <Text style={styles.buttonText(col)}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <DynamicFormModal
                visible={isEditModalVisible}
                title="Editar Perfil"
                fields={[
                    {name: "nombres", label: "Nombres", type: "text", placeholder: "Ingrese nombres"},
                    {name: "apellidos", label: "Apellidos", type: "text", placeholder: "Ingrese apellidos"},
                    {name: "telefono", label: "Teléfono", type: "text", placeholder: "Ingrese teléfono", keyboard: "phone-pad"},
                    // ...(rol === 2 ? [{
                    //     name: "especialidades",
                    //     label: "Especialidades",
                    //     placeholder: "Ingrese especialidades"
                    // }] : [])
                ]}
                initialData={usuario}
                onCloses={() => setIsEditModalVisible(false)}
                
                onSubmit={async (data) => {
                    try {
                        console.log(rol);
                        let endpoint = rol === 1 ? '/mi-perfil' :
                            rol === 2 ? '/mi-perfil-doctor' : '/mi-perfil-admin';
                        await Api.request(endpoint, {
                            method: 'PUT',
                            body: JSON.stringify(data)
                        });
                        showAlert("success", "Perfil actualizado correctamente");
                        cargarPerfil();
                        setIsEditModalVisible(false);
                    } catch (error) {
                        showAlert("error", error.message);
                    }
                }}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    buttonHalf: {
        flex: 0.48,
    },
    container: (col) => ({
        backgroundColor: col.secondary,
        flex: 1,
        padding: 20,
    }),
    profileContainer: (col) => ({
        backgroundColor: col.background,
        padding: 15,
        borderRadius: 10,
        shadowColor: col.backgroundResalt,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }),
    title: (col) => ({
        color: col.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    }),
    label: (col) => ({
        color: col.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    }),
    text: (col) => ({
        color: col.text,
        fontSize: 16,
        marginBottom: 10,
    }),
    button: (col) => ({
        backgroundColor: col.accent,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    }),
    buttonText: (col) => ({
        color: col.text,
        fontSize: 16,
        fontWeight: 'bold',
    }),
    modalContainer: (col) => ({
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    }),
    modalContent: (col) => ({
        backgroundColor: col.background,
        padding: 20,
        borderRadius: 10,
        width: '80%',
    }),
    modalText: (col) => ({
        color: col.text,
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    }),
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalButton: (col) => ({
        backgroundColor: col.accent,
        padding: 10,
        borderRadius: 5,
        width: '40%',
    }),
});
