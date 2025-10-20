import {Text, View, Switch, TouchableOpacity, StyleSheet, Modal, TextInput, Button} from "react-native";
import DarkSwitch from "../../../../../components/DarkSwitch";
import {useSelector, useDispatch} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import React, {useEffect, useState} from "react";
import CustomAlert from "../../../../../components/CustomAlert";
import axios from 'axios';
import api from "../../../../../Src/services/api/Api";
import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { goToLogin } from "../../../../../Src/services/navigation/NavigationService";


import * as Notifications from "expo-notifications";
import { useFocusEffect } from '@react-navigation/native';

let col = colors;


export default function ConfiguracionMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    const dispatch = useDispatch();
    isDark ? (col = colors) : (col = darkColors);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");

    const [modalVisible, setModalVisible] = useState(false);
    const [current_password, setCurrent_password] = useState('');
    const [new_password, setNew_password] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [permisosNotificaciones, setPermisosNotificaciones] = useState(false)
    const [loading, setLoading] = useState(true);

    const showAlert = (type, message) => {
        setAlertType(type);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const checkPermisos = async () => {
        const { status } = await  Notifications.getPermissionsAsync();
        const preferencia = await AsyncStorage.getItem('notificaciones_activas');
        setPermisosNotificaciones(status === 'granted' && preferencia === 'true');
        setLoading(false);
    }
    useEffect(() => {
        checkPermisos();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            checkPermisos();
        }, [])
    )

    const toggleSwitch = async (valor) => {
        if (valor) {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                setPermisosNotificaciones(true);
                await AsyncStorage.setItem('notificaciones_activas', 'true')
                showAlert('success', 'notificaciones activadas')
            } else {
                await AsyncStorage.setItem('notificaciones_activas', 'false')
                setPermisosNotificaciones(false);
                showAlert('success', 'permiso denegado')
            }
        } else {
            await AsyncStorage.setItem('notificaciones_activas', 'false')
            setPermisosNotificaciones(false);
            showAlert('error', 'notificaciones desactivadas')
        }
    }


    const programarNotificacion = async () => {
        const { status } = await  Notifications.getPermissionsAsync();
        const preferencia = await  AsyncStorage.getItem('notificaciones_activas')
        if (status !== 'granted' || preferencia !== 'true') {
            console.log(status);
            showAlert('error', 'no tienes permisos para recibir notificaciones');
            return;
        }

        const trigger = new Date(Date.now() +  5 * 1000);

        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Notificacion programada',
                    body: 'aguacate con limon'
                },
                trigger
            });
            showAlert('success', 'notificacion programada  para 5 s');

        } catch (e) {
            showAlert('error', 'error al programar la noti');
            console.log(e);
        }
    }




    const handleEditPassword = () => {
        setModalVisible(true);
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitPassword = async () => {

        if (new_password !== confirmPassword) {
            showAlert('error', 'Las contraseñas no coinciden');
            return;
        }

        if (new_password.length < 6 || new_password.length > 20) {
            showAlert('error', 'La contraseña debe tener entre 6 y 20 caracteres');
            return;
        }

        setIsLoading(true);
        try {
            await api.changePassword( {
                current_password,
                new_password
            });

            showAlert('success', 'Contraseña actualizada correctamente');
            setModalVisible(false);
            setCurrent_password('');
            setNew_password('');
            setConfirmPassword('');
        } catch (error) {
            showAlert('error', error.response?.data?.message || 'la contraseña actual es incorrecta');
        } finally {
            setIsLoading(false);
        }
    };

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const deleteUser = async () => {
        if (!password) {
            showAlert('error', 'Por favor ingresa tu contraseña');
            return;
        }

        setDeleteLoading(true);
        try {
            const userData = await AsyncStorage.getItem('user_data');
            if (!userData) {
                throw new Error('No se encontró información del usuario');
            }
            const user = JSON.parse(userData);
            let endpoint = '/delete-account';

            const request = await api.deleteAccount({password});

            if (request.success) {
                await api.logout();
                showAlert('success', 'Cuenta eliminada correctamente');
                goToLogin();
            } else {
                showAlert('error', request.message);
            }
        } catch (error) {
            if (error.response?.status === 422) {
                showAlert('error', 'Contraseña incorrecta');
            } else if (error.response?.data?.message) {
                showAlert('error', error.response.data.message);
            } else {
                showAlert('error', 'Error al eliminar la cuenta. Intenta nuevamente.');
            }
        } finally {
            setDeleteLoading(false);
            setDeleteModalVisible(false);
            setPassword('');
        }
    };
    const handleDeleteAccount = () => {
        setDeleteModalVisible(true);
    };

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.backgroundResalt}}>
            <CustomAlert
                visible={alertVisible}
                type={alertType}
                message={alertMessage}
                durationInSec={2}
                onClose={() => setAlertVisible(false)}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, {backgroundColor: col.backgroundResalt}]}>
                        <Text style={[styles.modalTitle, {color: col.text}]}>¿Estás seguro?</Text>
                        <Text style={[styles.modalText, {color: col.text}]}>Esta acción eliminará permanentemente tu
                            cuenta</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, {backgroundColor: col.background, color: col.text}]}
                                placeholder="Ingresa tu contraseña"
                                placeholderTextColor={col.textSecondary}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                                              style={styles.eyeIcon}>
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24}
                                          color={col.text}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, {backgroundColor: col.background}]}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={[styles.buttonText, {color: col.text}]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, {backgroundColor: col.error}]}
                                onPress={deleteUser}
                                disabled={deleteLoading}
                            >
                                <Text style={[styles.buttonText, {color: col.text}]}>
                                    {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, {backgroundColor: col.backgroundResalt}]}>
                        <Text style={[styles.modalTitle, {color: col.text}]}>Cambiar Contraseña</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, {backgroundColor: col.background, color: col.text}]}
                                placeholder="Contraseña actual"
                                placeholderTextColor={col.textSecondary}
                                secureTextEntry={!showOldPassword}
                                value={current_password}
                                onChangeText={setCurrent_password}
                            />
                            <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}
                                              style={styles.eyeIcon}>
                                <Ionicons name={showOldPassword ? "eye-outline" : "eye-off-outline"} size={24}
                                          color={col.text}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, {backgroundColor: col.background, color: col.text}]}
                                placeholder="Nueva contraseña"
                                placeholderTextColor={col.textSecondary}
                                secureTextEntry={!showNewPassword}
                                value={new_password}
                                onChangeText={setNew_password}
                            />
                            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}
                                              style={styles.eyeIcon}>
                                <Ionicons name={showNewPassword ? "eye-outline" : "eye-off-outline"} size={24}
                                          color={col.text}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, {backgroundColor: col.background, color: col.text}]}
                                placeholder="Confirmar nueva contraseña"
                                placeholderTextColor={col.textSecondary}
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                              style={styles.eyeIcon}>
                                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={24}
                                          color={col.text}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, {backgroundColor: col.error}]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.buttonText, {color: col.text}]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, {backgroundColor: col.primary}]}
                                onPress={handleSubmitPassword}
                                disabled={isLoading}
                            >
                                <Text style={[styles.buttonText, {color: col.text}]}>
                                    {isLoading ? 'Guardando...' : 'Guardar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.switchContainer}>
                <DarkSwitch/>
            </View>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: col.primaryResalt}]}
                onPress={handleEditPassword}
            >
                <Text style={[styles.buttonText, {color: col.text}]}>Editar Contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: col.error}]}
                onPress={handleDeleteAccount}
            >
                <Text style={[styles.buttonText, {color: col.text}]}>Eliminar Cuenta</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 18, marginBottom: 10}}>
                Notificaciones: {permisosNotificaciones ? 'activadas' : 'desactivadas'}
            </Text>
            <Switch
                value = {permisosNotificaciones}
                onValueChange =  {toggleSwitch}
            />
            <TouchableOpacity
                style={[styles.button, {backgroundColor: col.error}]}
                onPress={programarNotificacion}
            >
                <Text style={[styles.buttonText, {color: col.text}]}>programar noti</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
        marginVertical: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        paddingRight: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{translateY: -12}],
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        padding: 10,
    },
    text: {
        marginRight: 10,
        fontSize: 16,
    },
    button: {
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
