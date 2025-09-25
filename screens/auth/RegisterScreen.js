import React, {useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../utils/desing/Colors";



const RegisterScreen = ({navigation}) => {

    let col = colors;
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? col = colors : col = darkColors;


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombres, setNombres] = useState('');
    const [documento, setDocumento] = useState('');
    const [rh, setRh] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [genero, setGenero] = useState('');
    const [edad, setEdad] = useState('');
    const [telefono, setTelefono] = useState('');
    const [alergias, setAlergias] = useState('');
    const [apellidos, setApellidos] = useState('');

    const handleRegister = () => {
        console.log('Register pressed:', email, password);
        // TODO: Implementar lógica de registro
    };

    return (
        <SafeAreaView style={dynamicStyles.container(col)}>
            <ScrollView style={styles.scrollView}>
                <Text style={dynamicStyles.title(col)}>Registro</Text>

                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Nombres"
                    value={nombres}
                    onChangeText={setNombres}
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Apellidos"
                    value={apellidos}
                    onChangeText={setApellidos}
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Documento"
                    value={documento}
                    onChangeText={setDocumento}
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="RH"
                    value={rh}
                    onChangeText={setRh}
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Fecha de Nacimiento"
                    value={fechaNacimiento}
                    onChangeText={setFechaNacimiento}
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Género"
                    value={genero}
                    onChangeText={setGenero}
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Edad"
                    value={edad}
                    onChangeText={setEdad}
                    keyboardType="numeric"
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Teléfono"
                    value={telefono}
                    onChangeText={setTelefono}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={dynamicStyles.input(col)}
                    placeholder="Alergias"
                    value={alergias}
                    onChangeText={setAlergias}
                    multiline
                />

                <TouchableOpacity style={dynamicStyles.button(col)} onPress={handleRegister}>
                    <Text style={dynamicStyles.buttonText(col)}>Registrarse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={dynamicStyles.button(col)} onPress={() => navigation.navigate('Login')}>
                    <Text  style={dynamicStyles.buttonText(col)}>Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    scrollView: {
        padding: 20,
    },

});


const dynamicStyles = {
    title: (col) => ({
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: col.text,
    }),
    input: (col) => ({
        height: 40,
        borderWidth: 1,
        borderColor: col.primary,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        placeholderTextColor: col.text,
        color: col.text,

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
    container: (col) => ({
        flex: 1,
        backgroundColor: col.background,
    }),
}

export default RegisterScreen;
