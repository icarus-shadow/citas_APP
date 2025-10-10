import {ScrollView, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";

let col = colors;

export default function HorariosMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>
                <Text style={{color: col.text, fontSize: 20, marginBottom: 20}}>Página de Horarios de Doctores</Text>
                <Text style={{color: col.text}}>Datos de prueba:</Text>
                <Text style={{color: col.text}}>Horarios disponibles: Lunes a Viernes 9:00 AM - 5:00 PM</Text>
                <Text style={{color: col.text}}>Días libres: Sábados y Domingos</Text>
                <Text style={{color: col.text}}>Intervalo de citas: 30 minutos</Text>
            </View>
        </ScrollView>
    )
}