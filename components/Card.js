import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {colors, darkColors} from "../utils/desing/Colors";
import {useSelector} from "react-redux";


const Card = ({title, subtitle, icons}) => {
    let col = colors;
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? col = colors : col = darkColors;

    return (
        <View style={dynamicStyles.card(col)}>
            <View style={dynamicStyles.circle(col)} />

            <View style={styles.textContainer}>
                <Text style={dynamicStyles.title(col)}>{title}</Text>
                <Text style={dynamicStyles.subtitle(col)}>{subtitle}</Text>
            </View>

            <View style={styles.iconsContainer}>
                {icons.map((icon, index) => (
                    <TouchableOpacity key={index} style={dynamicStyles.btn(col)}>
                        <Ionicons
                            name={icon.name}
                            size={icon.size}
                            color={icon.color}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        padding: 15,
        flexDirection: "column",
    },
    iconsContainer: {
        flexDirection: "row",
        width: "100%",
        borderRadius: 15,
        overflow: "hidden",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 5,
    },

});

const dynamicStyles = {
    btn: (col)=> ({
        width: 84,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
    }),
    subtitle: (col)=> ({
        fontSize: 12,
        fontWeight: "300",
        color: col.textResalt,
    }),
    title: (col) => ({
        color: col.text,
        fontWeight: "900",
        fontSize: 18,
    }),
    circle: (col) => ({
        position: "absolute",
        top: "-30%",
        left: "-30%",
        width: 200,
        height: 200,
        borderRadius: 50,
        borderWidth: 35,
        borderColor: col.accentResalt,
    }),
    card: (col) => ({
        width: "90%",
        height: 200,
        borderRadius: 15,
        backgroundColor: col.backgroundResalt,
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
    }),
}

export default Card;
