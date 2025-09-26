import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import {colors, darkColors} from "../utils/desing/Colors";
import {useSelector} from "react-redux";

export default function CustomAlert({
                                        visible,
                                        type = "success",
                                        message,
                                        durationInSec = 3,
                                        onConfirm = null,
                                        options = {},
                                        onClose,
                                    }) {
    const [show, setShow] = useState(visible);

    let col = colors;
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? col = colors : col = darkColors;

    useEffect(() => {
        setShow(visible);
        if (visible && durationInSec > 0 && type !== "confirm") {
            const timer = setTimeout(() => {
                setShow(false);
                if (onClose) onClose();
            }, durationInSec * 1000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    const handleConfirm = (result) => {
        setShow(false);
        if (onClose) onClose();
        if (onConfirm) onConfirm(result);
    };

    return (
        <Modal transparent visible={show} animationType="fade">
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.alertBox,
                        type === "success" && styles.success(col),
                        type === "error" && styles.error(col),
                        type === "confirm" && styles.confirm(col),
                    ]}
                >
                    <Text style={styles.message(col)}>{message}</Text>
                    {type === "confirm" ? (
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.btn, styles.confirmBtn(col)]}
                                onPress={() => handleConfirm(true)}
                            >
                                <Text style={styles.btnText(col)}>
                                    {options.yesText || "Sí"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btn, styles.cancelBtn(col)]}
                                onPress={() => handleConfirm(false)}
                            >
                                <Text style={styles.btnText(col)}>
                                {options.noText || "No"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : durationInSec === 0 ? (
                        <TouchableOpacity
                            style={[styles.btn, styles.confirmBtn]}
                            onPress={() => handleConfirm()}
                        >
                            <Text style={styles.btnText(col)}>{options.okText || "Aceptar"}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    alertBox: {
        minWidth: 250,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    btn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 5,
    },
    message: (col) => ({
        color: col.text,
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
    }),
    success: (col) => ({backgroundColor: col.success}),
    error: (col) => ({backgroundColor: col.error}),
    btnText: (col) => ({color: col.text, fontWeight: "bold"}),

    confirm: (col) => ({backgroundColor: col.primary}),
    confirmBtn: (col) => ({backgroundColor: col.accentResalt}),
    cancelBtn: (col) => ({backgroundColor: col.error}),
});
