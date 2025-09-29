import React, { useState, useEffect } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function DynamicFormModal({
                                             visible,
                                             title = "Formulario",
                                             fields = [],
                                             onSubmit,
                                             onCloses,
                                         }) {
    const initialState = fields.reduce((acc, field) => {
        acc[field.name] = field.type === "select" && field.multiple ? [] : "";
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialState);
    const [activeSelect, setActiveSelect] = useState(null);

    useEffect(() => {
        setFormData(initialState);
    }, [fields]);

    const handleChange = (name, value, field) => {
        if (field?.type === "select" && field?.multiple) {
            setFormData((prev) => {
                const currentValues = prev[name] || [];
                const valueIndex = currentValues.indexOf(value);
                if (valueIndex === -1) {
                    return { ...prev, [name]: [...currentValues, value] };
                } else {
                    return { ...prev, [name]: currentValues.filter((v) => v !== value) };
                }
            });
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        if (onSubmit) onSubmit(formData);
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <ScrollView style={{ maxHeight: 300 }}>
                        {fields.map((field, index) => (
                            <View key={index} style={styles.inputContainer}>
                                <Text style={styles.label}>{field.label}</Text>
                                {field.type === "select" ? (
                                    <View>
                                        <TouchableOpacity
                                            style={[styles.input, styles.selectContainer]}
                                            onPress={() =>
                                                setActiveSelect(
                                                    activeSelect === field.name ? null : field.name
                                                )
                                            }
                                        >
                                            <Text>
                                                {field.multiple
                                                    ? (formData[field.name] || [])
                                                    .map(
                                                        (value) =>
                                                            field.options.find((o) => o.value === value)
                                                                ?.label
                                                    )
                                                    .filter(Boolean)
                                                    .join(", ") || "Seleccione..."
                                                    : field.options.find(
                                                    (o) => o.value === formData[field.name]
                                                )?.label || "Seleccione..."}
                                            </Text>
                                        </TouchableOpacity>
                                        {activeSelect === field.name && (
                                            <View style={styles.optionsContainer}>
                                                {field.options.map((option, i) => {
                                                    const isSelected = field.multiple
                                                        ? (formData[field.name] || []).includes(
                                                            option.value
                                                        )
                                                        : formData[field.name] === option.value;
                                                    return (
                                                        <TouchableOpacity
                                                            key={i}
                                                            style={[
                                                                styles.optionItem,
                                                                isSelected && styles.optionSelected,
                                                            ]}
                                                            onPress={() => handleChange(field.name, option.value, field)}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: isSelected ? "#fff" : "#333",
                                                                    fontWeight: isSelected ? "bold" : "normal",
                                                                }}
                                                            >
                                                                {option.label}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <TextInput
                                        style={[
                                            styles.input,
                                            field.type === "textarea" && {
                                                height: 100,
                                                textAlignVertical: "top",
                                            },
                                        ]}
                                        placeholder={field.placeholder || ""}
                                        secureTextEntry={field.secure || false}
                                        keyboardType={
                                            field.type === "number"
                                                ? "numeric"
                                                : field.type === "email"
                                                    ? "email-address"
                                                    : field.keyboard || "default"
                                        }
                                        multiline={field.type === "textarea"}
                                        numberOfLines={field.type === "textarea" ? 4 : 1}
                                        value={formData[field.name]}
                                        onChangeText={(text) => {
                                            let value = text;
                                            if (field.type === "number") {
                                                value = text.replace(/[^0-9]/g, "");
                                            }
                                            handleChange(field.name, value);
                                        }}
                                    />
                                )}
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.btn, styles.cancelBtn]}
                            onPress={onCloses}
                        >
                            <Text style={styles.btnText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.submitBtn]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.btnText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    selectContainer: {
        justifyContent: "center",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        elevation: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    inputContainer: { marginBottom: 12 },
    label: { fontSize: 14, marginBottom: 5, color: "#333" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
    },
    optionsContainer: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
    },
    optionItem: {
        padding: 10,
    },
    optionSelected: {
        backgroundColor: "#2196f3",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 15,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginLeft: 10,
    },
    cancelBtn: { backgroundColor: "#9e9e9e" },
    submitBtn: { backgroundColor: "#2196f3" },
    btnText: { color: "#fff", fontWeight: "bold" },
});