import React, { useState, useEffect } from "react";
import {View, Text, TextInput, TouchableOpacity, Modal, ScrollView} from "react-native";

const InfoCard = ({ data, hiddenFields = [], visible, onClose, onDelete, onSave }) => {
    const [editStates, setEditStates] = useState({});
    const [values, setValues] = useState(data);
    const [modified, setModified] = useState(false);

    useEffect(() => {
        setValues(data);
        setEditStates({});
        setModified(false);
    }, [data, visible]);

    const initials = `${data?.nombres?.[0] || ""}${data?.apellidos?.[0] || ""}`;

    const toggleEdit = (key) => {
        setEditStates((prev) => ({ ...prev, [key]: !prev[key] }));
        setModified(true);
    };

    const handleChange = (key, value) => {
        setValues((prev) => ({ ...prev, [key]: value }));
        setModified(true);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }}>
                <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "90%", height: "90%" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ backgroundColor: "#007bff", borderRadius: 25, width: 50, height: 50, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>{initials}</Text>
                        </View>
                        <TouchableOpacity onPress={onDelete}>
                            <Text style={{ color: "red", fontWeight: "bold" }}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView >
                        <View style={{ marginTop: 20 }}>
                        {Object.keys(data || {})
                            .filter((key) => !hiddenFields.includes(key))
                            .map((key) => (
                                <View key={key} style={{ marginBottom: 15 }}>
                                    <Text style={{ fontSize: 14, color: "gray", marginBottom: 5 }}>{key}</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <TextInput
                                            editable={!!editStates[key]}
                                            value={values?.[key]?.toString()}
                                            onChangeText={(val) => handleChange(key, val)}
                                            style={{
                                                fontSize: 16,
                                                borderBottomWidth: editStates[key] ? 1 : 0,
                                                borderColor: editStates[key] ? "#007bff" : "transparent",
                                                flex: 1,
                                                color: "#000",
                                            }}
                                        />
                                        <TouchableOpacity onPress={() => toggleEdit(key)} style={{ marginLeft: 10 }}>
                                            <Text style={{ color: "#007bff" }}>{editStates[key] ? "Bloquear" : "Editar"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                    </View>
                    </ScrollView>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                        <TouchableOpacity
                            disabled={!modified}
                            onPress={() => {
                                onSave(values);
                            }}
                            style={{
                                backgroundColor: modified ? "#007bff" : "gray",
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 5,
                            }}
                        >
                            <Text style={{ color: "#fff" }}>Guardar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                backgroundColor: "#6c757d",
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 5,
                            }}
                        >
                            <Text style={{ color: "#fff" }}>{modified ? "Cancelar" : "Cerrar"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default InfoCard;
