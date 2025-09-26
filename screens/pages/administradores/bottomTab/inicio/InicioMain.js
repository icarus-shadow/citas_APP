import {Button, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import Card from "../../../../../components/Card";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../../../../components/CustomAlert";
import { useState } from "react";

let col = colors;

const icons = [
    {
        name: "cloud-download-outline",
        color: col.primary,
        size: 24,
    },
    {
        name: "link",
        color: col.primary,
        size: 24,
    },
    {
        name: "ellipsis-vertical",
        color: col.primary,
        size: 24,
    }
]

export default function InicioMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    const [successVisible, setSuccessVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    return (
        <>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>
                <Card
                    title="Mi tarjeta"
                    subtitle="Subtítulo dinámico"
                    icons={icons}
                />

                <Button title="Mostrar Success" onPress={() => setSuccessVisible(true)} />
                <Button title="Mostrar Error" onPress={() => setErrorVisible(true)} />
                <Button title="Mostrar Confirm" onPress={() => setConfirmVisible(true)} />

                <CustomAlert
                    visible={successVisible}
                    type="success"
                    message="La operación se completó con éxito."
                    durationInSec={3}
                    onClose={() => setSuccessVisible(false)}
                />

                <CustomAlert
                    visible={errorVisible}
                    type="error"
                    message="Ocurrió un error inesperado."
                    durationInSec={3}
                    onClose={() => setErrorVisible(false)}
                />

                <CustomAlert
                    visible={confirmVisible}
                    type="confirm"
                    message="¿Desea continuar?"
                    onConfirm={(res) => console.log("Confirmación:", res)}
                    onClose={() => setConfirmVisible(false)}
                />
            </View>
        </>
    )
}
