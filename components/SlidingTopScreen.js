import React, { useRef, useState, useEffect } from "react";
import { Animated, PanResponder, View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { colors, darkColors } from "../utils/desing/Colors";

const { height, width } = Dimensions.get("window");

export default function SlidingTopScreen({ screens = [] }) {
    const navigation = useNavigation();
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? darkColors : colors;

    const overlayHeight = Math.round(height * 0.78);
    const handleHeight = 68;
    const hiddenPosition = -overlayHeight + handleHeight;

    const translateY = useRef(new Animated.Value(hiddenPosition)).current;
    const lastY = useRef(hiddenPosition);
    const startY = useRef(0);

    const [activeKey, setActiveKey] = useState(screens[0]?.key || null);

    useEffect(() => {
        lastY.current = hiddenPosition;
        translateY.setValue(hiddenPosition);
    }, [hiddenPosition]);

    const open = (animated = true) => {
        const toValue = 0;
        lastY.current = toValue;
        if (animated) {
            Animated.spring(translateY, { toValue, useNativeDriver: true, tension: 80, friction: 10 }).start();
        } else {
            translateY.setValue(toValue);
        }
    };

    const close = (animated = true) => {
        const toValue = hiddenPosition;
        lastY.current = toValue;
        if (animated) {
            Animated.spring(translateY, { toValue, useNativeDriver: true, tension: 80, friction: 10 }).start();
        } else {
            translateY.setValue(toValue);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
            onPanResponderGrant: () => {
                startY.current = lastY.current;
            },
            onPanResponderMove: (_, gesture) => {
                let newY = startY.current + gesture.dy;
                if (newY > 0) newY = 0;
                if (newY < hiddenPosition) newY = hiddenPosition;
                translateY.setValue(newY);
            },
            onPanResponderRelease: (_, gesture) => {
                const vy = gesture.vy;
                const dy = gesture.dy;
                if (dy > 80 || vy > 0.6) {
                    open();
                } else if (dy < -80 || vy < -0.6) {
                    close();
                } else {
                    const midpoint = hiddenPosition / 2;
                    translateY.stopAnimation((val) => {
                        if (val > midpoint) open(); else close();
                    });
                }
            },
        })
    ).current;

    const ActiveComponent = screens.find((s) => s.key === activeKey)?.component || null;


    return (
        <Animated.View
            style={[
                styles.overlay(col),
                {
                    height: overlayHeight,
                    transform: [{ translateY }],
                    backgroundColor: col.background,
                    borderBottomLeftRadius: 14,
                    borderBottomRightRadius: 14,
                },
            ]}
            pointerEvents="box-none"
            {...panResponder.panHandlers}
        >
            <View style={{ flexDirection: "row", width, height: overlayHeight - handleHeight }}>
                <View style={{ flex: 1 }}>
                    {ActiveComponent ? (
                        <ActiveComponent navigation={navigation} closeSliding={close} />
                    ) : (
                        <View style={styles.empty}>
                            <Text style={{ color: col.text }}>Sin contenido</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={[styles.bottomBar, { backgroundColor: col.secondaryResalt }]}>
                <TouchableOpacity
                    style={styles.iconLeft}
                    onPress={() => { setActiveKey(screens[0]?.key || null); open(); }}
                >
                    <Ionicons name="settings" size={24} color={col.primaryResalt} />
                    <Text style={[styles.iconLabel, { color: col.text }]}>{screens[0]?.label}</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.iconRight}
                    onPress={() => { setActiveKey(screens[1]?.key || screens[0]?.key || null); open(); }}
                >
                    <Ionicons name="person" size={24} color={col.primaryResalt} />
                    <Text style={[styles.iconLabel, { color: col.text }]}>{screens[1]?.label}</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: (col) => ({
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        elevation: 30,
        shadowColor: col.primaryResalt,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        overflow: "hidden",
    }),
    handleRow: {
        width: "100%",
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    iconLeft: {
        alignItems: "center",
        justifyContent: "center",
    },
    centerHandle: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    handleBar: {
        width: 60,
        height: 6,
        borderRadius: 6,
    },
    iconRight: {
        alignItems: "center",
        justifyContent: "center",
    },
    iconLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
});


