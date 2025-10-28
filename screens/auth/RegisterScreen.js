import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useSelector, useDispatch} from "react-redux";
import {colors, darkColors} from "../../utils/desing/Colors";
import ApiService from "../../Src/services/api/Api";
import DatePickerComponent from "../../components/DatePickerComponent";
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({navigation}) => {

    let col = colors;
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? col = colors : col = darkColors;

    // Estados para navegación por pasos
    const [currentStep, setCurrentStep] = useState(1);
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const [verificationToken, setVerificationToken] = useState('');

    // Estados para Paso 1: Verificación de email
    const [email, setEmail] = useState('');
    const [sendingCode, setSendingCode] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [sendError, setSendError] = useState('');
    const [sendSuccess, setSendSuccess] = useState('');

    // Estados para Paso 2: Verificación del código
    const [verificationCode, setVerificationCode] = useState('');
    const [verifyingCode, setVerifyingCode] = useState(false);
    const [verifyError, setVerifyError] = useState('');
    const [verifySuccess, setVerifySuccess] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    // Estados para Paso 3: Datos personales
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [nombres, setNombres] = useState('');
    const [documento, setDocumento] = useState('');
    const [rh, setRh] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [genero, setGenero] = useState('M');
    const [edad, setEdad] = useState('');
    const [telefono, setTelefono] = useState('');
    const [alergias, setAlergias] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [registering, setRegistering] = useState(false);
    const [registerError, setRegisterError] = useState('');

    // Estados para rastrear campos inválidos
    const [invalidFields, setInvalidFields] = useState({});

    const dispatch = useDispatch();

    // Efecto para cooldown de reenviar código
    useEffect(() => {
        let interval;
        if (resendCooldown > 0) {
            interval = setInterval(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendCooldown]);

    // Función para enviar código de verificación
    const handleSendVerificationCode = async () => {
        if (!email.trim()) {
            setSendError('Por favor ingresa un email válido');
            return;
        }

        setSendingCode(true);
        setSendError('');
        setSendSuccess('');

        try {
            const result = await ApiService.sendVerificationCode(email);
            if (result.success) {
                setCodeSent(true);
                setSendSuccess('Código enviado exitosamente. Revisa tu email.');
                setResendCooldown(60); // 60 segundos de cooldown
            }
        } catch (err) {
            setSendError(err.message || 'Error al enviar el código');
        } finally {
            setSendingCode(false);
        }
    };

    // Función para verificar código
    const handleVerifyCode = async () => {
        if (!verificationCode.trim() || verificationCode.length !== 6) {
            setVerifyError('Por favor ingresa un código de 6 dígitos');
            return;
        }

        setVerifyingCode(true);
        setVerifyError('');
        setVerifySuccess('');

        try {
            const result = await ApiService.verifyCode(email, verificationCode);
            if (result.success) {
                setVerifiedEmail(email);
                setVerificationToken(result.token);
                setVerifySuccess('Código verificado exitosamente');
                setTimeout(() => {
                    setCurrentStep(3);
                }, 1000);
            }
        } catch (err) {
            setVerifyError(err.message || 'Código inválido o expirado');
        } finally {
            setVerifyingCode(false);
        }
    };

    // Función para reenviar código
    const handleResendCode = async () => {
        if (resendCooldown > 0) return;

        await handleSendVerificationCode();
    };

    // Función para registro final
    const handleFinalRegister = async () => {
        setRegisterError('');
        const newInvalidFields = {};

        // Validaciones básicas
        if (!password.trim()) newInvalidFields.password = true;
        if (!nombres.trim()) newInvalidFields.nombres = true;
        if (!apellidos.trim()) newInvalidFields.apellidos = true;
        if (!documento.trim()) newInvalidFields.documento = true;
        if (!rh.trim()) newInvalidFields.rh = true;
        if (!fechaNacimiento.trim()) newInvalidFields.fechaNacimiento = true;
        if (!edad.trim()) newInvalidFields.edad = true;

        if (Object.keys(newInvalidFields).length > 0) {
            setInvalidFields(newInvalidFields);
            setRegisterError('Por favor completa todos los campos obligatorios');
            return;
        }

        // Validación de nombres
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nombres.trim() || !nameRegex.test(nombres.trim())) {
            setInvalidFields({ ...newInvalidFields, nombres: true });
            setRegisterError('Los nombres deben contener solo letras, espacios y acentos.');
            return;
        }

        // Validación de apellidos
        if (!apellidos.trim() || !nameRegex.test(apellidos.trim())) {
            setInvalidFields({ ...newInvalidFields, apellidos: true });
            setRegisterError('Los apellidos deben contener solo letras, espacios y acentos.');
            return;
        }

        // Validación de documento
        const docRegex = /^\d+$/;
        if (!documento.trim() || !docRegex.test(documento.trim())) {
            setInvalidFields({ ...newInvalidFields, documento: true });
            setRegisterError('El documento debe ser un número válido.');
            return;
        }

        // Validación de RH
        const rhRegex = /^(a|b|ab|o)(\+|\-)$/i;
        if (!rh.trim() || !rhRegex.test(rh.trim())) {
            setInvalidFields({ ...newInvalidFields, rh: true });
            setRegisterError('El RH debe ser uno de los siguientes: a+, a-, b+, b-, ab+, ab-, o+, o-.');
            return;
        }

        // Validación de edad
        const ageRegex = /^\d+$/;
        if (!edad.trim() || !ageRegex.test(edad.trim())) {
            setInvalidFields({ ...newInvalidFields, edad: true });
            setRegisterError('La edad debe ser un número válido.');
            return;
        }

        // Limpiar campos inválidos si tdo está bien
        setInvalidFields({});

        setRegistering(true);

        try {
            const userData = {
                email: verifiedEmail,
                password,
                nombres,
                apellidos,
                documento,
                rh,
                fecha_nacimiento: fechaNacimiento,
                genero,
                edad: edad,
                telefono,
                alergias,
                comentarios,
                verification_token: verificationToken
            };

            const result = await ApiService.register(userData);
            if (result.paciente) {
                navigation.navigate('Login');
            }
        } catch (err) {
            setRegisterError(err.message || 'Error en el registro');
        } finally {
            setRegistering(false);
        }
    };

    // Función para renderizar indicadores de progreso
    const renderProgressIndicator = () => {
        return (
            <View style={styles.progressContainer}>
                {[1, 2, 3].map(step => (
                    <View key={step} style={styles.progressStepContainer}>
                        <View style={[
                            styles.progressStep,
                            {
                                backgroundColor: currentStep >= step ? col.accent : col.primary,
                                borderColor: col.accent
                            }
                        ]}>
                            <Text style={[
                                styles.progressStepText,
                                { color: currentStep >= step ? col.text : col.text }
                            ]}>
                                {step}
                            </Text>
                        </View>
                        <Text style={[styles.progressLabel, { color: col.text }]}>
                            {step === 1 ? 'Email' : step === 2 ? 'Código' : 'Registro'}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    // Renderizar Paso 1: Verificación de email
    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={dynamicStyles.title(col)}>Verificación de Email</Text>
            <Text style={[dynamicStyles.subtitle(col), { textAlign: 'center', marginBottom: 20 }]}>
                Ingresa tu email para recibir un código de verificación
            </Text>

            <TextInput
                style={dynamicStyles.input(col)}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {sendError ? <Text style={{color: 'red', marginBottom: 10}}>{sendError}</Text> : null}
            {sendSuccess ? <Text style={{color: 'green', marginBottom: 10}}>{sendSuccess}</Text> : null}

            <TouchableOpacity
                style={[dynamicStyles.button(col), sendingCode && { opacity: 0.6 }]}
                onPress={handleSendVerificationCode}
                disabled={sendingCode}
            >
                {sendingCode ? (
                    <ActivityIndicator color={col.text} />
                ) : (
                    <Text style={dynamicStyles.buttonText(col)}>
                        {codeSent ? 'Reenviar Código' : 'Enviar Código'}
                    </Text>
                )}
            </TouchableOpacity>

            {codeSent && (
                <TouchableOpacity
                    style={[dynamicStyles.button(col), { marginTop: 10 }]}
                    onPress={() => setCurrentStep(2)}
                >
                    <Text style={dynamicStyles.buttonText(col)}>Continuar</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    // Renderizar Paso 2: Verificación del código
    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={dynamicStyles.title(col)}>Verificación del Código</Text>
            <Text style={[dynamicStyles.subtitle(col), { textAlign: 'center', marginBottom: 20 }]}>
                Ingresa el código de 6 dígitos enviado a {email}
            </Text>

            <TextInput
                style={dynamicStyles.input(col)}
                placeholder="Código de verificación"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
                maxLength={6}
            />

            {verifyError ? <Text style={{color: 'red', marginBottom: 10}}>{verifyError}</Text> : null}
            {verifySuccess ? <Text style={{color: 'green', marginBottom: 10}}>{verifySuccess}</Text> : null}

            <TouchableOpacity
                style={[dynamicStyles.button(col), verifyingCode && { opacity: 0.6 }]}
                onPress={handleVerifyCode}
                disabled={verifyingCode}
            >
                {verifyingCode ? (
                    <ActivityIndicator color={col.text} />
                ) : (
                    <Text style={dynamicStyles.buttonText(col)}>Verificar Código</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[dynamicStyles.button(col), { marginTop: 10, opacity: resendCooldown > 0 ? 0.6 : 1 }]}
                onPress={handleResendCode}
                disabled={resendCooldown > 0}
            >
                <Text style={dynamicStyles.buttonText(col)}>
                    {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar Código'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[dynamicStyles.button(col), { marginTop: 10, backgroundColor: col.primary }]}
                onPress={() => setCurrentStep(1)}
            >
                <Text style={dynamicStyles.buttonText(col)}>Cambiar Email</Text>
            </TouchableOpacity>
        </View>
    );

    // Renderizar Paso 3: Datos personales
    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={dynamicStyles.title(col)}>Datos Personales</Text>
            <Text style={[dynamicStyles.subtitle(col), { textAlign: 'center', marginBottom: 20 }]}>
                Completa tu información personal
            </Text>

            <TextInput
                style={dynamicStyles.input(col)}
                placeholder="Email"
                value={verifiedEmail}
                editable={false}
            />

            <View style={[dynamicStyles.input(col, invalidFields.password), { flexDirection: 'row', alignItems: 'center' }]}>
                <TextInput
                    style={{ flex: 1, color: col.text }}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style={{ padding: 10 }}
                >
                    <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color={col.text} />
                </TouchableOpacity>
            </View>

            <TextInput
                style={dynamicStyles.input(col, invalidFields.nombres)}
                placeholder="Nombres"
                value={nombres}
                onChangeText={setNombres}
            />

            <TextInput
                style={dynamicStyles.input(col, invalidFields.apellidos)}
                placeholder="Apellidos"
                value={apellidos}
                onChangeText={setApellidos}
            />

            <TextInput
                style={dynamicStyles.input(col, invalidFields.documento)}
                placeholder="Documento"
                value={documento}
                onChangeText={setDocumento}
                keyboardType="numeric"
            />

            <TextInput
                style={dynamicStyles.input(col, invalidFields.rh)}
                placeholder="RH"
                value={rh}
                onChangeText={setRh}
            />

            <DatePickerComponent
                formData={{ fecha_nacimiento: fechaNacimiento }}
                name="fecha_nacimiento"
                onChange={(name, value) => setFechaNacimiento(value)}
            />

            <View style={{ marginBottom: 20 }} />

            <View style={[dynamicStyles.input(col), {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around'
            }]}>
                <TouchableWithoutFeedback onPress={() => setGenero('M')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: col.accent,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 5,
                        }}>
                            {genero === 'M' && <View style={{
                                height: 12,
                                width: 12,
                                borderRadius: 6,
                                backgroundColor: col.accent,
                            }}/>}
                        </View>
                        <Text style={{color: col.text}}>Masculino</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setGenero('F')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: col.accent,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 5,
                        }}>
                            {genero === 'F' && <View style={{
                                height: 12,
                                width: 12,
                                borderRadius: 6,
                                backgroundColor: col.accent,
                            }}/>}
                        </View>
                        <Text style={{color: col.text}}>Femenino</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>

            <TextInput
                style={dynamicStyles.input(col, invalidFields.edad)}
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

            {registerError ? <Text style={{color: 'red', marginBottom: 10}}>{registerError}</Text> : null}

            <TouchableOpacity
                style={[dynamicStyles.button(col), registering && { opacity: 0.6 }]}
                onPress={handleFinalRegister}
                disabled={registering}
            >
                {registering ? (
                    <ActivityIndicator color={col.text} />
                ) : (
                    <Text style={dynamicStyles.buttonText(col)}>Registrarse</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[dynamicStyles.button(col), { marginTop: 10, backgroundColor: col.primary }]}
                onPress={() => setCurrentStep(2)}
            >
                <Text style={dynamicStyles.buttonText(col)}>Atrás</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={dynamicStyles.container(col)} edges={['top', 'left', 'right']}>
            <ScrollView
                style={styles.scrollView}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {renderProgressIndicator()}

                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                <TouchableOpacity style={dynamicStyles.button(col)} onPress={() => navigation.navigate('Login')}>
                    <Text style={dynamicStyles.buttonText(col)}>Ya tengo cuenta - Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        padding: 20,
    },
    stepContainer: {
        flex: 1,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    progressStepContainer: {
        alignItems: 'center',
        flex: 1,
    },
    progressStep: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    progressStepText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
});

const dynamicStyles = {
    title: (col) => ({
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: col.text,
    }),
    subtitle: (col) => ({
        fontSize: 16,
        color: col.text,
        opacity: 0.8,
    }),
    input: (col, isInvalid = false) => ({
        height: 40,
        borderWidth: 1,
        borderColor: isInvalid ? 'red' : col.primary,
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
