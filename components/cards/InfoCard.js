import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { useSelector } from "react-redux";
import { colors, darkColors } from "../../utils/desing/Colors";
import ApiService from "../../Src/services/api/Api";
import DateSlotSelectorModal from "../modals/DateSlotSelectorModal";

const InfoCard = ({
    data,
    hiddenFields = [],
    visible,
    onClose,
    onDelete,
    onSave,
    selectFields = {},
    readOnlyFields = [],
    availableHorarios = [],
    showHorarios = false,
    pacienteOptions = [],
    doctorOptions = [],
    fieldsToShow = ["lugar", "paciente", "doctor", "fecha_cita", "hora_cita"]
}) => {
    const [editStates, setEditStates] = useState({});
    const [values, setValues] = useState(data);
    const [modified, setModified] = useState(false);

    // Calculate if there are changes dynamically
    const hasChanges = () => {
        // Check if any field values changed
        const fieldChanged = Object.keys(values).some(key => {
            if (fieldsToShow.includes(key) && data[key] !== values[key]) return true;
        });

        // Check if schedules changed
        const originalIds = originalHorarios.map(h => h.id).sort();
        const currentIds = assignedHorarios.map(h => h.id).sort();
        const schedulesChanged = JSON.stringify(originalIds) !== JSON.stringify(currentIds);


        return fieldChanged || schedulesChanged;
    };
    const [errors, setErrors] = useState({});
    const [assignedHorarios, setAssignedHorarios] = useState([]);
    const [originalHorarios, setOriginalHorarios] = useState([]);
    const [showHorarioModal, setShowHorarioModal] = useState(false);
    const [showDateSlotModal, setShowDateSlotModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    // const [localSelectFields, setLocalSelectFields] = useState(selectFields);
    const [originalValues, setOriginalValues] = useState({});
    const localSelectFields = useMemo(() => {
        const newFields = { ...selectFields };
        if (pacienteOptions.length > 0) {
            newFields.paciente = {
                options: pacienteOptions.map(p => ({ value: p.id, label: `${p.nombres} ${p.apellidos}` }))
            };
        }
        if (doctorOptions.length > 0) {
            newFields.doctor = {
                options: doctorOptions.map(d => ({ value: d.id, label: `${d.nombres} ${d.apellidos}` }))
            };
        }
        return newFields;
    }, [selectFields, pacienteOptions, doctorOptions]);

    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;

    useEffect(() => {
        // Initialize values with IDs for select fields
        const initialValues = { ...data };
        if (data.id_paciente && !data.paciente) initialValues.paciente = data.id_paciente;
        if (data.id_doctor && !data.doctor) initialValues.doctor = data.id_doctor;
        setValues(initialValues);
        setOriginalValues(initialValues);
        setEditStates({});
        setModified(false);
        setErrors({});
        // Initialize assigned horarios from data
        if (data?.horarios_asignados && Array.isArray(data.horarios_asignados)) {
            if (data.horarios_asignados.length > 0 && typeof data.horarios_asignados[0] === 'string') {
                // Map horario names to full objects from availableHorarios
                const mappedHorarios = data.horarios_asignados
                    .map(name => availableHorarios.find(h => h.nombre === name))
                    .filter(Boolean); // Remove any undefined results
                setAssignedHorarios(mappedHorarios);
                setOriginalHorarios([...mappedHorarios]); // Keep track of original state
            } else if (data.horarios_asignados.length > 0 && typeof data.horarios_asignados[0] === 'object' && data.horarios_asignados[0].id && data.horarios_asignados[0].nombre) {
                // Map partial objects (id and nombre) to full objects from availableHorarios
                const mappedHorarios = data.horarios_asignados
                    .map(partial => availableHorarios.find(h => h.id === partial.id))
                    .filter(Boolean); // Remove any undefined results
                setAssignedHorarios(mappedHorarios);
                setOriginalHorarios([...mappedHorarios]); // Keep track of original state
            } else {
                setAssignedHorarios(data.horarios_asignados);
                setOriginalHorarios([...data.horarios_asignados]); // Keep track of original state
            }
        } else {
            setAssignedHorarios([]);
            setOriginalHorarios([]);
        }
    }, [data, visible]);

    // Filter available horarios (exclude already assigned ones)
    const availableHorariosFiltered = useMemo(() => {
        if (availableHorarios.length > 0) {
            const assignedIds = assignedHorarios.map(h => h.id);
            return availableHorarios.filter(h => !assignedIds.includes(h.id));
        }
        return [];
    }, [availableHorarios, assignedHorarios]);


    const validateField = (key, value) => {
        const newErrors = { ...errors };
        if (key === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
            newErrors[key] = 'Email inválido';
        } else if (key === 'telefono' && value && !/^\d{10}$/.test(value)) {
            newErrors[key] = 'Teléfono debe tener 10 dígitos';
        } else if (key === 'fecha_cita' && value) {
            const today = new Date().toISOString().split('T')[0];
            if (value < today) {
                newErrors[key] = 'La fecha debe ser hoy o futura';
            } else {
                delete newErrors[key];
            }
        } else if (key === 'hora_cita' && value && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
            newErrors[key] = 'Hora inválida';
        } else {
            delete newErrors[key];
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const toggleEdit = (key) => {
        setEditStates((prev) => ({ ...prev, [key]: !prev[key] }));
        setModified(true);
    };

    const handleChange = (key, value) => {
        setValues((prev) => ({ ...prev, [key]: value }));
        setModified(true);
        validateField(key, value);
        if (key === 'doctor' && value !== originalValues.doctor && fieldsToShow.includes('doctor')) {
            setSelectedDoctor(value);
            setShowDateSlotModal(true);
        }
    };

    const proceedSave = async () => {
        try {
            // Calculate which schedules were added and removed
            const originalIds = originalHorarios.map(h => h.id);
            const currentIds = assignedHorarios.map(h => h.id);

            const addedHorarios = assignedHorarios.filter(h => !originalIds.includes(h.id));
            const removedHorarios = originalHorarios.filter(h => !currentIds.includes(h.id));

            // Unassign removed schedules
            for (const horario of removedHorarios) {
                await ApiService.request('/desasignar-horario', {
                    method: 'POST',
                    body: JSON.stringify({
                        id_horario: horario.id,
                        id_doctor: data.id
                    })
                });
            }

            // Assign new schedules (they were already validated when added)
            for (const horario of addedHorarios) {
                await ApiService.request('/asignar-horario', {
                    method: 'POST',
                    body: JSON.stringify({
                        id_horario: horario.id,
                        id_doctor: data.id
                    })
                });
            }
            // Close the modal after successful save
            onClose();
            // Refresh data if needed
            if (onSave) {
                onSave({ ...values, horarios_asignados: assignedHorarios });
            }
        } catch (error) {
            Alert.alert("Error", "Error al guardar los cambios");
        }
    };

    const handleSave = async () => {
        const hasErrors = Object.keys(values).some(key => fieldsToShow.includes(key) && !validateField(key, values[key]));
        if (!hasErrors) {
            const criticalChange = (fieldsToShow.includes('doctor') && values.doctor !== originalValues.doctor) || (fieldsToShow.includes('fecha_cita') && values.fecha_cita !== originalValues.fecha_cita);
            if (criticalChange) {
                Alert.alert(
                    "Confirmar Cambios",
                    "Estás cambiando doctor o fecha de la cita. ¿Confirmar?",
                    [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Confirmar", onPress: proceedSave }
                    ]
                );
            } else {
                await proceedSave();
            }
        }
    };

    const addHorario = async (horario) => {
        try {
            // First check for conflicts with currently assigned horarios in frontend
            const hasFrontendConflict = checkFrontendConflicts(horario);
            if (hasFrontendConflict) {
                Alert.alert(
                    "Conflicto de Horarios",
                    `No se puede asignar "${horario.nombre}" porque hay un conflicto con horarios ya asignados en esta sesión.`
                );
                return;
            }

            // Then check for conflicts with database
            const result = await ApiService.request('/verificar-conflicto-horario', {
                method: 'POST',
                body: JSON.stringify({
                    id_doctor: data.id,
                    id_horario: horario.id
                })
            });

            if (result.conflictos && result.conflictos.length > 0) {
                // Show conflict details
                const conflicto = result.conflictos[0];
                const diasMap = {
                    1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves',
                    5: 'Viernes', 6: 'Sábado', 7: 'Domingo'
                };
                Alert.alert(
                    "Conflicto de Horarios",
                    `No se puede asignar "${horario.nombre}" porque hay un conflicto el ${diasMap[conflicto.dia]}.`
                );
                return;
            }

            // No conflicts, add the horario
            setAssignedHorarios(prev => [...prev, horario]);
            setModified(true);
            setShowHorarioModal(false);
        } catch (error) {
            Alert.alert("Error", "Error al verificar conflictos");
        }
    };

    const checkFrontendConflicts = (newHorario) => {
        // Check if the new horario conflicts with any currently assigned horarios
        for (const assigned of assignedHorarios) {
            if (horariosConflict(newHorario, assigned)) {
                return true;
            }
        }
        return false;
    };

    const horariosConflict = (horario1, horario2) => {
        // Check if they share any days
        const days1 = horario1.dias || [];
        const days2 = horario2.dias || [];
        const sharedDays = days1.filter(day => days2.includes(day));
        if (sharedDays.length === 0) return false;

        // Parse times for proper comparison
        const parseTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes; // Convert to minutes since midnight
        };

        const start1 = parseTime(horario1.hora_inicio);
        const end1 = parseTime(horario1.hora_fin);
        const start2 = parseTime(horario2.hora_inicio);
        const end2 = parseTime(horario2.hora_fin);

        // Check time overlap: two time ranges overlap if one starts before the other ends
        // and ends after the other starts
        return (start1 < end2 && end1 > start2);
    };

    const removeHorario = (horarioId) => {
        setAssignedHorarios(prev => prev.filter(h => h.id !== horarioId));
        setModified(true);
    };

    const initials = `${data?.nombres?.[0] || ""}${data?.apellidos?.[0] || ""}`;

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContainer(col)}>
                    <View style={styles.header}>
                        <View style={styles.avatarContainer(col)}>
                            <Ionicons name="person-circle" size={60} color={col.text} />
                            <View style={styles.initialsOverlay(col)}>
                                <Text style={styles.initialsText(col)}>{initials}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                            <Ionicons name="trash" size={24} color={col.error} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.fieldsContainer}>
                            {fieldsToShow
                                .filter((key) => !hiddenFields.includes(key) && data.hasOwnProperty(key))
                                .map((key) => {
                                    const isSelect = localSelectFields[key];
                                    return (
                                        <View key={key} style={styles.fieldContainer}>
                                            <Text style={styles.fieldLabel(col)}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                            <View style={styles.inputContainer}>
                                                {key === 'doctor' && !editStates[key] ? (
                                                    <Text style={styles.textInput(col, editStates[key])}>
                                                        {data.doctor ? `${data.doctor.nombres} ${data.doctor.apellidos}` : 'Sin doctor'}
                                                    </Text>
                                                ) : isSelect ? (
                                                    editStates[key] ? (
                                                        <View style={styles.pickerContainer(col, editStates[key])}>
                                                            <Picker
                                                                enabled={!!editStates[key]}
                                                                selectedValue={(values?.[key] ?? '').toString()}
                                                                onValueChange={(val) => handleChange(key, val)}
                                                                style={styles.picker(col, editStates[key])}
                                                                dropdownIconColor={col.primary}
                                                            >
                                                                {isSelect.options?.map((option) => (
                                                                    <Picker.Item
                                                                        key={option.value}
                                                                        label={option.label}
                                                                        value={option.value}
                                                                        color={col.text}
                                                                    />
                                                                ))}
                                                            </Picker>
                                                        </View>
                                                    ) : (
                                                        <Text style={styles.textInput(col, editStates[key])}>
                                                            {isSelect.options?.find(opt => opt.value != null && opt.value.toString() === (values?.[key] ?? '').toString())?.label || 'No seleccionado'}
                                                        </Text>
                                                    )
                                                ) : (
                                                    <TextInput
                                                        editable={!!editStates[key]}
                                                        value={(() => {
                                                            const val = values?.[key]?.toString();
                                                            console.log(`[InfoCard] key: ${key}, value:`, values?.[key], `type: ${typeof values?.[key]}, toString: ${val}`);
                                                            if (key === 'paciente') {
                                                                console.log(`[InfoCard] Nombre del paciente mostrado: ${val}`);
                                                            }
                                                            return val;
                                                        })()}
                                                        onChangeText={(val) => handleChange(key, val)}
                                                        style={styles.textInput(col, editStates[key])}
                                                        placeholder={`Ingrese ${key}`}
                                                        placeholderTextColor={col.textResalt}
                                                    />
                                                )}
                                                {errors[key] && <Text style={styles.errorText(col)}>{errors[key]}</Text>}
                                                {!readOnlyFields.includes(key) && (
                                                    <TouchableOpacity onPress={() => toggleEdit(key)} style={styles.editButton(col)}>
                                                        <Ionicons
                                                            name={editStates[key] ? "lock-closed" : "create"}
                                                            size={20}
                                                            color={col.primary}
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}

                            {/* Horarios Section */}
                            {showHorarios && (
                                <View style={styles.horariosSection}>
                                    <View style={styles.horariosHeader}>
                                        <Text style={[styles.fieldLabel(col), styles.horariosTitle]}>Horarios</Text>
                                        <TouchableOpacity
                                            onPress={() => setShowHorarioModal(true)}
                                            style={styles.addHorarioButton(col)}
                                        >
                                            <Ionicons name="add" size={24} color={col.background} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.assignedHorarios}>
                                        {assignedHorarios.length === 0 ? (
                                            <Text style={styles.noHorariosText(col)}>Sin horarios asignados</Text>
                                        ) : (
                                            assignedHorarios.map((horario) => (
                                                <View key={horario.id} style={styles.horarioItem(col)}>
                                                    <View style={styles.horarioInfo}>
                                                        <Text style={styles.horarioText(col)}>{horario.nombre}</Text>
                                                        <Text style={styles.horarioTime(col)}>
                                                            {horario.hora_inicio} - {horario.hora_fin}
                                                        </Text>
                                                        <Text style={styles.horarioDays(col)}>
                                                            {horario.dias && horario.dias.length > 0
                                                                ? horario.dias.map(dia => {
                                                                    const diasMap = {1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 7: 'Dom'};
                                                                    return diasMap[dia] || dia;
                                                                }).join(', ')
                                                                : 'Sin días'
                                                            }
                                                        </Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => removeHorario(horario.id)}
                                                        style={styles.removeHorarioButton(col)}
                                                    >
                                                        <Ionicons name="remove" size={20} color={col.error} />
                                                    </TouchableOpacity>
                                                </View>
                                            ))
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            disabled={!hasChanges() || Object.keys(errors).length > 0}
                            onPress={() => {
                                handleSave();
                            }}
                            style={styles.saveButton(col, hasChanges() && Object.keys(errors).length === 0)}
                        >
                            <Ionicons name="save" size={20} color={col.background} />
                            <Text style={styles.buttonText(col)}>Guardar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton(col)}
                        >
                            <Ionicons name={hasChanges() ? "close" : "checkmark"} size={20} color={col.background} />
                            <Text style={styles.buttonText(col)}>{hasChanges() ? "Cancelar" : "Cerrar"}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Modal para seleccionar horario */}
                    <Modal visible={showHorarioModal} animationType="fade" transparent>
                        <View style={styles.modalOverlay}>
                            <View style={styles.horarioModalContent(col)}>
                                <Text style={styles.modalTitle(col)}>Seleccionar Horario</Text>
                                <ScrollView style={styles.horarioList}>
                                    {availableHorariosFiltered.map((horario) => (
                                        <TouchableOpacity
                                            key={horario.id}
                                            onPress={() => addHorario(horario)}
                                            style={styles.horarioOption(col)}
                                        >
                                            <Text style={styles.horarioOptionText(col)}>{horario.nombre}</Text>
                                            <Text style={styles.horarioDetails(col)}>
                                                {horario.hora_inicio} - {horario.hora_fin}
                                            </Text>
                                            <Text style={styles.horarioDias(col)}>
                                                Días: {horario.dias && horario.dias.length > 0
                                                    ? horario.dias.map(dia => {
                                                        const diasMap = {1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 7: 'Dom'};
                                                        return diasMap[dia] || dia;
                                                    }).join(', ')
                                                    : 'Sin días'
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <TouchableOpacity
                                    onPress={() => setShowHorarioModal(false)}
                                    style={styles.closeModalButton(col)}
                                >
                                    <Text style={styles.closeModalText(col)}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <DateSlotSelectorModal
                        visible={showDateSlotModal}
                        onClose={() => {
                            setShowDateSlotModal(false);
                            setSelectedDoctor(null);
                        }}
                        doctorId={selectedDoctor}
                        onSelectSlot={(date, time) => {
                            handleChange('fecha_cita', date);
                            handleChange('hora_cita', time);
                            setSelectedDoctor(null);
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: (col) => ({
        backgroundColor: col.background,
        borderRadius: 20,
        width: "90%",
        height: "85%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        padding: 20,
    }),
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    avatarContainer: (col) => ({
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: col.primary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: col.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    }),
    initialsOverlay: (col) => ({
        position: "absolute",
        bottom: -5,
        right: -5,
        backgroundColor: col.textResalt,
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    }),
    initialsText: (col) => ({
        color: col.background,
        fontWeight: "bold",
        fontSize: 12,
    }),
    deleteButton: {
        padding: 10,
    },
    scrollView: {
        flex: 1,
    },
    fieldsContainer: {
        paddingBottom: 20,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    fieldLabel: (col) => ({
        fontSize: 16,
        fontWeight: "600",
        color: col.text,
        marginBottom: 8,
    }),
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    textInput: (col, isEditing) => ({
        flex: 1,
        fontSize: 16,
        color: col.text,
        borderBottomWidth: isEditing ? 2 : 1,
        borderColor: isEditing ? col.primary : col.textResalt,
        paddingVertical: 8,
        paddingHorizontal: 0,
    }),
    errorText: (col) => ({
        position: "absolute",
        bottom: -20,
        left: 0,
        fontSize: 12,
        color: col.error,
    }),
    editButton: (col) => ({
        marginLeft: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: col.backgroundResalt,
    }),
    // Horarios styles
    horariosSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    horariosHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    horariosTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    addHorarioButton: (col) => ({
        backgroundColor: col.success,
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    }),
    assignedHorarios: {
        marginTop: 10,
    },
    horarioItem: (col) => ({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: col.backgroundResalt,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    }),
    horarioInfo: {
        flex: 1,
    },
    horarioText: (col) => ({
        fontSize: 16,
        color: col.text,
        fontWeight: '600',
    }),
    horarioTime: (col) => ({
        fontSize: 14,
        color: col.textResalt,
        marginTop: 2,
    }),
    horarioDays: (col) => ({
        fontSize: 12,
        color: col.textResalt,
        marginTop: 2,
        fontStyle: 'italic',
    }),
    removeHorarioButton: (col) => ({
        padding: 5,
    }),
    noHorariosText: (col) => ({
        textAlign: 'center',
        color: col.textResalt,
        fontStyle: 'italic',
        padding: 20,
    }),
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    horarioModalContent: (col) => ({
        backgroundColor: col.background,
        borderRadius: 15,
        width: '80%',
        maxHeight: '60%',
        padding: 20,
    }),
    modalTitle: (col) => ({
        fontSize: 20,
        fontWeight: 'bold',
        color: col.text,
        textAlign: 'center',
        marginBottom: 15,
    }),
    horarioList: {
        maxHeight: 300,
    },
    horarioOption: (col) => ({
        backgroundColor: col.backgroundResalt,
        padding: 15,
        borderRadius: 8,
        marginBottom: 8,
    }),
    horarioOptionText: (col) => ({
        fontSize: 16,
        color: col.text,
        fontWeight: '600',
    }),
    horarioDetails: (col) => ({
        fontSize: 14,
        color: col.textResalt,
        marginTop: 2,
    }),
    horarioDias: (col) => ({
        fontSize: 12,
        color: col.textResalt,
        marginTop: 4,
        fontStyle: 'italic',
    }),
    closeModalButton: (col) => ({
        backgroundColor: col.secondary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    }),
    closeModalText: (col) => ({
        color: col.background,
        fontSize: 16,
        fontWeight: '600',
    }),
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    saveButton: (col, enabled) => ({
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: enabled ? col.success : col.textResalt,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowColor: enabled ? col.success : col.textResalt,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    }),
    closeButton: (col) => ({
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: col.secondary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowColor: col.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    }),
    buttonText: (col) => ({
        color: col.background,
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 8,
    }),
    pickerContainer: (col, isEditing) => ({
        flex: 1,
        borderBottomWidth: isEditing ? 2 : 1,
        borderColor: isEditing ? col.primary : col.textResalt,
        borderRadius: 4,
    }),
    picker: (col, isEditing) => ({
        color: col.text,
        fontSize: 16,
        height: 40,
    }),
});

export default InfoCard;
