import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import {useDispatch, useSelector} from "react-redux";

const DarkSwitch = () => {
    const isDark = useSelector((state) => state.darkMode.value);
    const [darkMode, setDarkMode] = useState(isDark);
    const animValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;
    const dispatch = useDispatch();

    const toggleMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        dispatch({type: 'darkMode/toggle'});
        Animated.timing(animValue, {
            toValue: !newMode ? 1 : 0,
            duration: 600,
            useNativeDriver: false,
        }).start();
    };

    const bgColor = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#fff", "#26242e"],
    });

    const circleBg = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#ff8c00", "#8983f7"],
    });

    const toggleTranslate = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-25, 100],
    });

    const crescentScale = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <Animated.View style={[styles.phone, { backgroundColor: bgColor }]}>

            <View style={styles.content}>
                <Animated.View style={[styles.circle, { backgroundColor: circleBg }]}>
                    <Animated.View
                        style={[
                            styles.crescent,
                            {
                                transform: [{ scale: crescentScale }],
                                backgroundColor: darkMode ? "#26242e" : "#e8e8e8",
                            },
                        ]}
                    />
                </Animated.View>

                <TouchableOpacity style={styles.switch} onPress={toggleMode}>
                    <Animated.View
                        style={[
                            styles.toggle,
                            {
                                transform: [{ translateX: toggleTranslate }],
                                backgroundColor: darkMode ? "#34323d" : "#fff",
                            },
                        ]}
                    />
                    <View style={styles.names}>
                        <Text style={[styles.light, { color: darkMode ? "white" : "black" }]}>
                            Light
                        </Text>
                        <Text style={[styles.dark, { color: darkMode ? "white" : "black" }]}>
                            Dark
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    phone: {
        width: 280,
        height: 270,
        borderRadius: 40,
        padding: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    menu: {
        flexDirection: "row",
        justifyContent: "space-between",
        opacity: 0.6,
    },
    time: {
        fontSize: 16,
    },
    icons: {
        flexDirection: "row",
    },
    battery: {
        width: 15,
        height: 8,
    },
    network: {
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderBottomWidth: 7,
        marginRight: 6,
        transform: [{ rotate: "135deg" }],
    },
    content: {
        alignItems: "center",
        marginTop: 20,
    },
    circle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    crescent: {
        width: 90,
        height: 90,
        borderRadius: 45,
        position: "absolute",
        right: 0,
    },
    switch: {
        marginTop: 30,
        width: "100%",
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.1)",
        justifyContent: "center",
    },
    toggle: {
        width: "50%",
        height: "100%",
        borderRadius: 20,
        position: "absolute",
        left: 25,
    },
    names: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
    },
    light: {
        fontWeight: "bold",
    },
    dark: {
        fontWeight: "bold",
    },
});

export default DarkSwitch;
