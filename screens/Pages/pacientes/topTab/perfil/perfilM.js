import {View, Text, StyleSheet, ActivityIndicator, Alert} from "@react-native"
import {useState, useEffect} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from '../../../../../Src/services/Conexion'


export default function perfilM() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const cargarPerfil = async () => {
            try{
                const token = await AsyncStorage.getItem("userToken");
                if (!token){
                    Alert.alert("Error", "No hay token de usuario");
                    return;
                }
                const response = await api.get("/mi-perfil");
                setUsuario(response.data);
            } catch (error) {
                console.error("Error al cargar el perfil", error);
                if (error.isAuthError || error.shouldRedirectToLogin) {
                    console.log("Error de autenticacion manejado por el interceptor, redirigiendo al login")
                    return;
                }
                if (error.response) {
                    Alert.alert("Error del servidor",
                        `Error ${error.response.status}: 
                        ${error.response.data.message || "Ocurrio un error al cargar el perfil"}`,
                        [
                            {
                                Text: "Ok",
                                onPress: async () => {
                                    await AsyncStorage.removeItem("userToken");
                                }
                            }
                        ])
                }
            }
        }
    }
    )
}
