import {Button, ScrollView, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Card from "../../../../../components/Card";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../../../../components/CustomAlert";
import React, { useState } from "react";

let col = colors;

const icons = [
    {
        name: "cloud-download-outline",
        color: col.primary,
        size: 24,
        onPress: () => {
            console.log("adios");
        }
    },
    {
        name: "link",
        color: col.primary,
        size: 24,
        onPress: () => {
            console.log("Hola");
        }
    },
    {
        name: "ellipsis-vertical",
        color: col.primary,
        size: 24,
        onPress: () => {
            console.log('pepe');
        }
    }
]

export default function InicioMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>
                <Card
                    title="Mi tarjeta"
                    subtitle="Subtítulo dinámico"
                    icons={icons}
                />
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>
                <Card
                    title="Mi tarjeta"
                    subtitle="Subtítulo dinámico"
                    icons={icons}
                />
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>
                <Card
                    title="Mi tarjeta"
                    subtitle="Subtítulo dinámico"
                    icons={icons}
                />
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>
                <Card
                    title="Mi tarjeta"
                    subtitle="Subtítulo dinámico"
                    icons={icons}
                />
            </View>
        </ScrollView>
    )
}
