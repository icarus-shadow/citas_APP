import React, {useEffect, useState} from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { colors, darkColors } from "../assets/colors";
import {useSelector} from "react-redux";

const { width } = Dimensions.get("window");

let col = colors;



const BottomTab = ({ tabs, initialTab }) => {
    const isDark = useSelector((state) => state.boolean.value);
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.key);


    isDark ? col = colors : col = darkColors;

    const handlePress = (tab) => {
        setActiveTab(tab.key);
        navigation.navigate(tab.route);
    };

    const activeTabData = tabs.find((t) => t.key === activeTab);

    return (
        <View style={styles.wrapper}>
            {/* Fondo curvado para los iconos */}
            <Svg
                width={width}
                height={135}
                style={styles.svgBackground}
                viewBox={`0 0 ${width} 70`}
            >
                <Path
                    d={`M0 30 Q ${width / 2} -30 ${width} 30 L ${width} 90 L 0 90 Z`}
                    fill={col.primary}
                    stroke={col.primary}
                />
            </Svg>

            {/* Barra curva superior para el label (encima de la de iconos) */}
            <Svg
                width={width}
                height={70}
                style={styles.svgLabel}
                viewBox={`0 0 ${width} 70`}
            >
                <Path
                    d={`M0 20 Q ${width / 2} -20 ${width} 20 L ${width} 90 L 0 90 Z`}
                    fill={col.primaryResalt}
                    stroke={col.primaryResalt}
                />
            </Svg>

            {/* Íconos */}
            <View style={styles.iconRow}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.tab}
                            onPress={() => handlePress(tab)}
                            activeOpacity={0.8}
                        >
                            {isActive && (
                                <View style={[dynamicStyles.glow(col)]} />
                            )}
                            <Ionicons
                                name={tab.icon}
                                size={32}
                                color={isActive ? col.accent : col.accentResalt}
                                style={isActive ? styles.activeIcon : styles.inactiveIcon}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Label fijo sobre su curva */}
            <View style={styles.labelContainer}>
                <Text style={[dynamicStyles.label(col)]}>{activeTabData?.label}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 110,
        alignItems: "center",
    },
    svgBackground: {
        position: "absolute",
        bottom: 13,
        zIndex: 1,
    },
    svgLabel: {
        position: "absolute",
        bottom: -25,
        zIndex: 2,
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
        width: "100%",
        height: 70,
        paddingBottom: 15,
        zIndex: 3,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    activeIcon: {
        marginBottom: 8,
    },
    inactiveIcon: {
        marginBottom: 4,
    },
    labelContainer: {
        position: "absolute",
        bottom: 15,
        width: "100%",
        alignItems: "center",
        zIndex: 4,
    },

});

const dynamicStyles = {
    glow: (col) => ({
        position: "absolute",
        bottom: 0,
        width: "60%",
        height: 5,
        borderRadius: 6,
        backgroundColor: col.accent,
        shadowColor: col.accent,
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    }),
    label: (col) => ({
        color: col.text,
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    }),
};

export default BottomTab;
