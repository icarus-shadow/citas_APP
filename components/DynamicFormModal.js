import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";

export default function DynamicFormModal({
                                             visible,
                                             title = "Formulario",
                                             fields = [],
                                             onSubmit,
                                             onCancel,
                                         }) {
    const initialState = fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialState);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                                <TextInput
                                    style={styles.input}
                                    placeholder={field.placeholder || ""}
                                    secureTextEntry={field.secure || false}
                                    keyboardType={field.keyboard || "default"}
                                    value={formData[field.name]}
                                    onChangeText={(text) => handleChange(field.name, text)}
                                />
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.btn, styles.cancelBtn]}
                            onPress={onCancel}
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