import {ScrollView, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import TotalCitasAsignadasCount from "./elements/TotalCitasAsignadasCount";
import CitasProximasCount from "./elements/CitasProximasCount";
import PacientesAtendidosCount from "./elements/PacientesAtendidosCount";

let col = colors;

export default function InicioMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom: "30%", paddingTop:"15%", backgroundColor: col.background}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>
                <TotalCitasAsignadasCount />
                <CitasProximasCount />
                <PacientesAtendidosCount />
            </View>
        </ScrollView>
    )
}