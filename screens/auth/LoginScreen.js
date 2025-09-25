import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../utils/slices/AuthSlice";
import {colors, darkColors} from "../../utils/desing/Colors";

let col = colors;

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? col = colors : col = darkColors;

    const dispatch = useDispatch();
    const { isLoading, error, token, user } = useSelector((state) => state.auth);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor completa todos los campos");
            return;
        }

        dispatch(login({ email, password }))
            .unwrap()
            .then(() => {
                Alert.alert("Éxito", "Inicio de sesión exitoso");
            })
            .catch((err) => {
                Alert.alert("Error de login", err || "Ocurrió un error al iniciar sesión");
            });
    };

    useEffect(() => {
        if (token && user) {
            console.log("✅ Usuario autenticado:", user.id_rol);
        }
    }, [token, user]);

    return (
        <SafeAreaView style={dynamicStyles.container(col)}>
            <View style={styles.formContainer}>
                <Text style={dynamicStyles.title(col)}>Login</Text>
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!isLoading}
                />
                <TouchableOpacity
                    style={[dynamicStyles.button(col), isLoading && { opacity: 0.5 }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={dynamicStyles.buttonText(col)}>
                        {isLoading ? "Cargando..." : "Login"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dynamicStyles.button(col)}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={dynamicStyles.buttonText(col)}>Registrarse</Text>
                </TouchableOpacity>
                {error && <Text style={dynamicStyles.errorText(col)}>{error}</Text>}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    formContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
});

const dynamicStyles = {
    buttonText: (col)=>( {
        color: col.text,
        fontSize: 16,
        fontWeight: "bold",
    }),
    button: (col)=> ({
        backgroundColor: col.accent,
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    }),
    input: (col)=> ({
        height: 50,
        borderWidth: 1,
        borderColor: col.primary,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
    }),

    errorText: (col) => ({
        color: col.errorResalt,
        textAlign: "center",
        marginTop: 10,
    }),

    container:(col) => ({
        flex: 1,
        backgroundColor: col.background,
    }),

    title: (col) => ({
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: col.text,
    }),
}

export default LoginScreen;
