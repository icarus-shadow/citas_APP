import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {colors, darkColors} from "../../utils/desing/Colors";
import {useSelector} from "react-redux";


const Card = ({title, subtitle, count, icons}) => {
    let col = colors;
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? col = colors : col = darkColors;

    return (
        <View style={dynamicStyles.card(col)}>
            <View style={dynamicStyles.circle(col)}>
                <Text style={dynamicStyles.count(col)}>{count}</Text>
            </View>

            <View style={styles.textContainer}>
                <Text style={dynamicStyles.title(col)}>{title}</Text>
                <Text style={dynamicStyles.subtitle(col)}>{subtitle}</Text>
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
    count: (col) => ({
        color: col.textResalt,
        fontWeight: "900",
        fontSize: 50,
    }),
    btn: (col)=> ({
        width: 84,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
    }),
    subtitle: (col)=> ({
        fontSize: 15,
        fontWeight: "300",
        color: col.textResalt,
    }),
    title: (col) => ({
        color: col.text,
        fontWeight: "900",
        fontSize: 24,
    }),
    circle: (col) => ({
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "-25%",
        left: "60%",
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
        marginVertical: 15,
    }),
}

export default Card;
