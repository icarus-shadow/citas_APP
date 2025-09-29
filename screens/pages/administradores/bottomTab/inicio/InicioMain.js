import {Button, ScrollView, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Card from "../../../../../components/cards/Card";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../../../../components/CustomAlert";
import React, { useState } from "react";

import CitasCount from "./elements/CitasCount";
import PacientesCount from "./elements/PacientesCount";
import DoctoresCount from "./elements/DoctoresCount";
import AdministradoresCount from "./elements/AdministradoresCount";
import EspecialidadesCount from "./elements/EspecialidadesCount";

let col = colors;

export default function InicioMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>
                <CitasCount />
                <PacientesCount />
                <DoctoresCount />
                <AdministradoresCount />
                <EspecialidadesCount />
            </View>
        </ScrollView>
    )
}
